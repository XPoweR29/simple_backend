import { Dish, DishGroup } from "../types/adona_types";
import { DishEntity } from "../entities/dish.entity";
import { serverLog } from "../utils/serverLog";
import { ValidationError } from "../middlewares/handleError";
import { HttpStatus } from "../types/httpExeptions";
import { DishGroupEntity } from "../entities/dishGroup.entity";
import { Like } from "typeorm";
import { CreateDishDTO } from "../DTO/adona.tdo";

export class AdonaService {
	async getMenu() {
		const menu = await DishGroupEntity.find({ relations: ["dishes"] });
		if (!menu) throw new ValidationError("Nie znaleziono MENU");
		return menu;
	}

	//group service
	async getOneGroup(id: string): Promise<DishGroupEntity> {
		if (!id || id.trim().length !== 36) {
			throw new ValidationError("Nieprawidłowe ID");
		}

		const group = await DishGroupEntity.findOne({ where: { id }, relations: ["dishes"]});
		if (!group) {
			throw new ValidationError("Grupa o podanym ID nie istnieje");
		}

		return group;
	}

	async getGroupByName(name: string): Promise<DishGroupEntity[]> {
		const searchingGroups = await DishGroupEntity.find({
			where: { name: Like(`%${name}%`) },
			relations: ["dishes"],
		});
		if (!searchingGroups || searchingGroups.length === 0) return [];
		return searchingGroups;
	}

	async addNewGroup(name: string): Promise<DishGroupEntity> {
		if (!name || name.trim().length === 0) {
			throw new ValidationError("Nazwa grupy nie może być pusta");
		}

		const exisingGroup = await DishGroupEntity.findOne({ where: { name } });
		if (exisingGroup) {
			throw new ValidationError("Grupa o podanej nazwie już istnieje");
		}

		const newGroup = DishGroupEntity.create({ name });
		await DishGroupEntity.save(newGroup);
		serverLog(`New group of dishes created: "${newGroup.name}"`);
		return newGroup;
	}

	async updateGroup(
		id: string,
		data: Partial<DishGroupEntity>
	): Promise<DishGroupEntity> {
		const group = await DishGroupEntity.findOne({ where: { id } });
		if (!group)
			throw new ValidationError(`Nie znaleziono elementu o ID: ${id}`);
		Object.assign(group, data);
		serverLog(`Group ${group.id} has been updated`);
		return await group.save();
	}

	async deleteGroup(id: string): Promise<DishGroup> {
		try {
			const group = await DishGroupEntity.findOneOrFail({ where: { id } });
			await group.remove();
			return group;
		} catch (err) {
			throw new ValidationError(
				err,
				HttpStatus.NOT_FOUND
			);
		}
	}

	//dishes service
	async getOneDish(id: string): Promise<Dish> {
		const dish = await DishEntity.findOne({ where: { id } });
		if (!dish) throw new ValidationError("Danie o podanym ID nie stnieje");
		return dish;
	}

	async getDishByName(name: string): Promise<DishEntity[]> {
		const dishes = await DishEntity.find({where: { name: Like(`%${name}%`)}});
		if (!dishes || dishes.length === 0) return [];
		return dishes;
	}

	async addNewDish(DTO: CreateDishDTO): Promise<Dish> {
		if(!DTO.groupId) throw new ValidationError("Musisz podać grupę do której chcesz dodać nową pozycję");

		const group = await DishGroupEntity.findOne({ where: { id: DTO.groupId } });
		if (!group) throw new ValidationError("Grupa posiłków o podanej nazwie nie istnieje");

		const {groupId, ...rest} = DTO; //..rest is DTO without grouId field

		const newDish = DishEntity.create({...rest, group});
		await newDish.save();
		serverLog(`Added new dish: ${newDish.name} into group ${group.name}`);
		return newDish;
	}

	async updateDish(id: string, data: Partial<Dish>): Promise<Dish> {
		const dish = await DishEntity.findOne({ where: { id } });
		if (!dish) throw new ValidationError("Danie o podanym ID nie istnieje");
		Object.assign(dish, data);
		dish.save();
		serverLog(`Dish ${dish.name} has been updated`);
		return dish;
	}

	async deleteDish(id: string): Promise<Dish> {
		const dish = await DishEntity.findOne({ where: { id } });
		if (!dish) throw new ValidationError("Danie o podanym ID nie istnieje");
		return await dish.remove();
	}
}
