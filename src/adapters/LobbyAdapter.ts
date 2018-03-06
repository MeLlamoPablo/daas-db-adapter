import { Bot, Lobby, LobbyStatus, Machine } from "@daas/model"
import { isUndefined } from "util"
import { EntityAdapter } from "./EntityAdapter"
import { CreateLobbyData } from "./definitions/CreateLobbyData"
import { UpdateLobbyData } from "./definitions/UpdateLobbyData"
import { PLAYER_COLUMNS, PlayerAdapter } from "./PlayerAdapter"
import { JoinType } from "./enums/JoinType"
import { JoinedData } from "./interfaces/JoinedData"
import { generatePassword } from "../support/generatePassword"
import { ExecQueryFunction } from "./types/ExecQueryFunction"
import { BOT_COLUMS } from "./BotAdapter"
import { MACHINE_COLUMNS } from "./MachineAdapter"

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
	"machine_id"
]

export class LobbyAdapter extends EntityAdapter<Lobby> {
	protected readonly dbTable: string = "lobbies"
	protected readonly dbColumns: Array<string> = LOBBY_COLUMNS
	// lobby_players <-- lobbies --> machines --> bots
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
			originColumn: "machine_id",
			targetTable: "machines",
			targetColumn: "id",
			targetTableColumns: MACHINE_COLUMNS
		},
		{
			type: JoinType.LEFT,
			originTable: "machines",
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

		const machinesJoin = joins.find(it => it.table === "machines")
		const botsJoin = joins.find(it => it.table === "bots")

		if (
			botsJoin &&
			botsJoin.rows.length > 0 &&
			machinesJoin &&
			machinesJoin.rows.length > 0
		) {
			const machineRow = machinesJoin.rows[0]
			const botRow = botsJoin.rows[0]

			lobby.machine = new Machine(
				row.machineId,
				machineRow.startedAt,
				new Bot(
					machineRow.botId,
					botRow.username,
					botRow.password,
					botRow.sentryFile
				),
				machineRow.isTerminated
			)
		} else {
			lobby.machine = null
		}

		return lobby
	}

	findByMachine(machine: Machine): Promise<Lobby | null> {
		return this.findByCondition({ machine_id: machine.id })
	}

	async findAllWithoutMachine(): Promise<Array<Lobby>> {
		const rows = await this.execQuery(db =>
			db
				.select("id")
				.from(this.dbTable)
				.where({
					machine_id: null,
					status: LobbyStatus.CREATION_PENDING
				})
		)

		return await Promise.all(
			rows.map(it => super.findById(it.id) as Promise<Lobby>)
		)
	}

	insert(data: CreateLobbyData): Promise<Lobby> {
		return super.insert({
			...data,
			password: generatePassword()
		})
	}

	async update(lobby: Lobby, data: UpdateLobbyData): Promise<Lobby> {
		const diff = {} as any

		if (data.name) {
			diff.name = data.name
		}

		if (data.password) {
			diff.password = data.password
		}

		if (data.server) {
			diff.server = data.server
		}

		if (data.gameMode) {
			diff.gameMode = data.gameMode
		}

		if (data.radiantHasFirstPick) {
			diff.radiantHasFirstPick = data.radiantHasFirstPick
		}

		if (data.status) {
			diff.status = data.status
		}

		if (data.machine) {
			diff.machineId = data.machine.id
		}

		if (data.matchId) {
			diff.matchId = data.matchId
		}

		if (data.matchResult) {
			diff.matchResult = data.matchResult
		}

		await super.update(lobby, diff)
		return (await this.findById(lobby.id))!
	}

	concerning(lobby: Lobby): LobbyConcernAdapter {
		return new LobbyConcernAdapter(super.execQuery.bind(this), lobby)
	}
}

