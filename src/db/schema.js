const { gql } = require("apollo-server");

// Schema
const typeDefs = gql`
  type User {
    id: ID
    name: String
    lastname: String
    email: String
    createdAt: String
  }

  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }

  type Query {
    obtenerCursos: String
  }

  type Mutation {
    newUser(input: UserInput): User
  }
`;

module.exports = typeDefs;
