import * as Knex from "knex"

let db: Knex | null = null

export function getDb(): Knex {
	if (db) {
		return db
	}

	// istanbul ignore if
	if (!process.env.DATABASE_URL) {
		throw new Error(
			"Cannot connect to the db because the DATABASE_URL" +
				" env var is not present!"
		)
	}

	let connStr = process.env.DATABASE_URL!
	// istanbul ignore next
	if (process.env.DATABASE_SSL === "true" && !connStr.includes("ssl=true")) {
		connStr += "?ssl=true"
	}

	db = Knex({
		client: "pg",
		connection: connStr
	})

	return db
}

// any because @typings/pg was causing trouble
export const getPg = () => getDb().client.acquireRawConnection() as Promise<any>

// async/await is needed here to convert Bluebird to Promise
export const closeDb = async () => await getDb().destroy()
