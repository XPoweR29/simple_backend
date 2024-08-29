import { IsString, IsNotEmpty, IsNumber, IsDecimal } from "class-validator";
import { DishGroup, Dish } from "../types/adona_types";

export class CreatGroupDTO implements Partial<DishGroup> {
    @IsString()
    @IsNotEmpty()
    name: string;
}


//dish
export class CreateDishDTO implements Omit<Dish, "id" | "group"> {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty({message: "Musisz podać grupę do które chcesz dodać nową pozycję!"})
	groupId: string;

	@IsString()
	@IsNotEmpty({message: "Musisz podać angielską nazwę dania"})

	engName: string;

	@IsDecimal({decimal_digits: '2', force_decimal: true})
	@IsNotEmpty({message: "Podaj cenę dania"})
	price: number;
}

export class GetDishByNameDTO implements Pick<Dish, "name"> {
	@IsString()
	@IsNotEmpty()
	name: string;
}