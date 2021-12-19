import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from './User';

@Entity()
export class UserMatch extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    matchId: number;

    @Column()
    user_send: number;

    @Column()
    user_receive: number;

    @Column({ default: null })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // TODO: Make Relations
    @ManyToOne((type) => User, (user) => user.userMatch)
    user: User;


}
