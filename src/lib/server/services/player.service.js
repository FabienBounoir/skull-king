import { error } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import { db } from "../db.server";

class PlayerService {
	#collection;

	/**
	 * @param {import("mongodb").Collection<import("mongodb").Document & {
	 *  name: string;
	 *  team: string;
	 *  win: number;
	 *  maxScore: number;
	 *  lowerScore: number;
	 *  history: Array<{date: Date, time: number, dailyId: string}>
	 * }>} collection
	 */
	constructor(collection) {
		this.#collection = collection;
	}

	/**
	 * @param {string} team
	 */
	async getAll(team) {
		let users = await this.#collection.aggregate([
			{
				$match: { team, date: { $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000) } }
			},
			{
				$addFields: {
					totalGame: { $size: "$history" }
				}
			},
			{
				$sort: { win: -1, totalGame: 1 }
			},
			{
				$project: {
					history: 0
				}
			}
		]).toArray();

		return users.length > 0 ? users : [];
	}

	/**
	 * 
	 * @param {String} _id 
	 * @returns 
	 */
	get(_id) {
		return this.#collection.findOne({ _id: new ObjectId(_id) });
	}

	/**
	 * 
	 * @param {String} team 
	 * @param {String} name 
	 * @returns 
	 */
	getByName(team, name) {
		// Format the name to match the stored format
		const formattedName = this.formatName(name);
		return this.#collection.findOne({ team, name: formattedName });
	}

	/**
	 * Get player with full history for profile page
	 * @param {String} team 
	 * @param {String} name 
	 * @returns 
	 */
	async getByNameWithHistory(team, name) {
		const formattedName = this.formatName(name);
		const player = await this.#collection.findOne({ team, name: formattedName });
		
		if (player && player.history) {
			// Add total games count
			player.totalGame = player.history.length;
		}
		
		return player;
	}

	/**
	 * @param {string} name
	 * @param {string} team
	 */
	async create(name, team) {
		return await this.#collection.insertOne({
			name,
			team,
			win: 0,
			history: [],
			maxScore: null,
			lowerScore: null,
			date: new Date()
		});
	}

	formatName(name) {
		return name.charAt(0).toUpperCase() + name.slice(1).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
	}

	async addUserScore(name, score, winner, team = "default", gameId) {
		name = this.formatName(name);

		let playerInfo = await this.#collection.findOne({ name, team });

		if (!playerInfo) {
			await this.create(name, team);
			playerInfo = await this.#collection.findOne({ name, team })
		}

		if (!playerInfo) {
			return console.error("Error creating user");
		}

		const history = [...playerInfo.history, { score, winner, date: new Date(), gameId: gameId.toString() }];
		if (winner) {
			playerInfo.win++;
		}

		if (!playerInfo.maxScore) {
			playerInfo.maxScore = score;
		}

		if (!playerInfo.lowerScore) {
			playerInfo.lowerScore = score;
		}


		if (score > playerInfo.maxScore) {
			playerInfo.maxScore = score;
		}

		if (score < playerInfo.lowerScore) {
			playerInfo.lowerScore = score;
		}

		await this.#collection.updateOne({ name, team }, {
			$set: {
				history,
				win: playerInfo.win,
				maxScore: playerInfo.maxScore,
				lowerScore: playerInfo.lowerScore,
				date: new Date()
			}
		});
	}

	async updateUserScore(name, score, winner, team = "default", gameId) {
		let playerInfo = await this.#collection.findOne({ name, team });

		if (!playerInfo) {
			return console.error("Error user not found");
		}

		//find gameId and update
		for (let i = 0; i < playerInfo.history.length; i++) {
			if (playerInfo.history[i].gameId == gameId) {
				playerInfo.history[i].score = score;
				playerInfo.history[i].winner = winner;
				playerInfo.history[i].date = new Date();
			}
		}

		//update max and lower score
		playerInfo.maxScore = null
		playerInfo.lowerScore = null

		for (let i = 0; i < playerInfo.history.length; i++) {
			if (!playerInfo.maxScore) {
				playerInfo.maxScore = playerInfo.history[i].score;
			}

			if (!playerInfo.lowerScore) {
				playerInfo.lowerScore = playerInfo.history[i].score;
			}

			if (playerInfo.history[i].score > playerInfo.maxScore) {
				playerInfo.maxScore = playerInfo.history[i].score;
			}

			if (playerInfo.history[i].score < playerInfo.lowerScore) {
				playerInfo.lowerScore = playerInfo.history[i].score;
			}
		}

		//update win
		playerInfo.win = 0
		for (let i = 0; i < playerInfo.history.length; i++) {
			if (playerInfo.history[i].winner) {
				playerInfo.win++;
			}
		}


		await this.#collection.updateOne({ name, team }, {
			$set: {
				history: playerInfo.history,
				win: playerInfo.win,
				maxScore: playerInfo.maxScore,
				lowerScore: playerInfo.lowerScore,
				date: new Date()
			}
		});
	}
}

export const playerService = new PlayerService(db.collection("players"));
