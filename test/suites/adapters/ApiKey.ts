import "mocha"
import { expect } from "chai"

import { ApiKey, ApiAccessLevel } from "@daas/model"
import { ApiKeys } from "../../../"

function testApiKeyProperties(key: ApiKey) {
	expect(key.id)
		.to.be.a("number")
		.that.is.at.least(1)
	expect(key.value).to.be.a("string")
	expect(key.fragment)
		.to.be.a("string")
		.that.has.length(5)
	expect(key.permissions).to.contain.keys(["bots", "lobbies", "apiKeys"])
	expect(key.lastUsed).to.be.an.instanceOf(Date)
	expect(key.lastUsed.getTime()).to.be.below(Date.now())
}

export const apiKeySuite = () =>
	describe("ApiKeyAdapter", async () => {
		let key: ApiKey
		describe("insert", () => {
			it("should insert an api key", async () => {
				key = await ApiKeys.insert({
					label: "test",
					permissions: {
						bots: ApiAccessLevel.WRITE,
						lobbies: ApiAccessLevel.WRITE,
						apiKeys: ApiAccessLevel.WRITE
					}
				})

				testApiKeyProperties(key)
				expect(key.fragment).to.equal(key.value.substr(0, 5))
			})
		})
		describe("findByFragment", async () => {
			it("should find the created key", async () => {
				const queriedKey = await ApiKeys.findByFragment(key.value.substr(0, 5))
				expect(queriedKey).not.to.be.null
				testApiKeyProperties(queriedKey!)
			})
		})
		describe("findByPlainTextKey", async () => {
			it("should find the created key", async () => {
				const queriedKey = await ApiKeys.findByPlainTextKey(key.value)
				expect(queriedKey).not.to.be.null
				testApiKeyProperties(queriedKey!)
			})
			it("shouldn't find a key with an incorrect password", async () => {
				const [queriedKey, queriedKey2] = await Promise.all([
					ApiKeys.findByPlainTextKey(key.value.substr(0, 5)),
					ApiKeys.findByPlainTextKey("waddup")
				])
				expect(queriedKey).to.be.null
				expect(queriedKey2).to.be.null
			})
		})
		describe("update", async () => {
			it("should update a key", async () => {
				const updatedKey = await ApiKeys.update(key, {
					label: "newlabel"
				})
				expect(updatedKey.label).to.equal("newlabel")
				testApiKeyProperties(updatedKey)
				// Make sure that the change is on DB and not just on memory
				expect((await ApiKeys.findById(1))!.label).to.equal("newlabel")
			})
			it("should do nothing with an empty diff", async () => {
				await ApiKeys.update(key, {})
			})
		})
		describe("delete", async () => {
			it("should delete a key", async () => {
				await ApiKeys.delete(key)
				expect(await ApiKeys.findById(1)).to.be.null
			})
		})
	})
