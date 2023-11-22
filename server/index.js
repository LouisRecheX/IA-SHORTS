import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

import { download } from "./download.js";
import { transcribe } from "./transcribe.js";
import { summarize } from "./summarize.js";

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/summary/:id", async (request, response) => {
  try {
    console.log(
      "Iniciando processo de download para o vídeo ID:",
      request.params.id
    );
    const audioPath = await download(request.params.id);

    console.log("Verificando existência do arquivo de áudio:", audioPath);
    if (!fs.existsSync(audioPath)) {
      throw new Error(`O arquivo de áudio não foi encontrado: ${audioPath}`);
    }

    console.log("Iniciando a transcrição do áudio.");
    const result = await transcribe(audioPath);

    console.log("Resultado da Transcrição:", result);

    if (!result || result.trim() === "") {
      throw new Error("A transcrição do áudio está vazia ou inválida.");
    }

    return response.json({ transcription: result });
  } catch (error) {
    console.log("Erro ocorrido:", error);
    return response.json({ error });
  }
});

app.post("/summary", async (request, response) => {
  try {
    console.log("Texto para Resumir:", request.body.text);
    const result = await summarize(request.body.text);
    console.log("Resultado do Resumo:", result);
    return response.json({ summary: result });
  } catch (error) {
    console.log("Erro ocorrido:", error);
    return response.json({ error });
  }
});

app.listen(3333, () => console.log("server is running on port 3333"));
