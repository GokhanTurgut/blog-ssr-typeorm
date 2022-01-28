// import mongoose from "mongoose";

// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   surname: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     minLength: 6,
//   },
//   posts: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Post",
//     },
//   ],
// });

// const user = mongoose.model("User", userSchema);

// export default user;

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
  @JoinColumn()
  posts: Post[];
}