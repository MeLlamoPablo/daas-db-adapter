import { Lobby } from "@daas/model"
import { EntityAdapter } from "./EntityAdapter"
import { CreateLobbyData } from "./definitions/CreateLobbyData"
import { UpdateLobbyData } from "./definitions/UpdateLobbyData"
import { PLAYER_COLUMNS, PlayerAdapter } from "./PlayerAdapter"
import { JoinType } from "./enums/JoinType"
import { JoinedData } from "./interfaces/JoinedData"
import { generatePassword } from "../support/generatePassword"
import { ExecQueryFunction } from "./types/ExecQueryFunction"
import { isUndefined } from "util"

export class LobbyConcernAdapter {
	private readonly execQuery: ExecQueryFunction
	private readonly lobby: Lobby

	constructor(execQuery: ExecQueryFunction, lobby: Lobby) {
		this.execQuery = execQuery
		this.lobby = lobby
	}

	get Players() {
		return new PlayerAdapter(this.execQuery, this.lobby)
	}
}

export const LOBBY_COLUMNS = [
	"name",
	"password",
	"server",
	"game_mode",
	"radiant_has_first_pick",
	"status",
	"match_result",
	"match_id"
]

export class LobbyAdapter extends EntityAdapter<Lobby> {
	protected readonly dbTable: string = "lobbies"
	protected readonly dbColumns: Array<string> = LOBBY_COLUMNS
	protected readonly joins = [
		{
			type: JoinType.LEFT,
			originTable: this.dbTable,
			originColumn: "id",
			targetTable: "lobby_players",
			targetColumn: "lobby_id",
			targetTableColumns: PLAYER_COLUMNS
		}
	]

	protected mapDbResultToClass(row: any, joins: Array<JoinedData> = []): Lobby {
		const lobby = new Lobby(
			row.id,
			row.name,
			row.password,
			row.server,
			row.gameMode,
			row.radiantHasFirstPick
		)

		if (!isUndefined(row.status)) {
			lobby.status = row.status
		}

		lobby.matchId = row.matchId || null
		lobby.matchResult = row.matchResult || null

		const playersJoin = joins.find(it => it.table === "lobby_players")

		if (playersJoin) {
			lobby.players = playersJoin.rows
		}

		return lobby
	}

	insert(data: CreateLobbyData): Promise<Lobby> {
		return super.insert({
			...data,
			password: generatePassword()
		})
	}

	async update(lobby: Lobby, data: UpdateLobbyData): Promise<Lobby> {
		const players = lobby.players
		const updatedLobby = await super.update(lobby, data)
		updatedLobby.players = players

		return updatedLobby
	}

	concerning(lobby: Lobby): LobbyConcernAdapter {
		return new LobbyConcernAdapter(super.execQuery.bind(this), lobby)
	}
}
