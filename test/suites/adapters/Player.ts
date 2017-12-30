import "mocha"
import { expect } from "chai"

import { Lobbies } from "../../.."
import { PlayerAdapter } from "../../../src/adapters/PlayerAdapter"

export const playerSuite = () =>
	describe("PlayerAdapter", async () => {
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
		describe("update", () => {
			it("should update a player in the lobby", async () => {
				const players = await Players.findAll()
				await Players.update(players[0], { isReady: true })

				expect((await Players.findAll())[0].isReady).to.be.true
			})
		})
		describe("update", () => {
			it("should update a player in the lobby", async () => {
				const players = await Players.findAll()
				await Players.delete(players[0])

				const newPlayers = await Players.findAll()

				expect(newPlayers)
					.to.be.an("array")
					.that.has.length(1)

				expect(newPlayers[0].steamId).to.equal("4321")
			})
		})
		describe("LobbyAdapter#findById", () => {
			it("shoul also find all players in the lobby", async () => {
				const lobby = await Lobbies.findById(2)
				const players = lobby!.players
				expect(players)
					.to.be.an("array")
					.that.has.length(1)
				expect(players[0].steamId).to.equal("4321")
			})
		})
	})
