import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { CiMail } from "react-icons/ci";


export const navbarLinks = [
    {
        id: 1,
        text: "Inicio",
        url: "/",
    },
    {
        id: 2,
        text: "Productos",
        url: "/productos",
    },
    {
        id: 3,
        text: "Sobre Nosotros",
        url: "/nosotros",
    },
];

export const socialLinks = [
    {
        id: 1,
        text: "Facebook",
        url: "https://www.facebook.com",
        icon: <FaFacebookF/>,
    },
    {
        id: 2,
        text: "Instagram",
        url: "https://www.instagram.com",
        icon: <FaInstagram/>,
    },
    {
        id: 3,
        text: "Twitter",
        url: "https://www.twitter.com",
        icon: <FaTwitter/>,
    },

];

export const contactLinks = [
    {
        id: 1,
        text: "WhatsApp",
        url: "https://www.Whatsapp.com",
        icon: <FaWhatsapp />
    },
    {
        id: 2,
        text: "Mail",
        url: "#",
        icon: <CiMail />
    },
    

];
