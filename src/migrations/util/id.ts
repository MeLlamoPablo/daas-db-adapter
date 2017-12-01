import { CreateTableBuilder } from "knex"

export const id = (table: CreateTableBuilder) =>
	table.increments("id").primary()
