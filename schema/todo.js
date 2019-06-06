const { gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { pubsub } = require("../pubsub");
const todoTriggers = {
  ON_TODO_CREATED: "on_todo_created",
  ON_TODO_UPDATED: "on_todo_updated",
  ON_TODO_DELETED: "on_todo_deleted"
};

const typeDefs = gql`
  scalar Timestamp
  type Todo {
    id: ID!
    created_at: Timestamp!
    updated_at: Timestamp!
    content: String!
  }
  enum TodoEvent {
    on_todo_created
    on_todo_updated
    on_todo_deleted
  }
  type Subscription {
    todoSub(trigger: [TodoEvent]): Todo
  }
  # We need a dummy query to avoid schema stiching error.
  # See apollographql/graphql-tools#764
  type Query {
    dummy: Boolean
  }
`;

const resolvers = {
  Subscription: {
    todoSub: {
      resolve: (payload, args, context, info) => {
        return payload.event.data.new;
      },
      subscribe: (payload, variables) => pubsub.asyncIterator(variables.trigger)
    }
  },
  Query: {
    dummy: () => true
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = { schema };
