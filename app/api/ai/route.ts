import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, hero, location, level, world, monster, economy } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ text: 'Oracle offline: OPENAI_API_KEY is not configured on the server.' }, { status: 503 });
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      instructions: `You are the Oracle of Veilbound, a dark-fantasy RPG narrator and systems advisor.
Use the supplied game state as authoritative. Never invent a change to game state and never claim to have executed an action.
Respect these world rules: item identity is Base + Quality + Rank + Affix + Trait + Soul + History + Condition; quality is distinct from rarity; monster Rank measures threat rather than guaranteed victory; skill power depends on Grade/Tier/Level/Mastery/Authority; profession progression can evolve through achievement; the economy has people, guild, state, and magical layers; Grand Treasury maintains monetary stability.
Stay immersive and concise. If the player asks in Indonesian, answer in Indonesian. Offer concrete consequences, tactical choices, lore, or quest hooks without contradicting the provided state.`,
      input: JSON.stringify({ world, location, hero, level, monster, economy, playerQuestion: prompt }),
      max_output_tokens: 450,
    });
    return NextResponse.json({ text: response.output_text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ text: 'The Oracle falters beyond the Veil.' }, { status: 500 });
  }
}
