/**
 * Path of child
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

const { gql } = require('apollo-server-lambda');

const File = gql`
  type File {
    id: String
    name: String
    size: Int
    type: String
    data: String
  }
`;
export default File;