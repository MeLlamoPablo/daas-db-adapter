import { EntityAdapter } from "../adapters/EntityAdapter"
import { getDb } from "../connect"
import { Db } from "../adapters/types/db"
import { Entity } from "@daas/model/src/Entity"

export function getAdapter<E extends Entity, A extends EntityAdapter<E>>(
	Adapter: new (db: Db) => A,
	transaction: boolean = false
) {
	return new Promise<A>(resolve => {
		if (transaction) {
			getDb()
				.transaction(trx => {
					resolve(new Adapter(trx))
				})
				/*
				 * If a transaction is rolled back, an error is thrown to
				 * here, even if the transaction is rolled back explicitly.
				 * If we don't catch it, it results in an unhandled rejection.
				 */
				.catch(() => {})
		} else {
			resolve(new Adapter(getDb()))
		}
	})
}
