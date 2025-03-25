import express from "express";
import cors from "cors";
import pkg from "@mercadopago/sdk-react/esm/mercadoPago/initMercadoPago/index.js";
import toast from 'react-hot-toast';

const { MercadoPagoConfig, Preference } = pkg;

const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
const client = new MercadoPagoConfig({
    accessToken : accessToken,
});

const app = express();
const port = 5173;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>{
    res.send("Hola:)");
});

app.post("/create_preference", async(req, res) =>{
    try{
        const { cartItems, totalAmount } = req.body;
        if (!cartItems || !totalAmount) {
            return res.status(400).json({ error: "cartItems y totalAmount son requeridos" });
        }
        if (!Array.isArray(cartItems) || typeof totalAmount !== 'number') {
            return res.status(400).json({ error: "Formato de cartItems o totalAmount inválido" });
        }
        const body = {
            items:[
                {
                    cartItems: cartItems.map(item => {
                        if (!item.variantId || typeof item.variantId !== 'string') {
                            throw new Error("variantId inválido");
                        }
                        if (!item.id || typeof item.id !== 'string') {
                            throw new Error("id inválido");
                        }
                        if (typeof item.price !== 'number' || typeof item.stock !== 'number') {
                            throw new Error("price o stock inválido");
                        }
                        return {
                            variantId: item.variantId,
                            id: item.id,
                            quantity: item.quantity,
                            price: item.price,
                            stock: item.stock,
                            categoryId: item.categoryId,
                        };
                    }),
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
        if (error.message.includes("inválido")) {
            return res.status(400).json({ error: error.message });
        }
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