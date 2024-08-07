import { LineaTicket, ResultadoLineaTicket, ResultadoTotalTicket, TicketFinal, TipoIva, TotalPorTipoIva } from "./modelo";

// Definir las tasas de IVA correspondientes
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

// Función para procesar cada línea del ticket
const procesarLineaTicket = (linea: LineaTicket): ResultadoLineaTicket => {
  const { producto, cantidad } = linea;
  const { nombre, precio, tipoIva } = producto;
  const precioSinIva = parseFloat((precio * cantidad).toFixed(2));
  const iva = calcularIva(precioSinIva, tipoIva);
  const precioConIva = calcularPrecioConIva(precioSinIva, iva);

  return {
    nombre,
    cantidad,
    precioSinIva,
    tipoIva,
    precioConIva,
  };
};

// Función para calcular el total y el desglose del IVA
const calcularTotales = (lineas: ResultadoLineaTicket[]): { total: ResultadoTotalTicket; desgloseIva: TotalPorTipoIva[] } => {
  let totalSinIva = 0;
  let totalConIva = 0;
  let totalIva = 0;
  const desgloseIva: { [key in TipoIva]?: number } = {};

  for (const linea of lineas) {
    totalSinIva += linea.precioSinIva;
    totalConIva += linea.precioConIva;
    const iva = linea.precioConIva - linea.precioSinIva;
    totalIva += iva;

    desgloseIva[linea.tipoIva] ??= 0;
    desgloseIva[linea.tipoIva]! += iva;
  }

  const totalDesgloseIva: TotalPorTipoIva[] = Object.entries(desgloseIva).map(
    ([tipoIva, cuantia]) => ({
      tipoIva: tipoIva as TipoIva,
      cuantia: parseFloat(cuantia!.toFixed(2)),
    })
  );

  return {
    total: {
      totalSinIva: parseFloat(totalSinIva.toFixed(2)),
      totalConIva: parseFloat(totalConIva.toFixed(2)),
      totalIva: parseFloat(totalIva.toFixed(2)),
    },
    desgloseIva: totalDesgloseIva,
  };
};

// Función principal para calcular el ticket
export const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
  const resultado = lineasTicket.map(procesarLineaTicket);
  const { total, desgloseIva } = calcularTotales(resultado);

  return {
    lineas: resultado,
    total,
    desgloseIva,
  };
};


