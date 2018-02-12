import { Bot } from "@daas/model"
import { EntityAdapter } from "./EntityAdapter"
import { CreateBotData } from "./definitions/CreateBotData"
import { UpdateBotData } from "./definitions/UpdateBotData"
import { BotStatus } from "@daas/model/src/BotStatus"

export const BOT_COLUMS = [
	"username",
	"password",
	"disabled_until",
	"status",
	"sentry_file"
]

export class BotAdapter extends EntityAdapter<Bot> {
	protected readonly dbTable = "bots"
	protected readonly dbColumns = BOT_COLUMS
	protected readonly joins = []

	protected mapDbResultToClass(row: any): Bot {
		const bot = new Bot(
			row.id,
			row.username,
			row.password,
			row.sentryFile || null
		)

		if (row.status !== undefined) {
			bot.status = row.status
		}
		if (row.disabledUntil !== undefined) {
			bot.disabledUntil = row.disabledUntil
		}

		return bot
	}

	findAllByStatus(status: BotStatus): Promise<Array<Bot>> {
		return this.execQuery(db =>
			db
				.select(this.dbColumns.concat("id"))
				.from(this.dbTable)
				.where({ status })
		).then(it => it.map(this.mapDbResultToClass))
	}

	insert(data: CreateBotData): Promise<Bot> {
		return super.insert(data)
	}

	update(bot: Bot, data: UpdateBotData): Promise<Bot> {
		return super.update(bot, data)
	}
}
