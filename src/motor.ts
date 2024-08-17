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

// Para calcular el IVA de un producto
const calcularIva = (precioSinIva: number, tipoIva: TipoIva): number => {
  const tasaIva = ivaRates[tipoIva];
  return parseFloat((precioSinIva * tasaIva / 100).toFixed(2));
};

// Para sumar el IVA calculado al precio del producto 
const calcularPrecioConIva = (precioSinIva: number, iva: number): number => {
  return parseFloat((precioSinIva + iva).toFixed(2));
};

export const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
  const resultado: ResultadoLineaTicket[] = [];
  let totalSinIva = 0;
  let totalConIva = 0;
  let totalIva = 0;

  const desgloseIva: { [key in TipoIva]?: number } = {};

  for (let i = 0; i < lineasTicket.length; i++) {
    const linea = lineasTicket[i];
    const { producto, cantidad } = linea;
    const { nombre, precio, tipoIva } = producto;

    // Calcular el precio sin IVA para la cantidad especificada
    const precioSinIva = parseFloat((precio * cantidad).toFixed(2));

    // Calcular el IVA correspondiente
    const iva = calcularIva(precioSinIva, tipoIva);

    // Calcular el precio sumándole el IVA
    const precioConIva = calcularPrecioConIva(precioSinIva, iva);

    // Añadir el resultado
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

  // Convertir el desgloseIva en TotalPorTipoIva
  const totalDesgloseIva: TotalPorTipoIva[] = Object.entries(desgloseIva).map(
    ([tipoIva, cuantia]) => ({
      tipoIva: tipoIva as TipoIva,
      cuantia: parseFloat(cuantia!.toFixed(2)),
    })
  );

  // Crear ResultadoTotalTicket con los totales calculados
  const resultadoTotalTicket: ResultadoTotalTicket = {
    totalSinIva: parseFloat(totalSinIva.toFixed(2)),
    totalConIva: parseFloat(totalConIva.toFixed(2)),
    totalIva: parseFloat(totalIva.toFixed(2)),
  };

  return {
    lineas: resultado,
    total: resultadoTotalTicket,
    desgloseIva: totalDesgloseIva,
  };
};
