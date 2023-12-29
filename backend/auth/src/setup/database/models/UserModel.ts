/**
 * User Model that store Data in Postgresql
 */
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Passwords } from "../../../utils/password";

@Entity("users") //this is the table inside the entity
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 50, unique: true })
  username: string;

  @Column("varchar", { length: 50, unique: true })
  email: string;

  @Column("varchar", { length: 100 })
  password: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  lastUpdatedDate: Date;

  @BeforeInsert()
  async HashPassword() {
    this.password = await Passwords.hashPassword(this.password);
  }
}
