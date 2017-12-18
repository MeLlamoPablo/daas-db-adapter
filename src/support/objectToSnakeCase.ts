import { snakeCase } from "lodash"

export const objectToSnakeCase = (obj: any) =>
	Object.keys(obj).reduce(
		(newObj, key) => {
			newObj[snakeCase(key)] = obj[key]
			return newObj
		},
		{} as any
	)
