import { Bot, Lobby } from "@daas/model"
import { EntityAdapter } from "./EntityAdapter"
import { CreateLobbyData } from "./definitions/CreateLobbyData"
import { UpdateLobbyData } from "./definitions/UpdateLobbyData"
import { PLAYER_COLUMNS, PlayerAdapter } from "./PlayerAdapter"
import { JoinType } from "./enums/JoinType"
import { JoinedData } from "./interfaces/JoinedData"
import { generatePassword } from "../support/generatePassword"
import { ExecQueryFunction } from "./types/ExecQueryFunction"
import { isUndefined } from "util"
import { BOT_COLUMS } from "./BotAdapter"

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
	"match_id",
	"bot_id"
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
		},
		{
			type: JoinType.LEFT,
			originTable: this.dbTable,
			originColumn: "bot_id",
			targetTable: "bots",
			targetColumn: "id",
			targetTableColumns: BOT_COLUMS
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

		const botsJoin = joins.find(it => it.table === "bots")

		if (botsJoin && botsJoin.rows.length > 0) {
			const botRow = botsJoin.rows[0]

			lobby.bot = new Bot(
				row.botId,
				botRow.username,
				botRow.password,
				botRow.sentryFile
			)
		} else {
			lobby.bot = null
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
		const updatedLobby = await super.update(lobby, {
			name: data.name,
			password: data.password,
			server: data.server,
			gameMode: data.gameMode,
			radiantHasFirstPick: data.radiantHasFirstPick,
			status: data.status,
			botId: data.bot ? data.bot.id : null,
			matchId: data.matchId,
			matchResult: data.matchResult
		})
		updatedLobby.players = players

		return updatedLobby
	}

	concerning(lobby: Lobby): LobbyConcernAdapter {
		return new LobbyConcernAdapter(super.execQuery.bind(this), lobby)
	}
}
