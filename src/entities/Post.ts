// import mongoose from "mongoose";

// const Schema = mongoose.Schema;

// const postSchema = new Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     sanitizedContent: {
//       type: String,
//       required: true,
//     },
//     imageURL: {
//       type: String,
//     },
//     creator: {
//       type: String,
//       required: true,
//     },
//     creatorId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const post = mongoose.model("Post", postSchema);

// export default post;

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column()
  sanitizedContent: string;

  @Column()
  imageURL: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (author) => author.posts, {
    createForeignKeyConstraints: false,
  })
  user: User;
}