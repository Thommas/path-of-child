/**
 * Path of child
 *
 * GraphQL - Types - Idea
 *
 * @author Thomas Bullier <thomasbullier@gmail.com>
 */

const Idea = `
  type Idea {
    id: String!
    label: String
    userId: String!
    loggedUserIdea: UserIdea
  }
  type Query {
    ideas: [Idea]
    loggedUserIdea: UserIdea
  }
  type Mutation {
    createIdea: Idea
    updateIdea(
      id: ID!
      label: String
      requiredAge: Int
      requiredAgeExplanation: String
      score: Int
      scoreExplanation: String
    ): Idea
    deleteIdea(
      id: ID!
    ): Idea
  }
`;
export default Idea;