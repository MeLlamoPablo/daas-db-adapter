import "mocha"
import { expect } from "chai"

import { ApiKeys, Lobbies } from "../.."
import { ApiAccessLevel } from "@daas/model/src/ApiAccessLevel"

export const transactionSuite = () =>
	describe("TransactionSuite", async () => {
		it("should delete all lobbies and persist the result", async () => {
			const Adapter = await Lobbies(true)

			const lobbies = await Adapter.findAll()
			await Promise.all(lobbies.map(it => Adapter.delete(it)))

			await Adapter.commit()

			expect(await (await Lobbies()).findAll()).to.have.length(0)
		})
		it("should insert an api key and rollback the result", async () => {
			const all = async () => (await ApiKeys()).findAll()

			const Adapter = await ApiKeys(true)

			const originalNumOfKeys = (await all()).length
			await Adapter.insert({
				label: "Testing",
				permissions: {
					bots: ApiAccessLevel.WRITE,
					apiKeys: ApiAccessLevel.WRITE,
					lobbies: ApiAccessLevel.WRITE
				}
			})

			await Adapter.rollback()

			expect(await all()).to.have.length(originalNumOfKeys)
		})
	})
