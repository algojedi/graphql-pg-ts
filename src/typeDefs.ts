import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    type AppUser {
        id: ID!
        email: String!
    }

    scalar Date

    type Person {
        name: String!
        age: Int!
    }

    type User {
        email: String!
        firstLetterOfEmail: String
    }

    type Todo {
        title: String!
        content: String!
        created_at: String!
        creator_id: Int!
        id: ID!
    }

    type Query {
        hello: Person!
        user(id: ID!): AppUser
        todos : [Todo]
        todosByUser(id: ID!) : [Todo]
    }

    type Mutation {
        register(email: String!, password: String!) : Boolean!
        login(email: String!, password: String!) : String
    }

`

    // type Query {
    //     me: AppUser
    // }
        // login(email: String!, password: String!): User
        // logout: Boolean!