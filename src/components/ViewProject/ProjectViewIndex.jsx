import { useMutation, useQuery } from "@tanstack/react-query"
import BigNumber from "bignumber.js"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useGetStoredData from "../useGetStoredData"

const ProjectViewIndex = () => {
  const { projectid } = useParams()
  const [projectDetails, setProjectDetails] = useState(null)
  const [contributeAmount, setContributeAmount] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { loadPrisonersData } = useGetStoredData()
  const prisonContractAddress = "0x2b7c8CaE47ea3748978BEA29D918f2670F5599E0"

  console.log(projectid)
  const { data: allProjectsData, isLoading: projectsDataLoading } = useQuery({
    queryKey: ["allProjects"],
  })

  const { data: PrisonContract } = useQuery({
    queryKey: ["contractObject"],
  })

  const { data: TokenContract } = useQuery({
    queryKey: ["tokenContract"],
  })

  useEffect(() => {
    console.log("hhhh", projectid, allProjectsData)
    if (!allProjectsData) return
    let dd = allProjectsData.filter((item, i) => i == projectid)
    setProjectDetails(dd)
  }, [projectid])

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
      const price = new BigNumber(contributeAmount).shiftedBy(18).toString()
      console.log(price)

      await TokenContract.approve(prisonContractAddress, price)
      await PrisonContract.contribute(projectid, price)
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log("erro in contributing :", error)
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
      <h2 className="text-3xl p-4">About Project</h2>

      <div className="flex flex-col justify-between items-center w-full gap-4 pb-2">
        {projectDetails && (
          <>
            <div className="flex w-1/2 mt-2">
              <img src={projectDetails[0]?.projectImage} alt="" />
            </div>
            <h2>{projectDetails[0]?.projectTitle}</h2>

            <div className="flex flex-col gap-1">
              <h2>Description</h2>
              <p>{projectDetails[0]?.projectDescription}</p>
            </div>
            <div>
              <h2>Proposed by</h2>
              <span>{projectDetails[0]?.address}</span>
            </div>
            <div>
              {Number(projectDetails[0]?.projectFunded) / 1e18} of{" "}
              {Number(projectDetails[0]?.projectGoal) / 1e18} FTR
            </div>
            <div>
              <input
                type="number"
                className="text-black rounded-md p-2"
                placeholder="enter amount to contribute"
                onChange={handleChange}
              />
            </div>
            <button
              onClick={() => HandleContribute}
              className="border p-2 rounded-md"
            >
              Contribute
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ProjectViewIndex
