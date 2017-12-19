import "mocha"
import { expect } from "chai"

import { GameMode, LobbyStatus, Lobby, Server } from "@daas/model"
import { Lobbies } from "../../../src"

export const lobbySuite = () =>
	describe("LobbyAdapter", () => {
		describe("insert", () => {
			it("should insert a lobby", async () => {
				const lobby = await Lobbies.insert({
					name: "Test lobby",
					password: "password",
					server: Server.LUXEMBOURG,
					gameMode: GameMode.CAPTAINS_MODE,
					teamAHasFirstPick: true
				})

				expect(lobby).to.be.instanceof(Lobby)
				expect(lobby.id).to.equal(1)
				expect(lobby.name).to.equal("Test lobby")
				expect(lobby.password).to.equal("password")
				expect(lobby.server).to.equal(Server.LUXEMBOURG)
				expect(lobby.gameMode).to.equal(GameMode.CAPTAINS_MODE)
				expect(lobby.status).to.equal(LobbyStatus.CREATION_PENDING)
				expect(lobby.teamAHasFirstPick).to.be.true
			})
		})
		describe("findAll", () => {
			it("should return all lobbies", async () => {
				await Lobbies.insert({
					name: "Test lobby 2",
					password: "password",
					server: Server.LUXEMBOURG,
					gameMode: GameMode.CAPTAINS_MODE,
					teamAHasFirstPick: true
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
			it("should update a bot", async () => {
				const lobby = await Lobbies.findById(1)
				expect(lobby).not.to.be.null
				const updatedLobby = await Lobbies.update(lobby!, {
					password: "newpass"
				})
				expect(updatedLobby.password).to.equal("newpass")
				expect((await Lobbies.findById(1))!.password).to.equal("newpass")
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
