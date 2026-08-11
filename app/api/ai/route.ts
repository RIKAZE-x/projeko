import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, hero, location, level } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ text: 'Oracle offline: OPENAI_API_KEY is not configured on the server.' }, { status: 503 });
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      instructions: 'You are the Oracle of Veilbound, a dark fantasy RPG narrator. Stay immersive, concise, and actionable. Never claim to change game state yourself. Answer in Indonesian if the player asks in Indonesian.',
      input: `World: ${location}. Hero: ${hero?.name}, class ${hero?.role}, level ${level}. Player asks: ${prompt}`,
      max_output_tokens: 300,
    });
    return NextResponse.json({ text: response.output_text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ text: 'The Oracle falters beyond the Veil.' }, { status: 500 });
  }
}
