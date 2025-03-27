import { Link } from "react-router-dom";
import Image from "./Image";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import axios from "axios";

const fetchPost = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts?featured=true&limit=4&sort=newest`);
    return res.data;
}

const FeaturedPosts = () => {


    const { isPending, error, data } = useQuery({
        queryKey: ['featuredPosts'],
        queryFn: () => fetchPost(),
    });

    if (isPending) return "載入中...";
    if (error) return "好像哪裡出錯了..." + error.message;
    if (!data) return "查無此文章";

    // 回傳的物件包含{posts,hasMore}後者不需要，只取前者
    const posts = data.posts;
    if (!posts || posts.length === 0) {
        return;
    }


    return (
        <div className="mt-8 flex flex-col lg:flex-row gap-8">

            {/* First */}
            <div className="w-full lg:w-1/2 flex flex-col gap-2">

                <div className="flex items-center gap-1">
                    <h1 className="font-semibold lg:text-3xl">01.</h1>
                    <Link to={posts[0].slug} className="text-xl lg:text-3xl font-semibold lg:font-bold"> {posts[0].title}</Link>
                </div>

                {/* details */}
                <div className="flex items-center gap-4">
                    <Link className="text-blue-800 lg:text-lg">{posts[0].category}</Link>
                    <span className="text-gray-500 text-xs">{format(posts[0].createdAt)}</span>
                    <span className="text-gray-500 text-xs">閱覽次數：{posts[0].visit}</span>
                </div>

                {/* title */}

                {/* image */}
                {posts[0].img &&
                    <Link to={posts[0].slug}><Image src={posts[0].img || "tempCover.jpg"} className="rounded-3xl object-cover" w="895" h="550" /></Link>
                }


            </div>

            {/* Other */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                {/* second */}
                {posts[1] &&
                    <div className="lg:h-1/3 flex justify-between gap-4">
                        <div className="w-1/3 aspect-video">
                           <Link to={posts[1].slug}>
                                <Image src={posts[1].img || "tempCover.jpg"}
                                    className="rounded-3xl object-cover  w-full h-full" w="298" />
                           </Link>
                        </div>

                        <div className="w-2/3">
                            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                                <h1 className="font-semibold">02.</h1>
                                <Link className="text-blue-800">{posts[1].category}</Link>
                                <span className="text-gray-500 text-sm">{format(posts[1].createdAt)}</span>
                                <span className="text-gray-500 text-xs">閱覽次數：{posts[1].visit}</span>
                            </div>
                            <Link to={posts[1].slug} className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium">{posts[1].title} </Link>
                        </div>
                    </div>
                }





                {/* third */}
                {posts[2] &&
                    <div className="lg:h-1/3 flex justify-between gap-4">
                        <div className="w-1/3 aspect-video">
                           <Link to={posts[2].slug}>
                                <Image src={posts[2].img || "tempCover.jpg"}
                                    className="rounded-3xl object-cover  w-full h-full" w="298" />
                           </Link>
                        </div>

                        <div className="w-2/3">
                            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                                <h1 className="font-semibold">03.</h1>
                                <Link className="text-blue-800">{posts[2].category}</Link>
                                <span className="text-gray-500 text-sm">{format(posts[2].createdAt)}</span>
                                <span className="text-gray-500 text-xs">閱覽次數：{posts[2].visit}</span>
                            </div>
                            <Link to={posts[2].slug} className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium">{posts[2].title} </Link>
                        </div>
                    </div>
                }


                {/* fourth */}
                {posts[3] &&
                    <div className="lg:h-1/3 flex justify-between gap-4">
                        <div className="w-1/3 aspect-video">
                            <Link to={posts[3].slug}>
                                <Image src={posts[3].img || "tempCover.jpg"}
                                    className="rounded-3xl object-cover  w-full h-full" w="298" />
                            </Link>
                        </div>

                        <div className="w-2/3">
                            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                                <h1 className="font-semibold">04.</h1>
                                <Link className="text-blue-800">{posts[3].category}</Link>
                                <span className="text-gray-500 text-sm">{format(posts[3].createdAt)}</span>
                                <span className="text-gray-500 text-xs">閱覽次數：{posts[3].visit}</span>
                            </div>
                            <Link to={posts[3].slug} className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium">{posts[3].title} </Link>
                        </div>
                    </div>
                }


            </div>

        </div>
    )
}

export default FeaturedPosts
