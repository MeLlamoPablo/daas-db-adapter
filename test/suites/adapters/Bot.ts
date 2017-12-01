import "mocha"
import { expect } from "chai"

import { Bot, BotStatus } from "@daas/model"
import { Bots } from "../../../src"
import { assertRejects } from "../../util/assertRejects"

export const botSuite = () =>
	describe("Bots", () => {
		describe("insert", () => {
			it("should insert a bot", async () => {
				const bot = await Bots.insert({
					username: "hello",
					password: "world",
					steamGuardEnabled: false
				})

				expect(bot).to.be.instanceof(Bot)
				expect(bot.id).to.equal(1)
				expect(bot.username).to.equal("hello")
				expect(bot.password).to.equal("world")
				expect(bot.steamGuardEnabled).to.be.false
				expect(bot.status).to.equal(BotStatus.OFFLINE)
				expect(bot.sentryFile).to.be.null
				expect(bot.disabledUntil).to.be.null
			})
			it("shouldn't insert a duplicate bot", async () => {
				await assertRejects(
					Bots.insert({
						username: "hello",
						password: "world",
						steamGuardEnabled: false
					})
				)
			})
		})
		describe("findAll", () => {
			it("should return all bots", async () => {
				await Promise.all([
					Bots.insert({
						username: "hello2",
						password: "world",
						steamGuardEnabled: false
					}),
					Bots.insert({
						username: "hello3",
						password: "world",
						steamGuardEnabled: false
					})
				])

				const bots = await Bots.findAll()

				expect(bots)
					.to.be.an("array")
					.that.has.length(3)
				bots.forEach(bot => expect(bot).to.be.instanceof(Bot))

				expect(bots[0].username).to.equal("hello")
				expect(bots[1].username).to.equal("hello2")
				expect(bots[2].username).to.equal("hello3")
			})
			it("should support limits and offsets", async () => {
				const bots = await Bots.findAll(1, 1)

				expect(bots)
					.to.be.an("array")
					.that.has.length(1)
				expect(bots[0]).to.be.instanceof(Bot)
				expect(bots[0].username).to.equal("hello2")
			})
		})
	})
