/**
 * Service VTO mis à jour : Appel sécurisé via Vercel API Route
 */

export const generateVTO = async (faceImage, hairStyleUrl) => {
  try {
    // 1. Appel de ton API interne (sécurisée sur le serveur Vercel)
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: faceImage,
        hair_image: hairStyleUrl,
        prompt: "high quality hairstyle try-on, realistic"
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de l'appel API");
    }

    // 2. Polling (attente du résultat) - On garde le polling en direct vers Replicate
    // car le GET est généralement autorisé par CORS sur leurs serveurs
    let prediction = data;
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise(r => setTimeout(r, 2000));
      
      const res = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 
          "Authorization": `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}` // Garde VITE_ ici car c'est côté client
        },
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
