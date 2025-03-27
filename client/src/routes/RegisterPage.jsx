import { SignUp } from '@clerk/clerk-react'
import React from 'react'

const Register = () => {
  return (
    <div className='flex h-[calc(100vh-80px)] items-center justify-center'>
    <SignUp
     signInUrl='./login'
    />
</div>
  )
}

export default Register
