import { Query } from "./Query"

export type ExecQueryFunction = (query: Query) => Promise<Array<any>>
