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
    vendor: ID
  }

  type Client {
    id: ID
    name: String
    lastname: String
    email: String
    phone: String
    vendor: ID
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

  input ClientInput {
    name: String!
    lastname: String!
    email: String!
    phone: String
  }

  input AuthenticationInput {
    email: String!
    password: String!
  }

  type Query {
    # User
    getUser(token: String!): User

    # Products
    getProducts: [Product]
    getProductByID(id: ID!): Product

    # Clients
    getClients: [Client]
    getClientByVendor: [Client]
    getClientById(id: ID!): Client
  }

  type Mutation {

    # Usuarios => Comentarios en GrapgQL 
    newUser(input: UserInput): User
    userAuthentication(input: AuthenticationInput): Token

    # Productos
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    # Clientes
    newClient(input: ClientInput): Client
    updateClient(id: ID!, input:ClientInput): Client
    deleteClient(id: ID!): String
  }
`;

module.exports = typeDefs;
