import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

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

}
