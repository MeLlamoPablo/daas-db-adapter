import { Lobby } from "@daas/model"
import { Adapter } from "./Adapter"
import { CreateLobbyData } from "./definitions/CreateLobbyData"
import { UpdateLobbyData } from "./definitions/UpdateLobbyData"
import { PlayerAdapter } from "./PlayerAdapter"

class LobbyConcernAdapter {
	private readonly lobby: Lobby

	constructor(lobby: Lobby) {
		this.lobby = lobby
	}

	get Players() {
		return new PlayerAdapter(this.lobby)
	}
}

export class LobbyAdapter extends Adapter<Lobby> {
	protected readonly dbTable: string = "lobbies"
	protected readonly dbColumns: Array<string> = [
		"name",
		"password",
		"server",
		"game_mode",
		"team_a_has_first_pick",
		"status"
	]

	protected mapDbResultToClass(row: any): Lobby {
		return new Lobby(
			row.id,
			row.name,
			row.password,
			row.server,
			row.gameMode,
			row.teamAHasFirstPick
		)
	}

	insert(data: CreateLobbyData): Promise<Lobby> {
		return super.insert(data)
	}

	update(lobby: Lobby, data: UpdateLobbyData): Promise<Lobby> {
		return super.update(lobby, data)
	}

	concerning(lobby: Lobby): LobbyConcernAdapter {
		return new LobbyConcernAdapter(lobby)
	}
}
