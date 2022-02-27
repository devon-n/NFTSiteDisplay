import { ethers } from 'ethers'
import { useState } from 'react'
import {create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import Image from '../components/Image'
import { nftaddresses, symbols } from '../config'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import NFT from './contracts/NFT.json'


export default function CreateItem () {
    const [fileUrl, setFileUrl] = useState(null) // Set state to null
    const [formInput, updateFormInput] = useState({ name: '', description: '', attribute: ''})
    const router = useRouter()


    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
        } catch (e) {
            console.log(e)
        }
    }

    async function createItem() {
        const { name, description, attribute } = formInput // Get vars from the form

        if (!name || !description || !attribute || !fileUrl) return // error if one of the forms inputs are empty
        const data = JSON.stringify({
            name, description, attribute, image: fileUrl // Convert Json to strings of form inputs
        })

        try {
            const added = await client.add(data) // Upload to IPFS
            const url = `https://ipfs.infura.io/ipfs/${added.path}` // Set url with the data inputted
    
            createSale(name, description, attribute, url) // function to create sale with url
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createSale(name, description, goal, endDate, url) {
        const web3Modal = new Web3Modal() // get web3modal
        const connection = await web3Modal.connect() // connect using web3
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() // get signer

        // Convert Goal to Ether
        const goalEther = ethers.utils.parseUnits(goal.toString(), 'wei')

        try {
            // Get connection and chain Id
            const network = await provider.getNetwork()
            const chainId = network['chainId']

            // Get Contract Address
            let contractAddress = nftaddresses[chainId]
            const tokenContract = new ethers.Contract(contractAddress, NFT.abi, signer) // get token contract

            // Convert date to timestamp
            let date = new Date(endDate)
            let timestamp = date.getTime() / 1000

            
            // Send transaction
            let transaction = await tokenContract.mint(
                timestamp, goalEther, url
            )
            await transaction.wait() // wait for transaction
            router.push('/your-funds')
        } catch (err) {
            console.log(err.code)
            if(err.code !== 4001){
                alert("Error: Contract not found. Please change your network to one that supports CryptoFundMe. You can find them on our home page")
            }
        }

    }

    return (
        <div className="flex justify-center px-5 pt-16 mx-auto md:pt-0 font-roboto">
            <div className="flex flex-col w-1/2 pb-12">
                <input
                    placeholder="Fund Name"
                    className="p-4 mt-8 mb-4 border rounded"
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <textarea
                    placeholder="Fund Description"
                    className="p-4 mt-2 border rounded"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input 
                    type="number" 
                    name="attribute"
                    placeholder="Attribute"
                    className="p-4 mt-2 border rounded"
                    onChange={e => updateFormInput({ ...formInput, attribute: e.target.value })}
                />
                <p className="p-4 mt-2 font-bold">End Date (UTC)</p>
                <p className="mt-2 text-xs">As photos use decentralized storage, we recommend you use smaller size files to load faster</p>
                <input
                    type="file"
                    name="Asset"
                    className="my-4"
                    onChange={onChange}
                />
                {
                    fileUrl && (
                        <Image unoptimized width={300} height={350} className="mt-4 rounded" src={fileUrl} alt="image" />
                    )
                }
                <button
                    onClick={createItem}
                    className="p-4 mt-4 font-bold text-white bg-orange-500 rounded shadow-lg"
                >
                    Mint
                </button>
            </div>
        </div>
    )

}