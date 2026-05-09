export default async function handler(req, res) {
  // Sécurité : n'accepte que le POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { image, hair_image, prompt } = req.body;
  
  // Utilise la variable que tu as créée dans Vercel
  const API_KEY = process.env.REPLICATE_API_TOKEN;

  if (!API_KEY) {
    return res.status(500).json({ error: "La clé REPLICATE_API_TOKEN n'est pas configurée sur le serveur." });
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "7299ed28669976f7093570678d21ef9a82d02927233df86a7c797a7e8e6e580a",
        input: { 
          image: image, 
          hair_image: hair_image, 
          prompt: prompt || "high quality hairstyle try-on, realistic" 
        }
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur : " + error.message });
  }
}
