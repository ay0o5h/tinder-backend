import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MusicCategory } from "./MusicCategory";

@Entity()
export class MusicFavourit extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    link: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // TODO: Make Relations

    @ManyToOne((type) => MusicCategory, (musicCat) => musicCat.musicFav)
    musicCat: MusicCategory;


}
