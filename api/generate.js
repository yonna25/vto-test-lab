export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { image, hair_image } = req.body;
  const API_KEY = process.env.REPLICATE_API_TOKEN;

  try {
    // 1. Lancer la génération
    const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "7299ed28669976f7093570678d21ef9a82d02927233df86a7c797a7e8e6e580a",
        input: { image, hair_image }
      }),
    });

    let prediction = await startResponse.json();
    if (!startResponse.ok) throw new Error(prediction.detail || "Erreur Replicate");

    // 2. Attendre le résultat (Polling côté serveur)
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise(r => setTimeout(r, 2000));
      const checkResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { "Authorization": `Token ${API_KEY}` },
      });
      prediction = await checkResponse.json();
    }

    if (prediction.status === "failed") throw new Error("La génération a échoué sur Replicate");

    // 3. Renvoyer le résultat final au téléphone
    return res.status(200).json({ output: prediction.output });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
