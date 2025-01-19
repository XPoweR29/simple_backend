import { Dish, DishGroup } from "../types/adona_types";
import { DishEntity } from "../entities/dish.entity";
import { serverLog } from "../utils/serverLog";
import { ValidationError } from "../middlewares/handleError";
import { HttpStatus } from "../types/httpExeptions";
import { DishGroupEntity } from "../entities/dishGroup.entity";
import { Like } from "typeorm";
import { CreateDishDTO, UpdateGroupOrderDTO } from "../DTO/adona.tdo";

export class AdonaService {
	private async getMaxOrderGroupIndex(): Promise<number> {
		const topGroup = await DishGroupEntity.createQueryBuilder('group')
			.select('MAX(group.order)', 'orderIndex')
			.getRawOne<{orderIndex: number | null}>();
			return topGroup.orderIndex ?? 0;
	}

	private async updateGroupIndexes(removedIndex: number): Promise<void> {
		await DishGroupEntity.createQueryBuilder()
			.update(DishGroupEntity)
			.set({order: ()=> 'order -1'})
			.where('order > :removedIndex', {removedIndex})
			.execute();
	}

	async getMenu() {
		const menu = await DishGroupEntity.find({ relations: ["dishes"], order: {order: "ASC"}});
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

		const maxGroupIndex = await this.getMaxOrderGroupIndex();
		const newGroup = DishGroupEntity.create({ name, order: maxGroupIndex+1 });
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
			await this.updateGroupIndexes(group.order);

			return group;
			
		} catch (err) {
			throw new ValidationError(
				err,
				HttpStatus.NOT_FOUND
			);
		}
	}

	async updateGroupOrder(groups: UpdateGroupOrderDTO[]) {
		if(groups.length === 0) return;

		try {
			for(const group of groups) {
				await DishGroupEntity.createQueryBuilder()
					.update(DishGroupEntity)
					.set({order: group.order})
					.where('id = :id', {id: group.id})
					.execute();
			};
			serverLog("Groups order updated successfully");
		} catch(err) {
			throw new ValidationError("Error during updating", err);
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
		const updatedDish = await dish.save();
		serverLog(`Dish ${dish.name} has been updated`);
		return updatedDish;
	}

	async deleteDish(id: string): Promise<Dish> {
		const dish = await DishEntity.findOne({ where: { id } });
		if (!dish) throw new ValidationError("Danie o podanym ID nie istnieje");
		return await dish.remove();
	}
}
