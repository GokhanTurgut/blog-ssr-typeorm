import { marked } from "marked";
import DOMPurifyCreator from "dompurify";
import { JSDOM } from "jsdom";
import { validationResult } from "express-validator";
import { RequestHandler } from "express";
import { getRepository } from "typeorm";

import { Post } from "../entities/Post";
import { User } from "../entities/User";

// Creating our DOMPurify object to sanitize HTML that is
// transformed from markdown using marked library
const DOMPurify = DOMPurifyCreator(new JSDOM().window as unknown as Window);

const getIndex: RequestHandler = async (req, res) => {
  try {
    const postRepo = getRepository(Post);
    const posts = await postRepo.find({ relations: ["user"] });
    res.render("index", { pageTitle: "gusto-Blogs", posts });
  } catch (err) {
    throw new Error(err as string);
  }
};

const getPostById: RequestHandler = async (req, res) => {
  try {
    const postId = req.params.postId;
    const postRepo = getRepository(Post);
    const post = await postRepo.findOne(postId);
    if (!post) {
      throw new Error("Post does not exist!");
    }
    res.render("blog/post", { pageTitle: post.title, post });
  } catch (err) {
    throw new Error(err as string);
  }
};

const getAddPost: RequestHandler = (req, res) => {
  res.render("blog/addPost", {
    pageTitle: "Add Post",
    errorMessage: null,
    oldInput: {
      title: null,
      imageURL: null,
      description: null,
      content: null,
    },
  });
};

const getMyPosts: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId;
    const userRepo = getRepository(User);
    const user = await userRepo.findOne(userId, { relations: ["posts"] });
    res.render("blog/myPosts", {
      pageTitle: "My Posts",
      posts: user.posts,
    });
  } catch (err) {
    throw new Error(err as string);
  }
};

const getEditPostById: RequestHandler = async (req, res) => {
  try {
    const postId = req.params.postId;
    const postRepo = getRepository(Post);
    const post = await postRepo.findOne(postId);
    res.render("blog/editPost", {
      pageTitle: "Edit Post",
      post: post,
      errorMessage: null,
    });
  } catch (err) {
    throw new Error(err as string);
  }
};

const postAddPost: RequestHandler = async (req, res) => {
  const { title, description, content } = req.body;
  let imageURL = req.body.imageURL;
  const userId = req.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("blog/addPost", {
      pageTitle: "Add Post",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        title: title,
        imageURL: imageURL,
        description: description,
        content: content,
      },
    });
  }

  // If no image provided use our default image
  if (!imageURL) {
    imageURL = "images/default-photo.webp";
  }

  // Transforming markdown to HTML then sanitizing it
  const sanitizedContent = DOMPurify.sanitize(marked(content));

  try {
    const postRepo = getRepository(Post);
    const userRepo = getRepository(User);
    const user = await userRepo.findOne(userId);

    let post = new Post();
    post.title = title;
    post.imageURL = imageURL;
    post.description = description;
    post.content = content;
    post.sanitizedContent = sanitizedContent;
    post.createdAt = new Date();
    post.user = user;

    await postRepo.save(post);
    res.redirect(`/post/${post.id}`);
  } catch (err) {
    throw new Error(err as string);
  }
};

const postDeletePostById: RequestHandler = async (req, res) => {
  try {
    const postId = req.params.postId;
    const postRepo = getRepository(Post);
    await postRepo.delete(postId);
    res.redirect("/myPosts");
  } catch (err) {
    throw new Error(err as string);
  }
};

const postEditPostById: RequestHandler = async (req, res) => {
  const { title, description, content } = req.body;
  let imageURL = req.body.imageURL;
  const postId = req.params.postId;

  const oldPost = { title, imageURL, description, content, id: postId };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("blog/editPost", {
      pageTitle: "Edit Post",
      post: oldPost,
      errorMessage: errors.array()[0].msg,
    });
  }

  // If no image provided use our default image
  if (!imageURL) {
    imageURL = "images/default-photo.webp";
  }

  // Transforming markdown to HTML then sanitizing it
  const sanitizedContent = DOMPurify.sanitize(marked(content));

  try {
    const postRepo = getRepository(Post);
    let post = await postRepo.findOne(postId, { relations: ["user"] });
    if (post.user.id !== req.userId) {
      return res.redirect("/");
    }
    post.title = title;
    post.imageURL = imageURL;
    post.description = description;
    post.content = content;
    post.sanitizedContent = sanitizedContent;
    await postRepo.save(post);
    res.redirect(`/post/${post.id}`);
  } catch (err) {
    throw new Error(err as string);
  }
};

export default {
  getIndex,
  getPostById,
  getAddPost,
  getMyPosts,
  getEditPostById,
  postAddPost,
  postEditPostById,
  postDeletePostById,
};
