const { ApolloServer, gql } = require("apollo-server");

const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");

// db
const connectDb = require('./config/db')

//conectar a bd
connectDb()


// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
      const myContext = "Hi";
   
      return {
          myContext
      }
  }
});

//
server.listen().then(({ url }) => {
  console.log(`Servidor start at port: ${url}`);
});
