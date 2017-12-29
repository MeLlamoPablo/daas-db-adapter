import { Db } from "../adapters/types/db"
import { Transaction } from "knex"

export function isTransaction(db: Db): db is Transaction {
	return "commit" in db
}
