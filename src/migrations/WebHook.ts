import { getDb } from "../connect"
import { id } from "./util/id"

export const migrateWebhooks = async () =>
	await getDb().schema.createTable("webhooks", table => {
		id(table)

		table.integer("event_type").notNullable()
		table.string("url").notNullable()
		table.string("secret").notNullable()
	})
