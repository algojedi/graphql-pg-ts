import { pool } from "./database/db"
import { ReturnedUser } from "./tsTypes"


        export const userResolver = async (
            _: any,
            { id }: { id: number }
        ): Promise<ReturnedUser | null> => {
            const text = 'select email, id from app_user where id = $1'
            const values = [id]
            try {
                const res = await pool.query(text, values)
                //    return res.rows[0]
                if (res.rowCount == 0) {
                    console.log('nothing returned from db query')
                    return null
                }
                console.log({ response: res.rows[0] })
                return res.rows[0]
            } catch (error) {
                console.log({ error })
                return null
            }
        }