import { server } from "./server.js";

const form = document.querySelector("#form");
const input = document.querySelector("#url");
const content = document.querySelector("#content");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevenir reset do formulário
  content.classList.add("placeholder");

  const videoURL = input.value;

  if (!videoURL.includes("shorts")) {
    content.textContent = "Esse vídeo não parece ser um shorts.";
    content.classList.remove("placeholder");
    return;
  }

  const videoID = videoURL.split("/shorts/")[1].split("?")[0];

  content.textContent = "Obtendo o texto do áudio...";

  try {
    const transcriptionResponse = await server.get("/summary/" + videoID);
    const transcription = transcriptionResponse.data.transcription; // Ajustar para garantir que está pegando a transcrição correta
    content.textContent = "Realizando o resumo...";

    const summaryResponse = await server.post("/summary", {
      text: transcription,
    });

    const summary = summaryResponse.data.summary; // Ajustar para garantir que está pegando o resumo correto
    content.textContent = summary;
  } catch (error) {
    content.textContent = "Erro ao processar o vídeo.";
    console.error("Erro:", error);
  }

  content.classList.remove("placeholder");
});
