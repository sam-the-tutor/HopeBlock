import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

const SharedDashboard = () => {
  return (
    <div className="flex w-full">
      <div className="flex w-1/6">
        <Sidebar />
      </div>
      <div className="w-5/6">
        <Outlet />
      </div>
    </div>
  )
}

export default SharedDashboard
