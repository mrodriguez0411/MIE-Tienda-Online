import { IoAddCircleOutline } from "react-icons/io5"
import { Link } from "react-router-dom"
import { TableProducts } from "../../components/dashboard"

export const DashboardProductsPage = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      <Link
        to='/dashboard/productos/new'
        className="bg-cyan-900 text-white flex items-center self-end py-[8px] px-3 rounded-md text-sm gap-1 font-semibold"
      >
          <IoAddCircleOutline className="inline-block" size={25}/>
          Agregar Producto  
      </Link>
      <TableProducts/>
    </div>
  )
}
