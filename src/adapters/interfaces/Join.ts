import { JoinType } from "../enums/JoinType"

export interface Join {
	type: JoinType
	originTable: string
	originColumn: string
	targetTable: string
	targetColumn: string
	targetTableColumns: Array<string>
}
