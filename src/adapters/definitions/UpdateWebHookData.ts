import { WebHookEventType } from "@daas/model"

export interface UpdateWebHookData {
	eventType?: WebHookEventType
	url?: string
	regenerateSecret?: boolean
}
