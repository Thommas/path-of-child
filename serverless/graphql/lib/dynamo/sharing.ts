/**
 * Path of child
 *
 * GraphQL - Dynamo - Sharing
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import { nanoid } from 'nanoid'
import { Entity } from '../model';
import { querySharingsBySharerId } from '../elasticsearch/sharing';

export function getSharings(sharerId: string) {
  return querySharingsBySharerId(sharerId)
    .then((sharings) => {
      const params: any = sharings.hits.hits.map((hit: any) => ({id: hit._id}));
      if (params.length === 0) {
        return [];
      }
      return Entity.batchGet(params);
    });
}

export function createSharing(args: any, userId: string) {
  const id = nanoid();
  const entity = new Entity({
    id: `Sharing-${id}`,
    sharerId: userId,
    userId: args.userId,
  });
  return entity.save();
}

export function deleteSharing(args: any, userId: string) {
  return Entity.get(args.id)
    .then((entity: any) => {
      if (!entity) {
        throw new Error('Sharing not found');
      }
      if (entity.sharerId !== userId) {
        throw new Error('Unauthorized');
      }
      return entity.delete();
    });
}
