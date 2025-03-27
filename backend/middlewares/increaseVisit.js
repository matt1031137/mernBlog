import Post from "../models/post.models.js";

const increaseVisit = async (req, res, next) => {
    const slug = req.params.slug;
    //用網址的slug搜尋資料庫，用$inc增加方法，讓visit欄位加1
    await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1 } })

    next();
}

export default increaseVisit