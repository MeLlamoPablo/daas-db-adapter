import { Bot } from "@daas/model"
import { Adapter } from "./Adapter"
import { CreateBotData } from "./definitions/CreateBotData"
import { UpdateBotData } from "./definitions/UpdateBotData"

export const BOT_COLUMS = [
	"username",
	"password",
	"steam_guard_enabled",
	"disabled_until",
	"sentry_file"
]

export class BotAdapter extends Adapter<Bot> {
	protected readonly dbTable = "bots"
	protected readonly dbColumns = BOT_COLUMS
	protected readonly joins = []

	protected mapDbResultToClass(row: any): Bot {
		const bot = new Bot(
			row.id,
			row.username,
			row.password,
			row.steamGuardEnabled
		)

		if (row.botStatus !== undefined) {
			bot.status = row.botStatus
		}
		if (row.disabledUntil !== undefined) {
			bot.disabledUntil = row.disabledUntil
		}
		if (row.sentryFile !== undefined) {
			bot.sentryFile = row.sentryFile
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
