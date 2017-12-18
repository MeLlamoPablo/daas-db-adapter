import "mocha"

import { closeDb, getDb } from "../src/connect"
import { up as migrationsUp, down as migrationsDown } from "../src/migrations"
import { botSuite } from "./suites/adapters/Bot"
import { lobbySuite } from "./suites/adapters/Lobby"
import { playerSuite } from "./suites/adapters/Player"

before(() => {
	// Open the connection inside the test suite
	// So that crashes are controlled
	getDb()

	if (!process.env.DATABASE_URL!.includes("test")) {
		throw new Error(
			"The database name does not contain 'test'. The " +
				"test suite is refusing to run just so you don't accidentally " +
				"run this in the production database. " +
				"Make sure to include 'test' in the name of your test database."
		)
	}
})

describe("Migrations Up", () => {
	it("should run correctly", () => migrationsUp())
})

describe("Database Adapters", () => {
	botSuite()
	lobbySuite()
	playerSuite()
})

describe("Migrations Down", () => {
	it("should run correctly", () => migrationsDown())
})

after(() => closeDb())
