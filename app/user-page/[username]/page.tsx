import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UserPortalClient from "../UserPortalClient";



export default async function UserProfilePage({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  
  // Fetch user profile by username
  const profile = await prisma.profile.findFirst({
    where: {
      user: { username }
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true
        }
      }
    }
  });

  if (!profile) {
    notFound();
  }

  const isOwnProfile = session?.user?.username === username;
  const profileForClient = {
  display_name: profile.display_name,
  bio: profile.bio,
  profile_image_url: profile.profile_image_url,
 
  school: profile.school,

  year: profile.graduation_year,
  instagram: profile.instagram_handle,

  user: {
    id: profile.user.id,
    username: profile.user.username,
  },
};
  return <UserPortalClient profile={profileForClient} isOwnProfile={isOwnProfile} />;
}