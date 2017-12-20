import { Lobby } from "@daas/model"
import { Adapter } from "./Adapter"
import { CreateLobbyData } from "./definitions/CreateLobbyData"
import { UpdateLobbyData } from "./definitions/UpdateLobbyData"
import { PLAYER_COLUMNS, PlayerAdapter } from "./PlayerAdapter"
import { JoinType } from "./enums/JoinType"
import { JoinedData } from "./interfaces/JoinedData"
import { generatePassword } from "../support/generatePassword"

class LobbyConcernAdapter {
	private readonly lobby: Lobby

	constructor(lobby: Lobby) {
		this.lobby = lobby
	}

	get Players() {
		return new PlayerAdapter(this.lobby)
	}
}

export const LOBBY_COLUMNS = [
	"name",
	"password",
	"server",
	"game_mode",
	"team_a_has_first_pick",
	"status"
]

export class LobbyAdapter extends Adapter<Lobby> {
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
			row.teamAHasFirstPick
		)

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

	update(lobby: Lobby, data: UpdateLobbyData): Promise<Lobby> {
		return super.update(lobby, data)
	}

	concerning(lobby: Lobby): LobbyConcernAdapter {
		return new LobbyConcernAdapter(lobby)
	}
}
