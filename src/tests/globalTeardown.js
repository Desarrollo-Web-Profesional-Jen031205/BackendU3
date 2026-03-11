/**
 * @description Archivo de configuración global para Jest, se ejecuta después de todas las pruebas
 * @author Jennifer Ailin Medina Hernández
 * @version 1.0.0
 */
export default async function globalTeardown() {
  await global.__MONGOINSTANCE.stop(); // Detiene la instancia de MongoDB después de todas las
  pruebas;
}
