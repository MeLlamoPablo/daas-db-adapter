import { getDb } from "../connect"
import { id } from "./util/id"

export const migrateApiKeys = () =>
	getDb().schema.createTable("api_keys", table => {
		id(table)

		table
			.string("label")
			.notNullable()
		table.string("fragment").notNullable().unique()
		table
			.string("value")
			.notNullable()
		table.jsonb("permissions").notNullable()
		table.timestamp("last_used").notNullable()
	})
