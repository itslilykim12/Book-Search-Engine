const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
//import Apollo Server 
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

//create new Apollo server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});
//integrate our Apollo server with the express application as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use Graphql at http://localhost:${PORT}${server.graphqlPath}`);
    });
});
