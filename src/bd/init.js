import "dotenv/config";
import mongoose from "mongoose";
//Define una función para inicializar la conexión a la base de datos
export function initBaseDeDatos() {
  const DATABASE_URL = process.env.DATABASE_URL;
  // Configura los eventos de conexión de Mongoose
  mongoose.connection.on("error", (error) => {
    console.error("Error de conexión a la Base de Datos:", error);
  });
  // Evento para cuando la conexión se abre exitosamente
  mongoose.connection.on("open", () => {
    console.info("Exitosamente Conectado a la Base de Datos:", DATABASE_URL);
  });
  // Inicia la conexión a la base de datos utilizando Mongoose
  const conexion = mongoose.connect(DATABASE_URL);
  return conexion;
}
