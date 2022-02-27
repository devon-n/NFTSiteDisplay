import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

// import { useForm } from 'react-hook-form'


export default function Contact() {

    // const { register, handleSubmit, errors, reset } = useForm()



  return (
        <div className="flex justify-center px-5 pt-16 mx-auto md:pt-6 font-roboto">
            <div className="flex flex-col w-3/4 pb-12 md:w-1/2">
                <p className="mb-3 text-3xl font-bold leading-tight text-center font-work-sans text-cw-grey-800">Contact Form</p>
                <input
                    placeholder="Name"
                    name="name"
                    // ref={register}
                    className="p-4 mt-8 border rounded"
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <input 
                    type="email" 
                    name="email"
                    // ref={register}
                    placeholder="Email Address"
                    className="p-4 mt-2 border rounded"
                    onChange={e => updateFormInput({ ...formInput, email: e.target.value })}
                />
                <textarea
                    name="query"
                    // ref={register}
                    placeholder="Please type your feedback or question."
                    className="p-4 mt-2 border rounded"
                    onChange={e => updateFormInput({ ...formInput, query: e.target.value })}
                />

                <button
                    className="p-4 mt-4 font-bold text-white bg-blue-500 rounded shadow-lg"
                >
                    Send
                </button>
            </div>
        </div>
  )
}
