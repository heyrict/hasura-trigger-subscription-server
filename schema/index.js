const { gql } = require("apollo-server-express");
const { mergeSchemas, makeExecutableSchema } = require("graphql-tools");
const { schema: todoSchema } = require("./todo");

const typeDefs = gql`
  # Query should not be empty according to graphql spec.
  type Query {
    dummy: Boolean
  }
`;

const resolvers = {
  Query: {
    dummy: () => true
  }
};

const rootSchema = makeExecutableSchema({ typeDefs, resolvers });
const schema = mergeSchemas({
  schemas: [rootSchema, todoSchema]
});
module.exports = { schema };
