import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "timeago.js";
import ReactQuill from "react-quill-new";

//獲取單篇文章所需slug並跨域請求
const fetchPost = async (slug) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${slug}`);
    return res.data;
}

const SinglePostPage = () => {

    //獲取單篇文章所需資訊
    const { slug } = useParams();

    const { isPending, error, data } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => fetchPost(slug),
    });

    if (isPending) return "載入中...";
    if (error) return "好像哪裡出錯了..." + error.message;
    if (!data) return "查無此文章";

    console.log(data);


    return (
        <div className="flex flex-col gap-4">
            {/* detail */}
            <div className="flex gap-8 flex-col">

            {data.img &&
                    <div className="hidden md:block w-full">
                        <Image src={data.img}  w="300" className="max-h-[500px] object-cover object-center" />
                    </div>
                }
                <div className="w-full  flex flex-col gap-3">
                    <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">{data.title}</h1>
                    <div className=" flex items-center gap-2 text-gray-400 text-sm">
                        <span>Written by</span>
                        <Link className="text-blue-800">{data?.user?.username}</Link>
                        <span>on</span>
                        <Link className="text-blue-800">{data.category}</Link>
                        <span>{format(data.createdAt)}</span>
                        <span>閱覽次數：{data.visit}</span>
                    </div>
                    <p className="text-gray-500 font-medium">
                        {data.desc}
                    </p>

                </div>
            

            </div>

            {/* content */}
            <div className="flex flex-col md:flex-row gap-12 border-t-2 pt-2">

                {/* text */}
                <div className="lg:text-lg flex flex-col gap-6 text-justify lg:flex-[3]">
                    <ReactQuill value={data.content} readOnly={true} theme="bubble" />;

                </div>

                {/* menu */}
                <div className="px-4 h-max sticky top-8 lg:flex-[1]">
                    <h1 className="mb-4 text-sm font-medium">Auther</h1>
                    <div className="flex flex-col gap-4">
                        <div className=" flex items-center gap-4">

                            {data.user.img 
                                ? (<Image src={data.user.img} className="w-12 h-12 rounded-full object-cover" w="48" h="48" />)
                                :  (<Image src="person.jpg" className="w-12 h-12 rounded-full object-cover" w="48" h="48" />)
                            }

                            <Link className="text-blue-800">{data.user.username}</Link>
                        </div>

                        <p className="text-sm text-gray-500">

                            {/* 在AI崛起的時代，才慢吞吞開始學Coding的老人。  */}
                            
 {data.user.desc
   ? (data.user.desc) 
   : ("作者簡介")

 }

                            </p>
                        {/* <div className="flex gap-2">
                            <Link><Image src="facebook.svg" /></Link>
                            <Link><Image src="instagram.svg" /></Link>
                        </div> */}

                    </div>


                    <PostMenuActions post={data} />

                    <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
                    <div className="flex flex-col gap-2 text-sm">
                        <Link to="/posts?cat=general" className="underline">一般</Link>
                        <Link to="/posts?cat=web-design" className="underline">網頁設計</Link>
                        <Link to="/posts?cat=frame" className="underline">框架</Link>
                        <Link to="/posts?cat=databases" className="underline">資料庫</Link>
                        <Link to="/posts?cat=seo" className="underline">SEO</Link>
                        <Link to="/posts?cat=game" className="underline">遊戲</Link>
                        <Link to="/posts" className="cursor-pointer text-blue-800">回文章列表</Link>
                    </div>
                    <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
                    <Search />
                </div>
            </div>

            <Comments postId={data._id} />
        </div>
    )
}

export default SinglePostPage
