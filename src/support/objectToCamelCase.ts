import { camelCase } from "lodash"

export const objectToCamelCase = (obj: any) =>
	Object.keys(obj).reduce(
		(newObj, key) => {
			newObj[camelCase(key)] = obj[key]
			return newObj
		},
		{} as any
	)
