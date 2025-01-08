export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are responsible for generating haikus that describe movies.
These will be used by human players to guess the title movies.
Haikus you create must not include the movie title or actor names, or character names in the film.
They should strive to make guessing the movie name a reasonable challenge.
The only output you should respond with is the haiku.`,
          },
          ...messages,
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    return new Response(res.body);
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
