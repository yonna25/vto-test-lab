export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { image, hair_image } = req.body;
  const API_KEY = process.env.REPLICATE_API_TOKEN;

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Nouvelle version correspondante au modèle idm-vton
        version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
        input: {
          human_img: image,      // Ton selfie
          garm_img: hair_image,  // La coiffure choisie
          garment_des: "cute hairstyle"
        },
      }),
    });

    let prediction = await response.json();
    if (!response.ok) throw new Error(prediction.detail || "Erreur Replicate");

    // Attente du résultat final sur le serveur
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise(r => setTimeout(r, 2000));
      const check = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { "Authorization": `Token ${API_KEY}` },
      });
      prediction = await check.json();
    }

    if (prediction.status === "failed") throw new Error("La génération a échoué");

    // On renvoie l'URL de l'image générée
    return res.status(200).json({ output: prediction.output });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
