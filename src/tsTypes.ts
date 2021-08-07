import { Session, SessionData } from "express-session";

export interface ReturnedUser {
    id: number
    email: string
}

export interface MyContext {
    req: Request & {
        session: Session & Partial<SessionData> & { userId?: number }
    }
    res: Response
}

export interface Todo {
    id: number
    content: string
    title: string
    created_at: string
    creator_id: number
}