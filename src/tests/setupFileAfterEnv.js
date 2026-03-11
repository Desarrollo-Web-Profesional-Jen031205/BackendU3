import mongoose from "mongoose";
import { beforeAll, afterAll } from "@jest/globals";
import { initBaseDeDatos } from "../bd/init.js";

/**
 * Archivo de configuración para Jest que se ejecuta después de configurar el entorno de pruebas.
 * Aquí se inicializa la base de datos antes de ejecutar las pruebas y se desconecta después de que todas las pruebas hayan finalizado.
 */
beforeAll(async () => {
  await initBaseDeDatos();
});

/**
 * Después de que todas las pruebas hayan finalizado, se desconecta de la base de datos para liberar recursos.
 */
afterAll(async () => {
  await mongoose.disconnect();
});
