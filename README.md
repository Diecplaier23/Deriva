# Deriva

Deriva es una página web sencilla para organizar el presupuesto de un viaje. Permite registrar gastos y viajeros, comparar el presupuesto con el dinero disponible y calcular el coste estimado por persona. La interfaz está en español y utiliza euros.

## Cómo abrirla

La aplicación no requiere instalar dependencias ni compilar el proyecto. Como usa módulos ES, sí debes servir la carpeta por HTTP(S); abrir `index.html` directamente con `file://` puede impedir que el navegador cargue los módulos.

Desde la carpeta del proyecto puedes iniciar un servidor estático con Python:

```powershell
py -m http.server 8000
```

Después abre `http://localhost:8000/`. También se puede publicar directamente en GitHub Pages.

## Organización

- `index.html`: estructura de la interfaz.
- `css/styles.css`: estilos.
- `js/app.js`: inicialización, coordinación y renderizado del resumen.
- `js/state.js` y `js/storage.js`: estado del viaje y persistencia.
- `js/calculations.js`: cálculos y formato de importes.
- `js/people.js`, `js/expenses.js` y `js/split.js`: gestión de viajeros, gastos y reparto.
- `js/download.js`: generación del resumen PNG.
- `js/categories.js` y `js/dom.js`: catálogo de categorías y acceso a elementos del DOM.

## Mi viaje

En esta vista puedes:

- Guardar el destino y los ahorros generales del viaje.
- Configurar el margen de seguridad entre el 0 % y el 100 %. El valor inicial es 10 % y se aplica a los gastos no confirmados.
- Añadir hasta 99 personas, editar sus nombres y quitar personas, siempre dejando al menos una.
- Elegir entre dos modos de cálculo. La división automática viene activada por defecto; reparte el presupuesto entre los viajeros y muestra una estimación por persona. Las aportaciones individuales no cuentan como dinero disponible en este modo.
- Cambiar a aportaciones manuales para introducir cuánto aporta cada persona. En este modo, las aportaciones y los ahorros generales cuentan como dinero disponible. Cambiar de modo conserva las aportaciones introducidas.
- Consultar el coste total presupuestado, gastos confirmados, gastos pendientes con margen, dinero disponible y coste por persona.
- En el modo manual, ver cuánto falta por aportar o el aviso «Presupuesto bajo control» cuando los gastos ya están cubiertos. El aviso aparece cuando hay gastos registrados.

## Gastos

Los gastos se añaden indicando categoría y precio; la descripción es opcional. Se pueden marcar como gasto de todo el grupo o como precio por persona. En el segundo caso, Deriva multiplica el precio por el número de viajeros.

Los tipos de gasto se muestran como bloques seleccionables, agrupados por categoría. Al seleccionar o editar un gasto, el bloque queda marcado en verde y aparece en la parte superior del selector. Los gastos guardan la categoría del grupo y el tipo por separado; los registros antiguos se migran al cargarse. Las categorías y tipos disponibles son:

- Transporte: vuelo, tren, autobús, alquiler de coche, gasolina, taxi / VTC, metro / tranvía, parking, peajes, traslado y ferry / barco.
- Alojamiento: hotel, apartamento, hostal, albergue, camping, casa rural y tasa turística.
- Comida: restaurante, comida, supermercado y bebidas.
- Actividades: actividad, excursión, tour, museo, entradas, espectáculo y ocio.
- Protección: seguro, equipaje, visado y documentación.
- Otros: compras, souvenirs, SIM / eSIM, lavandería, comisiones bancarias y cambio de moneda.
- Otro: opción independiente, fuera de la categoría «Otros».

Cada gasto puede marcarse como confirmado, editarse o eliminarse. Los gastos no confirmados añaden el margen de seguridad configurado en «Mi viaje» (10 % por defecto); los confirmados no añaden margen. El precio y la categoría los introduce el usuario: Deriva no busca precios ni procesa pagos.

## Resumen y cálculos

El resumen se actualiza al cambiar los datos. El presupuesto suma el precio de cada gasto y el margen aplicable. El saldo tras gastos es el dinero disponible menos el presupuesto: suma los ahorros generales y, solo en el modo manual, las aportaciones individuales. Si queda saldo positivo, el coste pendiente por persona es cero; si queda un déficit, se reparte a partes iguales entre los viajeros. El campo de ahorros conserva el importe inicial y el saldo del resumen se recalcula al cambiar los gastos.

El indicador de dinero disponible muestra el progreso frente al presupuesto. En el modo manual, si hay gastos registrados, Deriva muestra la cantidad pendiente de aportar o indica que el presupuesto está bajo control si el dinero disponible cubre los gastos.

El botón **Descargar** genera una imagen PNG llamada `deriva-resumen.png` con la fecha y hora local de la captura, las métricas, el desglose por persona y ahorros, el aviso de cobertura cuando corresponda y la nota sobre el margen de seguridad. La imagen es un resumen y no contiene la lista detallada de gastos.

## Repartir un coste

La sección **¿Ya conoces el coste?** sirve para dividir un importe total a partes iguales entre los viajeros, descontando primero el saldo positivo que quede tras los gastos del viaje. Permite escribir o cambiar sus nombres y marcar quién ha pagado. Es un cálculo informativo independiente: no crea un gasto en el presupuesto del viaje.

## Guardado y privacidad

Los datos del viaje se guardan automáticamente en el almacenamiento local del navegador (`localStorage`). Permanecen en ese navegador y perfil; no se sincronizan con otros dispositivos ni se envían a un servidor. El botón **Reiniciar todo** pide confirmación y elimina el destino, los ahorros, el margen configurado, las personas, las aportaciones y los gastos guardados.

Deriva no requiere una cuenta ni conexión a un servicio externo para realizar sus cálculos. Si se borra el almacenamiento del navegador, también se borrarán los datos guardados de la aplicación. Cambiar entre «Mi viaje» y «¿Ya conoces el coste?» reinicia ambas vistas y elimina los datos guardados para evitar mezclar sus importes.
