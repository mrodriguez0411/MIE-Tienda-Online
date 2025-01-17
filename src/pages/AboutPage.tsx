export const AboutPage = () => {
  return (
    <div className="space-y-10">
      <h1 className="text-center text-4xl font-semibold tracking-tighter mb-5">
        Nuestra Empresa
      </h1>
      <div className="rounded-full overflow-hidden w-20">
      <img src="../../public/img/logo.jpg" alt="Imagen de fondo" className="w-full object-cover"/>
      </div>
      <div className="flkex flex-col gap-4 tracking-tighter leading-7 text-sm font-medium text-slate-900">
        <p>
          Somos una empresa familiar con más de 30 años de experiencia en el rubro de la librería y papelería. Nuestro
          objetivo es brindar a nuestros clientes una amplia variedad de productos de excelente calidad y al mejor precio
          del mercado.
        </p>
        <p>
          Contamos con un equipo de trabajo altamente capacitado para brindar asesoramiento personalizado y atención
          especializada a cada uno de nuestros clientes.
        </p>
        <p>
          Nuestra misión es satisfacer las necesidades de nuestros clientes, ofreciendo productos de calidad y un
          servicio de excelencia.
        </p>
        <h2 className="text-3xl font-semibold tracking-tighter mt-8 mb-4"> 
          MIE Tienda Online
        </h2>
        <p>
          Para mas información sobre nuestra empresa, no dudes en contactarnos a través de nuestro correo electrónico:<a href="mailto:contacto@mietiendaonine.com">contacto@mietiendaonine.com</a> o via telefónica al 011-1234-5678.
        </p>
      </div>
    </div>
  )
}
