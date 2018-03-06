import "mocha"
import { expect } from "chai"

import { ApiKeys, getApiKeysAdapter, Lobbies, getLobbiesAdapter } from "../.."
import { ApiAccessLevel } from "@daas/model/src/ApiAccessLevel"

export const transactionSuite = () =>
	describe("TransactionSuite", async () => {
		it("should delete all lobbies and persist the result", async () => {
			const LobbiesTransaction = await getLobbiesAdapter(true)

			const lobbies = await LobbiesTransaction.findAll()
			await Promise.all(lobbies.map(it => LobbiesTransaction.delete(it)))

			await LobbiesTransaction.commit()

			expect(await Lobbies.findAll()).to.have.length(0)
		})
		it("should insert an api key and rollback the result", async () => {
			const ApiKeysTransaction = await getApiKeysAdapter(true)

			const originalNumOfKeys = (await ApiKeys.findAll()).length
			await ApiKeysTransaction.insert({
				label: "Testing",
				permissions: {
					bots: ApiAccessLevel.WRITE,
					apiKeys: ApiAccessLevel.WRITE,
					lobbies: ApiAccessLevel.WRITE,
					webhooks: ApiAccessLevel.WRITE
				}
			})

			await ApiKeysTransaction.rollback()

			expect(await ApiKeys.findAll()).to.have.length(originalNumOfKeys)
		})
	})
