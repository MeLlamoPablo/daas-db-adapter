import "mocha"
import { expect } from "chai"

import { WebHook, WebHookEventType } from "@daas/model"
import { WebHooks } from "../../.."

const numberOfEventTypes = Object.keys(WebHookEventType).length / 2

export function testWebHookProperties(webhook: WebHook) {
	expect(webhook).to.be.instanceof(WebHook)
	expect(webhook.id).to.be.at.least(1)
	expect(webhook.eventType)
		.to.be.at.least(0)
		.and.at.most(numberOfEventTypes - 1)
	expect(webhook.url).to.be.a("string")
	expect(webhook.secret).to.be.a("string")
}

export const webHookSuite = () =>
	describe("WebHookAdapter", async () => {
		describe("insert", () => {
			it("should insert a webhook", async () => {
				const wh = await WebHooks.insert({
					url: "https://www.test.com",
					eventType: WebHookEventType.GAME_CANCELLED
				})

				testWebHookProperties(wh)

				expect(wh.id).to.equal(1)
				expect(wh.url).to.equal("https://www.test.com")
				expect(wh.eventType).to.equal(WebHookEventType.GAME_CANCELLED)
			})
		})
		describe("findAll", () => {
			it("should return all hooks", async () => {
				await Promise.all([
					WebHooks.insert({
						url: "https://www.test2.com",
						eventType: WebHookEventType.GAME_FINISHED
					}),
					WebHooks.insert({
						url: "https://www.test3.com",
						eventType: WebHookEventType.PLAYER_READY_STATUS_UPDATE
					})
				])

				const whs = await WebHooks.findAll()

				expect(whs)
					.to.be.an("array")
					.that.has.length(3)
				whs.forEach(testWebHookProperties)

				expect(whs[0].url).to.equal("https://www.test.com")
				expect(whs[1].url).to.equal("https://www.test2.com")
				expect(whs[2].url).to.equal("https://www.test3.com")
			})
			it("should support limits and offsets", async () => {
				const whs = await WebHooks.findAll(1, 1)

				expect(whs)
					.to.be.an("array")
					.that.has.length(1)
				testWebHookProperties(whs[0])
				expect(whs[0].url).to.equal("https://www.test2.com")
			})
		})
		describe("findById", async () => {
			it("should find a specific webhook", async () => {
				const wh = await WebHooks.findById(1)
				expect(wh).not.to.be.null
				expect(wh!.url).to.equal("https://www.test.com")
			})
			it("should return null on non existing hooks", async () => {
				expect(await WebHooks.findById(100)).to.be.null
			})
		})
		describe("update", async () => {
			it("should update a hook", async () => {
				const wh = await WebHooks.findById(1)
				expect(wh).not.to.be.null
				const updatedWh = await WebHooks.update(wh!, {
					url: "https://www.test3.com",
					regenerateSecret: true
				})
				expect(updatedWh.url).to.equal("https://www.test3.com")
				expect(updatedWh.secret).to.not.equal(wh!.secret)
			})
		})
		describe("delete", async () => {
			it("should delete a hook", async () => {
				const wh = await WebHooks.findById(1)
				expect(wh).not.to.be.null
				await WebHooks.delete(wh!)
				expect(await WebHooks.findById(1)).to.be.null
			})
		})
	})
