export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { image, hair_image } = req.body;
  // ON UTILISE BIEN LE NOUVEAU NOM ICI
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({ error: "Clé API Hugging Face manquante sur Vercel" });
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur Hugging Face");
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    
    return res.status(200).json({ output: `data:image/jpeg;base64,${base64}` });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
