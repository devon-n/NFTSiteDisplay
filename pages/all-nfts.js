
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Link from 'next/link'
import Image from '../components/Image'
import { nftaddresses, symbols } from '../config'

import NFT from './contracts/NFT.json'


export default function Home() {

  const [nfts, setNfts] = useState([]) // Set default state
  const [symbol, setSymbol] = useState('ETH')
  const [loadingState, setLoadingState] = useState('not-loaded') // set loading state

  useEffect(() => {
    
    loadNFTs() // Load NFT's on start
  }, [])


  async function loadNFTs() {
    if(window.ethereum){
      const web3Modal = new Web3Modal()
    
      // Get connection and chain Id
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await provider.getNetwork()
      const chainId = network['chainId']

      // Get Contract Address
      let contractAddress = nftaddresses[chainId]
      setSymbol(symbols[chainId])
      const tokenContract = new ethers.Contract(contractAddress, NFT.abi, provider) // get token contract

      const data = await tokenContract.getFunds() // Use market contract function to  get data
      const items = await Promise.all(data.map(async i => { // Loop through NFT's to get all data
        
        const tokenUri = await tokenContract.tokenURI(i.id.toNumber())
        const meta = await axios.get(tokenUri) // Get meta data 
        let item = {
          id: i.id.toNumber(),
          mintDate: getDateFromTimestamp(i.mintDate.toNumber()),
          attribute: i.attribute.toNumber(),
          image: meta.data.image,
          // name: meta.data.name,
          // description: meta.data.description,
        }
        return item // Return each nft to an array
      }))
      
      setNfts(items) // Set NFT's from array items
      setLoadingState('loaded') // Set loading state to loaded
    } else {
        alert('Please install metamask to view all crowd funds.')
    }
    
  }

  function getDateFromTimestamp(timestamp) {
    let date = new Date(timestamp*1000)
    date = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear()
    return date
  }
  
  if (loadingState === 'loaded' && nfts.length < 1) return (
    <h1 className="px-20 py-10 text-3xl">There are no NFT's at the moment. Create one on the create page.</h1>
  )

  return (
    <div className="flex justify-center px-5 pt-16 mx-auto py-14 md:py-8 font-roboto">
      <div className="px-4">
        <div style={{"maxWidth": "1600px" }} className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {
            nfts.map((nft, i) => (
              <Link href={`/funds/${Number(nft.id)}`} passHref key={i} >
                <div className="w-3/4 ml-16 overflow-hidden border shadow sm:ml-0 md:ml-16 lg:ml-0 sm:w-auto rounded-xl">

                <Image unoptimized src={nft.image} width={400} height={350} className='cursor-pointer rounded-t-xl' alt="image"/> 

                <div className="h-auto p-4 -mt-2 overflow-hidden bg-orange-100 ">
                  <p className="text-2xl font-semibold">NFT Name</p>
                  <div >
                    <p className="text-gray-400 truncate max-h-24">NFT Description</p>
                    <p className="font-semibold text-gray-400">ID: {nft.id} {symbol}</p>
                    <p className="font-semibold text-gray-400">Mint Date: {nft.mintDate} {symbol}</p>
                    <p className="font-semibold text-gray-400">Attribute: {nft.attribute}</p>
                  </div>
                  <button
                      className="w-full py-2 mt-2 font-bold text-white bg-orange-400 rounded hover:bg-orange-300" 
                      >View
                  </button>
                </div>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  )
}
