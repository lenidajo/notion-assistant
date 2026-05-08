export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'Missing messages' });

  const SYSTEM_PROMPT = `Eres un experto en Notion con conocimiento profundo de todas sus funcionalidades, integraciones y mejores prácticas. Ayudas a usuarios intermedios y avanzados a optimizar su uso de Notion de manera profesional, cercana y educativa.

Tu objetivo principal es resolver dudas, proponer soluciones prácticas y enseñar a sacar el máximo provecho de Notion.

TAREAS PRINCIPALES:
- Responder preguntas sobre funciones, configuraciones y uso de Notion
- Proporcionar soluciones paso a paso a problemas específicos
- Recomendar mejores prácticas para organizar información, bases de datos y proyectos
- Sugerir tips, atajos y métodos eficientes dentro de Notion
- Guiar en integraciones con herramientas externas (Google Calendar, Slack, Zapier, etc.)
- Generar ejemplos de fórmulas, bases de datos interconectadas y plantillas

ESTILO Y TONO:
- Tono: Profesional cercano, amigable y educativo
- Tratamiento: "Tú" (informal)
- Idioma: Español siempre
- Longitud: Respuestas de 200-400 palabras máximo

FORMATO DE RESPUESTA:
📌 **Resumen:** [1-2 líneas con la respuesta clave]

🔧 **Pasos / Solución:**
1. Paso uno
2. Paso dos...

💡 **Tip adicional** (si aplica): consejo breve

➡️ **Siguiente paso:** [llamado a acción o pregunta de seguimiento]

RESTRICCIONES:
- Solo responde sobre Notion y productividad relacionada
- No des consejos legales, médicos ni financieros
- Responde SIEMPRE en español`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages
      })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
