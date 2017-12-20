import { randomBytes } from "crypto"

export const generatePassword = () => randomBytes(10).toString("hex")
