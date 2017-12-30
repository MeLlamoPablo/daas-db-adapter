import "mocha"
import { expect } from "chai"

import { Config } from "../../.."

export const configSuite = () =>
	describe("getConfigAdapter", async () => {
		it("should select the config successfully", async () => {
			const config = await Config.get()
			expect(config).to.be.an("object")
			expect(config.leagueId).to.be.null
		})
		it("should update the config successfully", async () => {
			await Config.update({ leagueId: 1234 })
			const config = await Config.get()
			expect(config).to.be.an("object")
			expect(config.leagueId).to.equal(1234)
		})
		it("should not do anything if the update diff is empty", async () => {
			await Config.update({})
		})
	})
