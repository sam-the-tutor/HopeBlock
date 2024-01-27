import { useEffect, useState } from "react"
import "./App.css"
import { ethers } from "ethers"
import { create } from "@web3-storage/w3up-client"
import { Route, Routes } from "react-router-dom"
import SharedDashboard from "./components/SharedDashboard"
import PrisonerIndex from "./components/Prisoners/PrisonerIndex"
import FundraiseIndex from "./components/Fundraise/FundraiseIndex"
import Donations from "./components/Donations/Donations"
import Index from "./components/Index"
import PrisonerViewIndex from "./components/ViewPrisoner/PrisonerViewIndex"
import ProjectViewIndex from "./components/ViewProject/ProjectViewIndex"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SharedDashboard />}>
          <Route index element={<Index />} />
          <Route path="prisoners" element={<PrisonerIndex />} />
          <Route path="prisoners/:prisonerid" element={<PrisonerViewIndex />} />
          <Route path="fundraise" element={<FundraiseIndex />} />
          <Route path="fundraise/:projectid" element={<ProjectViewIndex />} />

          <Route path="donations" element={<Donations />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
