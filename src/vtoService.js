/**
 * Service VTO avec vérification de configuration
 */

const getApiKey = () => {
  // On cherche la clé dans les variables d'environnement de Vite
  return import.meta.env.VITE_REPLICATE_API_TOKEN;
};

const MODEL_VERSION = "7299ed28669976f7093570678d21ef9a82d02927233df86a7c797a7e8e6e580a";

export const generateVTO = async (faceImage, hairStyleUrl) => {
  const API_KEY = getApiKey();

  if (!API_KEY) {
    console.error("ERREUR : La variable VITE_REPLICATE_API_TOKEN est vide sur Netlify.");
    throw new Error("Configuration API manquante.");
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          image: faceImage,
          hair_image: hairStyleUrl, // Vérifie si ton modèle demande 'hair_image' ou 'mask'
          prompt: "high quality hairstyle try-on, realistic",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Erreur API Replicate");
    }

    // Polling (attente du résultat)
    let prediction = data;
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise(r => setTimeout(r, 2000));
      const res = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
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
