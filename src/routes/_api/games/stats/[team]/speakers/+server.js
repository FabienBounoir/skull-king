import { connection } from "$lib/server/db.server";
import { dailyService } from "$lib/server/services/game.service";
import { speakerService } from "$lib/server/services/player.service";
import { userService } from "$lib/server/services/user.service";
import { error, json } from "@sveltejs/kit";

/**
 * @type {import("../$types").RequestHandler}
 */
export const GET = async ({ request, params }) => {
	await connection;
	try {
		// @ts-ignore
		const token = request.headers.get("authorization").split(" ")[1];

		const team = params.team;

		if (!team) {
			throw error(404, { id: "request.invalid", message: "Invalid request" });
		}

		const user = await userService.getFromJWT(token);

		// @ts-ignore
		if (!user || !user.teams.includes(team)) {
			throw error(403, { id: "user.unauthorized", message: "Unauthorized" });
		}

		const dailies = await speakerService.getAll(team)


		const ordered = dailies.sort((a, b) => {
			return b.moyenTime - a.moyenTime;
		})

		return json(ordered);

	}
	catch (e) {
		return json({ error: e.message }, { status: 500 });
	}
};