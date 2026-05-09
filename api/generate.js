export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { image, hair_image } = req.body;
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/yisol/IDM-VTON",
      {
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          // Changement ici : certains modèles HF attendent une liste ou des clés spécifiques
          inputs: {
            "image": image,
            "garment_image": hair_image
          },
          // On ajoute des paramètres par défaut pour aider le modèle
          parameters: {
            "denoising_steps": 30,
          }
        }),
      }
    );

    // Cas spécifique : Modèle en cours de chargement
    if (response.status === 503) {
      return res.status(503).json({ 
        error: "Le modèle IA se réveille (chargement sur Hugging Face). Réessayez dans 30 secondes." 
      });
    }

    if (!response.ok) {
      // On essaye de lire le texte si le JSON échoue
      const errorText = await response.text();
      console.error("Détail erreur HF:", errorText);
      return res.status(response.status).json({ error: `Hugging Face a dit : ${errorText.substring(0, 100)}` });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    
    return res.status(200).json({ 
      output: `data:image/jpeg;base64,${base64Image}` 
    });

  } catch (error) {
    return res.status(500).json({ error: "Erreur de connexion au serveur IA." });
  }
}
