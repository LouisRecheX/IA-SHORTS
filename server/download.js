import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const download = (videoID) =>
  new Promise((resolve, reject) => {
    const videoURL = "https://www.youtube.com/shorts/" + videoID;
    const outputDir = "./tmp/";
    const outputPath = path.join(outputDir, "video.mp4");
    const ffmpegLocation =
      "C:/Users/Louis_Reche-PC/Documents/ITEM/ffmpeg-2025-02-10-git-a28dc06869-full_build/bin/ffmpeg.exe";

    // Certifique-se de que o diretório de saída existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const command = `yt-dlp ${videoURL} -o ${outputPath} --ffmpeg-location ${ffmpegLocation} --extract-audio --audio-format wav`;
    console.log("Executando o comando:", command);
    exec(command, (error, stdout, stderr) => {
      console.log("Saída do comando:", stdout);
      console.log("Erro do comando:", stderr);
      if (error) {
        console.log(
          "Não foi possível fazer o download do video. Detalhes do erro:",
          error
        );
        reject(error);
      } else {
        console.log("Download do video finalizado.");

        // Verificar se o arquivo de áudio foi criado
        const audioPath = path.join(outputDir, "video.mp4.wav");
        const absoluteAudioPath = path.resolve(audioPath);
        console.log("Caminho absoluto do arquivo de áudio:", absoluteAudioPath);
        if (fs.existsSync(audioPath)) {
          console.log("Áudio extraído com sucesso.");
          resolve(audioPath);
        } else {
          console.log("Erro: O arquivo de áudio não foi encontrado.");
          reject(new Error("O arquivo de áudio não foi encontrado."));
        }
      }
    });
  });
