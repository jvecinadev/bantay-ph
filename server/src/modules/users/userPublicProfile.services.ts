import { prisma } from "../../db/prisma";

export const getUserPublicProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      profile: { select: { avatarUrl: true } },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.profile?.avatarUrl ?? null,
  };
}