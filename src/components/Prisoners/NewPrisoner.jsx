import React, { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { PropagateLoader } from "react-spinners"
import { IoMdClose, IoMdNotificationsOutline } from "react-icons/io"
// import { backend } from "../../declarations/backend"

import { IoAdd } from "react-icons/io5"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useGetStoredData from "../useGetStoredData"
import BigNumber from "bignumber.js"

function NewPrisonerModal() {
  const { data: userAddress } = useQuery({
    queryKey: ["userEthAddress"],
  })
  const { data: PrisonContract } = useQuery({
    queryKey: ["contractObject"],
  })

  const { data: Web3Bucket } = useQuery({
    queryKey: ["web3BucketStorage"],
  })

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const [prisonerImage, setPrisonerImage] = useState(null)
  const { loadPrisonersData } = useGetStoredData()

  async function saveAccountDetails(data) {
    try {
      setIsLoading(true)

      //upload the image to the web3 storage
      if (!prisonerImage) {
        alert("please select image")
        return
      }
      const directoryCid = await Web3Bucket.uploadFile(prisonerImage)
      const imageUrl = `https://${directoryCid.toString()}.ipfs.w3s.link`

      //upload the data to the smart contract
      if (!PrisonContract) {
        alert("conect your wallet")
        return
      }
      const price = new BigNumber(data.newPrice).shiftedBy(18).toString()

      // await PrisonContract.whitelistAddress()
      await PrisonContract.writePrisoner(
        data.newPatientName,
        imageUrl,
        data.newPatientDescription,
        data.newLocation,
        price
      ).then((res) => {
        console.log("new prisoner sav :", res)
      })

      return "res"
    } catch (error) {
      console.log(error)
      alert("you are not whitelisted")
    }
  }

  const { mutateAsync: saveSinglePost } = useMutation({
    mutationFn: (data) => saveAccountDetails(data),
    onSuccess: async () => {
      // queryClient.invalidateQueries(["allPrisonerData"])
      await loadPrisonersData(PrisonContract)
      setIsLoading(false)
    },
  })

  console.log("USER IMAGE :", prisonerImage)
  const handleFileInput = async (event) => {
    const files = event.target.files
    setPrisonerImage(files[0])
    console.log("Uploaded files :", files[0])
  }

  return (
    <div className=" flex flex-col justify-center items-center w-full">
      <div
        onClick={() => setIsOpen(true)}
        type="submit"
        className="p-2  justify-center hover:cursor-pointer hover:shadow-sm hover:shadow-black text-xl mt-4 shadow-md shadow-black flex gap-1 hover:bg-yellow-500 items-center"
      >
        Add New
      </div>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto ">
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-80 transition-opacity"
              aria-hidden="true"
            ></div>
            <div
              style={{ backgroundColor: "#11131f" }}
              className="rounded-lg overflow-hidden relative shadow-xl flex flex-col justify-center items-center transform transition-all sm:max-w-md sm:w-full"
            >
              <div className="mt-2 flex w-full justify-end mr-6 text-white">
                <IoMdClose
                  size={25}
                  className="hover:cursor-pointer"
                  onClick={() => setIsOpen(false)}
                />
              </div>
              <Formik
                initialValues={{
                  newPatientName: "",
                  newPatientDescription: "",
                  newLocation: "",
                  newPrice: 0,
                }}
                validate={(values) => {
                  const errors = {}

                  if (!values.newPatientName) {
                    errors.newPatientName = "name is empty"
                  }
                  if (!values.newPatientDescription) {
                    errors.newPatientDescription = "description is empty"
                  }
                  if (!values.newLocation) {
                    errors.newLocation = "location is empty"
                  }
                  if (!values.newPrice === 0) {
                    errors.newPrice = "bill amount is zero"
                  }
                  return errors
                }}
                //save the data in the backend
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await saveSinglePost(values)
                  } catch (error) {
                    console.log("error in saving single post", error)
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="flex  p-6 flex-col gap-4 w-3/4 justify-center items-center text-black">
                    <h1 className="mt-2 text-white border-b-2 gap-4  pb-1 flex w-full justify-center items-center text-xl">
                      <span>New Prisoner Details</span>
                    </h1>
                    <div className="flex-col gap-1 w-full">
                      <Field
                        as="textarea"
                        type="text"
                        name="newPatientName"
                        placeholder="name"
                        className="rounded-md h-8 w-full"
                      />
                      <ErrorMessage
                        name="newPatientName"
                        component="span"
                        className="text-white bg-red-500 p-1"
                      />
                    </div>
                    <div className="flex-col gap-1 w-full">
                      <Field
                        as="textarea"
                        type="text"
                        name="newPatientDescription"
                        placeholder="description"
                        className="rounded-md h-8 w-full"
                      />
                      <ErrorMessage
                        name="newPatientDescription"
                        component="span"
                        className="text-white bg-red-500 p-1"
                      />
                    </div>
                    <div className="flex-col gap-1 w-full">
                      <Field
                        as="textarea"
                        type="text"
                        name="newLocation"
                        placeholder="address"
                        className="rounded-md h-8 w-full"
                      />
                      <ErrorMessage
                        name="newLocation"
                        component="span"
                        className="text-white bg-red-500 p-1"
                      />
                    </div>
                    <div className="flex-col gap-1 w-full">
                      <Field
                        as="textarea"
                        type="number"
                        name="newPrice"
                        placeholder="bill amount"
                        className="rounded-md h-8 w-full"
                      />
                      <ErrorMessage
                        name="newPrice"
                        component="span"
                        className="text-white bg-red-500 p-1"
                      />
                    </div>
                    {/* upload the image */}
                    <div className="flex text-white w-full justify-center items-center">
                      <input type="file" multiple onChange={handleFileInput} />
                    </div>

                    {userAddress ? (
                      <button
                        type="submit"
                        style={{
                          boxShadow: "0px 2px transparent",
                        }}
                        className="rounded-md border text-white text-2xl hover:bg-yellow-500 w-1/2 mb-4"
                      >
                        {isLoading ? (
                          <PropagateLoader color="#36d7b7" />
                        ) : (
                          "Upload"
                        )}
                      </button>
                    ) : (
                      <button>connect wallet</button>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewPrisonerModal
