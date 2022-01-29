import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column("text")
  content: string;

  @Column("text")
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
