import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { nftaddresses, symbols } from "../config"
import { ethers } from 'ethers'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Image from '../../../components/Image'

import NFT from '../../contracts/NFT.json'

export default function Id() {

  // TODO: Remove transfer from here and put it in the all funds page

    const [nft, setNft] = useState([]) // Set default state
    const [symbol, setSymbol] = useState('ETH')
    const [loadingState, setLoadingState] = useState('not-loaded') // set loading state
    const router = useRouter()

    let id = router.query.id
    
    useEffect(() => {
      if(typeof(id) == 'string'){
        loadNFT(id)
      }
    }, [id])

    
    async function loadNFT(id) {
      const idInt = Number(id)
      const web3Modal = new Web3Modal()
      
      // Get connection and chain Id
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await provider.getNetwork()
      const chainId = network['chainId']
      setSymbol(symbols[chainId])

      
      // Get Contract Address
      let contractAddress = nftaddresses[chainId]
      const tokenContract = new ethers.Contract(contractAddress, NFT.abi, provider) // get token contract
      
      // Get and Clean Data
      const data = await tokenContract.nfts(idInt) // Use market contract function to  get data
      let { tokenURI, mintDate, attribute, id } = data
      const meta = await axios.get(tokenURI) // Get meta data 

      const items = [
        meta.data.name, // If using names and descriptions
        meta.data.description,
        Number(id),
        Number(attribute),
        getDateFromTimestamp(Number(mintDate)),
        meta.data.image
      ]

      setNft(items)
      setLoadingState('loaded') // Set loading state to loaded        
    }

    function getDateFromTimestamp(timestamp) {
        let date = new Date(timestamp*1000)
        date = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear()
        return date
      }

    
      
    if (loadingState != "loaded"){ 
      return null 
    }

    return(
        <div className="container justify-between px-5 mx-auto text-center md:text-left md:max-w-6xl font-roboto">
          <article className="flex flex-col py-20 mt-5 md:flex-row">
          <div className="md:mr-12">
              <Image unoptimized src={nft[3]} alt="Image" width={500} height={450} className="border-sm"/>
            </div>

          <div className="px-6 py-6 pt-8 mb-2 overflow-hidden bg-orange-100 rounded-xl md:w-1/2">
              <h1 href="#" className="mb-3 text-3xl font-bold leading-tight text-center font-work-sans text-cw-grey-800 md:text-left"
                >{nft[0]}
              </h1>
              <div className="leading-relaxed break-normal break-all md:mb-0 text-stretch lg:text-left">
                {nft[1]}
              </div>
              <div className="mt-2 mb-2">ID: {nft[2]}</div>
              <div className="mb-2">Attribute: {nft[3]} {symbol}</div>
              <div className="mb-2">Mint Date: {nft[4]}</div>
            </div>       
          </article>
      </div>

    ) 
}
