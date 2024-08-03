import { LineaTicket } from './modelo';
import {calculaTicket} from './motor'

// Ejemplo de uso
const productos: LineaTicket[] = [
    {
        producto: {
        nombre: "Legumbres",
        precio: 2,
        tipoIva: "general",
        },
        cantidad: 2,
    },
    {
        producto: {
        nombre: "Perfume",
        precio: 20,
        tipoIva: "general",
        },
        cantidad: 3,
    },
    {
        producto: {
        nombre: "Leche",
        precio: 1,
        tipoIva: "superreducidoC",
        },
        cantidad: 6,
    },
    {
        producto: {
        nombre: "Lasaña",
        precio: 5,
        tipoIva: "superreducidoA",
        },
        cantidad: 1,
    },
    ];

console.log(calculaTicket(productos));
