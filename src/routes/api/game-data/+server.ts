import { SPECTATOR_DATA_URL } from "$env/static/private";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ fetch }) => {
  const url = SPECTATOR_DATA_URL;
  const data = await fetch(url).then(res => res.json());

  return json(data);
};