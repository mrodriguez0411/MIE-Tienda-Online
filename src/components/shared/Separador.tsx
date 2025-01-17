interface Props{
    className?: string;
}

export const Separador = ({className}: Props) => {
    return (
        <div className={`bg-cyan-200 h-0.5 my-5 ${className}`}></div>
    )
}