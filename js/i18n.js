import { state } from "./state.js";

const spanishToEnglish = {
  "Tu viaje, bajo tu control": "Your trip, in your hands",
  Moneda: "Currency",
  Idioma: "Language",
  "Reiniciar todo": "Reset everything",
  "Secciones de Deriva": "Deriva sections",
  "Deriva, inicio": "Deriva, home",
  "Mi viaje": "My trip",
  "← Mi viaje": "← My trip",
  "¿Ya conoces el coste?": "Already know the cost?",
  "Tú pones los datos. Deriva pone orden.": "You bring the details. Deriva brings order.",
  "Tu viaje, a tu manera": "Your trip, your way",
  "Añade lo que ya sabes y completa el presupuesto poco a poco. Tú decides cuánto cuesta cada cosa; Deriva hace las cuentas.": "Add what you know and build your budget over time. You choose what things cost; Deriva does the maths.",
  "Tu viaje": "Your trip",
  "Datos básicos": "Basics",
  Destino: "Destination",
  "(opcional)": "(optional)",
  "¿A dónde vas?": "Where are you going?",
  Ahorros: "Savings",
  "¿Tienes ahorros?": "Do you have savings?",
  "Saldo general disponible para el viaje.": "General funds available for the trip.",
  "Margen de seguridad": "Safety margin",
  "Se añade a los gastos no confirmados. Por defecto, 10 %.": "Added to unconfirmed expenses. 10% by default.",
  "Modo de cálculo del presupuesto": "Budget calculation mode",
  "División automática": "Split evenly",
  "Aportaciones manuales": "Manual contributions",
  "Personas del viaje": "People on the trip",
  "Aportaciones disponibles": "Available contributions",
  "Añadir persona": "Add person",
  "El presupuesto total se divide a partes iguales entre todas las personas.": "The total budget is split evenly among everyone.",
  "Saldo general, aparte de las aportaciones individuales.": "General funds, separate from individual contributions.",
  "Los ahorros y las aportaciones individuales se suman al dinero disponible.": "Savings and individual contributions count toward available funds.",
  "Gastos del viaje": "Trip expenses",
  "Añade y organiza a tu ritmo": "Add and organize at your own pace",
  "Añadir gasto": "Add expense",
  "Repartir el coste": "Split the cost",
  "Introduce el total y calcula cuánto corresponde a cada persona.": "Enter the total to see each person's share.",
  "Coste total": "Total cost",
  "Introduce el coste total": "Enter the total cost",
  "A cada persona": "Each person pays",
  "Personas en el reparto": "People sharing the cost",
  "El total se divide a partes iguales. Este cálculo es informativo y no añade un gasto al presupuesto.": "The total is split evenly. This estimate does not add an expense to your budget.",
  "Resumen del presupuesto": "Budget summary",
  "Resumen del viaje": "Trip summary",
  "En tiempo real": "Live",
  "Descargar el resumen": "Download the summary",
  "Descargar el resumen como imagen": "Download the summary as an image",
  Descargar: "Download",
  "Coste total presupuestado": "Total planned cost",
  "Gastos confirmados": "Confirmed expenses",
  "No confirmados, con margen": "Unconfirmed, including margin",
  "Dinero disponible": "Available funds",
  "Dinero disponible respecto al presupuesto": "Available funds compared with the budget",
  "Reparto estimado por persona y ahorros": "Estimated share per person and savings",
  "Coste pendiente por persona y saldo restante": "Remaining cost per person and balance",
  "Los gastos no confirmados incluyen un margen de seguridad del": "Unconfirmed expenses include a safety margin of",
  "No es un precio añadido al servicio.": "This is not an extra service fee.",
  ". No es un precio añadido al servicio.": ". This is not an extra service fee.",
  "El saldo libre del viaje se descuenta antes del reparto. Las personas marcadas como pagadas se reflejan en el total pendiente.": "Remaining trip funds are deducted before splitting the cost. People marked as paid are excluded from the outstanding total.",
  "¿Qué gasto quieres añadir?": "What expense would you like to add?",
  "El precio siempre lo introduces tú.": "You always enter the price yourself.",
  Cerrar: "Close",
  "Categorías de gasto": "Expense categories",
  "Cambiar gasto": "Change expense",
  Descripción: "Description",
  "Un detalle para reconocerlo": "A note to help identify it",
  "Precio que has encontrado": "Price you found",
  "Gasto para:": "Expense for:",
  "Todo el grupo": "The whole group",
  "Por persona": "Per person",
  "Gasto personal": "Personal expense",
  "Personas a las que se aplica": "People this applies to",
  "✕ No confirmado": "✕ Unconfirmed",
  "✓ Confirmado": "✓ Confirmed",
  "✎ Editar": "✎ Edit",
  "⌫ Eliminar": "⌫ Delete",
  Quitar: "Remove",
  "Si no está confirmado, se añadirá un margen de seguridad del": "Unconfirmed expenses include a safety margin of",
  "al presupuesto.": "to the budget.",
  Cancelar: "Cancel",
  "Guardar gasto": "Save expense",
  "¿Reiniciar todo?": "Reset everything?",
  "Se eliminarán el destino, los ahorros, todas las personas y todos los gastos.": "Your destination, savings, people, and expenses will be deleted.",
  "Reiniciar de todas formas": "Reset anyway",
  "Organiza el presupuesto de tu viaje": "Plan your trip budget",
  "Herramienta gratuita para organizar y calcular el presupuesto de tus viajes.": "A free tool to plan and calculate your trip budget.",
  Proyecto: "Project",
  "Código fuente": "Source code",
  "Apoyar el proyecto": "Support the project",
  Información: "Information",
  "Gratis y sin cuenta": "Free, no account needed",
  "Los datos se guardan únicamente en tu navegador": "Your data is stored only in your browser",
  "Deriva no recopila los datos del presupuesto ni procesa pagos": "Deriva does not collect budget data or process payments",
  "Creado por": "Created by",
  "Falta por aportar {amount}": "Short by {amount}",
  "Presupuesto bajo control": "Budget on track",
  "Resumen del reparto": "Cost split summary",
  "Coste total conocido": "Known total cost",
  "Saldo del viaje aplicado": "Trip funds applied",
  "Pagado por el grupo": "Paid by the group",
  "Pendiente de pago": "Still to pay",
  "Reparto por persona": "Split per person",
  "Coste cubierto por el saldo del viaje y los pagos": "Cost covered by trip funds and payments",
  "Coste cubierto": "Cost covered",
  "Falta por pagar {amount}": "Still to pay {amount}",
  Pagado: "Paid",
  Pendiente: "Pending",
  "Saldo tras gastos": "Balance after expenses",
  "Tu lista empieza aquí": "Your list starts here",
  "Añade los gastos que ya conoces. Puedes completar el resto más adelante.": "Add the expenses you already know. You can fill in the rest later.",
  "El tipo seleccionado aparece arriba.": "The selected type appears above.",
  "Introduce un precio válido para guardar el gasto.": "Enter a valid price to save this expense.",
  "Selecciona al menos una persona para este gasto.": "Select at least one person for this expense.",
  "Debe haber al menos una persona": "At least one person is required",
  "Sin personas seleccionadas": "No people selected",
  TRANSPORTE: "TRANSPORT",
  ALOJAMIENTO: "ACCOMMODATION",
  COMIDA: "FOOD",
  ACTIVIDADES: "ACTIVITIES",
  "PROTECCIÓN": "PROTECTION",
  OTROS: "MISCELLANEOUS",
  OTRO: "OTHER",
  Transporte: "Transport",
  Vuelo: "Flight",
  Tren: "Train",
  "Autobús": "Bus",
  "Alquiler de coche": "Car rental",
  Gasolina: "Fuel",
  "Taxi / VTC": "Taxi / rideshare",
  "Metro / Tranvía": "Metro / Tram",
  Parking: "Parking",
  Peajes: "Tolls",
  Traslado: "Transfer",
  "Ferry / Barco": "Ferry / Boat",
  Hotel: "Hotel",
  Apartamento: "Apartment",
  Hostal: "Guesthouse",
  Albergue: "Hostel",
  Camping: "Camping",
  "Casa rural": "Rural stay",
  "Tasa turística": "Tourist tax",
  Restaurante: "Restaurant",
  Comida: "Food",
  Supermercado: "Groceries",
  Bebidas: "Drinks",
  Actividad: "Activity",
  Excursión: "Excursion",
  Tour: "Tour",
  Museo: "Museum",
  Entradas: "Tickets",
  Espectáculo: "Show",
  Ocio: "Entertainment",
  Seguro: "Insurance",
  Equipaje: "Luggage",
  Visado: "Visa",
  Documentación: "Documents",
  Compras: "Shopping",
  Souvenirs: "Souvenirs",
  "SIM / eSIM": "SIM / eSIM",
  Lavandería: "Laundry",
  "Comisiones bancarias": "Bank fees",
  "Cambio de moneda": "Currency exchange",
  Otro: "Other"
};

const englishToSpanish = new Map(Object.entries(spanishToEnglish).map(([spanish, english]) => [english, spanish]));

function translatePattern(value, language) {
  if (language === "en") {
    const translateCategory = (name) => spanishToEnglish[name] || name;
    const translateDisplayName = (name) => {
      const personNumber = name.match(/^Persona (\d+)$/)?.[1];
      return personNumber ? `Person ${personNumber}` : translateCategory(name);
    };
    const translateCurrencyName = (name) => ({ euros: "euros", dólares: "dollars", libras: "pounds" })[name] || name;
    const patterns = [
      [/^(\d+) persona$/, "$1 person"],
      [/^(\d+) personas$/, "$1 people"],
      [/^Persona (\d+)$/, "Person $1"],
      [/^Nombre de la persona (\d+)$/, "Name of person $1"],
      [/^Aportación de la persona (\d+) en (.+)$/, (_, number, currency) => `Contribution for person ${number} in ${translateCurrencyName(currency)}`],
      [/^Aportación \((.+)\)$/, "Contribution ($1)"],
      [/^Quitar persona (\d+)$/, "Remove person $1"],
      [/^Quitar (.+)$/, "Remove $1"],
      [/^Eliminar (.+)$/, (_, category) => `Delete ${translateCategory(category)}`],
      [/^Falta por aportar (.+)$/, "Short by $1"],
      [/^Falta por pagar (.+)$/, "Still to pay $1"],
      [/^Solo para (\d+) personas?$/, (_, count) => `Only for ${count} ${count === "1" ? "person" : "people"}`],
      [/^(.+) por persona · (.+) para (\d+)$/, "$1 per person · $2 for $3"],
      [/^(.+) por persona$/, "$1 per person"],
      [/^(.+) introducidos$/, "$1 entered"],
      [/^\+(.+) de margen \((.+)\)$/, "+$1 safety margin ($2)"],
      [/^(.+) presupuestados$/, "$1 budgeted"],
      [/^(.+) \/ persona$/, "$1 / person"],
      [/^Editar (.+)$/, (_, category) => `Edit ${translateCategory(category)}`],
      [/^(.+) · Pagado$/, (_, name) => `${translateDisplayName(name)} · Paid`],
      [/^(.+) · Pendiente$/, (_, name) => `${translateDisplayName(name)} · Pending`],
      [/^SELECCIONADO · (.+)$/, (_, group) => `SELECTED · ${translateCategory(group)}`]
    ];
    for (const [pattern, replacement] of patterns) {
      if (pattern.test(value)) return value.replace(pattern, replacement);
    }
    return null;
  }
  return null;
}

export function translateText(value) {
  if (state.language === "en") return spanishToEnglish[value] || translatePattern(value, "en") || value;
  return englishToSpanish.get(value) || value;
}

export function applyTranslations() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const original = node.textContent;
    const trimmed = original.trim();
    if (!trimmed) continue;
    const translated = translateText(trimmed);
    if (translated !== trimmed) node.textContent = original.replace(trimmed, translated);
  }

  document.querySelectorAll("[placeholder], [aria-label], [title]").forEach((element) => {
    ["placeholder", "aria-label", "title"].forEach((attribute) => {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, translateText(element.getAttribute(attribute)));
    });
  });
  document.documentElement.lang = state.language;
  document.title = "Deriva";
}