import { ApiPermissions } from "@daas/model"

export interface UpdateApiKeyData {
	label?: string
	permissions?: ApiPermissions
	lastUsed?: Date
}
