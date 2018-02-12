import "mocha"
import { expect } from "chai"

import { Machine } from "@daas/model"
import { Bots, Machines, Lobbies } from "../../.."
import { testBotProperties } from "./Bot"

export function testMachineProperties(machine: Machine) {
	expect(machine).to.be.an.instanceOf(Machine)
	expect(machine.id).to.be.at.least(1)
	expect(machine.isTerminated).to.be.a("boolean")
	testBotProperties(machine.bot)
}

export const machineSuite = () => {
	describe("machineAdapter", () => {
		describe("insert", () => {
			it("should insert a machine", async () => {
				const bot = (await Bots.findAll())[0]
				expect(bot).not.to.be.undefined
				const machine = await Machines.insert({ bot })
				testMachineProperties(machine)
			})
		})
		describe("findAll", () => {
			it("should return all machines", async () => {
				await Machines.insert({
					bot: await Bots.insert({
						username: "machinetest",
						password: "machinetest",
						sentryFile: null
					})
				})

				await Machines.insert({
					bot: await Bots.insert({
						username: "machinetest2",
						password: "machinetest2",
						sentryFile: null
					})
				})

				const machines = await Machines.findAll()

				expect(machines)
					.to.be.an("array")
					.that.has.length(4)
				machines.forEach(testMachineProperties)
			})
			it("should support limits and offsets", async () => {
				const machines = await Machines.findAll(1, 2)

				expect(machines)
					.to.be.an("array")
					.that.has.length(1)
				testMachineProperties(machines[0])
				expect(machines[0].bot.username).to.equal("machinetest")
			})
		})
		describe("findAllIdle", () => {
			it("should find a all idle machines", async () => {
				const [lobby, machine] = await Promise.all([
					Lobbies.findById(2),
					Machines.findById(3)
				])

				expect(lobby).not.to.be.null
				expect(lobby!.name).to.equal("Test lobby 2")
				expect(machine).not.to.be.null
				expect(machine!.bot.username).to.equal("machinetest")

				await Lobbies.update(lobby!, { machine })

				const machines = await Machines.findAllIdle()

				expect(machines).to.have.length(2)
				machines.forEach(testMachineProperties)
				expect(machines[0].bot.username).to.equal("hello3")
				expect(machines[1].bot.username).to.equal("machinetest2")
			})
		})
		describe("findById", () => {
			it("should find a specific machine", async () => {
				const machine = (await Machines.findById(3))!
				expect(machine).not.to.be.null
				testMachineProperties(machine)
				expect(machine.bot.username).to.equal("machinetest")
			})
			it("should return null on non existing machines", async () => {
				expect(await Machines.findById(100)).to.be.null
			})
		})
		describe("update", () => {
			it("should update a machine", async () => {
				const machine = (await Machines.findById(1))!
				expect(machine).not.to.be.null
				const updatedMachine = await Machines.update(machine, {
					isTerminated: true
				})
				testMachineProperties(updatedMachine)
				expect((await Machines.findById(1))!.isTerminated).to.be.true
			})
		})
		describe("delete", () => {
			it("should delete a machine", async () => {
				const machine = (await Machines.findById(2))!
				expect(machine).not.to.be.null
				await Machines.delete(machine)
				expect(await Machines.findById(2)).to.be.null
			})
		})
	})
}
