import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserMatch {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    matchId: number;

    @Column()
    user_send: number;

    @Column()
    user_request: number;

    @Column({ default: false })
    status: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // TODO: Make Relations

}
