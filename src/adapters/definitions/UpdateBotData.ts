import { BotStatus } from "@daas/model/src/BotStatus"

export interface UpdateBotData {
	readonly username?: string
	readonly password?: string
	readonly steamGuardEnabled?: boolean
	readonly sentryFile?: Buffer
	readonly status?: BotStatus
}
