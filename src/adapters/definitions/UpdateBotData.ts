import { BotStatus } from "@daas/model/src/BotStatus"

export interface UpdateBotData {
	readonly username?: string
	readonly password?: string
	readonly sentryFile?: Buffer
	readonly status?: BotStatus
	readonly disabledUntil?: Date | null
}
