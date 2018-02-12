import "mocha"
import { expect } from "chai"

import { GameMode, Server } from "@daas/model"
import { PubSub, Lobbies } from "../.."

export const triggerSuite = () =>
	describe("Triggers", async () => {
		let unsubscribe: () => Promise<void>, lastMessage: any
		it("should notify of lobby updates", async () => {
			unsubscribe = await PubSub.listen("database_changes", msg => {
				lastMessage = msg
			})

			const lobby = await Lobbies.insert({
				name: "Trigger test",
				server: Server.LUXEMBOURG,
				gameMode: GameMode.CAPTAINS_MODE,
				radiantHasFirstPick: true
			})

			await Lobbies.update(lobby, { name: "Trigger test 2" })

			await new Promise(r => setTimeout(r, 200))

			expect(lastMessage).to.deep.equal({ table: "lobbies" })
		})
		it("should unsubscribe successfully", () => unsubscribe())
	})
