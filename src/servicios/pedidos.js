// servicios/pedidos.js
import { Pedido } from "../bd/modelos/pedido.js";

/**
 * Función para crear un nuevo pedido en la base de datos.
 * @param {*} pedido - Objeto que contiene los detalles del pedido a crear, incluyendo:
 * - nombre: Nombre del cliente
 * - telefono: Teléfono del cliente (10 dígitos)
 * - fecha_solicitud: Fecha de solicitud del pedido
 * - fecha_envio: Fecha de envío del pedido
 * - total: Total del pedido (opcional, por defecto 0.0)
 * - pagado: Lista de métodos de pago utilizados (opcional)
 * - abono: Monto abonado al pedido (opcional)
 * - comentario: Comentarios adicionales sobre el pedido (opcional)
 * @returns {Promise<Pedido>} - El pedido creado en la base de datos.
 */
export async function creaPedido({
  nombre,
  telefono,
  fecha_solicitud,
  fecha_envio,
  total,
  pagado,
  abono,
  comentario,
}) {
  const pedido = new Pedido({
    nombre,
    telefono,
    fecha_solicitud,
    fecha_envio,
    total,
    pagado,
    abono,
    comentario,
  });
  return await pedido.save();
}

/**
 * Función para obtener una lista de pedidos de la base de datos.
 * @param {*} query Tipo de consulta
 * @param {*} param1 Ordenamiento de la consulta
 * @returns {Promise<Array>} - Una promesa que resuelve en un arreglo de pedidos.
 */
export async function listaPedidos(
  query = {},
  { sortBy = "createdAt", sortOrder = "descending" } = {},
) {
  return await Pedido.find(query).sort({ [sortBy]: sortOrder });
}

/**
 * Función para obtener una lista de todos los pedidos de la base de datos.
 * @param {*} opciones
 * @returns {Promise<Array>} - Una promesa que resuelve en un arreglo de pedidos.
 */
export async function listaAllPedidos(opciones) {
  return await listaPedidos({}, opciones);
}

/**
 * Funcion para obtener una lista de pedidos filtrados por nombre del cliente.
 * @param {*} nombre
 * @param {*} opciones
 * @returns {Promise<Array>} - Una promesa que resuelve en un arreglo de pedidos.
 */
export async function listaPedidosByNombre(nombre, opciones) {
  return await listaPedidos({ nombre }, opciones);
}

/**
 * Funcion para obtener una lista de pedidos filtrados por teléfono del cliente.
 * @param {*} pagado
 * @param {*} opciones
 * @returns {Promise<Array>} - Una promesa que resuelve en un arreglo de pedidos.
 */
export async function listPedidosByPagado(pagado, opciones) {
  return await listaPedidos({ pagado }, opciones);
}

/**
 * Funcion para obtener un pedido específico por su ID.
 * @param {*} pedidoId Identificador
 * @returns {Promise<Pedido>} - Una promesa que resuelve en el pedido encontrado o null si no se encuentra.
 */
export async function getPedidoById(pedidoId) {
  return await Pedido.findById(pedidoId);
}

/**
 * Función para modificar un pedido existente en la base de datos utilizando su ID.
 * @param {Function} pedidoId
 * @param {*} param1
 * @returns {Promise<Pedido>} - Una promesa que resuelve en el pedido actualizado o null si no se encuentra.
 */
export async function modificaPedido(
  pedidoId,
  {
    nombre,
    telefono,
    fecha_solicitud,
    fecha_envio,
    total,
    pagado,
    abono,
    comentario,
  },
) {
  return await Pedido.findOneAndUpdate(
    { _id: pedidoId },
    {
      $set: {
        nombre,
        telefono,
        fecha_solicitud,
        fecha_envio,
        total,
        pagado,
        abono,
        comentario,
      },
    },
    { new: true },
  );
}

/**
 * Elimina un pedido de la base de datos utilizando su ID.
 * @param {*} pedidoId
 * @returns {Promise<Object>} - Una promesa que resuelve en el resultado de la operación de eliminación.
 */
export async function eliminaPedido(pedidoId) {
  return await Pedido.deleteOne({ _id: pedidoId });
}
