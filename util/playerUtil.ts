import prisma from "@/lib/prismadb";

export const getPlayers = async () => {
  if (!process.browser) return null;

  const res = await fetch(
    "http://" + window.location.host + "/api/get_players"
  );
  const data = await res.json();
  return data.players;
};
