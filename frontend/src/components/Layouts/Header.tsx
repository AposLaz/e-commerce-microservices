import Head from 'next/head'
import React from 'react'

const Header = ({titleHeader}: {titleHeader: string}) => {
    return (
    <Head>
        <title>{titleHeader}</title>
        <meta property="og:title" content={`Aplaz - ${titleHeader}`} key="title" />
    </Head>
  )
}

export default Header