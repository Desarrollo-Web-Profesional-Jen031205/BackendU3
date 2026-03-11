import {
  createUsuario,
  loginUsuario,
  getUsuarioInfoById,
} from "../servicios/usuarios.js";

export function usuarioRoutes(app) {
  // Crear usuario
  app.post("/api/v1/usuario/signup", async (req, res) => {
    try {
      const usuario = await createUsuario(req.body);
      return res.status(201).json({ username: usuario.username });
    } catch (err) {
      console.error("Error creando usuario:", err);
      return res.status(400).json({
        error: err.message,
      });
    }
  });

  // Login usuario
  app.post("/api/v1/usuario/login", async (req, res) => {
    try {
      const token = await loginUsuario(req.body);
      return res.status(200).send({ token });
    } catch (err) {
      console.error("Error en login:", err);
      return res.status(400).send({
        error: err.message,
      });
    }
  });

  // Obtener usuario por ID
  app.get("/api/v1/usuarios/:id", async (req, res) => {
    try {
      const userInfo = await getUsuarioInfoById(req.params.id);
      return res.status(200).send(userInfo);
    } catch (err) {
      console.error("Error obteniendo usuario:", err);
      return res.status(500).json({
        error: err.message,
      });
    }
  });
}
