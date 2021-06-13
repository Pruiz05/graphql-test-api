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

  type Order {
    id: ID
    order: [OrderGroup]
    total: Float
    client: ID
    vendor: ID
    createdAt: String
    state: OrderState
  }

  type OrderGroup {
    id: ID
    quantity: Int
  }

  type TopClients {
    total: Float
    clients: [Client]
  }

  type TopVendors {
    total: Float
    vendors: [User]
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

  input OrderProductInput {
    id: ID
    quantity: Int
  }

  input OrderInput {
    order: [OrderProductInput]
    total: Float
    client: ID
    state: OrderState
  }

  enum OrderState {
    PENDIENTE
    COMPLETADO
    CANCELADO
  }

  type Query {
    # User
    getUser: User

    # Products
    getProducts: [Product]
    getProductByID(id: ID!): Product

    # Clients
    getClients: [Client]
    getClientByVendor: [Client]
    getClientById(id: ID!): Client

    # Orders
    getOrders: [Order]
    getOrdersByVendor: [Order]
    getOrderById(id: ID!): Order
    getOrderByState(state: String!): [Order]

    # Busquedas Avanzadas
    bestClients: [TopClients]
    bestVendors: [TopVendors]
    findProduct(text: String!): [Product] 
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

    # Pedidos
    newOrder(input: OrderInput): Order
    updateOrder(id: ID!, input: OrderInput): Order
    deleteOrder(id: ID!): String
  }
`;

module.exports = typeDefs;
