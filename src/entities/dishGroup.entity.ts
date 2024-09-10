import { Dish, DishGroup } from './../types/adona_types.d';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DishEntity } from './dish.entity';

@Entity()
export class DishGroupEntity extends BaseEntity implements DishGroup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    name: string;
    
    @OneToMany(() => DishEntity, dish => dish.group, {cascade: ['remove']})
    dishes: Dish[];

    @Column({type: "int"})
    order: number;

}