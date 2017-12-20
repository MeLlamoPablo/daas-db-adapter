import { randomBytes } from "crypto"

export const generateApiKey = () => randomBytes(40).toString("base64")
