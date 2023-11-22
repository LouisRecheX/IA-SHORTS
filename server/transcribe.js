import { pipeline } from "@xenova/transformers";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

// Função para converter o áudio em Float32Array usando `ffmpeg`
async function convertAudioToFloat32Array(audioPath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      audioPath,
      "-f",
      "f32le",
      "-ac",
      "1",
      "-ar",
      "16000",
      "pipe:1",
    ]);

    const chunks = [];
    ffmpeg.stdout.on("data", (chunk) => chunks.push(chunk));
    ffmpeg.stdout.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const float32Array = new Float32Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength / Float32Array.BYTES_PER_ELEMENT
      );
      resolve(float32Array);
    });
    ffmpeg.stderr.on("data", (data) => console.error(data.toString()));
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffmpeg process exited with code ${code}`));
      }
    });
  });
}

export async function transcribe(audioPath) {
  try {
    console.log("Realizando a transcrição...");
    console.log(`Verificando existência do arquivo de áudio: ${audioPath}`);
    if (!fs.existsSync(audioPath)) {
      throw new Error(`O arquivo de áudio não foi encontrado: ${audioPath}`);
    }

    // Converta o áudio em Float32Array usando `ffmpeg`
    const audioData = await convertAudioToFloat32Array(audioPath);
    console.log("Áudio convertido com sucesso.");

    const transcribe = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-small"
    );

    const transcription = await transcribe(audioData, {
      chunk_length_s: 30,
      stride_length_s: 5,
      language: "portuguese",
      task: "transcribe",
    });

    console.log("Transcrição finalizada com sucesso.");
    console.log("Transcrição:", transcription);

    const transcribedText = transcription?.text.replace("[Música]", "");
    if (!transcribedText) {
      throw new Error("A transcrição retornou um texto vazio ou inválido.");
    }

    return transcribedText;
  } catch (error) {
    console.log("Erro ao realizar a transcrição:", error);
    throw new Error(error);
  }
}
