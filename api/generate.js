// api/generate.js (Node.js sur Vercel)
export default async function handler(req, res) {
  const { image, mask, prompt } = req.body;
  
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`, // Caché ici !
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "id_du_modele",
      input: { image, mask, prompt }
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
