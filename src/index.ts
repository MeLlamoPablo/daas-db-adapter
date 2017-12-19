import { BotAdapter } from "./adapters/BotAdapter"
import { LobbyAdapter } from "./adapters/LobbyAdapter"

export const Bots = new BotAdapter()
export const Lobbies = new LobbyAdapter()

export { closeDb } from "./connect"
