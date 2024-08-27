import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { DishGroupEntity } from "./dishGroup.entity";
import { Dish } from "../types/adona_types";

@Entity()
export class DishEntity extends BaseEntity implements Dish {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => DishGroupEntity, dishGroup => dishGroup.dishes)
	group: string;

	@Column({length: 50})
	name: string;

	@Column()
	engName: string;

	@Column('decimal', {precision: 10, scale: 2})
	price: number;
}