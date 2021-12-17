import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Passion } from "./Passion";
import { User } from "./User";

@Entity()
export class UserPassion extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;


    // TODO: Make Relations



    @ManyToOne((type) => User, (user) => user.userPassion)
    user: User;
    @ManyToOne((type) => Passion, (passion) => passion.userPassion)
    passion: Passion;

}
