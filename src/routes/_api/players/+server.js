import { connection } from "$lib/server/db.server";
import { playerService } from "$lib/server/services/player.service";
import { error, json } from "@sveltejs/kit";

/**
 * @type {import("./$types").RequestHandler}
 */
export const GET = async () => {
	await connection;
	const users = await playerService.getAll("soprasteria");

	return json(users);
};

// /**
//  * @type {import("./$types").RequestHandler}
//  */
// export const POST = async ({ request }) => {
// 	const { username, password, team } = await request.json();

// 	//check if user exists 
// 	const existingUser = await playerService.getByUsername(username);

// 	if (existingUser) {
// 		throw error(400, "Username already taken");
// 	}

// 	const existingTeam = await playerService.getByTeam(team);

// 	if (existingTeam && existingTeam.length > 0) {
// 		throw error(400, "Team already exists");
// 	}

// 	const user = await playerService.create(username, password, ["user"], [team]);

// 	return json(user);
// };
