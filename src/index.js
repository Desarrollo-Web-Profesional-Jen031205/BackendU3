// backend/src/index.js
import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { initBaseDeDatos } from "./bd/init.js";

/**
 * Iniciar el servidor Express después de conectar a la base de datos
 */
try {
  await initBaseDeDatos();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT);
  console.info(`Servidor Express ejecutandose sobre http://localhost:${PORT}`);
} catch (err) {
  console.error("Error conecteando a la Base de Datos:", err);
}
