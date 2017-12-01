import { migrateBots } from "./Bot"
import { migrateLobbies } from "./Lobby"
import { migrateLobbyPlayers } from "./LobbyPlayer"
import { getDb } from "../connect"

export async function up() {
	await migrateBots()
	await migrateLobbies()
	await migrateLobbyPlayers()
}

export async function down() {
	const db = getDb()

	await db.schema.dropTable("lobby_players")
	await db.schema.dropTable("lobbies")
	await db.schema.dropTable("bots")
}
