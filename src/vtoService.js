/**
 * Service de connexion à l'IA Replicate
 * Utilise les variables d'environnement pour la sécurité
 */

const API_KEY = import.meta.env.VITE_REPLICATE_API_TOKEN;
const MODEL_VERSION = "7299ed28669976f7093570678d21ef9a82d02927233df86a7c797a7e8e6e580a"; // Modèle VTO

export const generateVTO = async (faceImage, hairStyleUrl) => {
  if (!API_KEY) {
    throw new Error("Clé API manquante. Configurez VITE_REPLICATE_API_TOKEN sur Netlify.");
  }

  try {
    // 1. Création de la prédiction
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
          mask: hairStyleUrl,
          prompt: "high quality, professional hairstyle, realistic",
        },
      }),
    });

    const data = await response.json();
    
    if (data.detail) {
      throw new Error(data.detail);
    }

    // 2. Récupération du résultat (Polling)
    let prediction = data;
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise(r => setTimeout(r, 2000)); // Attendre 2 secondes
      const res = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { "Authorization": `Token ${API_KEY}` },
      });
      prediction = await res.json();
    }

    if (prediction.status === "failed") {
      throw new Error("La génération a échoué.");
    }

    return prediction.output; // URL de l'image générée
  } catch (error) {
    console.error("Erreur VTO Service:", error);
    throw error;
  }
};
