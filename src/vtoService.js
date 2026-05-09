/**
 * Service VTO Ultra-simplifié (Zéro blocage CORS)
 */
export const generateVTO = async (faceImage, hairStyleUrl) => {
  try {
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
      throw new Error(data.error || "Erreur serveur");
    }

    // Le résultat est directement dans data.output
    return data.output;
  } catch (error) {
    console.error("VTO Error:", error.message);
    throw error;
  }
};
