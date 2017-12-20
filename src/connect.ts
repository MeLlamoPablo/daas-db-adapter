import * as Knex from "knex"

let db: Knex | null = null

export function getDb(): Knex {
	if (db) {
		return db
	}

	if (!process.env.DATABASE_URL) {
		throw new Error(
			"Cannot connect to the db because the DATABASE_URL" +
				" env var is not present!"
		)
	}

	let connStr = process.env.DATABASE_URL!
	if (process.env.DATABASE_SSL === "true" && !connStr.includes("ssl=true")) {
		connStr += "?ssl=true"
	}

	db = Knex({
		client: "pg",
		connection: connStr
	})

	return db
}

// async/await is needed here to convert Bluebird to Promise
export const closeDb = async () => await getDb().destroy()
