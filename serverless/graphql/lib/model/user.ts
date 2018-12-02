/**
 * Path of child
 *
 * GraphQL - Model - User
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

import * as dynamoose from 'dynamoose';

declare var process: {
  env: {
    LOCAL_DYNAMODB_ENDPOINT: string,
    USER_TABLE: string
  }
}

if (process.env.LOCAL_DYNAMODB_ENDPOINT && process.env.LOCAL_DYNAMODB_ENDPOINT.length > 0) {
  dynamoose.AWS.config.update({
    region: 'eu-west-2',
  });
  dynamoose.local(process.env.LOCAL_DYNAMODB_ENDPOINT);
}

const TableName = process.env.USER_TABLE;

const Schema = dynamoose.Schema;

const UserSchema = new Schema({
  id: {
    type: String,
  },
  currentChildId: {
    type: String,
  },
  xp: {
    type: Number,
  },
  lvl: {
    type: Number,
  },
}, {
  timestamps: true
});

const User = dynamoose.model(TableName, UserSchema);

export default User