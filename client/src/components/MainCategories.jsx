import { Link } from "react-router-dom"
import Search from "./Search"

const MainCategories = () => {
    return (
        <div className="hidden md:flex bg-white rounded-3xl  xl:rounded-full p-4 shadow-lg items-center justify-center gap-8">
            {/* links */}
            <div className="flex-1 flex items-center justify-between flex-wrap">
                <Link to="./posts" className="bg-blue-800 text-white rounded-full px-4 py-2">所有文章</Link>
                <Link to="./posts?cat=general" className="hover:bg-blue-50 rounded-full px-4 py-2">一般</Link>
                <Link to="./posts?cat=web-design" className="hover:bg-blue-50 rounded-full px-4 py-2">網頁設計</Link>
                <Link to="./posts?cat=frame" className="hover:bg-blue-50 rounded-full px-4 py-2">框架</Link>
                <Link to="./posts?cat=databases" className="hover:bg-blue-50 rounded-full px-4 py-2">資料庫</Link>
                <Link to="./posts?cat=seo" className="hover:bg-blue-50 rounded-full px-4 py-2">SEO</Link>
                <Link to="./posts?cat=game" className="hover:bg-blue-50 rounded-full px-4 py-2">遊戲</Link>
            </div>
            <span className="text-xl font-medium">｜</span>


            {/* search */}
            {/* <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" fill="gray" viewBox="0 0 24 24">
                    <path d="M 13.261719 14.867188 L 15.742188 17.347656 C 15.363281 18.070313 15.324219 18.789063 15.722656 19.1875 L 20.25 23.714844 C 20.820313 24.285156 22.0625 23.972656 23.015625 23.015625 C 23.972656 22.058594 24.285156 20.820313 23.714844 20.25 L 19.191406 15.722656 C 18.789063 15.324219 18.070313 15.363281 17.347656 15.738281 L 14.867188 13.261719 Z M 8.5 0 C 3.804688 0 0 3.804688 0 8.5 C 0 13.195313 3.804688 17 8.5 17 C 13.195313 17 17 13.195313 17 8.5 C 17 3.804688 13.195313 0 8.5 0 Z M 8.5 15 C 4.910156 15 2 12.089844 2 8.5 C 2 4.910156 4.910156 2 8.5 2 C 12.089844 2 15 4.910156 15 8.5 C 15 12.089844 12.089844 15 8.5 15 Z"></path>
                </svg>
                <input type="text" placeholder="搜尋文章..." className="bg-transparent outline-none" />
            </div> */}
            <Search />

        </div>
    )
}

export default MainCategories
