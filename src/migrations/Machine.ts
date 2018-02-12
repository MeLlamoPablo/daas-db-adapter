import { getDb } from "../connect"
import { id } from "./util/id"

export const migrateMachines = async () =>
	await getDb().schema.createTable("machines", table => {
		id(table)

		table
			.integer("bot_id")
			.references("id")
			.inTable("bots")
			.notNullable()
		table.boolean("is_terminated").notNullable()
		table.timestamp("started_at").notNullable()
	})
