/**
 * Path of child
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import * as nanoid from 'nanoid';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, of, from } from 'rxjs';
import { mergeMap, map, withLatestFrom, tap } from 'rxjs/operators';
import {
  GetWorldQuery,
  GetWorldsQuery,
  CreateWorldMutation,
  UpdateWorldMutation,
  DeleteWorldMutation,
  WorldAddCharacterMutation,
  WorldRemoveCharacterMutation
} from '../graphql';
import { ApolloService } from '../services';
import {
  WorldActionTypes,
  GetWorld,
  FetchMoreWorld,
  FetchMoreWorldLoading,
  FetchMoreWorldComplete,
  CreateWorld,
  UpdateWorld,
  SelectWorld,
  DeleteWorld,
  WorldAddCharacter,
  WorldRemoveCharacter,
} from '../store';
import { WorldFiltersFacade } from './world-filters.facade';
import { UserFacade } from './user.facade';
import { QueryRef } from 'apollo-angular';

@Injectable()
export class WorldFacade {
  worldQuery: QueryRef<any> = null;
  worldsQuery: QueryRef<any> = null;
  static total: number = null;

  newWorlds = [];
  world$ = this.store
    .pipe(
      select('world', 'id'),
      mergeMap((id: string) => {
        if (!id) {
          return of(null);
        }
        return this.apolloService.apolloClient.watchQuery<any>({
          query: GetWorldQuery,
          variables: {
            id,
          }
        })
          .valueChanges
          .pipe(map((res: any) => res.data.world))
      })
    );
  worlds$ = this.worldFiltersFacade.filters$.pipe(
    mergeMap((filters: any) => {
      this.worldsQuery = this.apolloService.apolloClient.watchQuery<any>({
        query: GetWorldsQuery,
        variables: this.purifyFilters(filters),
      });
      return this.worldsQuery
        .valueChanges
        .pipe(
          map((response: any) => {
            WorldFacade.total = response.data.worlds.total;
            return response.data.worlds.nodes;
          }),
        );
    })
  );
  fetchMoreLoading$ = this.store.pipe(select('world', 'fetchMoreLoading'));
  selectedWorld$ = this.store.pipe(select('world', 'selected'));
  worldsHasMore$ = this.worlds$.pipe(
    map((worlds: any) => WorldFacade.total !== 0 && worlds.length !== WorldFacade.total),
  );

  constructor(
    private actions$: Actions,
    private apolloService: ApolloService,
    private worldFiltersFacade: WorldFiltersFacade,
    private userFacade: UserFacade,
    private store: Store<{ world: any }>
  ) {
  }

  purifyFilters(filters: any) {
    const currentFilters = Object.assign({}, filters.characterInput);
    if (!currentFilters.label) {
      delete currentFilters.label;
    }

    return {
      characterInput: currentFilters,
      page: filters.page ? filters.page : 1,
      sort: filters.sort ? filters.sort : undefined,
    };
  }

  getWorldById(id: string) {
    this.store.dispatch(new GetWorld({ id }));
  }

  fetchMore() {
    this.store.dispatch(new FetchMoreWorld());
  }

  @Effect({dispatch: false})
  fetchMoreWorld$ = this.actions$
    .pipe(
      ofType(WorldActionTypes.FetchMoreWorld),
      withLatestFrom(
        this.worldFiltersFacade.filters$,
        this.worlds$
      ),
      mergeMap((args: any[]) => {
        const filters = args[1];
        const worlds = args[2];
        const variables = this.purifyFilters(filters);

        if (!this.worldsQuery) {
          return of(EMPTY);
        }
        if (worlds.length === WorldFacade.total) {
          return of(EMPTY);
        }
        this.worldsQuery.fetchMore({
          query: GetWorldsQuery,
          variables,
          updateQuery: (prev, { fetchMoreResult }) => {
            this.store.dispatch(new FetchMoreWorldComplete());
            return {
              worlds: {
                total: fetchMoreResult.worlds.total,
                page: fetchMoreResult.worlds.page,
                nodes: [
                  ...prev.worlds.nodes,
                  ...fetchMoreResult.worlds.nodes,
                ],
                __typename: "WorldEdge",
              },
            };
          },
        });
        this.store.dispatch(new FetchMoreWorldLoading());
        return of(EMPTY);
      }),
    );

  createWorld() {
    this.store.dispatch(new CreateWorld({
      label: 'New world',
    }));
  }

  @Effect({dispatch: false})
  createWorld$ = this.actions$
    .pipe(
      ofType(WorldActionTypes.CreateWorld),
      withLatestFrom(
        this.userFacade.user$,
        this.worldFiltersFacade.filters$
      ),
      mergeMap((args: any[]) => {
        const action: any = args[0];
        const user: any = args[1];
        const filters = args[2];
        if (!user) {
          return of(EMPTY);
        }
        return this.apolloService.apolloClient.mutate({
          mutation: CreateWorldMutation,
          variables: {
            ...action.payload,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            optimistic: true,
            createWorld: {
              __typename: 'World',
              id: `-${nanoid.nanoid()}`,
              ...action.payload,
            },
          },
          update: (store, { data: { createWorld, optimistic } }: any) => {
            if (!createWorld) {
              return;
            }
            const data: any = store.readQuery({
              query: GetWorldsQuery,
              variables: this.purifyFilters(filters)
            });
            const updatedWorlds: any = data.worlds.nodes;
            updatedWorlds.unshift(createWorld);
            store.writeQuery({
              query: GetWorldsQuery,
              variables: this.purifyFilters(filters),
              data: {
                worlds: {
                  total: WorldFacade.total,
                  page: filters.page,
                  nodes: updatedWorlds,
                  __typename: "WorldEdge",
                }
              }
            });
            // TODO Use a separate list for newly created items
            // this.selectWorld(createWorld);
            // if (optimistic) {
            //   this.newWorlds.unshift(createWorld);
            // }
          },
        });
      })
    );

  updateWorld(data: any) {
    this.store.dispatch(new UpdateWorld(data));
  }

  @Effect({dispatch: false})
  updateWorld$ = this.actions$
    .pipe(
      ofType(WorldActionTypes.UpdateWorld),
      withLatestFrom(
        this.userFacade.user$,
        this.selectedWorld$
      ),
      mergeMap((args: any[]) => {
        const action: any = args[0];
        const user: any = args[1];
        const selectedWorld: any = args[2];
        if (!user || !selectedWorld) {
          return of(EMPTY);
        }
        if (action.payload.category && action.payload.category !== 'videogame') {
          action.payload.platform = null;
        }
        return this.apolloService.apolloClient.mutate({
          mutation: UpdateWorldMutation,
          variables: {
            id: selectedWorld.id,
            ...action.payload
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateWorld: {
              __typename: 'World',
              ...selectedWorld,
              ...action.payload,
            },
          },
          update: (store: any, { data: { updateWorld } }: any) => {
            if (!updateWorld) {
              return;
            }
            const world = store.data.get(`World:${updateWorld.id}`);
            if (world) {
              Object.assign(world, updateWorld);
              Object.assign(selectedWorld, updateWorld);
              store.writeData(world);
            }
          }
        });
      })
    );

  deleteWorld() {
    this.store.dispatch(new DeleteWorld());
  }

  @Effect({dispatch: false})
  deleteWorld$ = this.actions$
    .pipe(
      ofType(WorldActionTypes.DeleteWorld),
      withLatestFrom(
        this.selectedWorld$
      ),
      mergeMap((args: any[]) => {
        const selectedWorld: any = args[1];
        if (!selectedWorld) {
          return of(EMPTY);
        }
        return this.apolloService.apolloClient.mutate({
          mutation: DeleteWorldMutation,
          variables: {
            id: selectedWorld.id
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteWorld: {
              __typename: 'World',
              id: selectedWorld.id
            },
          },
          update: (store, { data: { deleteWorld } }: any) => {
            if (!deleteWorld) {
              return;
            }
            const query: any = store.readQuery({ query: GetWorldsQuery });
            const updatedWorlds: any[] = query.worlds.filter((world: any) => world.id && world.id !== deleteWorld.id);
            store.writeQuery({ query: GetWorldsQuery, data: { worlds: updatedWorlds }});
          },
        }).pipe(
          tap(() => {
          this.store.dispatch(new SelectWorld(null));
        }));
      })
    );

  selectWorld(world: any) {
    this.store.dispatch(new SelectWorld(world));
  }

  addCharacter(character: any) {
    this.store.dispatch(new WorldAddCharacter(character));
  }

  @Effect({dispatch: false})
  addCharacter$ = this.actions$
    .pipe(
      ofType(WorldActionTypes.WorldAddCharacter),
      withLatestFrom(
        this.world$
      ),
      mergeMap((args: any[]) => {
        const action = args[0];
        const world = args[1];
        const character = action.payload;
        return this.apolloService.apolloClient.mutate({
          mutation: WorldAddCharacterMutation,
          variables: {
            id: world.id,
            characterId: character.id,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addCharacter: {
              __typename: 'World',
              id: world.id
            },
          },
          update: (store, { data: { addCharacter } }: any) => {
            if (!addCharacter) {
              return;
            }
            const query: any = store.readQuery({
              query: GetWorldQuery,
              variables: {
                id: addCharacter.id
              }
            });
            const updatedWorld: any = query.world;
            updatedWorld.characters.push(character);
            store.writeQuery({
              query: GetWorldQuery,
              variables: { id: addCharacter.id },
              data: { world: updatedWorld }
            });
          },
        });
      })
    );

  removeCharacter(characterId: string) {
    this.store.dispatch(new WorldRemoveCharacter({
      characterId,
    }));
  }

  @Effect({dispatch: false})
  removeCharacter$ = this.actions$
    .pipe(
      ofType(WorldActionTypes.WorldRemoveCharacter),
      withLatestFrom(
        this.world$
      ),
      mergeMap((args: any[]) => {
        const action = args[0];
        const world = args[1];
        const characterId = action.payload.characterId;
        return this.apolloService.apolloClient.mutate({
          mutation: WorldRemoveCharacterMutation,
          variables: {
            id: world.id,
            characterId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            removeCharacter: {
              __typename: 'World',
              id: world.id
            },
          },
          update: (store, { data: { removeCharacter } }: any) => {
            if (!removeCharacter) {
              return;
            }
            const query: any = store.readQuery({
              query: GetWorldQuery,
              variables: {
                id: removeCharacter.id
              }
            });
            const updatedWorld: any = query.world;
            updatedWorld.characters = updatedWorld.characters.filter((character: any) => character.id !== characterId);
            store.writeQuery({
              query: GetWorldQuery,
              variables: { id: removeCharacter.id },
              data: { world: updatedWorld }
            });
          },
        });
      })
    );
}
