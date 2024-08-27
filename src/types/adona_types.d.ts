export interface Dish {
    id: string;
    group: string;
    name: string;
    engName: string;
    price: number;
}

export interface DishGroup {
    id: string;
    name: string;
    dishes: Dish[];
}