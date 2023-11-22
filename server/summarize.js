import fetch from "node-fetch";

const API_URL =
  "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
const API_TOKEN = "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"; // Insira sua chave API correta aqui

export async function summarize(text) {
  try {
    console.log("Realizando o resumo...");
    console.log("Texto de Entrada:", text);

    // Verificar se o texto de entrada está vazio ou indefinido
    if (!text || text.trim() === "") {
      throw new Error("O texto de entrada para resumo está vazio ou inválido.");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 300, // Ajustando para permitir um resumo mais longo
          min_length: 200,
          do_sample: true,
          early_stopping: false,
          num_beams: 4,
        },
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Resumo concluído com sucesso!");
      console.log("Saída do Gerador:", result);
      return result[0].summary_text;
    } else {
      throw new Error(result.error || "Erro ao realizar o resumo.");
    }
  } catch (error) {
    console.log("Não foi possível realizar o resumo", error);
    throw new Error(error);
  }
}
