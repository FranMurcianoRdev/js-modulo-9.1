import { LineaTicket, ResultadoLineaTicket, ResultadoTotalTicket, TicketFinal, TipoIva, TotalPorTipoIva } from "./modelo";

export const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
    // Definir las tasas de IVA correspondientes
    const ivaRates: { [key in TipoIva]: number } = {
    "general": 21,
    "reducido": 10,
    "superreducidoA": 4,
    "superreducidoB": 7,
    "superreducidoC": 2,
    "sinIva": 0,
    };

  // Array para almacenar las líneas del ticket con los precios calculados
    const resultado: ResultadoLineaTicket[] = [];

  // Variables para acumular los totales
    let totalSinIva = 0;
    let totalConIva = 0;
    let totalIva = 0;

  // Objeto para almacenar el desglose del IVA por tipo
    const desgloseIva: { [key in TipoIva]?: number } = {};

  // Recorrer cada línea del ticket usando un bucle for
    for (let i = 0; i < lineasTicket.length; i++) {
        const linea = lineasTicket[i];
        const { producto, cantidad } = linea;
        const { nombre, precio, tipoIva } = producto;

    // Calcular el precio sin IVA para la cantidad especificada
        const precioSinIva = parseFloat((precio * cantidad).toFixed(2));

    // Obtener la tasa de IVA correspondiente al tipo de IVA del producto
        const tasaIva = ivaRates[tipoIva];

    // Calcular el IVA correspondiente
     const iva = parseFloat((precioSinIva * tasaIva / 100).toFixed(2));

    // Calcular el precio con IVA
        const precioConIva = parseFloat((precioSinIva + iva).toFixed(2));

    // Añadir el resultado de la línea al array de resultado
    resultado.push({
        nombre,
        cantidad,
        precioSinIva,
        tipoIva,
        precioConIva,
    });

    // Acumular los totales
    totalSinIva += precioSinIva;
    totalConIva += precioConIva;
    totalIva += iva;

    // Acumular el desglose del IVA por tipo
    desgloseIva[tipoIva] ??= 0;
    desgloseIva[tipoIva]! += iva;
}

  // Convertir el objeto desgloseIva en un array de TotalPorTipoIva
    const totalDesgloseIva: TotalPorTipoIva[] = Object.entries(desgloseIva).map(
    ([tipoIva, cuantia]) => ({
        tipoIva: tipoIva as TipoIva,
        cuantia: parseFloat(cuantia!.toFixed(2)),
    })
);

  // Crear el objeto ResultadoTotalTicket con los totales calculados
    const resultadoTotalTicket: ResultadoTotalTicket = {
    totalSinIva: parseFloat(totalSinIva.toFixed(2)),
    totalConIva: parseFloat(totalConIva.toFixed(2)),
    totalIva: parseFloat(totalIva.toFixed(2)),
};

  // Devolver el resultado final con las líneas del ticket, el total y el desglose del IVA
    return {
    lineas: resultado,
    total: resultadoTotalTicket,
    desgloseIva: totalDesgloseIva,
    };
};

