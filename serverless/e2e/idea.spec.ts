/**
 * Path of child
 *
 * GraphQL - Dynamo - User
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

require('dotenv').config();
import {
  getIdeas,
  createIdea,
  updateIdea,
} from '../lib/dynamo/idea'
import { dynamoService } from '../lib/services';

describe('Idea', () => {
  it('getIdeas', (done) => {
    getIdeas('auth0|5a773beebfd2511753f2c9c0', {}).then((result: any) => {
      console.log('result', result);
      done();
    })
  });

  it('createIdea', (done) => {
    const args = {
      label: 'test-label',
    };
    createIdea(args, 'auth0|5a773beebfd2511753f2c9c0').then((data: any) => {
      const params: any = [{id: data.id}];
      return dynamoService.getEntity().batchGet(params);
    }).then((result) => {
      console.log('result', result);
      done();
    })
  });

  // it('updateIdea', (done) => {
  //   const args = {
  //     id: '0986945c-36de-4f34-b869-d06039501879',
  //     label: 'Test',
  //   };
  //   updateIdea(args, 'auth0|5a773beebfd2511753f2c9c0').then((data: any) => {
  //     done();
  //   })
  // });
});