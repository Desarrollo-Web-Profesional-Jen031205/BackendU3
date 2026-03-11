// <reference types="jest" />
import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Configuración global para las pruebas utilizando Jest y MongoDB Memory Server.
 * Esta función se ejecuta antes de todas las pruebas y establece una instancia de MongoDB en memoria para garantizar un entorno de prueba aislado.
 * Se asigna la URI de la base de datos a la variable de entorno DATABASE_URL para que las pruebas puedan conectarse a esta instancia.
 */
export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    binary: {
      version: "6.0.4",
    },
  });
  global.__MONGOINSTANCE = instance;
  process.env.DATABASE_URL = instance.getUri();
}
