import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

//  Limitar peticiones
const comentariosLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: "Demasiadas peticiones, intenta más tarde",
  },
});

// Validación + sanitización
const validarComentario = [
  body("puntuacion")
    .isInt()
    .withMessage("La puntuación debe ser un número entero"),

  body("texto")
    .isLength({ max: 200 })
    .withMessage("Máximo 200 caracteres")
    .trim()
    .escape(),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
];

// Ruta
export function comentariosRoutes(app) {
  app.post(
    "/api/v1/comentarios",
    comentariosLimiter,
    validarComentario,
    async (req, res) => {
      try {
        const { puntuacion, texto } = req.body;

        return res.status(201).json({
          message: "Comentario recibido",
          data: { puntuacion, texto },
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno" });
      }
    },
  );
}
