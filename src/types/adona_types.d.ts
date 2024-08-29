export interface DishGroup {
    id: string;
    name: string;
    dishes: Dish[];
}

export interface Dish {
    id: string;
    group: DishGroup;
    name: string;
    engName: string;
    price: number;
}
