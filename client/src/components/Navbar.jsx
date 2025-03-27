import { useState,useEffect } from "react"
import { IKImage } from 'imagekitio-react';
import Image from "./Image";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton,useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";


const NavBar = () => {
    const [open, setOpen] = useState(false);

    const {getToken} = useAuth();
 
    //測試用
    useEffect(()=>{
        getToken().then(token=>console.log(token));
    },[])


    return (
        <div className="w-full h-16 md:h-20 flex items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-4 text-2xl font-bold" onClick={()=>{if(open){
            setOpen(!open);
            }} }>
                <Image src="logo.jpeg" alt="logo" w={50} h={50} className="rounded-2xl shadow-md"/>
                <span>Matt大熱美</span>
            </Link>


            {/* MobileMenu */}
            <div className="md:hidden"
                onClick={() => setOpen((state) => !state)}
            >
                <div className="cursor-pointer text-4xl">
                    {open ? "X" : "☰"}
                </div>
                <div className={`z-10 bg-gray-100 w-full h-screen flex flex-col items-center justify-center absolute top-16 gap-8 font-medium text-lg transition-all ease-in-out ${open ? "right-0" : "right-[100%]"}`}>
                    <Link to="/">首頁</Link>
                    <Link to="/posts">文章列表</Link>
                    <Link to="/posts?sort=popular">熱門文章</Link>
                    <div className="cursor-pointer"  onClick={()=>{toast.info("如需連絡請Email：keigo8231@gmail.com",{theme:"colored"})}}>關於站長</div>
                    <SignedOut>
                    <Link to="/login">
                        <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">登入👋</button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                </div>

            </div>



            {/* DesktopMenu */}
            <div className="hidden md:flex items-center gap-8 md:gap-12 font-medium" >
                <Link to="/">首頁</Link>
                <Link to="/posts">文章列表</Link>
                    <Link to="/posts?sort=popular">熱門文章</Link>
                    <div className="cursor-pointer"  onClick={()=>{toast.info("如需連絡請Email：keigo8231@gmail.com",{theme:"colored"})}}>關於站長</div>
                <SignedOut>
                    <Link to="/login">
                        <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">登入👋</button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>

            </div>





        </div>
    )
}

export default NavBar
