import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Image from '../components/Image'
import Link from 'next/link'
import { nftaddresses, symbols } from '../config'


import NFT from './contracts/NFT.json'


export default function Home() {


  return (
      <div className="container px-5 mx-auto text-center md:text-left md:max-w-6xl font-roboto">
        <p>Home Page</p>
      </div>

  )
}