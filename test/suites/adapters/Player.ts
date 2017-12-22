import "mocha"
import { expect } from "chai"

import { Lobbies } from "../../../index"
import { PlayerAdapter } from "../../../src/adapters/PlayerAdapter"

export const playerSuite = () =>
	describe("PlayerAdapter", () => {
		let Players: PlayerAdapter
		before(async () => {
			const lobby = await Lobbies.findById(2)
			expect(lobby).not.to.be.null
			Players = Lobbies.concerning(lobby!).Players
		})
		describe("insert", () => {
			it("should insert a player into a lobby", async () => {
				await Players.insert({
					steamId: "1234",
					isRadiant: true,
					isCaptain: true,
					isReady: false
				})
			})
		})
		describe("findAll", () => {
			it("should find all players in the lobby", async () => {
				await Players.insert({
					steamId: "4321",
					isRadiant: true,
					isCaptain: false,
					isReady: false
				})

				const players = await Players.findAll()
				expect(players)
					.to.be.an("array")
					.that.has.length(2)
				expect(players[0].steamId).to.equal("1234")
				expect(players[1].steamId).to.equal("4321")
			})
		})
		describe("LobbyAdapter#findById", () => {
			it("shoul also find all players in the lobby", async () => {
				const lobby = await Lobbies.findById(2)
				const players = lobby!.players
				expect(players)
					.to.be.an("array")
					.that.has.length(2)
				expect(players[0].steamId).to.equal("1234")
				expect(players[1].steamId).to.equal("4321")
			})
		})
	})
