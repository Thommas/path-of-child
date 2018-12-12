/**
 * Path of child
 *
 * GraphQL - Dynamo - Idea
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import generate = require('nanoid/generate');
import IdeaUser from '../model/idea-user';

export function getIdeaUsers(ideaId) {
  const params: any = {
    ideaId: {eq: ideaId}
  };
  return IdeaUser.scan(params)
    .exec()
    .catch(e => console.log(e));
}

export function getLoggedIdeaUser(ideaId, userId) {
  const params: any = {
    ideaId: {eq: ideaId},
    userId: {eq: userId}
  };
  return IdeaUser.scan(params)
    .exec()
    .then((ideaUsers: any) => {
      if (ideaUsers.count === 0) {
        throw new Error('IdeaUser not found');
      }
      return ideaUsers[0];
    })
    .catch(e => console.log(e));
}

export function updateIdeaUser(args, userId) {
  return IdeaUser.get(args.id)
    .then((ideaUser: any) => {
      if (!ideaUser) {
        throw new Error('Idea not found');
      }
      if (ideaUser.userId !== userId) {
        throw new Error('Unauthorized');
      }
      Object.assign(ideaUser, args);
      return ideaUser.save();
    });
}
