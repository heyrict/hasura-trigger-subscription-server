const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { execute, subscribe } = require("graphql");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { gql, ApolloServer, PubSub } = require("apollo-server-express");

const { schema } = require("./schema");
const { pubsub } = require("./pubsub");
const isDev = process.env.NODE_ENV !== "production";
const PORT = 5000;

const app = express();
const server = new ApolloServer({
  schema,
  introspection: isDev,
  playground: isDev
});
server.applyMiddleware({ app });

app.use("/webhook", bodyParser.json(), (request, response) => {
  const data = request.body;
  pubsub.publish(data.trigger.name, data);
});

// Wrap the Express server
const websocketServer = createServer(app);
websocketServer.listen(PORT, () => {
  console.log(`Apollo Server is now running on http://localhost:${PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: websocketServer,
      path: "/graphql"
    }
  );
});
