import { getDb } from "../connect"
import { id } from "./util/id"

export const migrateLobbyPlayers = async () =>
	await getDb().schema.createTable("lobby_players", table => {
		id(table)

		table.string("steam_id").notNullable()
		table
			.integer("lobby_id")
			.notNullable()
			.references("id")
			.inTable("lobbies")
			.onDelete("cascade")
			.onUpdate("cascade")
		table.boolean("is_radiant").notNullable()
		table
			.boolean("is_ready")
			.notNullable()
			.defaultTo(false)
		table.boolean("is_captain").notNullable()

		table.unique(["steam_id", "lobby_id"])
	})
