import { BotStatus } from "@daas/model"
import { getDb } from "../connect"
import { id } from "./util/id"

export const migrateBots = async () =>
	await getDb().schema.createTable("bots", table => {
		id(table)

		table
			.string("username")
			.notNullable()
			.unique()
		table.string("password").notNullable()
		table
			.integer("status")
			.notNullable()
			.defaultTo(BotStatus.OFFLINE)
		table.timestamp("disabled_until")
		table.binary("sentry_file")
	})
