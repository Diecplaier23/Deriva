export const CATEGORIES = [
  { group: "TRANSPORTE", name: "Vuelo" }, { group: "TRANSPORTE", name: "Tren" },
  { group: "TRANSPORTE", name: "Autobús" }, { group: "TRANSPORTE", name: "Alquiler de coche" },
  { group: "TRANSPORTE", name: "Gasolina" }, { group: "TRANSPORTE", name: "Taxi / VTC" },
  { group: "TRANSPORTE", name: "Metro / Tranvía" }, { group: "TRANSPORTE", name: "Parking" },
  { group: "TRANSPORTE", name: "Peajes" }, { group: "TRANSPORTE", name: "Traslado" },
  { group: "TRANSPORTE", name: "Ferry / Barco" },
  { group: "ALOJAMIENTO", name: "Hotel" }, { group: "ALOJAMIENTO", name: "Apartamento" },
  { group: "ALOJAMIENTO", name: "Hostal" }, { group: "ALOJAMIENTO", name: "Albergue" },
  { group: "ALOJAMIENTO", name: "Camping" }, { group: "ALOJAMIENTO", name: "Casa rural" },
  { group: "ALOJAMIENTO", name: "Tasa turística" },
  { group: "COMIDA", name: "Restaurante" }, { group: "COMIDA", name: "Comida" },
  { group: "COMIDA", name: "Supermercado" }, { group: "COMIDA", name: "Bebidas" },
  { group: "ACTIVIDADES", name: "Actividad" }, { group: "ACTIVIDADES", name: "Excursión" },
  { group: "ACTIVIDADES", name: "Tour" }, { group: "ACTIVIDADES", name: "Museo" },
  { group: "ACTIVIDADES", name: "Entradas" }, { group: "ACTIVIDADES", name: "Espectáculo" },
  { group: "ACTIVIDADES", name: "Ocio" },
  { group: "PROTECCIÓN", name: "Seguro" }, { group: "PROTECCIÓN", name: "Equipaje" },
  { group: "PROTECCIÓN", name: "Visado" }, { group: "PROTECCIÓN", name: "Documentación" },
  { group: "OTROS", name: "Compras" }, { group: "OTROS", name: "Souvenirs" },
  { group: "OTROS", name: "SIM / eSIM" }, { group: "OTROS", name: "Lavandería" },
  { group: "OTROS", name: "Comisiones bancarias" }, { group: "OTROS", name: "Cambio de moneda" },
  { group: "OTRO", name: "Otro" }
];

export const LEGACY_CATEGORIES = [
  { group: "TRANSPORTE", name: "Transporte" }
];

export const ALL_CATEGORIES = [...CATEGORIES, ...LEGACY_CATEGORIES];