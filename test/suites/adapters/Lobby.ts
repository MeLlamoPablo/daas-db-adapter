import "mocha"
import { expect } from "chai"

import { Bot, GameMode, LobbyStatus, Lobby, Server } from "@daas/model"
import { Bots, Lobbies } from "../../.."
import { testBotProperties } from "./Bot"

export const lobbySuite = () =>
	describe("LobbyAdapter", async () => {
		describe("insert", () => {
			it("should insert a lobby", async () => {
				const lobby = await Lobbies.insert({
					name: "Test lobby",
					server: Server.LUXEMBOURG,
					gameMode: GameMode.CAPTAINS_MODE,
					radiantHasFirstPick: true
				})

				expect(lobby).to.be.instanceof(Lobby)
				expect(lobby.id).to.equal(1)
				expect(lobby.name).to.equal("Test lobby")
				expect(lobby.password).to.be.a("string")
				expect(lobby.server).to.equal(Server.LUXEMBOURG)
				expect(lobby.gameMode).to.equal(GameMode.CAPTAINS_MODE)
				expect(lobby.status).to.equal(LobbyStatus.CREATION_PENDING)
				expect(lobby.matchId).to.be.null
				expect(lobby.matchResult).to.be.null
				expect(lobby.radiantHasFirstPick).to.be.true
				expect(lobby.bot).to.be.null
			})
		})
		describe("findAll", () => {
			it("should return all lobbies", async () => {
				await Lobbies.insert({
					name: "Test lobby 2",
					server: Server.LUXEMBOURG,
					gameMode: GameMode.CAPTAINS_MODE,
					radiantHasFirstPick: true
				})

				const lobbies = await Lobbies.findAll()

				expect(lobbies)
					.to.be.an("array")
					.that.has.length(2)
			})
		})
		describe("findById", async () => {
			it("should find a specific lobby", async () => {
				const lobby = await Lobbies.findById(1)
				expect(lobby).not.to.be.null
				expect(lobby!.name).to.equal("Test lobby")
				expect(lobby!.players).to.be.an("array").that.is.empty
			})
		})
		describe("update", async () => {
			it("should update a lobby", async () => {
				const lobby = await Lobbies.findById(1)
				expect(lobby).not.to.be.null
				const updatedLobby = await Lobbies.update(lobby!, {
					password: "newpass",
					matchId: "1234",
					status: LobbyStatus.OPEN
				})
				expect(updatedLobby.password).to.equal("newpass")
				expect(updatedLobby.matchId).to.equal("1234")
				expect(updatedLobby.status).to.equal(LobbyStatus.OPEN)
				expect((await Lobbies.findById(1))!.password).to.equal("newpass")
			})
			it("should not lose player information", async () => {
				const lobby = await Lobbies.findById(1)
				expect(lobby).not.to.be.null
				;(lobby as any).players = ["waddup"]
				const updatedLobby = await Lobbies.update(lobby!, {
					password: "newpass2"
				})
				expect(updatedLobby.password).to.equal("newpass2")
				expect(updatedLobby.players).to.deep.equal(["waddup"])
				expect((await Lobbies.findById(1))!.password).to.equal("newpass2")
			})
			it("should bring the bot information after linking a bot", async () => {
				let [lobby, bot] = await Promise.all([
					Lobbies.insert({
						name: "Test lobby 3",
						server: Server.LUXEMBOURG,
						gameMode: GameMode.CAPTAINS_MODE,
						radiantHasFirstPick: true
					}),
					Bots.insert({
						username: "foo",
						password: "bar",
						sentryFile: null
					})
				])

				await Lobbies.update(lobby, { bot })
				lobby = (await Lobbies.findById(lobby.id))!

				expect(lobby.bot).to.be.an.instanceOf(Bot)
				testBotProperties(lobby.bot!)
			})
		})
		describe("delete", async () => {
			it("should delete a lobby", async () => {
				const lobby = await Lobbies.findById(1)
				expect(lobby).not.to.be.null
				await Lobbies.delete(lobby!)
				expect(await Lobbies.findById(1)).to.be.null
			})
		})
	})
