import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { fundraiseData, shortenString } from "../functions"
import NewPrisonerModal from "./NewProject"
import BigNumber from "bignumber.js"
import { Link } from "react-router-dom"
// 0x5172ee135f49fc3b6f4a50223891fc3f373a5098
const PrisonerIndex = () => {
  const prisonContractAddress = "0x2b7c8CaE47ea3748978BEA29D918f2670F5599E0"

  const [buttonID, setButtonId] = useState(null)
  const queryClient = useQueryClient()
  const { data: userAddress } = useQuery({
    queryKey: ["userEthAddress"],
  })

  const { data: PrisonContract } = useQuery({
    queryKey: ["contractObject"],
  })
  const { data: TokenContract } = useQuery({
    queryKey: ["tokenContract"],
  })

  const { data: allProjectsData, isLoading: projectsDataLoading } = useQuery({
    queryKey: ["allProjects"],
  })

  console.log("all projects :", allProjectsData)
  async function clearPrisonersBill(data) {
    // setIsLoading(true)
    // console.log(data, TokenContract)
    if (!TokenContract) alert("no contract")
    //approve the contract to deduct funds on your behalf
    const price = new BigNumber(data.kk / 1e18).shiftedBy(18).toString()
    console.log(price)
    // console.log(data.kk / 1e18)
    await TokenContract.approve(prisonContractAddress, price)
    await PrisonContract.payPrisonerBills(4)

    return "res"
  }

  const { mutateAsync: ClearBills } = useMutation({
    mutationFn: (data) => clearPrisonersBill(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["completedUploads"])
      // setIsLoading(false)
    },
  })

  return (
    <div
      style={{ backgroundColor: "#2D3348", minHeight: "90vh" }}
      className="flex flex-col w-full mt-10 rounded-lg min-h-screen px-4"
    >
      <div className="flex flex-col justify-between items-center w-full pb-2">
        {/* <div className="w-full flex justify-between gap-10 items-center text-center text-xl px-2 text-bold">
          <h2>Projects</h2>
          <div>
            {userAddress && (
              <div className="gap-2 flex">
                <span>{shortenString(userAddress)}</span>
                <button>Disconnect</button>
              </div>
            )}
          </div>
        </div> */}
        {/* new prisoners and display prisoners */}
        <div className="flex flex-col justify-center items-center w-full">
          <NewPrisonerModal />
        </div>
      </div>
      <div className="flex w-full gap-2 justify-center items-center">
        {projectsDataLoading ? (
          <div>loading....</div>
        ) : allProjectsData?.length > 0 ? (
          allProjectsData.map((data, index) => {
            return (
              <div
                key={index}
                className="flex flex-col border rounded-md w-1/4 justify-between pb-2 items-center shadow-md shadow-black mt-8"
              >
                <div className="flex-col justify-between items-center gap-2">
                  <Link to={`${index.toString()}`}>
                    <img src={data.projectImage} alt="" />
                  </Link>
                </div>
                <Link to={`${index.toString()}`}>
                  <div>{data.projectTitle}</div>
                </Link>

                <div>
                  {Number(data?.projectFunded) / 1e18} of{" "}
                  {Number(data?.projectGoal) / 1e18} FTR
                </div>
              </div>
            )
          })
        ) : (
          <div>No Data at the moment</div>
        )}
      </div>
    </div>
  )
}

export default PrisonerIndex
