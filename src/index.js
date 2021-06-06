const { ApolloServer, gql } = require("apollo-server");
const jwt = require("jsonwebtoken");

const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
require("dotenv").config({ path: ".env" });

// db
const connectDb = require("./config/db");

//conectar a bd
connectDb();

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // console.log(req.headers);
     console.log(req.header('authorization'))
    const token = req.header("authorization") || "";

    if (token) {
      try {
        const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_TOKEN);
        console.log( user)
        return {
          user,
        };
      } catch (error) {
        console.log(error);
      }
    }
  },
});

//
server.listen().then(({ url }) => {
  console.log(`Servidor start at port: ${url}`);
});
