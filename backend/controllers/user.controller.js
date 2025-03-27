import User from "../models/user.models.js";
import Post from "../models/post.models.js";

export const getUserSavedPosts = async (req, res) => {
    const clerkUserId = req.auth.userId;
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated");
    }

    const user = await User.findOne({ clerkUserId });

    res.status(200).json(user.savedPosts);
}


export const savePost = async (req, res) => {
    const clerkUserId = req.auth.userId;
    //為什麼req.body會儲存文章id，要確認-->axios傳送資料時設定，把組件接收到的post送出來
    const postId = req.body.postId;
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated");
    }

    const user = await User.findOne({ clerkUserId });

    // 用some檢查savedPost陣列有無存在要存檔的文章id，只要有一個符合就回傳true
    const isSaved = user.savedPosts.some((p) => p === postId)

    if (!isSaved) {
        await User.findByIdAndUpdate(user._id, {
            $push: { savedPosts: postId },
        });
    } else {
        await User.findByIdAndUpdate(user._id, {
            $pull: { savedPosts: postId },
        })
    }

  //避免網速太慢導致?? 確定更新資料庫後再回傳
  setTimeout(()=>{
    res.status(200).json(isSaved ? "文章已取消儲存" : "已儲存文章");
  },3000)

}
