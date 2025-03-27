import { useAuth, useUser } from "@clerk/clerk-react";
import Comment from "./Comment"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

//獲取全部留言。注意！因為經過axios回傳的資料會包成物件，然後把值放到物件的data變數內。
//這邊先用res.data把值取出來。之後就能直接用useQuery接收到的data變數進行操作
const fetchComments = async (postId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
  return res.data;
}

const Comments = ({ postId }) => {

  const navigate = useNavigate();

  //useMutation留言前要獲取token
  const { getToken } = useAuth();

  //這裡的user是用在留言剛送出時，mutation.pending狀態時會暫時顯示留言跟用戶資訊
  const { user } = useUser();


  const { isPending, error, data } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });


  //發文成功後要refreash畫面
  const queryClient = useQueryClient();


  //留言功能
  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });


  // 處理送出留言的submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);

    const data = {
      desc: formdata.get("desc"),
    };

    mutation.mutate(data);

     // 清空輸入框
  e.target.desc.value = "";
  };



  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500">文章留言▼</h1>

      <form onSubmit={handleSubmit} className="flex items-center justify-between gap-8 w-full">
        <textarea name="desc" placeholder="寫下你的留言..." className="w-full p-4 rounded-xl outline-none" />

        {user
          ? (<button className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl  cursor-pointer whitespace-nowrap">我要留言</button>)
          : (<div className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl cursor-pointer whitespace-nowrap" onClick={() => { navigate("/login") }}>請先登入</div>)
        }

      </form>
      {/* 剛進頁面載入留言的狀態條件*/}
      {isPending
        ? "載入中..."
        : error
          ? "留言載入發生錯誤"
          :
          // 最終載入留言完成，再追加留言與否的狀態與條件(組件記得要包起來)
          <>
            {/* 當留言送出後還在mutation.pending階段時，先顯示發送的資料 */}
            {mutation.isPending && (
              <Comment comment={{
                desc: `${mutation.variables.desc} (留言送出中...)`,
                createdAt: new Date(),
                user: {
                  img: "person.jpg",
                  username: user.username,
                },
              }}
              />
            )}

            {/* mutation.pending結束後，呈現完整的留言資料 */}
            {/* postId也要傳進組件，讓queryClient.invalidateQueries({ queryKey: ["comments", postId] });可以跑 */}
            {data.map((comment) => (
              <Comment key={comment._id} comment={comment} postId={postId} />
            ))}


          </>

      }

    </div>
  )
}

export default Comments
