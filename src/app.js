// backend/src/app.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { usuarioRoutes } from "./rutas/usuarios.js";

import { pedidosRoutes } from "./rutas/pedidos.js";

// Crear la aplicación Express
const app = express();
// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());

// Configurar rutas
usuarioRoutes(app);
pedidosRoutes(app);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Hola from Express!");
});

export { app };
