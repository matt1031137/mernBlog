import express from "express";
import { connectDB } from "./lib/connectDB.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import webHookRouter from "./routes/webhook.route.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import cors from "cors";
import path from 'path';


const app = express();

const __dirname = path.resolve();

app.use(cors(process.env.CLIENT_URL));
// app.use(cors({
//   origin: process.env.CLIENT_URL, 
//   credentials: true
// }));

app.use(clerkMiddleware());
app.use("/webhooks", webHookRouter); //因為只有webhook使用body-parser而不是express.json所以移上來
app.use(express.json());

// 上傳imageKit圖片的middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



// 驗證測試 看起來驗證後資料clerk會存在req.auth
// app.get("/auth-state",(req,res)=>{
//     const authState = req.auth;
//     res.json(authState);
// })


// 驗證方法一
// app.get("/protect", (req, res) => {
//     const { userId } = req.auth;
//     if (!userId) {
//         return res.status(401).json("not authenticated")
//     }
//     res.status(200).json("content");
// })

//驗證方法二，用@clerk/express內建的驗證函式
// app.get("/protect2", requireAuth(), (req, res) => {
//     res.status(200).json("content");
// })

app.use("/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/comments", commentRoutes);

//全域錯誤處理中介軟體
app.use((error, req, res, next) => {
  res.status(error.status || 500);

  res.json({
    message: error.message || "某個地方出錯了...",
    status: error.status,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined, // 只在開發環境回傳錯誤堆疊
  })
})

app.use(express.static(path.join(__dirname, "../client/dist")));

//將用戶導入前端的靜態路徑檔案
// 前端 React Router 交給 index.html 處理
app.get("*", (req, res) => { 
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});


app.listen(3000, () => {
  console.log(__dirname)
  // console.log(process.env)
  connectDB();
  console.log("伺服器開啟");
});