import { ObjectId } from "mongodb";
import { db } from "../db.server";

class GameService {
	#collection;

	/**
	 * @param {import("mongodb").Collection<import("mongodb").Document & {
	 *  users: string[];
	 *  totalTime: number;
	 *  totalPoints: number;
	 *  team: string;
	 *  date: Date;
	 *  winner: string;
	 *  date: Date;
	 * }>} collection
	 */
	constructor(collection) {
		this.#collection = collection;
	}

	/**
	 * @param {string} team
	 */
	getAll(team) {
		return this.#collection.find({
			team
		}).toArray();
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
	 * @param {string[]} score
	 * @param {string} team
	 */
	async create(score, team) {
		return await this.#collection.insertOne({
			score,
			team,
			winner: score[0][0],
			date: new Date()
		});
	}

	async update(_id, score) {
		return await this.#collection.updateOne({ _id: new ObjectId(_id) }, { $set: { score, winner: score[0][0] } });
	}

	/**
	 * @param {string} _id
	 */
	async delete(_id) {
		return await this.#collection.deleteOne({ _id: new ObjectId(_id) });
	}
}

export const gameService = new GameService(db.collection("game"));
