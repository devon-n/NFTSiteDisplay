import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import axios from 'axios'
import Link from 'next/link'
import Image from '../components/Image'
import { nftaddresses, symbols } from '../config'


import NFT from './contracts/NFT.json'


export default function MyAssets() { 
  
    const [nfts, setNfts] = useState([])
    const [symbol, setSymbol] = useState('ETH')
    const [to, updateToAddress] = useState(0)
    const [loadingState, setLoadingState] = useState('not-loaded')
    
    useEffect(() => {
        loadNFTs()
    }, [])


    async function loadNFTs() {
      if(window.ethereum){
        const accounts = await window.ethereum.request({method: "eth_requestAccounts"})

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()


        // Get connection and chain Id
        const network = await provider.getNetwork()
        const chainId = network['chainId']
        console.log(symbols)
        setSymbol(symbols[chainId])

        // Get Contract Address
        try {
            let contractAddress = nftaddresses[chainId]
            const tokenContract = new ethers.Contract(contractAddress, NFT.abi, provider) // get token contract
            const data = await tokenContract.getNFTs() // Get all NFTs

            const items = await Promise.all(data.map(async i => { // Loop through NFT's to get all data
              const tokenUri = await tokenContract.tokenURI(i.id.toNumber())
              const meta = await axios.get(tokenUri)
              let item = {
                id: i.id.toNumber(),
                mintDate: i.mintDate.toNumber(),
                attribute: i.attribute.toNumber(),
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
              }

              // Check if owner of nft is the connected account
              const owner = await tokenContract.ownerOf(item.id)

              // Return each nft to an array if its the right owner
              if(owner.toLowerCase() == accounts[0]) {
                return item 
              }
              
            }))
            
            // Filter out null items
            const filteredItems = items.filter(element => {
              return element != null
            })

            setNfts(filteredItems) // Set NFT's from array items
            setLoadingState('loaded') // Set loading state to loaded

        } catch (err) {
          console.log(err)
            alert("Please change your network to one that supports us. You can find them on our home page")
        }
      } else {
        alert('Please install metamask to use view the NFTs.')
      }

      }


      // Transfer NFT
      async function transfer(to, id) {
        const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection) // get provider
        const signer = provider.getSigner()

        // Get connection and chain Id
        const network = await provider.getNetwork()
        const chainId = network['chainId']
        
        let contractAddress = nftaddresses[chainId]
        const tokenContract = new ethers.Contract(contractAddress, NFT.abi, signer) // get token contract

        try {
          let tx = await tokenContract.transferFrom(accounts[0], to, id)
          await tx.wait()
        } catch (err) {
          console.log(err)
        }
      }

      function getDateFromTimestamp(timestamp) {
        let date = new Date(timestamp*1000)
        date = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear()
        return date
      }
      

      if (loadingState == 'loaded' && nfts.length < 0) return (
          <h1 className="px-20 py-10 text-3xl">No NFTs owned</h1>
      )
        
      return (
        <div className="flex justify-center px-5 pt-16 mx-auto py-14 md:py-8 font-roboto">
            <div className="px-4">
                <div style={{"maxWidth": "1600px" }} className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="overflow-hidden border shadow rounded-xl">
                              <Link href={`/funds/${Number(nft.id)}`} passHref key={i} >
                                <div>
                                  <Image unoptimized width={400} height={350} className='cursor-pointer rounded-t-xl'src={nft.image} alt="image"/>
                                </div>
                              </Link>
                                
                                <div className="h-full p-4 -mt-2 bg-orange-100">
                                    <p className="text-2xl font-bold">{nft.name}</p> 
                                    <p className="text-l">Mint Date - {getDateFromTimestamp(nft.mintDate)}</p> 
                                    <p className="text-l">ID: {nft.id} {symbol}</p>
                                    <input 
                                      type="text" 
                                      name="toAddress"
                                      placeholder="Address to send NFT to"
                                      className="w-full p-4 mt-2 mb-2 border rounded"
                                      onChange={e => updateToAddress(e.target.value)}
                                    />
                                    <button
                                      className="bottom-0 w-full py-2 font-bold text-white bg-orange-400 rounded hover:bg-orange-300"
                                      onClick={transfer(to, nft.id)}>
                                      Transfer
                                    </button>
                                </div>
                                
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
      )
}