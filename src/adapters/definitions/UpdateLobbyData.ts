import {
	Machine,
	GameMode,
	LobbyStatus,
	MatchResult,
	Server
} from "@daas/model"

export interface UpdateLobbyData {
	name?: string
	password?: string
	server?: Server
	gameMode?: GameMode
	radiantHasFirstPick?: boolean
	status?: LobbyStatus
	machine?: Machine | null
	matchId?: string | null
	matchResult?: MatchResult | null
}
