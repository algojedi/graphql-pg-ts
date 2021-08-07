import 'reflect-metadata'
import 'dotenv/config'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import { MyContext } from './tsTypes'
import { redis } from './redis'
import session = require('express-session')
import  connectRedis  from 'connect-redis';
import cors = require('cors')


const startServer = async () => {
    const server = new ApolloServer({
        // These will be defined for both new or existing servers
        typeDefs,
        resolvers,
        // context: ({ req, res }: { req: Request; res: Response }) => ({
        context: ({ req, res }: MyContext) => ({
            req,
            res
        })
    })

    const app = express()
    const RedisStore = connectRedis(session)
    app.use(
        session({
            store: new RedisStore({
                client: redis as any
            }),
            name: 'qid',
            secret: 'lousySecret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
            }
        })
    )

     app.use(
        cors({
            credentials: true,
            origin: 'http://localhost:3000'
        })
    )

    await server.start()
    server.applyMiddleware({
        app
    }) // app is from an existing express app


    app.listen({ port: 5000 }, () =>
        console.log(
            `🚀 Server ready at http://localhost:5000${server.graphqlPath}`
        )
    )
}

startServer()
