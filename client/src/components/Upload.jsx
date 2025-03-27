import { toast } from "react-toastify";
import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";

// 處理Imagekit圖片上傳驗證
const authenticator = async () => {

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/upload-auth`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

const Upload = ({children, type, setProgress, setData}) => {

    const ref = useRef(null);

    //封面圖片上傳錯誤處理
    const onError = (err) => {
        console.log(err);
        toast.error("圖片上傳失敗...");
    }

    //封面圖片上傳成功處理，res是包含圖片網址的物件資訊
    const onSuccess = (res) => {
        console.log(res);
        setData(res);
    }

    //處理圖片上傳進度
    const onUploadProgress = (progress) => {
        console.log(progress);
        setProgress(Math.round(progress.loaded / progress.total) * 100)
    }


    return (
        <IKContext
            publicKey={import.meta.env.VITE_PUBLIC_KEY}
            urlEndpoint={import.meta.env.VITE_URL_ENDPOINT}
            authenticator={authenticator} >
            <IKUpload
                // fileName="test-upload.png"
                useUniqueFileName
                onError={onError}
                onSuccess={onSuccess}
                onUploadProgress={onUploadProgress}
                className="hidden"
                ref={ref}
                accept={`${type}/*`}
            />
            <div className="cursor-pointer" onClick={() => ref.current.click()}>
                {children}
            </div>
        </IKContext>
    );
};

export default Upload
