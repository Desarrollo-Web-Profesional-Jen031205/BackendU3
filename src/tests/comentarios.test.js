import request from "supertest";
import app from "../app.js";

describe("POST /api/v1/comentarios", () => {
  it("debe crear un comentario correctamente", async () => {
    const res = await request(app).post("/api/v1/comentarios").send({
      puntuacion: 5,
      texto: "Test correcto",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.texto).toBe("Test correcto");
  });

  // EL NUEVO TEST
  it("debe fallar si puntuacion no es número", async () => {
    const res = await request(app).post("/api/v1/comentarios").send({
      puntuacion: "hola",
      texto: "test",
    });

    expect(res.statusCode).toBe(400);
  });

  //Test rate limit
  it("debe bloquear después de muchas peticiones", async () => {
    for (let i = 0; i < 11; i++) {
      await request(app).post("/api/v1/comentarios").send({
        puntuacion: 5,
        texto: "spam",
      });
    }

    const res = await request(app).post("/api/v1/comentarios").send({
      puntuacion: 5,
      texto: "spam",
    });

    expect(res.statusCode).toBe(429);
  });

  //Test Sanitizacion
  it("debe sanitizar scripts", async () => {
    await new Promise((resolve) => setTimeout(resolve, 60000));

    const res = await request(app).post("/api/v1/comentarios").send({
      puntuacion: 5,
      texto: "<script>alert('hack')</script>",
    });

    expect(res.body.data.texto).toContain("&lt;script&gt;");
  }, 70000); //timeout de 70 segundos
});
