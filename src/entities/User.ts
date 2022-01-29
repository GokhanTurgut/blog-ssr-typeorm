import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique: true})
  email: string;

  @Column({unique: true})
  username: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (todo) => todo.user)
  posts: Post[];
}