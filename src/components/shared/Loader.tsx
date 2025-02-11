import { TbFidgetSpinner } from "react-icons/tb"


export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
        <TbFidgetSpinner  className="animate-spin" size={70}/>
    </div>
  )
}
