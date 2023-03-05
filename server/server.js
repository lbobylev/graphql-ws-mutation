import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
      setName: {
        type: GraphQLString,
        args: {
          x: { type: GraphQLString },
        },
        resolve: (_, args) => {
          pubsub.publish("GREETINGS", { greetings: "Hello " + args.x });
          return "success";
        },
      },
    },
  }),
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => "world",
      },
    },
  }),
  subscription: new GraphQLObjectType({
    name: "Subscription",
    fields: {
      greetings: {
        type: GraphQLString,
        subscribe: () => pubsub.asyncIterator("GREETINGS"),
      },
    },
  }),
});

const server = new WebSocketServer({
  port: 4000,
  path: "/graphql",
});

useServer({ schema }, server);

console.log("Listening to port 4000");
