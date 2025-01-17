const brands = [
    {
        img: '/img/brands/Rivadavia.png',
        alt:'Rivadavia',
    },
    {
        img: '/img/brands/Bic.png',
        alt:'Bic',
    },
    {
        img: '/img/brands/Laprida.png',
        alt:'Laprida',
    },
    {
        img: '/img/brands/Maped.png',
        alt:'Maped',
    },
    {
        img: '/img/brands/Faber1.png',
        alt:'Faber',
    },
    {
        img: '/img/brands/Triunfante.png',
        alt:'Triunfante',
    },
]

export const Brands = () => {
  return (
    <div className="flex flex-col items-center gap-3 pt-16 pb-12">
        <h2 className="font-bold text-2xl">Marcas Disponibles</h2>
        <div className="grid grid-cols-3 gap-6 mt-8 items-center md:grid-cols-6">
            {brands.map((brand, index) => (
                <div key={index}>
                    <img src={brand.img} alt={brand.alt} />
                </div>
            ))}
        </div>
    </div>

  )
}
