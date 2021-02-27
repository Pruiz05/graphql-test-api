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

  type Product {
    id: ID
    name: String
    stock: Int
    price: Float
    createdAt: String
  }

  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    stock: Int!
    price: Float!
  }

  input AuthenticationInput {
    email: String!
    password: String!
  }

  type Query {
    # Usera
    getUser(token: String!): User

    # Products
    getProducts: [Product]

    getProductByID(id: ID!): Product
  }

  type Mutation {

    # Usuarios => Comentarios en GrapgQL 
    newUser(input: UserInput): User
    userAuthentication(input: AuthenticationInput): Token

    # Productos
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String
  }
`;

module.exports = typeDefs;
