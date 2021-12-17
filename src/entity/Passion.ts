import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { UserPassion } from "./UserPassion";

@Entity()
export class Passion extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // TODO: Make Relations
    @ManyToMany((type) => User, user => user.passions)
    users: User[];
    @OneToMany((type) => UserPassion, (userPassion) => userPassion.passion)
    userPassion: UserPassion[];

}
