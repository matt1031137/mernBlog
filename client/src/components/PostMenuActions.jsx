import { useAuth, useUser } from "@clerk/clerk-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const PostMenuActions = ({ post }) => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();



    // 注意回傳資料的變數名稱改成savePosts，   queryKey: ['savedPosts']是？
    const { isPending, error, data: savedPosts } = useQuery({
        queryKey: ['savedPosts'],
        queryFn: async () => {
            const token = await getToken();
            if (token) {
                return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

        }

    });

    //處理管理者帳號功能(注意要在clerk的面板的session先設定好public變數)
    const isAdmin = user?.publicMetadata?.role === "admin" || false;

    //savedPosts是接收到的變數沒錯，雖然後端傳的是[]陣列，但經過axios會被包在物件內，而傳送的值會放在物件的data變數內
    const isSaved = savedPosts?.data?.some(p => p === post._id) || false;

    //處理刪除文章的動作
    // const deleteMutation = useMutation({
    //     mutation: async () => {   <-------------------------這裡錯，要用mutationFn
    //         const token = await getToken();
    //         return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //     },
    //     onSuccess: () => {
    //         toast.onSuccess("文章刪除成功！");
    //         //回首頁直接/就好
    //         navigate("/")
    //     },
    //     onError: () => {
    //         toast.error(error.response.data);
    //     },
    // });


    const deleteMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: () => {
            toast.success("刪除文章成功!");
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    });

    const handleDelete = () => {
        deleteMutation.mutate();
    };


    //這裡的useQueryClient()是要操作queryKey: ['savedPosts']，把儲存文章....?
    const queryClient = useQueryClient();


    //處理儲存文章功能
    const saveMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            // 注意要改patch
            return axios.patch(`${import.meta.env.VITE_API_URL}/users/save`,
                // 注意文章資訊的變數也要傳到後端，這樣後端就能用req.body.postId抓文章的post._id
                {
                    postId: post._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        },
        onSuccess: () => {
            //成功的話，把文章...放進去？
            queryClient.invalidateQueries({ queryKey: ['savedPosts'] })
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    });


    const handleSave = () => {
        if (!user) {
            return navigate("/login");
        }
        saveMutation.mutate();
    };

    //處理Featured文章的mutation
    const featureMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return axios.patch(
                `${import.meta.env.VITE_API_URL}/api/posts/feature`,
                {
                    postId: post._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["post", post.slug] });
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    });

    const handleFeature = () => {
        featureMutation.mutate();
    };



    return (
        <div>
            {user && (<h1 className="mt-8 mb-4 text-sm font-medium">Actions</h1>)}

            {/* 依照畫面載入時，useQuery */}
            {user ?
                (
                    isPending ? (<span className="text-xs">載入中...</span>) : error ? (<span className="text-xs">請先登入</span>) :
                        (
                            <div className="flex items-center gap-2 py-2 text-sm cursor-pointer" onClick={handleSave}>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="21" height="21" viewBox="0 0 30 30"
                            fill={isSaved ? "black" : "white"}
                        >
                            <path d="M23,27l-8-7l-8,7V5c0-1.105,0.895-2,2-2h12c1.105,0,2,0.895,2,2V27z"></path>
                        </svg> */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 48 48"
                                    width="20px"
                                    height="20px"
                                >
                                    <path
                                        d="M12 4C10.3 4 9 5.3 9 7v34l15-9 15 9V7c0-1.7-1.3-3-3-3H12z"
                                        stroke="black"
                                        strokeWidth="2"
                                        // 追加修改儲存文章後的狀態(如果修改中且原本是儲存>none；如果修改中但原本沒儲存>black)
                                        fill={
                                            saveMutation.isPending
                                                ? isSaved
                                                    ? "none"
                                                    : "black"
                                                //這邊就是剛進頁面初始的判斷
                                                : isSaved
                                                    ? "black"
                                                    : "none"
                                        }
                                    />
                                </svg>


                                <span>儲存文章</span>
                                {saveMutation.isPending &&
                                    <span className="text-xs">(修改中...)</span>
                                }
                            </div>
                        )
                )
                :
                ("")
            }

            {/* 處理Featured文章 */}
            {isAdmin && (
                <div
                    className="flex items-center gap-2 py-2 text-sm cursor-pointer"
                    onClick={handleFeature}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="20px"
                        height="20px"
                    >
                        <path
                            d="M24 2L29.39 16.26L44 18.18L33 29.24L35.82 44L24 37L12.18 44L15 29.24L4 18.18L18.61 16.26L24 2Z"
                            stroke="black"
                            strokeWidth="2"
                            fill={
                                featureMutation.isPending
                                    ? post.isFeatured
                                        ? "none"
                                        : "black"
                                    : post.isFeatured
                                        ? "black"
                                        : "none"
                            }
                        />
                    </svg>
                    <span>Feature</span>
                    {featureMutation.isPending && (
                        <span className="text-xs">(修改中...)</span>
                    )}
                </div>
            )}



            {/*驗證用戶存在 且 傳入的post文章資訊的作者名稱 === 驗證用戶的名稱 */}
            {/* 追加如果是isAdmin也能刪除別人文章 */}
            {user && (post.user.username === user.username || isAdmin) &&
                <div className="flex items-center gap-2 py-2 text-sm cursor-pointer"
                    onClick={handleDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="21" height="21" viewBox="0 0 32 32" fill="#8B0000">
                        <path d="M 15 4 C 14.476563 4 13.941406 4.183594 13.5625 4.5625 C 13.183594 4.941406 13 5.476563 13 6 L 13 7 L 7 7 L 7 9 L 8 9 L 8 25 C 8 26.644531 9.355469 28 11 28 L 23 28 C 24.644531 28 26 26.644531 26 25 L 26 9 L 27 9 L 27 7 L 21 7 L 21 6 C 21 5.476563 20.816406 4.941406 20.4375 4.5625 C 20.058594 4.183594 19.523438 4 19 4 Z M 15 6 L 19 6 L 19 7 L 15 7 Z M 10 9 L 24 9 L 24 25 C 24 25.554688 23.554688 26 23 26 L 11 26 C 10.445313 26 10 25.554688 10 25 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 16 12 L 16 23 L 18 23 L 18 12 Z M 20 12 L 20 23 L 22 23 L 22 12 Z"></path>
                    </svg>
                    <span className="text-red-900">刪除文章</span>
                    {deleteMutation.isPending && <span className="text-xs">(文章刪除中...)</span>}
                </div>
            }


            {/* 追加編輯文章 */}

            {user && (post.user.username === user.username || isAdmin) &&
                <div className="flex items-center gap-2 py-2 text-sm cursor-pointer" >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="21" height="21" viewBox="0 0 48 48" fill="gray">
                        <path d="M38.657 18.536l2.44-2.44c2.534-2.534 2.534-6.658 0-9.193-1.227-1.226-2.858-1.9-4.597-1.9s-3.371.675-4.597 1.901l-2.439 2.439L38.657 18.536zM27.343 11.464L9.274 29.533c-.385.385-.678.86-.848 1.375L5.076 41.029c-.179.538-.038 1.131.363 1.532C5.726 42.847 6.108 43 6.5 43c.158 0 .317-.025.472-.076l10.118-3.351c.517-.17.993-.463 1.378-.849l18.068-18.068L27.343 11.464z"></path>
                    </svg>
                    <span className="text-gray-900" onClick={() => navigate("/edit", { state: { post } })}>編輯文章</span>
                </div>
            }

        </div>
    )
}

export default PostMenuActions
