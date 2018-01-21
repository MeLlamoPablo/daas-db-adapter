import { Bot, GameMode, LobbyStatus, MatchResult, Server } from "@daas/model"

export interface UpdateLobbyData {
	name?: string
	password?: string
	server?: Server
	gameMode?: GameMode
	radiantHasFirstPick?: boolean
	status?: LobbyStatus
	bot?: Bot | null
	matchId?: string | null
	matchResult?: MatchResult | null
}
