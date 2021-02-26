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

  type Token {
    token: String
  }

  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }

  input AuthenticationInput {
    email: String!
    password: String!
  }

  type Query {
    getUser(token: String!): User
  }

  type Mutation {
    newUser(input: UserInput): User
    userAuthentication(input: AuthenticationInput): Token
  }
`;

module.exports = typeDefs;
