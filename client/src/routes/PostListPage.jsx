import PostList from "../components/PostList"
import SideMenu from "../components/SideMenu"
import { useState } from "react";

const PostListPage = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className=''>
            <h1 className="mb-8 text-2xl">文章列表</h1>
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
