/**
 * Path of child
 *
 * GraphQL - DynamoDB
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import uuid = require('uuid/v4');
import * as db from './dynamo';

const TableName = 'child';

export function getChildren() {
  const params = {
    TableName,
    AttributesToGet: [
      'id',
      'firstname',
      'middlename',
      'lastname',
      'nickname',
      'birthdate',
      'gender',
      'xp',
      'level'
    ],
  };

  return db.scan(params);
}

export function getChildById(id) {
  const params = {
    TableName,
    Key: {
      id,
    },
  };

  return db.get(params);
}

export function createChild(args) {
  const params = {
    TableName,
    Item: {
      id: uuid(),
      xp: 0,
      level: 1,
      ...args
    },
  };

  return db.createItem(params);
}

export function updateChild(args) {
  const params = {
    TableName,
    Key: {
      id: args.id,
    },
    ExpressionAttributeValues: {
      ':firstname': args.firstname
    },
    UpdateExpression: 'SET firstname = :firstname',
    ReturnValues: 'ALL_NEW',
  };

  return db.updateItem(params, args);
}

export function deleteChild(args) {
  const params = {
    TableName,
    Key: {
      id: args.id,
    },
  };

  return db.deleteItem(params, args);
}
