// const { Pool, Client } = require('pg')
import { Pool } from 'pg'

export const pool = new Pool({
  user: 'vic',
  host: 'localhost',
  database: 'todo_database',
  password: 'test',
  port: 5432,
})

