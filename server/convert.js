import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

const filePath = "./tmp/video.mp4"; // Certifique-se de que o caminho do arquivo de vídeo está correto
const outputPath = filePath.replace(".mp4", ".wav");

export const convert = () =>
  new Promise((resolve, reject) => {
    console.log("Convertendo o vídeo...");

    if (!fs.existsSync(filePath)) {
      return reject(new Error("Arquivo de vídeo não encontrado: " + filePath));
    }

    ffmpeg.setFfmpegPath(ffmpegStatic);
    ffmpeg(filePath)
      .audioFrequency(16000)
      .audioChannels(1)
      .format("wav")
      .on("end", () => {
        console.log("Vídeo convertido com sucesso");
        resolve(fs.readFileSync(outputPath));
        fs.unlinkSync(outputPath);
      })
      .on("error", (error) => {
        console.log("Erro ao converter o vídeo:", error);
        reject(error);
      })
      .save(outputPath);
  });
