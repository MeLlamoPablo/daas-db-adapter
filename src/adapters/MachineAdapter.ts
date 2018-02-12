import { Bot, Machine } from "@daas/model"
import { EntityAdapter } from "./EntityAdapter"
import { JoinedData } from "./interfaces/JoinedData"
import { JoinType } from "./enums/JoinType"
import { BOT_COLUMS } from "./BotAdapter"
import { CreateMachineData } from "./definitions/CreateMachineData"
import { UpdateMachineData } from "./definitions/UpdateMachineData"

export const MACHINE_COLUMNS = ["bot_id", "is_terminated", "started_at"]

export class MachineAdapter extends EntityAdapter<Machine> {
	protected readonly dbTable = "machines"
	protected readonly dbColumns = MACHINE_COLUMNS
	protected readonly joins = [
		{
			type: JoinType.LEFT,
			originTable: this.dbTable,
			originColumn: "bot_id",
			targetTable: "bots",
			targetColumn: "id",
			targetTableColumns: BOT_COLUMS
		}
	]

	protected mapDbResultToClass(
		row: any,
		joins?: Array<JoinedData>,
		originalBot?: Bot
	): Machine {
		const botsJoin = joins && joins.find(it => it.table === "bots")
		const bot = botsJoin && botsJoin.rows[0]

		return new Machine(
			row.id,
			row.startedAt,
			bot
				? new Bot(row.botId, bot.username, bot.password, bot.sentryFile || null)
				: (originalBot as Bot),
			row.isTerminated
		)
	}

	async findAll(limit?: number, offset: number = 0): Promise<Array<Machine>> {
		const result = await super.findAll(limit, offset)
		return await Promise.all(
			result.map(it => this.findById(it.id) as Promise<Machine>)
		)
	}

	async findAllIdle(): Promise<Array<Machine>> {
		const rows = await this.execQuery(db =>
			db
				.select("id")
				.from(this.dbTable)
				.whereNotIn(
					"id",
					db
						.select("machine_id")
						.from("lobbies")
						.whereNotNull("machine_id")
				)
				.andWhereNot({ is_terminated: null })
		)

		return await Promise.all(
			rows.map(row => this.findById(row.id) as Promise<Machine>)
		)
	}

	async insert(data: CreateMachineData): Promise<Machine> {
		const result = await super.insert({
			botId: data.bot.id,
			startedAt: new Date(),
			isTerminated: false
		})
		return (await this.findById(result.id))!
	}

	update(machine: Machine, data: UpdateMachineData): Promise<Machine> {
		return super.update(machine, data, machine.bot)
	}
}
