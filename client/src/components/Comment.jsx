import { useAuth, useUser } from "@clerk/clerk-react";
import Image from "./Image"
import { format } from "timeago.js"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";


const Comment = ({ comment, postId }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  const queryClient = useQueryClient();


  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("留言刪除成功！")
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });


  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-8">
      <div className="flex items-center gap-4">
        <Image src={
          comment.user.img
          ? comment.user.img
          : "person.jpg"
          
          } className="w-10 h-10 rounded-full object-cover" w="40" />
        <span className="font-medium">{comment.user.username}</span>
        <span className="text-sm text-gray-500">{format(comment.createdAt)}</span>
        {/* 處理作者及管理者刪除留言的邏輯 */}
        {user && (comment.user.username === user.username || role === "admin") && (
          <span className="text-xs text-red-300 hover:text-red-500 cursor-pointer"
            onClick={() => { mutation.mutate(); }}>delete {mutation.isPending && <span>"(刪除中...)"</span>}</span>
        )}

      </div>
      <div className="mt-4">
        <p>{comment.desc}</p>
      </div>
    </div>
  )
}

export default Comment
