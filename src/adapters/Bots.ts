import { Bot } from "@daas/model"
import { Adapter } from "./Adapter"
import { CreateBotData } from "./definitions/CreateBotData"

export class BotsAdapter extends Adapter<Bot> {
	protected readonly dbTable: string = "bots"
	protected readonly dbColumns: Array<string> = [
		"username",
		"password",
		"steam_guard_enabled",
		"disabled_until",
		"sentry_file"
	]

	protected mapDbResultToClass(row: any): Bot {
		const bot = new Bot(
			row.id,
			row.username,
			row.password,
			row.steam_guard_enabled
		)

		if (row.bot_status !== undefined) {
			bot.status = row.botStatus
		}
		if (row.disabled_until !== undefined) {
			bot.disabledUntil = row.disabled_until
		}
		if (row.sentry_file !== undefined) {
			bot.sentryFile = row.sentry_file
		}

		return bot
	}

	insert(data: CreateBotData): Promise<Bot> {
		return super.insert({
			username: data.username,
			password: data.password,
			steam_guard_enabled: data.steamGuardEnabled
		})
	}
}
