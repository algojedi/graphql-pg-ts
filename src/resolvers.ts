import { IResolvers } from 'apollo-server-express'
import * as bcrypt from 'bcryptjs'
import { pool } from './database/db'
import { MyContext, Todo } from './tsTypes'
import { userResolver } from './userResolver'

interface RegisterInput {
    email: string
    password: string
}

// let person: { email: string; password: string } = {
//     email: 'bob',
//     password: 'nono'
// }

interface Person {
    name: string
    age: number
}

type User = {
    email: string
}

type UserResult = User | null // can also include error types

// const someDummy: ReturnedUser = { email: 'John@john.com', id: 58 }

export const resolvers: IResolvers = {
    User: {
        firstLetterOfEmail: (parent: { email: any[] }) => {
            // WE'RE ONLY USING THE FIRST ARG HERE PASSED TO THE FIELD: PARENT
            return parent.email ? parent.email[0] : null // DERIVED FIELD: GETS RESOLVED IN THIS WAY
        }
        // username: parent => { return parent.username;
        // }
    },

    Query: {
        hello: (): Person => {
            return { name: 'ashoo', age: 14 }
        },

        user: userResolver,

        todos: async (): Promise<Todo[] | null> => {
            const text = 'select * from todo'
            try {
                const res = await pool.query(text)
                console.log({ res: res.rows })
                return res.rows
            } catch (err) {
                console.log(err.stack)
                return null
            }
        },

        todosByUser: async (
            _: any,
            { id }: { id: number }
        ): Promise<Todo[] | null> => {
            const text = 'select title from todo where creator_id = $1'
            const values = [id]
            try {
                const res = await pool.query(text, values)
                if (res.rowCount == 0) return []
                return res.rows
            } catch (err) {
                console.log(err.stack)
                return null
            }
        }
    },

    Mutation: {
        // args: first one is the parent, second are the args passed in as an object
        register: async (
            _: any,
            { email, password }: RegisterInput
        ): Promise<boolean> => {
            // probably better to have a RegisterResponse type
            const hashedPassword = await bcrypt.hash(password, 10)
            const text =
                'INSERT INTO app_user(email, password) VALUES($1, $2) RETURNING *'
            const values = [email, hashedPassword]
            try {
                // const res = await pool.query(text, values)
                await pool.query(text, values)
                // console.log({ res: res.rows })
                return true
            } catch (err) {
                console.log(err.stack)
                return false
            }
        },

        login: async (
            _: any,
            { email, password }: RegisterInput,
            ctx: MyContext
        ): Promise<UserResult> => {
            const { req } = ctx
            // !Must compare encrypted password here
            const text = 'select password from app_user where email = $1'
            const values = [email]
            try {
                const result = await pool.query(text, values)
                if (result.rowCount == 0)
                    throw new Error('Incorrect email or password')
                console.log({ loginPGresponse: result.rows[0] })
                const valid = await bcrypt.compare(
                    password,
                    result.rows[0].password
                )
                if (!valid) throw new Error('Incorrect email or password')
                // express-session will only create a cookie if session object is modified
                req.session.userId = 3
                return { email }
            } catch (err) {
                console.log(err)
                return null
            }
        }
    }
}

// export const resolvers: IResolvers = {
//   Query: {
//     me: (_, __, { req }) => {
//       if (!req.session.userId) {
//         return null;
//       }

//       return User.findOne(req.session.userId);
//     }
//   },
//   Mutation: {
//     logout: async (_, __, { req, res }) => {
//       await new Promise(res => req.session.destroy(() => res()));
//       res.clearCookie("connect.sid");
//       return true;
//     },
//     register: async (_, { email, password }) => {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       await User.create({
//         email,
//         password: hashedPassword
//       }).save();

//       return true;
//     },
//     login: async (_, { email, password }, { req }) => {
//       const user = await User.findOne({ where: { email } });
//       if (!user) {
//         return null;
//       }

//       const valid = await bcrypt.compare(password, user.password);
//       if (!valid) {
//         return null;
//       }

//       req.session.userId = user.id;

//       return user;
//     }

//     },
// };
