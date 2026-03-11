import { initBaseDeDatos } from "./bd/init.js";
import { Pedido } from "./bd/modelos/pedido.js";

await initBaseDeDatos();

/**
 * Ejemplo de creación, actualización y consulta de pedidos utilizando Mongoose.
 */
const pedido = new Pedido({
  nombre: "Juan Gabriel Lopez",
  telefono: "4181231234",
  fecha_solicitud: "07/02/2026",
  fecha_envio: "09/02/2026",
  total: 45.0,
  pagado: ["PAGADO"],
  abono: 45.0,
  comentario: "Ha sido pagado el pedido",
});
// Guardar el nuevo pedido en la base de datos
await pedido.save();
const createdPedido = await pedido.save();

// Actualizar el nombre del cliente para el pedido creado
await Pedido.findByIdAndUpdate(createdPedido._id, {
  $set: { nombre: "Juan Gabriel Lopez Beltran" },
});

// Consultar y mostrar todos los pedidos en la base de datos
const pedidos = await Pedido.find();
// Mostrar los pedidos en la consola
console.log(pedidos);
