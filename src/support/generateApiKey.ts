import { randomBytes } from "crypto"

export const generateApiKey = () => randomBytes(25).toString("hex")
