import { useMutation, useQuery } from "@tanstack/react-query"
import BigNumber from "bignumber.js"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useGetStoredData from "../useGetStoredData"

const PrisonerViewIndex = () => {
  const { prisonerid } = useParams()
  const [projectDetails, setProjectDetails] = useState(null)
  const [contributeAmount, setContributeAmount] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { loadPrisonersData } = useGetStoredData()
  const prisonContractAddress = "0x2b7c8CaE47ea3748978BEA29D918f2670F5599E0"

  console.log(prisonerid)
  const { data: allPrisonersData, isLoading: projectsDataLoading } = useQuery({
    queryKey: ["allPrisonerData"],
  })

  const { data: PrisonContract } = useQuery({
    queryKey: ["contractObject"],
  })

  const { data: TokenContract } = useQuery({
    queryKey: ["tokenContract"],
  })

  useEffect(() => {
    console.log("hhhh", prisonerid, allPrisonersData)
    if (!allPrisonersData) return
    let dd = allPrisonersData.filter((item, i) => i == prisonerid)
    setProjectDetails(dd)
  }, [prisonerid])

  async function handleChange(e) {
    setContributeAmount(e.target.value)
  }
  console.log(contributeAmount)

  async function saveAccountDetails(data) {
    try {
      setIsLoading(true)

      //upload the data to the smart contract
      if (!PrisonContract) {
        alert("conect your wallet")
        return
      }
      const price = new BigNumber(data).shiftedBy(18).toString()
      console.log(price)

      await TokenContract.approve(prisonContractAddress, data)
      await PrisonContract.payPrisonerBills(prisonerid)
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log("erro in clearing prisoner bills :", error)
        })

      // await PrisonContract.contribute(
      //   projectid,contributeAmount
      // ).then((res) => {
      //   console.log("new prisoner sav :", res)
      // })

      return "res"
    } catch (error) {
      console.log(error)
      alert("you are not whitelisted")
    }
  }

  const { mutateAsync: HandleContribute } = useMutation({
    mutationFn: (data) => saveAccountDetails(data),
    onSuccess: async () => {
      // queryClient.invalidateQueries(["allPrisonerData"])
      await loadPrisonersData(PrisonContract)
      setIsLoading(false)
    },
  })

  return (
    <div
      style={{ backgroundColor: "#2D3348", minHeight: "90vh" }}
      className="flex flex-col w-full mt-10 rounded-lg min-h-screen px-4"
    >
      <h2 className="text-3xl p-4">Details Page</h2>
      <div className="flex flex-col justify-start items-center w-full gap-4 pb-2">
        {projectDetails && (
          <>
            <div className="flex rounded-md">
              <img
                height={100}
                width={700}
                src={projectDetails[0]?.prisonerImage}
                alt=""
              />
            </div>

            {/* <div className="flex flex-col"> */}
            <h2>Name : {projectDetails[0]?.prisonerName} </h2>

            {/* <h2>{projectDetails[0]?.prisonerName}</h2> */}
            {/* </div> */}
            <div className="flex flex-col">
              <h2>Description</h2>
              <p>{projectDetails[0]?.prisonerDescription}</p>
            </div>
            <div>
              <h2>Proposed by</h2>
              <span>{projectDetails[0]?.address}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span>Amount required:</span>
              {Number(projectDetails[0]?.billAmount) / 1e18} FTR
            </div>

            <button
              onClick={() => HandleContribute(projectDetails[0]?.billAmount)}
              className="border p-2 rounded-md"
            >
              Pay {Number(projectDetails[0]?.billAmount) / 1e18} FTR
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PrisonerViewIndex
