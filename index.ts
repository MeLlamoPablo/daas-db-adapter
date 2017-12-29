import { ApiKeyAdapter } from "./src/adapters/ApiKeyAdapter"
import { BotAdapter } from "./src/adapters/BotAdapter"
import { LobbyAdapter } from "./src/adapters/LobbyAdapter"
import { ConfigAdapter } from "./src/adapters/ConfigAdapter"
import { PubSubAdapter } from "./src/adapters/PubSubAdapter"
import { getAdapter } from "./src/support/getAdapter"

export const ApiKeys = (t: boolean = false) => getAdapter(ApiKeyAdapter, t)
export const Bots = (t: boolean = false) => getAdapter(BotAdapter, t)
export const Lobbies = (t: boolean = false) => getAdapter(LobbyAdapter, t)
export const Config = async () => new ConfigAdapter()
export const PubSub = async () => new PubSubAdapter()

export { closeDb } from "./src/connect"
