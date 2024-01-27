import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { create } from "@web3-storage/w3up-client"
import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import PrisonAbi from "../../contracts/contractABI/prison.json"
import useGetStoredData from "./useGetStoredData"

const Index = () => {
  const queryClient = useQueryClient()
  const {
    loadPrisonersData,
    loadFundraisingProjects,
    setUpWeb3Storage,
    connectWalletHandler,
  } = useGetStoredData()

  //set up the eb3 bucket everytime the page loads
  useEffect(() => {
    setUpWeb3Storage()
  }, [])

  const connectWalletButton = () => {
    return (
      <div className="" style={{ display: "flex" }}>
        <div class="flex gap-1 justify-center items-center">
          <img
            height={20}
            width={20}
            src="https://cdn.discordapp.com/attachments/950584476658962473/1200663345628467230/Screenshot_from_2024-01-27_07-46-31-removebg-preview.png?ex=65c6ffe0&is=65b48ae0&hm=f845a232b54147695a74c38ce6219c1995b01f2f815a4fb564a043291cd5e735&"
            alt=""
          />
          <button onClick={connectWalletHandler} className="">
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }
  const imageUrl =
    "https://cdn.discordapp.com/attachments/950584476658962473/1200575122206101584/24301074482_b3feb1719d_z.jpg?ex=65c6adb6&is=65b438b6&hm=bf9ba48319e60761380ed6469547aad50bdee4960151f4ccf2be548aff63098f&"
  return (
    <div
      style={{
        backgroundColor: "#2D3348",
        minHeight: "90vh",
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        filter: "contrast(100%)",
        // height: "100vh",
      }}
      className="flex flex-col w-full mt-10 justify-center items-center rounded-lg min-h-screen px-4"
    >
      <div className="flex justify-between gap-4 flex-col items-center w-full pb-2 h-full">
        <div className="flex flex-col justify-center items-center text-xl px-2 gap-4">
          <h1 className="text-6xl bg-blue-500 "> HopeBlock </h1>

          <p className="text-md">
            Together, we can make a difference. <br /> Join our
            blockchain-powered platform to support the less privileged.
          </p>
        </div>
        <div className="flex gap-4 mt-2 justify-center">
          <div
            style={{ backgroundColor: "#2D3348" }}
            className="flex border  p-2 rounded-md"
          >
            {connectWalletButton()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
