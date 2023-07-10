import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import 'dotenv/config'


const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic("neo4j", process.env.NEO4J_PASSWORD)
);



// Define types

const typeDefs = `#graphql
 type Game {
    id: ID!,
    title: String!,
    platform: [String!]!,
    reviews: [Review!]
 }
 type Review {
    id: ID!
    rating: Int!
    content: String!
    game: Game!
    author: Author!
 }
 type Author {
    id: ID!
    name: String!
    verified: Boolean!
    reviews: [Review!]
 }


 type Query {
   reviews: [Review]
   review(id: ID!): Review
   games: [Game] 
   game(id: ID!): Game
   authors: [Author]
   author(id:ID!): Author
 }

`



const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
   schema: await neoSchema.getSchema(),
});

const { url } = await startStandaloneServer(server, {
   context: async ({ req }) => ({ req }),
   listen: { port: 4000 },
});

console.log(` Server running at ${url}`);