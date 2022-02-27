import '../styles/globals.css'
import Link from 'next/link'
import Nav from '../components/Nav.js'
import Meta from '../components/Meta.js'
import { useState } from 'react'
import { ethers } from 'ethers'
import {nftaddresses, symbols } from '../config'

function MyApp({ Component, pageProps }) {

  return (
  <div>
    <Meta />
    <Nav />
    <Component {...pageProps} />
  </div>
  )
}

export default MyApp
