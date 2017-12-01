import { LobbyStatus } from "@daas/model"
import { getDb } from "../connect"
import { id } from "./util/id"

export const migrateLobbies = () =>
	getDb().schema.createTable("lobbies", table => {
		id(table)

		table.string("name").notNullable()
		table.string("password").notNullable()
		table.integer("server").notNullable()
		table.integer("game_mode").notNullable()
		table.boolean("team_a_has_first_pick").notNullable()
		table
			.integer("status")
			.notNullable()
			.defaultTo(LobbyStatus.CREATION_PENDING)
	})
