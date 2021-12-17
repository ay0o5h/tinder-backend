import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MusicFavourit } from "./MusicFavourit";
import { Passion } from "./Passion";
import { UserMatch } from "./UserMatch";
import { UserPassion } from "./UserPassion";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    age: number;

    @Column()
    gender: string;

    @Column()
    gender_Love: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    fb_url: string;

    @Column({ nullable: true })
    insta_url: string;

    @Column({ nullable: true })
    otp: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    passwordOtp: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // TODO: Make Relations

    @ManyToMany((type) => Passion, passion => passion.users, {
        cascade: true,
    })
    @JoinTable()
    passions: Passion[];

    @OneToMany((type) => UserMatch, (userMatch) => userMatch.user)
    userMatch: UserMatch[];
    @OneToMany((type) => MusicFavourit, (musicFav) => musicFav.user)
    musicFav: MusicFavourit[];

    @OneToMany((type) => UserPassion, (userPassion) => userPassion.user)
    userPassion: UserPassion[];


}
