import express from 'express';
import OpenAI from 'openai';
import { splitTextIntoSegments } from './utils.js';

const app = express();
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/analyze', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }
  const segments = splitTextIntoSegments(text);
  const prompt = `Classify each segment as "Audit Knowledge", "Client Permanent", "Current Year", or "None". Return JSON with a key segments containing an array of objects {"text":...,"category":...}. Segments:\n\n${segments.map((s,i)=>`${i+1}. ${s}`).join('\n')}`;
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    const data = JSON.parse(completion.choices[0].message.content);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
