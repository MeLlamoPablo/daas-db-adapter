import { getDb } from "../connect"

export const migrateConfig = async () => {
	await getDb().schema.createTable("config", table => {
		table.integer("league_id")
		table.integer("lobby_timeout").notNullable()
		table.integer("always_active_machines").notNullable()
	})

	await getDb()
		.insert({
			league_id: null,
			lobby_timeout: 300,
			always_active_machines: 1
		})
		.into("config")
}
