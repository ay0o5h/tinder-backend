import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MusicCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // TODO: Make Relations

}
