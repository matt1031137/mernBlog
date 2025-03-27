import { useAuth, useUser } from "@clerk/clerk-react"
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import Image from "../components/Image";


const Write = () => {
    //利用clerk的hook確認用戶狀態
    // isLoaded 確認用戶資訊
    const { isLoaded, isSignedIn } = useUser();


    //為了獲取ReactQuill的文章內容，固定用useState方法
    const [value, setValue] = useState();

    // 儲存上傳的封面圖片網址
    const [cover, setCover] = useState();

    //處理上傳封面圖片的進度條
    const [progress, setProgress] = useState(0);

    //處理ReactQuill上傳的圖片與影片
    const [img, setImg] = useState("");
    const [video, setVideo] = useState("");

    //將文章上傳的圖文內容放到ReactQuill內文中
    useEffect(() => {
        img && setValue((prev) => (prev + `<p><image src="${img.url}" /></p>`))
    }, [img])

    // 注意影片是iframe且class要加ql-video
    useEffect(() => {
        video && setValue((prev) => (prev + `<p><iframe class="ql-video" src="${video.url}" /></p>`))
    }, [video])


    // 發文成功後導向文章網址
    const navigate = useNavigate();

    // useMutation發文前要獲取token
    const { getToken } = useAuth();


    //教學說要before condition
    const mutation = useMutation({
        mutationFn: async (newPost) => {
            const token = await getToken();
            return axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, newPost, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: (res) => {
            toast.success("已發表文章！");
            navigate(`/${res.data.slug}`);
        }
    })


    //剛進來會先確認用戶資訊
    if (!isLoaded) {
        return <div className="">載入中...</div>
    }

    //確認用戶資訊完畢，但未登入
    if (isLoaded && !isSignedIn) {
        return <div className="">若要發文請先登入！</div>
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target)
        const data = {
            img: cover.filePath || "",
            title: formData.get("title"),
            category: formData.get("category"),
            desc: formData.get("desc"),
            content: value,
        }
        console.log(data);
        // 利用mutation.mutate將發文資料送出
        mutation.mutate(data);
    }


    return (
        <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
            <h1 className="text-xl font-light">發表新文章</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">

                <div className="flex items-center">
                    {/* 參數children不用寫，直接包子元素進去就好 */}
                    <Upload type="image" setProgress={setProgress} setData={setCover}>
                        <div className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">添加封面圖片</div>
                    </Upload>

                    {cover &&
                        <Image src={cover.filePath} w="250" h="100" />
                    }
                </div>

                <input className="text-4xl font-semibold bg-transparent outline-none"
                    type="text"
                    placeholder="title"
                    name="title"
                    required
                />
                <div className="flex items-center gap-4">
                    <label className="text-sm" htmlFor="">選擇文章分類</label>
                    <select name="category" id="" className="p-2 rounded-xl bg-white shadow-md">
                        <option value="general">一般</option>
                        <option value="web-design">網頁設計</option>
                        <option value="frame">框架</option>
                        <option value="databases">資料庫</option>
                        <option value="seo">SEO</option>
                        <option value="game">遊戲</option>
                    </select>
                </div>
                <textarea className="p-4 rounded-xl bg-white shadow-md" name="desc" placeholder="簡短的文章概要..."  required/>
                <div className="flex flex-1">
                    <div className="flex flex-col gap-2 mr-2">

                        <Upload type="image" setProgress={setProgress} setData={setImg}>
                            <div className="cursor-pointer">🖼️</div>
                        </Upload>

                        <Upload type="video" setProgress={setProgress} setData={setVideo}>
                            <div className="cursor-pointer">▶️</div>
                        </Upload>

                    </div>
                    <ReactQuill
                        theme="snow"
                        className="flex-1 rounded-xl bg-white shadow-md"
                        value={value}
                        onChange={setValue}
                        disabled={(progress > 0 && progress < 100)}
                    />
                </div>
                <button
                    className="bg-blue-800 text-white font-medium rounded-md mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    disabled={mutation.isPending || (progress > 0 && progress < 100)}>
                    {mutation.isPending ? "傳送中..." : "Send"}</button>
                {"圖/影上傳進度:" + progress + "%"}
                {/* {mutation.isError && <span>mutation.error.message</span>} */}
            </form>
        </div>
    )
}

export default Write
