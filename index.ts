import { BotAdapter } from "./src/adapters/BotAdapter"
import { LobbyAdapter } from "./src/adapters/LobbyAdapter"

export const Bots = new BotAdapter()
export const Lobbies = new LobbyAdapter()

export { closeDb } from "./src/connect"
