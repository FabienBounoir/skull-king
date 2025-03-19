import { connection } from "$lib/server/db.server";
import { playerService } from "$lib/server/services/player.service";
import { error, json } from "@sveltejs/kit";

/**
 * @type {import("./$types").RequestHandler}
 */
export const GET = async ({ request }) => {
	await connection;

	try {
		const url = new URL(request?.url);

		const users = await playerService.getAll(url?.searchParams?.get?.("team") || "default");

		return json(users);
	}
	catch (e) {
		return json({ error: e.message }, { status: 500 });
	}
};