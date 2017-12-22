import { GameMode, LobbyStatus, Server } from "@daas/model"

export interface CreateLobbyData {
	name: string
	server: Server
	gameMode: GameMode
	radiantHasFirstPick: boolean
	status?: LobbyStatus
}
