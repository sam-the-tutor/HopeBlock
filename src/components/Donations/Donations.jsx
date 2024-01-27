import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Donations = () => {
  const [projectData, setProjectData] = useState(null)
  const [entryData, setEntryData] = useState(null)
  const { data: allProjectsData, isLoading: projectsDataLoading } = useQuery({
    queryKey: ["allProjects"],
  })
  const { data: userAddress } = useQuery({
    queryKey: ["userEthAddress"],
  })
  const { data: allPrisonerData, isLoading: prisonerDataLoading } = useQuery({
    queryKey: ["allPrisonerData"],
  })

  useEffect(() => {
    if (!prisonerDataLoading && userAddress) {
      setEntryData(
        allPrisonerData?.filter(
          (item, i) => item.address.toLowerCase() === userAddress?.toString()
        )
      )
    }
  }, [prisonerDataLoading, userAddress])

  useEffect(() => {
    if (!projectsDataLoading && userAddress) {
      let ff = allProjectsData?.filter(
        (item, i) => item.address.toLowerCase() === userAddress.toString()
      )
      setProjectData(ff)
    }
  }, [projectsDataLoading, userAddress])
  console.log("entries :", entryData)
  return (
    <div
      style={{ backgroundColor: "#2D3348", minHeight: "90vh" }}
      className="flex flex-col w-full mt-10 rounded-lg min-h-screen px-4"
    >
      <div className="flex justify-between items-center w-full pb-2">
        <div className="flex w-full justify-center items-center text-xl px-2 text-bold">
          <div className="flex flex-col p-4 w-full justify-center items-center overflow-y-auto">
            <div className="flex flex-col border-b-2 w-full">
              <span className="text-sm p-2">
                Address : {userAddress?.toString()}
              </span>
            </div>

            <h2 className="text-2xl mt-6">My Projects</h2>
            {/* display projects */}
            <div className="flex gap-2">
              {projectData &&
                projectData.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col border rounded-md w-1/4 justify-between pb-2 items-center shadow-md shadow-black mt-4"
                    >
                      <div className="flex-col justify-between items-center gap-2">
                        <Link to={`../fundraise/${index.toString()}`}>
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
                      <div>
                        {Number(data?.projectFunded) >=
                        Number(data?.projectGoal) ? (
                          <div className=" text-green-600">ended</div>
                        ) : (
                          <div className=" p-1 text-yellow-300">ongoing</div>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
            {/* display entries */}
            <h2 className="text-2xl mt-4">Entries</h2>
            <div>
              {entryData &&
                entryData.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col border rounded-md w-1/4 justify-between pb-2 items-center shadow-md shadow-black mt-8"
                    >
                      <Link to={`${index.toString()}`}>
                        <img width="100%" src={data.prisonerImage} alt="" />
                      </Link>
                      <div className="flex gap-2 mt-4 w-full justify-between px-4 items-center">
                        <div>{data.prisonerName}</div>
                        <div>{data.prisonerHospital}</div>
                      </div>
                      <div>
                        {data.isCleared ? (
                          <div className=" text-green-600">ended</div>
                        ) : (
                          <div className=" p-1 text-yellow-300">ongoing</div>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Donations
