import { WebHookEventType } from "@daas/model"

export interface CreateWebHookData {
	readonly eventType: WebHookEventType
	readonly url: string
}
