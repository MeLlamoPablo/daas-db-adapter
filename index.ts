import { ApiKeyAdapter } from "./src/adapters/ApiKeyAdapter"
import { BotAdapter } from "./src/adapters/BotAdapter"
import { LobbyAdapter } from "./src/adapters/LobbyAdapter"
import { ConfigAdapter as RawConfigAdapter } from "./src/adapters/ConfigAdapter"
import { PubSubAdapter as RawPubSubAdapter } from "./src/adapters/PubSubAdapter"
import { getAdapter } from "./src/support/getAdapter"
import { MachineAdapter } from "./src/adapters/MachineAdapter"
import { WebHookAdapter } from "./src/adapters/WebHookAdapter"

export const getApiKeysAdapter = (t: boolean = false) =>
	getAdapter(ApiKeyAdapter, t)
export const getBotsAdapter = (t: boolean = false) => getAdapter(BotAdapter, t)
export const getMachinesAdapter = (t: boolean = false) =>
	getAdapter(MachineAdapter, t)
export const getLobbiesAdapter = (t: boolean = false) =>
	getAdapter(LobbyAdapter, t)
export const getWebHookAdapter = (t: boolean = false) => getAdapter(WebHookAdapter, t)
export const getConfigAdapter = async () => new RawConfigAdapter()

export let ApiKeys: ApiKeyAdapter
export let Bots: BotAdapter
export let Machines: MachineAdapter
export let Lobbies: LobbyAdapter
export let WebHooks: WebHookAdapter
export let Config: RawConfigAdapter
export const PubSub = new RawPubSubAdapter()

async function main() {
	ApiKeys = await getApiKeysAdapter()
	Bots = await getBotsAdapter()
	Machines = await getMachinesAdapter()
	Lobbies = await getLobbiesAdapter()
	WebHooks = await getWebHookAdapter()
	Config = await getConfigAdapter()
}

main().catch(console.error)

export { closeDb } from "./src/connect"
