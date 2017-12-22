import { Bot } from "@daas/model"
import { EntityAdapter } from "./EntityAdapter"
import { CreateBotData } from "./definitions/CreateBotData"
import { UpdateBotData } from "./definitions/UpdateBotData"

export const BOT_COLUMS = [
	"username",
	"password",
	"disabled_until",
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

		if (row.botStatus !== undefined) {
			bot.status = row.botStatus
		}
		if (row.disabledUntil !== undefined) {
			bot.disabledUntil = row.disabledUntil
		}

		return bot
	}

	insert(data: CreateBotData): Promise<Bot> {
		return super.insert(data)
	}

	update(bot: Bot, data: UpdateBotData): Promise<Bot> {
		return super.update(bot, data)
	}
}
