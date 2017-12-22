import { Player, Lobby } from "@daas/model"
import { getDb } from "../connect"
import { objectToSnakeCase } from "../support/objectToSnakeCase"
import { objectToCamelCase } from "../support/objectToCamelCase"
import { UpdatePlayerData } from "./definitions/UpdatePlayerData"

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

	constructor(lobby: Lobby) {
		this.lobby = lobby
	}

	async findAll(): Promise<Array<Player>> {
		return ((await getDb()
			.select(this.dbColumns)
			.from(this.dbTable)
			.where({
				lobby_id: this.lobby.id
			})) as any[]).map(it => objectToCamelCase(it))
	}

	async insert(data: Player): Promise<Player> {
		await getDb()
			.insert({
				lobby_id: this.lobby.id,
				...objectToSnakeCase(data)
			})
			.into(this.dbTable)

		return data
	}

	async update(data: UpdatePlayerData): Promise<Player> {
		const [updatedData] = await getDb()
			.update({
				lobby_id: this.lobby.id,
				...objectToSnakeCase(data)
			})
			.table(this.dbTable)
			.returning(this.dbColumns)

		return objectToCamelCase(updatedData)
	}

	async delete(player: Player): Promise<void> {
		await getDb()
			.delete()
			.from(this.dbTable)
			.where({
				lobby_id: this.lobby.id,
				steam_id: player.steamId
			})
	}
}
