import { ApiPermissions } from "@daas/model"

export interface CreateApiKeyData {
	label: string
	permissions: ApiPermissions
}
