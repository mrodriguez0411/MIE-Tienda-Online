import { useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { IoMdClose } from "react-icons/io"
import { useGlobalStore } from "../../store/global.store";

export const Search = () => {

 const [searchTerm, setSearchTerm]  = useState('');
 const closeSheet = useGlobalStore(state => state.closeSheet);
  return (
    <>
      <div className="py-5 px-7 gap-10 items-center border-b border-cyan-200">
        <form 
        className="flex gap-3 items-center flex-1">

          <HiOutlineSearch size={22}/>
          <input 
            type="text"
            placeholder="¿Que deseas buscar?"
            className="outline-none w-full text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} />
        </form>
        <button onClick={closeSheet}>
          <IoMdClose size={22} className="text-black"/>
        </button>
      </div>
    
    
    </>
  )
}
