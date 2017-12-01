import "mocha"

import { Bot, BotStatus } from "@daas/model"
import { closeDb, getDb } from "../src/connect"
import { up as migrationsUp, down as migrationsDown } from "../src/migrations"
import { botSuite } from "./suites/adapters/Bot"

before(() => {
	// Open the connection inside the test suite
	// So that crashes are controlled
	getDb()
})

describe("Migrations Up", () => {
	it("should run correctly", () => migrationsUp())
})

describe("Database Adapters", () => {
	botSuite()
})

describe("Migrations Down", () => {
	it("should run correctly", () => migrationsDown())
})

after(() => closeDb())
