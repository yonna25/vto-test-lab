/**
 * Service VTO Ultra-simplifié (Zéro blocage CORS)
 * Ce fichier communique uniquement avec ton serveur Vercel.
 */
export const generateVTO = async (faceImage, hairStyleUrl) => {
  try {
    // On appelle ta route interne définie dans /api/generate.js
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: faceImage,
        hair_image: hairStyleUrl
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si le serveur renvoie une erreur (ex: version du modèle, clé API)
      throw new Error(data.error || "Erreur serveur");
    }

    // Le serveur a fait tout le travail, il nous donne directement l'image
    return data.output;
  } catch (error) {
    console.error("VTO Error:", error.message);
    throw error;
  }
};
