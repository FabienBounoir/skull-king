import { connection } from "$lib/server/db.server";
import { gameService } from "$lib/server/services/game.service";
import { playerService } from "$lib/server/services/player.service";
import { error, json } from "@sveltejs/kit";

/**
 * @type {import("./$types").RequestHandler}
 */
export const GET = async ({ request }) => {
	await connection;
	try {
		const games = await gameService.getAll("soprasteria");

		return json(games.reverse());
	}
	catch (e) {
		return json({ error: e.message }, { status: 500 });
	}
};

/**
 * @type {import("./$types").RequestHandler}
 */
export const POST = async ({ request }) => {
	try {
		const { score, team } = await request.json();

		if (!team || !score) {
			throw error(404, { id: "request.invalid", message: "Invalid request" });
		}

		console.log(score, team);

		const game = await gameService.create(score, team);

		if (score && score.length > 0) {
			let promises = [];
			for (let i = 0; i < score.length; i++) {
				promises.push(playerService.addUserScore(score[i][0], score[i][1], i == 0, "soprasteria"));
			}

			await Promise.all(promises);
		}

		return json(game);
	}
	catch (e) {
		return json({ error: e.message }, { status: 500 });
	}
};
