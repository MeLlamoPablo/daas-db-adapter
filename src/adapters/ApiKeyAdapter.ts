import { ApiKey } from "@daas/model"
import { compare , hash } from "bcrypt"
import { generateApiKey } from "../support/generateApiKey"
import { Adapter } from "./Adapter"
import { CreateApiKeyData } from "./definitions/CreateApiKeyData"
import { JoinedData } from "./interfaces/JoinedData"
import { UpdateApiKeyData } from "./definitions/UpdateApiKeyData"

export const API_KEY_COLUMNS = [
	"label",
	"value",
	"fragment",
	"permissions",
	"last_used"
]

export class ApiKeyAdapter extends Adapter<ApiKey> {
	protected readonly dbTable = "api_keys"
	protected readonly dbColumns = API_KEY_COLUMNS
	protected readonly joins = []

	protected mapDbResultToClass(
		row: any,
		joins?: Array<JoinedData>,
		plainTextKey?: string
	): ApiKey {
		return new ApiKey(
			row.id,
			row.label,
			plainTextKey || row.value,
			row.fragment,
			row.permissions,
			row.lastUsed
		)
	}

	async findByPlainTextKey(plainText: string): Promise<ApiKey | null> {
		const fragment = plainText.substr(0, 5)
		const key = await super.findByCondition({ fragment })

		if (key && await this.verifyMatches(key, plainText)) {
			return key
		} else {
			return null
		}
	}

	async insert(data: CreateApiKeyData): Promise<ApiKey> {
		const plainTextKey = generateApiKey()
		return await super.insert(
			{
				...data,
				value: await hash(plainTextKey, 10),
				fragment: plainTextKey.substr(0, 5),
				lastUsed: new Date()
			},
			plainTextKey
		)
	}

	update(key: ApiKey, data: UpdateApiKeyData): Promise<ApiKey> {
		return super.update(key, data)
	}

	/**
	 * Verifies that an api key queried from the database matches its
	 * plain text version. When a key is queried, its "value" parameter
	 * is set to the hash, as returned from the database. However, when
	 * a key is inserted, its "value" parameter is set to the generated
	 * plain text password. This is the only time that the ApiKey object
	 * contains the plain text password
	 *
	 * @param key The ApiKey object returned from the database
	 * @param keyToCompare The plain text key sent by the client
	 * @returns True if they match, false otherwise
	 */
	private async verifyMatches(key: ApiKey, keyToCompare: string): Promise<boolean> {
		return await compare(keyToCompare, key.value)
	}
}
