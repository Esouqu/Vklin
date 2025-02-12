import { SPECTATOR_DATA_URL } from "$env/static/private";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ fetch }) => {
  const url = SPECTATOR_DATA_URL;
  const response = await fetch(url);

  if (response.status === 502) {
    return new Response('Bad Gateway', { status: 502 });
  }

  const data = await response.json();
  return json(data);
};
