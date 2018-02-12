import { getDb } from "../connect"

export const migrateTriggers = async () =>
	await getDb().raw(
		`
	CREATE FUNCTION lobby_created_trigger() RETURNS trigger AS $$
	BEGIN
	  NOTIFY database_changes, '{"table": "lobbies"}';
	  RETURN NULL;
	END;
	$$ LANGUAGE plpgsql;
	
	CREATE TRIGGER lobby_created_trigger
	  AFTER UPDATE
	  ON lobbies
	  FOR EACH STATEMENT
	  EXECUTE PROCEDURE lobby_created_trigger();
	`
	)
