import { ApiKeyAdapter } from "./src/adapters/ApiKeyAdapter"
import { BotAdapter } from "./src/adapters/BotAdapter"
import { LobbyAdapter } from "./src/adapters/LobbyAdapter"
import { ConfigAdapter as RawConfigAdapter } from "./src/adapters/ConfigAdapter"
import { PubSubAdapter as RawPubSubAdapter } from "./src/adapters/PubSubAdapter"
import { getAdapter } from "./src/support/getAdapter"

export const getApiKeysAdapter = (t: boolean = false) =>
	getAdapter(ApiKeyAdapter, t)
export const getBotsAdapter = (t: boolean = false) => getAdapter(BotAdapter, t)
export const getLobbiesAdapter = (t: boolean = false) =>
	getAdapter(LobbyAdapter, t)
export const getConfigAdapter = async () => new RawConfigAdapter()

export let ApiKeys: ApiKeyAdapter
export let Bots: BotAdapter
export let Lobbies: LobbyAdapter
export let Config: RawConfigAdapter
export const PubSub = new RawPubSubAdapter()

async function main() {
	ApiKeys = await getApiKeysAdapter()
	Bots = await getBotsAdapter()
	Lobbies = await getLobbiesAdapter()
	Config = await getConfigAdapter()
}

main().catch(console.error)

export { closeDb } from "./src/connect"
