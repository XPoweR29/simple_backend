import { Dish, DishGroup } from "../../types/adona_types";
import { DishEntity } from "../../entities/dish.entity";
import { serverLog } from "../../utils/serverLog";
import { ValidationError } from "../../middlewares/handleError";
import { HttpStatus } from "../../types/httpExeptions";
import { DishGroupEntity } from "../../entities/dishGroup.entity";

export class AdonaService {
	async getMenu() {
		return await DishGroupEntity.find({ relations: ["dishes"] });
	}

	//group service
	async getOneGroup(id: string): Promise<DishGroupEntity> {
		if (!id || id.trim().length !== 36) {
			throw new ValidationError("Nieprawidłowe ID");
		}

		const group = await DishGroupEntity.findOne({ where: { id } });
		if (!group) {
			throw new ValidationError("Grupa o podanym ID nie istnieje");
		}

		return group;
	}

	async addNewGroup(name: string): Promise<DishGroup> {
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

	async deleteGroup(id: string): Promise<{ message: string }> {
		try {
			const group = await DishGroupEntity.findOneOrFail({ where: { id } });
			await group.remove();
			return { message: `Grupa "${group.name}" została usunięta` };
		} catch (err) {
			throw new ValidationError(
				"Grupa o podanym ID nie istnieje",
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

	async addNewDish(DTO: Dish): Promise<Dish> {
		const group = await DishGroupEntity.findOne({ where: { id: DTO.id } });
		if (!group) throw new ValidationError("Grupa o podanym ID nie istnieje");
		const newDish = Object.assign(new DishEntity(), DTO);
		await newDish.save();
		serverLog(`Added new dish: ${newDish.name} into group ${newDish.group}`);
		return newDish;
	}

	async updateDish(id: string, data: Partial<Dish>): Promise<Dish> {
		const dish = await DishEntity.findOne({ where: { id } });
		if (!dish) throw new ValidationError("Danie o podanym ID nie istnieje");
		Object.assign(dish, data);
		dish.save();
		serverLog(`Dish ${dish.id} has been updated`);
		return dish;
	}

	async deleteDish(id: string): Promise<Dish> {
		const dish = await DishEntity.findOne({ where: { id } });
		if (!dish) throw new ValidationError("Danie o podanym ID nie istnieje");
		return await dish.remove();
	}
}
