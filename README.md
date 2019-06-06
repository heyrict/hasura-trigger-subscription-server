# Hasura trigger subscription server
**Hasura trigger subscription server** is a simple example of adding trigger event-based subscription support for [hasura](https://github.com/hasura/graphql-engine) (see [hasura/graphql-engine#2317](https://github.com/hasura/graphql-engine/issues/2317) and [hasura/graphql-engine#1355](https://github.com/hasura/graphql-engine/issues/1355)), using event triggers in hasura.

## Overview
We use the following database schema:

```graphql
scalar Timestamp
type Todo {
  type Todo {
    id: ID!
    created_at: Timestamp!
    updated_at: Timestamp!
    content: String!
  }
}
```

expose the following events in hasura console:

```graphql
enum TodoEvent {
  on_todo_created
  on_todo_updated
  on_todo_deleted
}
```

and add a subscription in the custom subscription server:

```graphql
type Subscription {
  todoSub(trigger: [TodoEvent]): Todo
}
```

## Customization
This example implementation uses the following two endpoints at port `5000`:

- `/graphql`: for exposing the graphql endpoint.
- `/webhook`: for listening to hasura event triggers.

Both endpoints can be configured in [./index.js](./index.js)

### Add event-based subscription to an existing table
Say you added a new table `tag` to the database.

```graphql
scalar Timestamp
type Todo {
  id: ID!
  created_at: Timestamp!
  updated_at: Timestamp!
  content: String!
  tags: [Tag]
}
type Tag {
  id: ID!
  text: String!
  todos: [Todo]
}
```

To add subscription to an existing table, you need to:

1. Add a trigger in hasura console (say if you want to get notified when `tag` get updated).
    - Click `create` in `EVENTS` tab in hasura console.
    - Add trigger named `on_tag_updated`.
    - choose table `tag`, trigger operations to `update`.
    - set webhook URL to `http://localhost:5000/webhook`, if you used the preset parameters in this repository.
    - Click `Create Event Trigger`

2. Add corresponding schema in [./schema](./schema).
    - Create a file called `./schema/tag.js`.
    - Customize the typeDefs and resolvers in `./schema/tag.js`.
      You can refer to [./schema/todo.js](./schema/todo.js) as a reference, or define your own logic.
    - Add tag schema to `./schema/index.js`, in `mergeSchemas` function.

## Todos
- [ ] This repo does not cover how to authenticate a user over websocket connection.
- [ ] This repo does not cover detailed information about how to filter a subscription with variables in resolvers.
