/**
 * Service VTO avec Debugging de clé et Proxy CORS
 */

const getApiKey = () => {
  const key = import.meta.env.VITE_REPLICATE_API_TOKEN;
  // Ce log te dira immédiatement si la clé est présente ou non dans la console
  console.log("État de la clé API :", key ? "DÉTECTÉE (Commence par " + key.substring(0, 5) + ")" : "NON DÉTECTÉE");
  return key;
};

const MODEL_VERSION = "7299ed28669976f7093570678d21ef9a82d02927233df86a7c797a7e8e6e580a";
const PROXY_URL = "https://corsproxy.io/?";

export const generateVTO = async (faceImage, hairStyleUrl) => {
  const API_KEY = getApiKey();

  if (!API_KEY) {
    throw new Error("Configuration API manquante dans l'environnement.");
  }

  try {
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
