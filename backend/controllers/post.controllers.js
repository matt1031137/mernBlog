import Post from "../models/post.models.js";
import User from "../models/user.models.js";
import ImageKit from "imagekit";


// 教學說express5不用特地用try catch捕捉錯誤，只要在app.use((error...設定好，只要出錯就會自動顯示錯誤訊息。


export const getPosts = async (req, res) => {

    //對應useInfiniteQuery抓特定頁數
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 2


    //處理搜尋文章的邏輯
    const query = {};
    const cat = req.query.cat;
    const author = req.query.author;
    const searchQuery = req.query.search;
    const sortQuery = req.query.sort;
    const featured = req.query.featured;

    // console.log(req.query);

    //這邊用資料庫的欄位名稱做鍵，將搜尋變數的值帶進來
    if (cat) {
        query.category = cat;
    }

    if (searchQuery) {
        //$regex會從資料庫所有的title去找關鍵字(searchQuery)
        //$options:"i"是無視大小寫
        query.title = { $regex: searchQuery, $options: "i" };
    }

    if (author) {
        //用author去user資料表找username=author的資料，並回傳_id就好
        const user = await User.findOne({ username: author }).select("_id")

        if (!user) {
            return res.status(404).json("無該作者文章！");
        }

        //將搜尋條件的作者id放到query.user的鍵內
        query.user = user._id;
    }

    // 設定排序的變數，預設是-1最新文章
    let sortObj = { createdAt: -1 };


    if (sortQuery) {
        switch (sortQuery) {
            case "newest":
                sortObj = { createdAt: -1 };
                break;
            case "oldest":
                sortObj = { createdAt: 1 };
                break;
            case "popular":
                sortObj = { visit: -1 };
                break;
            case "trending":
                sortObj = { visit: -1 };
                query.createdAt = {
                    // $gte是大於等於，時間設定7天前(現在時間轉換毫秒後，減去7天份的毫秒)
                    $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
                }
                break;
            default:
                break;
        }
    }

    //處理featured文章的邏輯
    if (featured) {
        query.isFeatured = true;
    }

    //抓5個資料，略過(頁面變數-1)*5項
    //query 是一個物件，其中的 鍵（key）是 資料庫集合（table）內的欄位，而 值（value）則是對應的搜尋條件。
    //如果有不相干的鍵（資料表沒有該欄位）MONGODB會忽略不會錯誤
    const posts = await Post.find(query)
        //populate用文章作者的_id變數user，去資料庫找username的欄位抓作者名稱
        .populate("user", "username")
        // 搜尋的.sort({createdAt:值}) -1就是最新(newest)  1就是最舊(oldest)。
        //搜尋的.sort({visit:值}) -1就是最熱門(popular)  -1再加上期間就是潮流(trending)
        .sort(sortObj)
        .limit(limit)
        .skip((page - 1) * 2);


    //還要回傳剩多少資料沒抓(前端才能顯示下N頁)
    //先抓資料總比數，判斷是否大於"扣掉目前頁數*5"(布林值)
    const totalPosts = await Post.countDocuments();
    const hasMore = page * limit < totalPosts;

    res.status(200).send({ posts, hasMore });
}

export const getPost = async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug })
        .populate("user", "username img desc");
    res.status(200).send(post);
}

export const createPost = async (req, res) => {
    const clerkUserId = req.auth.userId;
    console.log(req.headers);
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated")
    };
    const user = await User.findOne({ clerkUserId });
    if (!user) {
        return res.status(404).json("User not found");
    }

    // 把標題的空白用-替代並改成大寫，當作slug
    let slug = req.body.title.replace(/ /g, "-").toLowerCase()

    //檢查是否重複slug
    let existingPost = await Post.findOne({ slug });

    //如果重複追加2，又再重複則+1迴圈
    let counter = 2;
    while (existingPost) {
        slug = `${slug}-${counter}`;
        existingPost = await Post.findOne({ slug });
        counter++;
    }

    const newPost = new Post({ user: user._id, slug, ...req.body });
    const post = await newPost.save();
    res.status(200).json(post)
}

export const deletePost = async (req, res) => {

    //追加管理者也能刪除文章的邏輯
    const role = req.auth.sessionClaims?.metadata?.role || "user"

    if (role === "admin") {
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).send("Post has been deleted");
    }


    const clerkUserId = req.auth.userId;
    if (!clerkUserId) {
        return res.status(401).json("Not authenticated")
    };
    const user = await User.findOne({ clerkUserId });
    //除了網址傳的用戶params.id以外，還要核對身分驗證的user.id是不是本人
    const deletedPost = await Post.findOneAndDelete({
        _id: req.params.id,
        user: user._id
    });
    if (!deletedPost) {
        return res.status(403).json("You can only delete your post!")
    }
    res.status(200).send("Post has been deleted");
}

// 處理圖片上傳uploadAuth的驗證
const imagekit = new ImageKit({
    urlEndpoint: process.env.IK_URL_ENDPOINT,
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
}


export const featurePost = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const postId = req.body.postId;

    if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";

    if (role !== "admin") {
        return res.status(403).json("You cannot feature posts!");
    }

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json("Post not found!");
    }

    const isFeatured = post.isFeatured;


    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
            isFeatured: !isFeatured,
        },
        { new: true }
    );

    res.status(200).json(updatedPost);

}

// 處理修改文章
export const editPost = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const postId = req.params.id;

    const img = req.body.img;
    const category = req.body.category;
    const title = req.body.title;
    const desc = req.body.desc;
    const content = req.body.content;
    const userId = req.body.userId;


    if (!clerkUserId) {
        return res.status(401).json("Not authenticated")
    };

    const user = await User.findOne({ clerkUserId });

    if (!user) {
        return res.status(404).json("User not found");
    }

    if (userId != user._id) {
        return res.status(404).json("非原作者不可編輯！");
    }

    const editPost = await Post.findByIdAndUpdate(
        postId,
        {
            img,
            category,
            title,
            desc,
            content,
        },
        { new: true }
    )

    res.status(200).json(editPost);
}