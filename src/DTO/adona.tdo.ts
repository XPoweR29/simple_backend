import { IsString, IsNotEmpty, IsNumber, Min, IsInt, } from "class-validator";
import { DishGroup, Dish } from "../types/adona_types";
import { Type } from "class-transformer";

export class CreatGroupDTO implements Partial<DishGroup> {
	@IsString()
	@IsNotEmpty()
	name: string;
}

export class UpdateGroupOrderDTO {
	@IsString()
	id: string;

	@Type(()=>Number)
	@IsInt({message: "Inideks musi być liczbą"})
	@Min(1, {message: "Indeks musi być większy od 0"})
	order: number;
}

//dish
export class CreateDishDTO implements Omit<Dish, "id" | "group"> {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty({
		message: "Musisz podać grupę do które chcesz dodać nową pozycję!",
	})
	groupId: string;

	@IsString()
	@IsNotEmpty({ message: "Musisz podać angielską nazwę dania" })
	engName: string;

	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0, { message: "Cena musi być większa lub równa 0" })
	@IsNotEmpty({ message: "Podaj cenę dania" })
	price: number;
}

export class UpdateDishDTO implements Partial<Dish> {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty({ message: "Musisz podać angielską nazwę dania" })
	engName: string;

	@Type(() => Number)
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0, { message: "Cena musi być większa lub równa 0" })
	@IsNotEmpty({ message: "Podaj cenę dania" })
	price: number;
}

export class GetDishByNameDTO implements Pick<Dish, "name"> {
	@IsString()
	@IsNotEmpty()
	name: string;
}
