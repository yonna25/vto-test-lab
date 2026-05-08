/**
 * Service pour gérer les appels au modèle de Virtual Try-On
 */
export const generateTryOn = async (userImageBase64, targetStyleUrl) => {
  // Note : Dans un environnement de test, nous utilisons une URL d'API
  // Vous devrez configurer votre clé API dans les variables d'environnement
  const API_KEY = import.meta.env.VITE_REPLICATE_API_TOKEN;

  if (!API_KEY) {
    throw new Error("Clé API manquante. Configurez VITE_REPLICATE_API_TOKEN.");
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // ID du modèle IDM-VTON (à titre d'exemple)
        version: "71c33648a8010834371cd72535091f0951478161e1b2123f03b5b54bc9cf3457",
        input: {
          human_image: userImageBase64,
          garment_image: targetStyleUrl,
        }
      })
    });

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'appel IA:", error);
    throw error;
  }
};
