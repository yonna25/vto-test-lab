export default async function handler(req, res) {
  // Sécurité pour garantir une réponse JSON quoi qu'il arrive
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { image, hair_image } = req.body;
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

  // Vérification de la présence du jeton
  if (!HF_TOKEN) {
    return res.status(500).json({ error: "Configuration Vercel incomplète : HUGGINGFACE_TOKEN manquant." });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/yisol/IDM-VTON",
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: {
            image: image,
            garment_image: hair_image,
          },
        }),
      }
    );

    // Si Hugging Face est en train de charger le modèle (froid)
    if (response.status === 503) {
      return res.status(503).json({ error: "Le modèle IA se réveille... Réessayez dans 20 secondes." });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HF (${response.status}): ${errorText}`);
    }

    // Conversion de l'image binaire reçue en Base64 pour l'affichage
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    
    return res.status(200).json({ 
      output: `data:image/jpeg;base64,${base64Image}` 
    });

  } catch (error) {
    console.error("Erreur API Generate:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
