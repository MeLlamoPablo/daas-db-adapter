import { CreateTableBuilder, ColumnBuilder } from "knex"

export const id = (table: CreateTableBuilder) =>
	table.increments("id").primary() as ColumnBuilder
