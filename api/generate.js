export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { image, hair_image } = req.body;
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

  try {
    // Appel à l'Inference API de Hugging Face pour IDM-VTON
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

    if (!response.ok) throw new Error("Le modèle est peut-être en train de charger, réessayez dans 30 secondes.");

    // Hugging Face renvoie l'image. On la convertit en base64 pour le front-end
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const imageData = `data:image/jpeg;base64,${base64}`;

    return res.status(200).json({ output: imageData });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
