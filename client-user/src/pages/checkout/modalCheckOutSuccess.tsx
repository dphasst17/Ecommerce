import { ModalContent } from "@nextui-org/react"
import { StateContext } from "../../context/stateContext"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

const ModalCheckOutSuccess = () => {
    const { setListCheckOut } = useContext(StateContext)
    const navigate = useNavigate()
    return <ModalContent>
        {(__onClose) => <>
            <div
                className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
                <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">

                    <div className="my-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-14 shrink-0 fill-green-500 inline" viewBox="0 0 512 512">
                            <path
                                d="M383.841 171.838c-7.881-8.31-21.02-8.676-29.343-.775L221.987 296.732l-63.204-64.893c-8.005-8.213-21.13-8.393-29.35-.387-8.213 7.998-8.386 21.137-.388 29.35l77.492 79.561a20.687 20.687 0 0 0 14.869 6.275 20.744 20.744 0 0 0 14.288-5.694l147.373-139.762c8.316-7.888 8.668-21.027.774-29.344z"
                                data-original="#000000" />
                            <path
                                d="M256 0C114.84 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 470.487c-118.265 0-214.487-96.214-214.487-214.487 0-118.265 96.221-214.487 214.487-214.487 118.272 0 214.487 96.221 214.487 214.487 0 118.272-96.215 214.487-214.487 214.487z"
                                data-original="#000000" />
                        </svg>
                        <h4 className="text-xl text-gray-800 font-semibold mt-4">Your order has been placed</h4>
                    </div>

                    <button onClick={() => { setListCheckOut([]); navigate('/') }}
                        className="px-5 py-2.5 w-full rounded-lg text-white text-sm border-none outline-none bg-gray-800 hover:bg-gray-700">Got it</button>
                </div>
            </div>
        </>}
    </ModalContent>
}

export default ModalCheckOutSuccess