import { json } from '@sveltejs/kit';
import { playerService } from '$lib/server/services/player.service.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
	const { name } = params;
	const team = url.searchParams.get('team') || 'default';

	try {
		const player = await playerService.getByNameWithHistory(team, name);
		
		if (!player) {
			return json({ error: 'Player not found' }, { status: 404 });
		}

		return json(player);
	} catch (error) {
		console.error('Error fetching player:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
