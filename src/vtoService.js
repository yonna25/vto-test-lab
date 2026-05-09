/**
 * Service VTO pour AfroTresse - Version Hugging Face
 * Ce service appelle ta fonction serverless sur Vercel.
 */
export const generateVTO = async (faceImage, hairStyleUrl) => {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        image: faceImage,      // Ta photo (base64)
        hair_image: hairStyleUrl // L'URL de la coiffure
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // On affiche l'erreur précise renvoyée par le serveur (ex: "Modèle en cours de chargement")
      throw new Error(data.error || "Erreur lors de la génération");
    }

    // Le serveur nous renvoie directement l'image en base64 prête à être affichée
    return data.output;
  } catch (error) {
    console.error("Erreur VTO Service:", error.message);
    throw error;
  }
};
