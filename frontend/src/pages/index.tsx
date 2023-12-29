'use client'

import Head from 'next/head'
import styles from '@/styles/Home.module.css'


export default function Home() {
  const ErrorFetch = async ()=>{
    const res = await fetch(`http://${process.env.AUTH_URL!}/test`);
    const json = await res.json();
    console.log(json)
  }

  return (
    <>
      <Head>
        <title>Aplaz E-Commerce</title>
        <meta name="description" content="E-Commerce Microservices Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <button onClick={ErrorFetch}>Hello</button>
      </main>
    </>
  )
}


