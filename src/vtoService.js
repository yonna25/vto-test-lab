/**
 * Service VTO avec vérification de configuration et Proxy CORS
 */

const getApiKey = () => {
  return import.meta.env.VITE_REPLICATE_API_TOKEN;
};

const MODEL_VERSION = "7299ed28669976f7093570678d21ef9a82d02927233df86a7c797a7e8e6e580a";
const PROXY_URL = "https://corsproxy.io/?";

export const generateVTO = async (faceImage, hairStyleUrl) => {
  const API_KEY = getApiKey();

  if (!API_KEY) {
    throw new Error("Configuration API manquante.");
  }

  try {
    // 1. Envoi de la prédiction via Proxy
    const targetUrl = "https://api.replicate.com/v1/predictions";
    const response = await fetch(PROXY_URL + encodeURIComponent(targetUrl), {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          image: faceImage,
          hair_image: hairStyleUrl,
          prompt: "high quality hairstyle try-on, realistic",
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Erreur API Replicate");

    // 2. Polling (attente du résultat) via Proxy
    let prediction = data;
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise(r => setTimeout(r, 2000));
      
      const pollUrl = `https://api.replicate.com/v1/predictions/${prediction.id}`;
      const res = await fetch(PROXY_URL + encodeURIComponent(pollUrl), {
        headers: { "Authorization": `Token ${API_KEY}` },
      });
      prediction = await res.json();
    }

    if (prediction.status === "failed") throw new Error("Génération échouée");

    return prediction.output;
  } catch (error) {
    console.error("VTO Error:", error.message);
    throw error;
  }
};
