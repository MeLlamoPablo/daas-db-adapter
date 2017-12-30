import { Db } from "./db"
import { QueryBuilder } from "knex"

export type Query = (db: Db) => QueryBuilder
