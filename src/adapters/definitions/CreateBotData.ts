export interface CreateBotData {
	readonly username: string
	readonly password: string
	readonly steamGuardEnabled: boolean
	readonly sentryFile?: Buffer
}
