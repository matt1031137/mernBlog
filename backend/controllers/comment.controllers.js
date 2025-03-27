import Comment from "../models/comment.models.js";
import User from "../models/user.models.js"

export const getPostComments = async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId })
        .populate("user", "username img")
        .sort({ createdAt: -1 });

    res.json(comments);
};

export const addComment = async (req, res) => {
    // 留言同樣要驗證登入
    const clerkUserId = req.auth.userId;
    const postId = req.params.postId

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated");
    };

    const user = await User.findOne({ clerkUserId });

    const newComment = new Comment({
        ...req.body,
        user: user._id,
        post: postId,
    });

    const saveComment = await newComment.save();

    // 前端mutation.pending階段時會先顯示新留言，所以後端等3秒後再回覆
    setTimeout(() => {
        //用201代表資料創建成功
        res.status(201).json(saveComment);
    }, 3000)
};

export const deleteComment = async (req, res) => {
    const clerkUserId = req.auth.userId;
    //這裡抓的是留言的資料庫id
    const id = req.params.id;

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated");
    };

    //追加管理者也能刪除文章的邏輯
    const role = req.auth.sessionClaims?.metadata?.role || "user"

    if (role === "admin") {
        await Comment.findByIdAndDelete(req.params.id);
        return res.status(200).send("Comment has been deleted");
    }

    const user = await User.findOne({ clerkUserId });

    const deleteComment = await Comment.findOneAndDelete({
        _id: id,
        user: user._id,
    })


    if (!deleteComment) {
       console.log(id,user);
        return res.status(403).json("你只能刪除自己的留言")
    };

    res.status(200).json("留言已刪除");
}


