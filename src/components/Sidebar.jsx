import React from "react"
import { Link } from "react-router-dom"
import { MdDashboard } from "react-icons/md"
import { IoArrowBackOutline } from "react-icons/io5"
import { IoArrowForwardOutline } from "react-icons/io5"
import { useQuery } from "@tanstack/react-query"
import { FaDonate } from "react-icons/fa"
import { RiFundsLine } from "react-icons/ri"
import { FaPeopleLine } from "react-icons/fa6"
import { IoIosHome } from "react-icons/io"
import { SiBlockchaindotcom } from "react-icons/si"
const Sidebar = () => {
  const { data: userAddress } = useQuery({
    queryKey: ["userEthAddress"],
  })
  const { data: PrisonContract } = useQuery({
    queryKey: ["contractObject"],
  })
  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <h2 className="text-4xl">
        <Link to="/">
          <SiBlockchaindotcom />
        </Link>
      </h2>
      {/* the tabs */}
      <div className="justify-center align-center mt-4">
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <IoIosHome className="mt-1" />

          <Link to="/">Home</Link>
        </div>
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <FaPeopleLine className="mt-1" />

          <Link to="./prisoners">Orphans</Link>
        </div>

        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <RiFundsLine />
          <Link to="./fundraise">Fundraise</Link>
        </div>
        <div className="flex items-center p-2 gap-4 hover:bg-yellow-500">
          <FaDonate />
          <Link to="./donations">My Projects</Link>
        </div>

        <div className="flex mt-10">
          {userAddress && (
            <button
              onClick={() => PrisonContract?.whitelistAddress()}
              className="flex border p-2 rounded-md justify-center items-center"
            >
              Join whitelist
            </button>
          )}
        </div>

        {/* <div className="mt-8">
          {userAddress && (
            <div>
              <span>{userAddress}</span>
              <button>Disconnect</button>
            </div>
          )}
        </div> */}
      </div>
    </div>
  )
}

export default Sidebar
