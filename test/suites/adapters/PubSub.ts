import "mocha"
import { expect } from "chai"

import { PubSub as getPubSubAdapter } from "../../.."
import { PubSubAdapter } from "../../../src/adapters/PubSubAdapter"

export const pubSubSuite = () =>
	describe("PubSub", async () => {
		let PubSub: PubSubAdapter,
			unsubscribe: () => Promise<void>,
			lastMessage: any
		before(async () => {
			PubSub = await getPubSubAdapter()
		})
		it("should notify successfully", async () => {
			unsubscribe = await PubSub.listen("test", msg => {
				lastMessage = msg
			})

			await PubSub.notify("test", { hello: "world" })
			await PubSub.notify("wrong_channel", { wrong: "msg" })

			expect(lastMessage).to.deep.equal({ hello: "world" })
		})
		it("should unsubscribe successfully", async () => {
			await unsubscribe()

			await PubSub.notify("test", { msg: "after unsubscribe" })
			expect(lastMessage).to.deep.equal({ hello: "world" })
		})
	})
