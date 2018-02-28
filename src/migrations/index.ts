import { migrateBots } from "./Bot"
import { migrateLobbies } from "./Lobby"
import { migrateLobbyPlayers } from "./LobbyPlayer"
import { migrateApiKeys } from "./ApiKey"
import { getDb } from "../connect"
import { migrateConfig } from "./Config"
import { migrateMachines } from "./Machine"
import { migrateTriggers } from "./triggers"
import { migrateWebhooks } from "./WebHook"

export async function up() {
	await migrateBots()
	await migrateMachines()
	await migrateLobbies()
	await migrateLobbyPlayers()
	await migrateApiKeys()
	await migrateConfig()
	await migrateWebhooks()
	await migrateTriggers()
}

export async function down() {
	const db = getDb()

	await db.schema.dropTable("webhooks")
	await db.schema.dropTable("config")
	await db.schema.dropTable("api_keys")
	await db.schema.dropTable("lobby_players")
	await db.schema.dropTable("lobbies")
	await db.schema.dropTable("machines")
	await db.schema.dropTable("bots")
	await db.raw("DROP FUNCTION lobby_created_trigger();")
}
