import { getPg } from "../connect"

export type OnNotification = (notification: object) => void
export type UnsubscribeFunction = () => Promise<void>

export class PubSubAdapter {
	public async notify(channel: string, payload: object) {
		const pg = await getPg()
		await pg.query(`NOTIFY "${channel}", '${JSON.stringify(payload)}';`)
		await pg.end()
	}

	public async listen(
		channel: string,
		onNotification: OnNotification
	): Promise<UnsubscribeFunction> {
		const pg = await getPg()
		const unsubscribe = async () => await pg.end()

		pg.on("notification", (msg: any) => onNotification(JSON.parse(msg.payload)))
		await pg.query(`LISTEN "${channel}";`)

		return unsubscribe
	}
}
