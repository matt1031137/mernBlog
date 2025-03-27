import React from 'react'
import { Link } from 'react-router-dom'
import MainCategories from '../components/MainCategories'
import FeaturedPosts from '../components/FeaturedPosts'
import PostList from '../components/PostList'

const Homepage = () => {
  return (
    <div className='mt-4 flex flex-col gap-4'>
      {/* <BreadCrumb /> */}
      {/* <div className='flex gap-4'>
        <Link to="./" >首頁</Link>
        <span>・</span>
        <span className='text-blue-800'>手工部落格</span>
      </div> */}

      {/* <Introduction /> */}
      <div className='flex items-center justify-between'>
        {/* titles */}
        <div className=''>
          <h1 className='text-gray-800 text-2xl md:text-5xl lg:text-6xl font-bold'>Keep Calm and Carry on.</h1>
          <p className='mt-8 text-md md:text-xl text-gray-500'>轉職工程師中，每天吃飯睡覺寫代碼抄筆記投履歷。本網站是練習MERN時架的部落格，為展示功能不同分類會寫個一兩篇。之後如果有時間，會拿來放學習筆記，或心路歷程，或是分享平常看的教學資源，總之物盡其用。</p>
        </div>
        {/* animated button */}
        <Link to="write" className='hidden md:block  relative'>
          <svg
            viewBox='0 0 200 200'
            width="200"
            height="200"
            className='text-lg tracking-wider animate-spin animatedButton'
            // className='text-lg tracking-wider'
          >
            <path
              id="circlePath"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              fill='none'
            />
            <text >
              <textPath href="#circlePath" startOffset="0%">Keep Going.</textPath>
              <textPath href="#circlePath" startOffset="50%" >Keep Coding.</textPath>
            </text>
          </svg>
          <button className='absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-blue-800 flex justify-center items-center rounded-full'>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill='white'>
              <g transform="scale(2)"><path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" /></g>
            </svg>
          </button>
        </Link>
      </div>

      {/* <Categories /> */}
      <MainCategories />

      {/* <FeaturedPosts /> */}
      <FeaturedPosts />

      {/* <PostList /> */}
      <div className=''>
        <h1 className='my-8 text-2xl text-gray-600 border-b-2 text-center'>近期文章</h1>
        <PostList />
      </div>
    </div>
  )
}

export default Homepage
