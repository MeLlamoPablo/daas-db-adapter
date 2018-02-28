import { randomBytes } from "crypto"

export const generatePassword = (length: number = 20) =>
	randomBytes(Math.floor(length / 2)).toString("hex")
