import "mocha"
import { expect } from "chai"

import { Lobbies } from "../../.."
import { PlayerAdapter } from "../../../src/adapters/PlayerAdapter"

export const playerSuite = () =>
	describe("PlayerAdapter", async () => {
		const allPlayers = async () =>
			(await Players.findAll()).sort((a, b) => +a.steamId - +b.steamId)

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
			it("should insert players in bulk", async () => {
				await Players.insert([
					{
						steamId: "4321",
						isRadiant: true,
						isCaptain: true,
						isReady: false
					},
					{
						steamId: "2222",
						isRadiant: true,
						isCaptain: true,
						isReady: false
					}
				])
			})
		})
		describe("findAll", () => {
			it("should find all players in the lobby", async () => {
				const players = await allPlayers()

				expect(players)
					.to.be.an("array")
					.that.has.length(3)

				expect(players[0].steamId).to.equal("1234")
				expect(players[1].steamId).to.equal("2222")
				expect(players[2].steamId).to.equal("4321")
			})
		})
		describe("update", () => {
			it("should update a player in the lobby", async () => {
				const players = await Players.findAll()
				await Players.update(players[0], { isReady: true })

				expect((await allPlayers())[0].isReady).to.be.true
			})
			it("should update a player in the lobby by their ID", async () => {
				await Players.update("4321", { isReady: true })

				expect((await allPlayers())[2].isReady).to.be.true
			})
		})
		describe("delete", () => {
			it("should delete a player in the lobby", async () => {
				const players = await allPlayers()
				await Players.delete(players[0])

				const newPlayers = await allPlayers()

				expect(newPlayers)
					.to.be.an("array")
					.that.has.length(2)

				expect(newPlayers[0].steamId).to.equal("2222")
				expect(newPlayers[1].steamId).to.equal("4321")
			})
		})
		describe("LobbyAdapter#findById", () => {
			it("shoul also find all players in the lobby", async () => {
				const lobby = await Lobbies.findById(2)
				const players = lobby!.players.sort((a, b) => +a.steamId - +b.steamId)
				expect(players)
					.to.be.an("array")
					.that.has.length(2)

				expect(players[0].steamId).to.equal("2222")
				expect(players[1].steamId).to.equal("4321")
			})
		})
	})
