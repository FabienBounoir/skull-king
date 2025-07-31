import { connection } from "$lib/server/db.server";
import { gameService } from "$lib/server/services/game.service";
import { playerService } from "$lib/server/services/player.service";
import { error, json } from "@sveltejs/kit";

/**
 * @type {import("./$types").RequestHandler}
 */
export const GET = async ({ params, url }) => {
	try {
		const team = url.searchParams.get('team') || 'default';
		const game = await gameService.get(params._id);
		
		if (!game) {
			throw error(404, "Game not found");
		}

		// Verify the game belongs to the correct team
		if (game.team !== team) {
			throw error(404, "Game not found for this team");
		}

		return json(game);
	} catch (e) {
		console.error('Error fetching game:', e);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

/**
 * @type {import("./$types").RequestHandler}
 */
export const PUT = async ({ request, params }) => {
	try {
		const { score, team } = await request.json();

		if (!team || !score) {
			throw error(404, "Invalid request");
		}

		const game = await gameService.update(params._id, score);

		if (score && score.length > 0) {
			let promises = [];
			for (let i = 0; i < score.length; i++) {
				promises.push(playerService.updateUserScore(score[i][0], score[i][1], i == 0, team || 'default', params._id));
			}

			await Promise.all(promises);
		}

		return json(game);
	}
	catch (e) {
		console.error('Error updating game:', e);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
