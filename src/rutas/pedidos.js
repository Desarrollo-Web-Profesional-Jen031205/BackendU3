import mongoose from "mongoose";
// rutas/pedidos.js
import {
  creaPedido,
  listaPedidos,
  listaAllPedidos,
  listaPedidosByNombre,
  listPedidosByPagado,
  getPedidoById,
  modificaPedido,
  eliminaPedido,
} from "../servicios/pedidos.js";

/**
 * Funcion que define las rutas para pedidos
 * @param {*} app
 */
export function pedidosRoutes(app) {
  // Listar Pedidos con filtros opcionales
  app.get("/api/v1/pedidos", async (req, res) => {
    const { sortBy, sortOrder, nombre, pagado } = req.query;
    const opciones = { sortBy, sortOrder };
    try {
      if (nombre && pagado) {
        return res
          .status(400)
          .json({ error: "Consulta por nombre o status, No Ambos" });
      } else if (nombre) {
        return res.json(await listaPedidosByNombre(nombre, opciones));
      } else if (pagado) {
        return res.json(await listPedidosByPagado(pagado, opciones));
      } else {
        return res.json(await listaAllPedidos(opciones));
      }
    } catch (err) {
      console.error("Error listando Pedidos", err);
      return res.status(500).end();
    }
  });

  // Obtener un Pedido por ID
  app.get("/api/v1/pedidos/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).end();
    }

    try {
      const pedido = await getPedidoById(id);

      if (!pedido) return res.status(404).end();

      return res.json(pedido.toObject());
    } catch (err) {
      console.error("Error Obtiendo un Pedido", err);
      return res.status(500).end();
    }
  });

  // Crear un nuevo Pedido
  app.post("/api/v1/pedidos", async (req, res) => {
    try {
      const pedido = await creaPedido(req.body);
      return res.json(pedido);
    } catch (err) {
      console.error("Error creando un pedido", err);
      return res.status(500).end();
    }
  });

  // Modificar un Pedido existente
  app.patch("/api/v1/pedidos/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "ID inválido",
        mensaje: `Se esperaban 24 caracteres, recibidos: ${id.length}`,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "ID inválido",
        mensaje: `Se esperaban 24 caracteres, recibidos: ${id.length}`,
      });
    }

    try {
      const pedido = await modificaPedido(id, req.body);
      return res.json(pedido);
    } catch (err) {
      console.error("Error modificando Pedido", err);
      return res.status(500).end();
    }
  });

  // Eliminar un Pedido por ID
  app.delete("/api/v1/pedidos/:id", async (req, res) => {
    try {
      const { deletedCount } = await eliminaPedido(req.params.id);
      if (deletedCount === 0) return res.sendStatus(404);
      return res.status(204).end();
    } catch (err) {
      console.error("Error Eliminando un Pedido", err);
      return res.status(500).end();
    }
  });
}
