import { LobbyStatus } from "@daas/model"
import { getDb } from "../connect"
import { id } from "./util/id"

export const migrateLobbies = async () =>
	await getDb().schema.createTable("lobbies", table => {
		id(table)

		table.string("name").notNullable()
		table.string("password").notNullable()
		table.integer("server").notNullable()
		table.integer("game_mode").notNullable()
		table.boolean("radiant_has_first_pick").notNullable()
		table.string("match_id")
		table.integer("match_result")
		table
			.integer("status")
			.notNullable()
			.defaultTo(LobbyStatus.CREATION_PENDING)
	})
