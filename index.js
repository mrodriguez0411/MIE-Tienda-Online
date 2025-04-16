import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "@mercadopago/sdk-react/esm/mercadoPago/initMercadoPago";
import toast from 'react-hot-toast';

const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
const client = new MercadoPagoConfig({
    accessToken : accessToken,
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (res) =>{
    res.send("Hola:)");
});

app.post("/create_preference", async(res) =>{
    try{
        const body = {
            items:[
                {
                    cartItems: cartItems.map(item => ({
                        variantId: item.body.variantId,
                        quantity: item.body.quantity,
                        price: item.body.price,
                    })),
                    totalAmount,
                },
            ],
            backs_urls: {
                success: "/",
                failure: "/",
                pending: "<isLoader>",
            },
            auto_return: "approver",
        };
        const preference = new Preference(client);
        const result = await preference.create({body});
        res.json({
            id:result.id,
        });
    } catch (error){
        toast.error('Producto agotado', {
                position: 'bottom-right',
              });
    }
});

app.listen(port, ()=>{
    toast.error(`El servidor esta corriendo en el puerto: ${port}`, {
        position: 'bottom-right',
      });
})