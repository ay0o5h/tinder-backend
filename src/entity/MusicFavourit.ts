import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MusicFavourit {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    link: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // TODO: Make Relations

}
