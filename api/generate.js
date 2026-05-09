export default async function handler(req, res) {
  // Sécurité JSON
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { image, hair_image } = req.body;
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({ error: "Configuration Vercel : HUGGINGFACE_TOKEN manquant." });
  }

  try {
    // URL exacte pour l'Inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/yisol/IDM-VTON",
      {
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          // Pour IDM-VTON, les noms des paramètres doivent être précis
          inputs: {
            "background_image": image,
            "garment_image": hair_image
          }
        }),
      }
    );

    // Gestion du réveil du modèle (Erreur 503)
    if (response.status === 503) {
      return res.status(503).json({ 
        error: "Le modèle IA est en cours de chargement sur Hugging Face. Réessayez dans 30 secondes." 
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }));
      throw new Error(errorData.error || `Erreur HF: ${response.status}`);
    }

    // Récupération de l'image
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    
    return res.status(200).json({ 
      output: `data:image/jpeg;base64,${base64Image}` 
    });

  } catch (error) {
    console.error("Erreur API:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
