import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MusicFavourit } from "./MusicFavourit";

@Entity()
export class MusicCategory extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // TODO: Make Relations
    @OneToMany((type) => MusicFavourit, (musicFav) => musicFav.musicCat)
    musicFav: MusicFavourit[];

}
