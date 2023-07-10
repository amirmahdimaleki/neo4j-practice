const {Neo4jGraphQL} = require('@neo4j/graphql')
const {ApolloServer, gql} = require('@apollo/server')
const neo4j = require('neo4j-driver')
const { startStandaloneServer } = require ( '@apollo/server/standalone')


const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "password")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

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

 type Mutation {
   addGame(game: AddGameInput!): Game
    deleteGame(id: ID!): [Game]
    updateGame(id: ID!, edits: EditGameInput): Game
 }


`