//import { inputRules } from "@tiptap/pm/inputrules"
import { Separador } from "../shared/Separador";

/* EN caso de hacer que busque por marcas disponibles
Armo este ejemplo para cuando haga bien la base de datos y porque se va a poder filtrar*/
const avialableBrands = [
    'Bic',
    'Faber Castell',
    'Laprida',
    'Maped',
    'Pizzini',
    

];

interface Props {
    selectedTypes : string[];
    setSelectedTypes: (types : string[]) => void;
}



export const ContainerFilter = ({selectedTypes , setSelectedTypes} 
    : Props) => {
    const handleTypeChange = (type: string) =>{
        if(selectedTypes.includes(type)){
            setSelectedTypes(selectedTypes.filter(b=>b !==type));
    }else{
        setSelectedTypes([...selectedTypes, type]);
    }
};
    return (
    <div className="p-5 border border-cyan-300 rounded-lg h-fit col-span-2 lg:col-span-1"> 
        <h3 className="font-semibold text-xl text-black">
            Filtros
        </h3>
        {/*Separador*/}
        <Separador/>
        <div className="flex.flex-col.gap3">
            <h3 className="text-lg font-medium text-black">
                Marcas
            </h3>
            <div className="flex flex-col gap-2">
                {avialableBrands.map(type => (
                    <label key={type} className="inline-flex items-center">
                    <input type= 'checkbox' className="text-black border-black focus:ring-black accent-black" 
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}/>
                    <span className="ml-2 text-black text-sm cursor-pointer">
                        {type}
                    </span>
                    </label>
                ))}
            </div>

        </div>

    </div>

)};