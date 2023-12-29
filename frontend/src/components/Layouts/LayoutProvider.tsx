import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { LayoutProps } from '@/types/types'
import Header from './Header'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

const LayoutProvider = ({children}:LayoutProps) => {
    const router = useRouter()
    const {data: session} = useSession()
    const [titleHeader,setTitleHeader] = useState<string>('')
    useEffect(()=>{
      const titleHead = router.pathname.replace("/","").toLocaleUpperCase()
      setTitleHeader(titleHead);
      
      //set token in localstore
      if(session?.accessToken){
        sessionStorage.setItem('accessToken', session.accessToken)
      }

    },[router, session])
    
  return (
    <>
        <Header titleHeader={titleHeader}/>
        <Navbar />
        {children}
    </>
  )
}

export default LayoutProvider