import ytdl from "ytdl-core";
import fs from "fs";

export const download = (videoID) => new Promise((resolve, reject) => {
  const videoURL = "https://www.youtube.com/shorts/" + videoID;
  console.log("Realizando o download do video", videoID);

  ytdl(videoURL, { quality: "lowestaudio", filter: "audioonly" })
    .on("info", (info) => {
      const seconds = info.formats[0].approxDurationMs / 1000

      if (seconds > 60) {
        throw new Error("A Duração desse video é maior do que 60 segundos.");
      }
    })
    .on("end", () => {
      console.log("Download do video finalizado.")
      resolve()
    })

    .on("error", (error) => {
      console.log(
        "Não foi possível fazer o download do video. Detalhes do erro",
        error
      )
      reject(error)
    })
    .pipe(fs.createrWriteStream("./tmp/audio.mp4"))
})

