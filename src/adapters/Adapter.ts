import { Entity } from "@daas/model"
import { getDb } from "../connect"
import { objectToSnakeCase } from "../support/objectToSnakeCase"
import { objectToCamelCase } from "../support/objectToCamelCase"

export abstract class Adapter<T extends Entity> {
	protected abstract readonly dbTable: string
	protected abstract readonly dbColumns: Array<string>

	private get allColumns() {
		return this.dbColumns.concat("id")
	}

	protected abstract mapDbResultToClass(row: any): T

	async findById(id: number): Promise<T | null> {
		const rows = await getDb()
			.select(this.allColumns)
			.from(this.dbTable)
			.where({ id })

		if (rows.length === 0) {
			return null
		} else {
			return this.mapDbResultToClass(objectToCamelCase(rows[0]))
		}
	}

	async findAll(limit?: number, offset: number = 0): Promise<Array<T>> {
		let query = getDb()
			.select(this.allColumns)
			.from(this.dbTable)

		if (typeof limit !== "undefined") {
			query = query.limit(limit)
		}

		query = query.offset(offset)

		const results = (await query) as Array<any>
		return results.map(objectToCamelCase).map(this.mapDbResultToClass)
	}

	async insert(data: any): Promise<T> {
		const [id] = await getDb()
			.insert(objectToSnakeCase(data))
			.into(this.dbTable)
			.returning("id")

		data.id = id

		return this.mapDbResultToClass(objectToCamelCase(data))
	}

	async update(entity: T, difference: any): Promise<T> {
		const [updatedData] = await getDb()
			.table(this.dbTable)
			.update(objectToSnakeCase(difference))
			.where({ id: entity.id })
			.returning(this.allColumns)

		return this.mapDbResultToClass(objectToSnakeCase(updatedData))
	}

	async delete(entity: T): Promise<void> {
		await getDb()
			.delete()
			.from(this.dbTable)
			.where({ id: entity.id })
	}
}
