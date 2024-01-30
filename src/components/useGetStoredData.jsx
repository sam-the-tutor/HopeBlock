import { useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"
import { create } from "@web3-storage/w3up-client"
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom"
import PrisonAbi from "../../contracts/contractABI/prison.json"
import MyTokenAbi from "../../contracts/contractABI/Mytoken.json"
const useGetStoredData = () => {
  const queryClient = useQueryClient()

  //contract address for the test token
  const myTokenContractAddress = "0xAEe74c4025E1E3eDAF2895FfE14CCf6c573dAc43"
  //contract address for the prison fundraising contract
  const prisonContractAddress = "0x2b7c8CaE47ea3748978BEA29D918f2670F5599E0"

  const [network, setNetwork] = useState(null)
  //check if the wallet is connected every time the aplication loads

  const navigate = useNavigate()

  async function loadPrisonersData(RealContract) {
    let totalPrisoners = []
    if (!RealContract) return
    try {
      //get the total number of prisoners stored in the contract
      const totalNumber = Number(await RealContract.getprisonersLength())

      for (let index = 0; index < totalNumber; index++) {
        //fetch the individual prisoners
        const results = await RealContract.readPrisoner(index)

        const DataValues = Object.values(results)
        totalPrisoners.push({
          address: DataValues[0],
          prisonerName: DataValues[1],
          prisonerImage: DataValues[2],
          prisonerDescription: DataValues[3],
          prisonerHospital: DataValues[4],
          billAmount: DataValues[5],
          isCleared: DataValues[6],
        })
      }

      queryClient.setQueryData(["allPrisonerData"], totalPrisoners)
    } catch (error) {
      console.log("error in getting the prisoners :", error)
    }
  }

  async function loadFundraisingProjects(PrisonContract) {
    let totalProjects = []
    try {
      if (!PrisonContract) return
      //get the total number of prisoners stored in the contract
      const totalNumber = Number(await PrisonContract.numbeOfProjects())
      // await PrisonContract.whitelistAddress()
      for (let index = 0; index < totalNumber; index++) {
        //fetch the individual prisoners
        const results = await PrisonContract.getAllProjects(index)
        const DataValues = Object.values(results)
        totalProjects.push({
          address: DataValues[0],
          projectTitle: DataValues[1],
          projectImage: DataValues[2],
          projectDescription: DataValues[3],
          projectGoal: DataValues[4],
          projectFunded: DataValues[5],
          projectEnded: DataValues[6],
        })
      }

      queryClient.setQueryData(["allProjects"], totalProjects)
    } catch (error) {
      console.log("error in getting the projects :", error)
    }
  }

  async function setUpWeb3Storage() {
    try {
      //create the web3 client
      const client = await create()
      //log in with your email
      const myAccount = await client.login("smartskillsweb3@gmail.com")
      //set the bucket(space) where all content uploads will be stored
      await client.setCurrentSpace(
        "did:key:z6MkqXuQNBGX3KJuvN5rRZjerfLvtBuUDWXGNiEH8wPP8cBq"
      )

      queryClient.setQueryData(["web3BucketStorage"], client)
    } catch (error) {
      console.log("error in setting up web3 storage :", error)
    }
  }

  const checkWalletIsConnected = async () => {
    const { ethereum } = window
    if (!ethereum) {
      console.log("Make sure you have metamask!")
      return
    } else {
      console.log("We have the ethereum object", ethereum)
    }
    const provider = new ethers.BrowserProvider(ethereum)
    const network = await provider.getNetwork()
    setNetwork(network.chainId)
    console.log(network.chainId)

    ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log("Found an account:", account)
      } else {
        console.log("No account found")
      }
    })
  }

  // //connect the wallet to the application
  const connectWalletHandler = () => {
    const { ethereum } = window
    if (!ethereum) {
      alert("Get MetaMask!")
      return
    }
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then(async (accounts) => {
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()

        const PrisonContract = new ethers.Contract(
          prisonContractAddress,
          PrisonAbi,
          signer
        )

        const TokenContract = new ethers.Contract(
          myTokenContractAddress,
          MyTokenAbi,
          signer
        )

        loadPrisonersData(PrisonContract)
        loadFundraisingProjects(PrisonContract)
        await queryClient.setQueryData(["tokenContract"], TokenContract)
        await queryClient.setQueryData(["contractObject"], PrisonContract)
        await queryClient.setQueryData(["userEthAddress"], accounts[0])
        navigate("/orphans")
      })
      .catch((err) => console.log(err))
  }

  return {
    loadPrisonersData,
    loadFundraisingProjects,
    setUpWeb3Storage,
    checkWalletIsConnected,
    connectWalletHandler,
  }
}

export default useGetStoredData
