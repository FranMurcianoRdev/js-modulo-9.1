import { LineaTicket, ResultadoLineaTicket, ResultadoTotalTicket, TicketFinal, TipoIva, TotalPorTipoIva } from "./modelo";

// Definir las tasas de IVA correspondientes para cada tipo de IVA
const ivaRates: { [key in TipoIva]: number } = {
  "general": 21,
  "reducido": 10,
  "superreducidoA": 5,
  "superreducidoB": 4,
  "superreducidoC": 0,
  "sinIva": 0,
};

// Función para calcular el IVA de un precio sin IVA
const calcularIva = (precioSinIva: number, tipoIva: TipoIva): number => {
  const tasaIva = ivaRates[tipoIva];
  return parseFloat((precioSinIva * tasaIva / 100).toFixed(2));
};

// Función para calcular el precio con IVA
const calcularPrecioConIva = (precioSinIva: number, iva: number): number => {
  return parseFloat((precioSinIva + iva).toFixed(2));
};

// Función principal para calcular el ticket usando un bucle `for`
export const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
  const resultado: ResultadoLineaTicket[] = [];
  let totalSinIva = 0;
  let totalConIva = 0;
  let totalIva = 0;

  // Objeto para acumular el desglose del IVA por tipo
  const desgloseIva: { [key in TipoIva]?: number } = {};

  // Recorrer cada línea del ticket usando un bucle `for`
  for (let i = 0; i < lineasTicket.length; i++) {
    const linea = lineasTicket[i];
    const { producto, cantidad } = linea;
    const { nombre, precio, tipoIva } = producto;

    // Calcular el precio sin IVA para la cantidad especificada
    const precioSinIva = parseFloat((precio * cantidad).toFixed(2));

    // Calcular el IVA correspondiente
    const iva = calcularIva(precioSinIva, tipoIva);

    // Calcular el precio con IVA
    const precioConIva = calcularPrecioConIva(precioSinIva, iva);

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
