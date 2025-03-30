
import { useSearchParams } from "react-router-dom";
import PostList from "../components/PostList"
import SideMenu from "../components/SideMenu"
import { useState } from "react";

const PostListPage = () => {
    const [open, setOpen] = useState(false);
    // 試著寫過濾的麵包屑

    const [searchParams, setSearchParams] = useSearchParams();
    const searchParamsObj = Object.fromEntries([...searchParams])
    let filter1 = searchParamsObj.cat;
    let filter2 = searchParamsObj.sort;
    let searchFilter = "";

    if (filter1 || filter2) {
        switch (filter1) {
            case "general":
                filter1 = "一般";
                break;
            case "web-design":
                filter1 = "網頁設計";
                break;
            case "frame":
                filter1 = "框架";
                break;
            case "databases":
                filter1 = "資料庫";
                break;
            case "seo":
                filter1 = "SEO";
                break;
            case "game":
                filter1 = "遊戲";
                break;
            default:
                filter1 = "無";
        }


        switch (filter2) {
            case "newest":
                filter2 = "最新";
                break;
            case "oldest":
                filter2 = "最舊";
                break;
            case "popular":
                filter2 = "最受歡迎";
                break;
            case "trend":
                filter2 = "目前流行";
                break;
            default:
                filter2 = "無";
        }

        searchFilter = `分類：${filter1}` + "\u00A0\u00A0\u00A0\u00A0\u00A0" + `篩選：${filter2 || "無"}`;
    } else {
        searchFilter = "ALL";
    }

    return (
        <div className=''>
            <h1 className="mb-8 text-2xl">文章列表
                <span className="text-xs text-blue-950 pl-4">{searchFilter}</span>
            </h1>
            <button onClick={() => setOpen(!open)} className="md:hidden bg-blue-800 px-4 py-2 rounded-2xl text-white text-sm mb-4">
                {open ? "關閉" : "篩選或搜尋"}</button>
            <div className="flex flex-col-reverse gap-8 md:flex-row justify-between">
                <div>
                    <PostList />
                </div>

                <div className={`${open ? "block" : "hidden"} md:block`}>
                    <SideMenu />
                </div>
            </div>
        </div>
    )
}

export default PostListPage
