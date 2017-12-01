import { Entity } from "@daas/model"
import { getDb } from "../connect"

export abstract class Adapter<T extends Entity> {
	protected abstract readonly dbTable: string
	protected abstract readonly dbColumns: Array<string>

	private get allColumns() {
		return this.dbColumns.concat("id")
	}

	protected abstract mapDbResultToClass(row: any): T

	async findAll(limit?: number, offset: number = 0) {
		let query = getDb()
			.select(this.allColumns)
			.from(this.dbTable)

		if (typeof limit !== "undefined") {
			query = query.limit(limit)
		}

		query = query.offset(offset)

		const results = (await query) as Array<any>
		return results.map(this.mapDbResultToClass)
	}

	async insert(data: any): Promise<T> {
		const [id] = await getDb()
			.insert(data)
			.into(this.dbTable)
			.returning("id")

		data.id = id

		return this.mapDbResultToClass(data)
	}
}
