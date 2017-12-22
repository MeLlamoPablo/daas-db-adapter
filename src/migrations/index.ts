import { migrateBots } from "./Bot"
import { migrateLobbies } from "./Lobby"
import { migrateLobbyPlayers } from "./LobbyPlayer"
import { migrateApiKeys } from "./ApiKey"
import { getDb } from "../connect"
import { migrateConfig } from "./Config"

export async function up() {
	await migrateBots()
	await migrateLobbies()
	await migrateLobbyPlayers()
	await migrateApiKeys()
	await migrateConfig()
}

export async function down() {
	const db = getDb()

	await db.schema.dropTable("api_keys")
	await db.schema.dropTable("bots")
	await db.schema.dropTable("lobby_players")
	await db.schema.dropTable("lobbies")
	await db.schema.dropTable("config")
}
