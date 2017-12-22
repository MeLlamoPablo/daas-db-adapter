import { ApiKeyAdapter } from "./src/adapters/ApiKeyAdapter"
import { BotAdapter } from "./src/adapters/BotAdapter"
import { LobbyAdapter } from "./src/adapters/LobbyAdapter"
import { ConfigAdapter } from "./src/adapters/ConfigAdapter"
import { PubSubAdapter } from "./src/adapters/PubSubAdapter"

export const ApiKeys = new ApiKeyAdapter()
export const Bots = new BotAdapter()
export const Lobbies = new LobbyAdapter()
export const Config = new ConfigAdapter()
export const PubSub = new PubSubAdapter()

export { closeDb } from "./src/connect"
