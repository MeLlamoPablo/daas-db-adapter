import { getDb } from "../connect"

export const migrateConfig = async () => {
	await getDb().schema.createTable("config", table => {
		table.integer("league_id")
	})

	await getDb()
		.insert({
			league_id: null
		})
		.into("config")
}
