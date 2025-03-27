import PostListItem from "./PostListItem";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";


const fetchPosts = async (pageParam,searchParams) => { 
  // 處理搜尋條件的物件(為什麼要用這種方式？)http://localhost:5173/posts?cat=web-design會被轉換成{cat:"web-design"}
  const searchParamsObj = Object.fromEntries([...searchParams])

  // console.log(searchParamsObj)

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`, {
    //傳送出去時會變成localhost:3000/posts?page=1&limit=5 (如果page=2，就會略過前5項直接抓6-10項)
    //注意要把搜尋條件searchParamsObj傳到後端
    params: { page: pageParam,limit:10,...searchParamsObj },
  });
  return res.data;
}


const PostList = () => {

  //處理搜尋文章的邏輯(searchParams要放到fetchPosts的變數內，注意useInfiniteQuery的fetchPosts也要放)
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts',searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam,searchParams),
    initialPageParam: 1,
    //pages是回傳的物件
    getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 1 : undefined,
  })

  if (status === "loading") return 'Loading...';

  if (status === "error") return 'something went wrong: '


    //後端傳送時是{posts, hasMore}
  //經過useInfiniteQuery會變成{pages:[{posts, hasMore}], PageParam[1]}左邊等同{posts, hasMore}，右邊是1
  //data.pages取出{posts, hasMore}物件
  //經過flatMap的(page)=>page.posts，依序取出post物件[{文章1},{文章2}]放到新的陣列所以變成[[{文章1},{文章2}]]
  //接著攤平一維(等於拆掉最內層的陣列)最終變成[{文章1},{文章2}]
  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];


  // console.log(data);
  console.log(allPosts);

  //改allPosts.length 跟fetchNextPage
  return (
    <InfiniteScroll
      dataLength={allPosts.length} 
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>載入中...</h4>}
      endMessage={
        <p>
          <b className="text-md text-gray-600">載入完成，已無新文章。</b>
        </p>
      }
    >
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </InfiniteScroll>








  );
};

export default PostList
