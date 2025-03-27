import express from "express";
import { getPosts, getPost, createPost, deletePost, uploadAuth,featurePost, editPost } from "../controllers/post.controllers.js"
import increaseVisit from "../middlewares/increaseVisit.js";

const router = express.Router();

// 因為upload-auth跟單篇文章的:slug有衝突(格式一樣)，所以移上來
router.get("/upload-auth", uploadAuth)

router.get("/", getPosts)
router.get("/:slug", increaseVisit,getPost)
router.post("/", createPost)
router.delete("/:id", deletePost)
router.patch("/feature", featurePost);
router.patch("/edit/:id", editPost);


export default router