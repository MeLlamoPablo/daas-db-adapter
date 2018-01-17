import { isArray } from "util"
import { Player, Lobby } from "@daas/model"
import { getDb } from "../connect"
import { objectToSnakeCase } from "../support/objectToSnakeCase"
import { objectToCamelCase } from "../support/objectToCamelCase"
import { UpdatePlayerData } from "./definitions/UpdatePlayerData"
import { ExecQueryFunction } from "./types/ExecQueryFunction"

export const PLAYER_COLUMNS = [
	"steam_id",
	"is_radiant",
	"is_ready",
	"is_captain"
]

export class PlayerAdapter {
	protected readonly dbTable: string = "lobby_players"
	protected readonly dbColumns: Array<string> = PLAYER_COLUMNS

	private readonly lobby: Lobby
	private readonly execQuery: ExecQueryFunction

	constructor(execQuery: ExecQueryFunction, lobby: Lobby) {
		this.execQuery = execQuery
		this.lobby = lobby
	}

	async findAll(): Promise<Array<Player>> {
		return ((await getDb()
			.select(this.dbColumns)
			.from(this.dbTable)
			.where({
				lobby_id: this.lobby.id
			})
			.orderBy("id", "asc")) as any[]).map(it => objectToCamelCase(it))
	}

	async insert(data: Player | Array<Player>): Promise<void> {
		await this.execQuery(db =>
			db
				.insert(
					(isArray(data) ? data : [data]).map(it => ({
						lobby_id: this.lobby.id,
						...objectToSnakeCase(it)
					}))
				)
				.into(this.dbTable)
		)
	}

	async update(
		player: Player | string,
		data: UpdatePlayerData
	): Promise<Player> {
		const [updatedData] = await this.execQuery(db =>
			db
				.update(objectToSnakeCase(data))
				.table(this.dbTable)
				.where({
					lobby_id: this.lobby.id,
					steam_id: typeof player === "string" ? player : player.steamId
				})
				.returning(this.dbColumns)
		)

		return objectToCamelCase(updatedData)
	}

	async delete(player: Player): Promise<void> {
		await this.execQuery(db =>
			db
				.delete()
				.from(this.dbTable)
				.where({
					lobby_id: this.lobby.id,
					steam_id: player.steamId
				})
		)
	}
}
