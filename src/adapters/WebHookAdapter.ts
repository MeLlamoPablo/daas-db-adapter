import { WebHook } from "@daas/model"
import { EntityAdapter } from "./EntityAdapter"
import { CreateWebHookData } from "./definitions/CreateWebHookData"
import { generatePassword } from "../support/generatePassword"
import { UpdateWebHookData } from "./definitions/UpdateWebHookData"

export const WEBHOOK_COLUMNS = ["event_type", "url", "secret"]

export class WebHookAdapter extends EntityAdapter<WebHook> {
	protected readonly dbTable = "webhooks"
	protected readonly dbColumns = WEBHOOK_COLUMNS
	protected readonly joins = []

	protected mapDbResultToClass(row: any): WebHook {
		return new WebHook(row.id, row.eventType, row.url, row.secret)
	}

	insert(data: CreateWebHookData): Promise<WebHook> {
		return super.insert({
			...data,
			secret: generatePassword(40)
		})
	}

	update(webhook: WebHook, data: UpdateWebHookData): Promise<WebHook> {
		const diff: any = {}

		if (data.eventType) {
			diff.eventType = data.eventType
		}

		if (data.url) {
			diff.url = data.url
		}

		if (data.regenerateSecret) {
			diff.secret = generatePassword(40)
		}

		return super.update(webhook, diff)
	}
}
