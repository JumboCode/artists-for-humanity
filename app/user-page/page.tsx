import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function UserPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.username) {
    redirect("/login");
  }

  redirect(`/user-page/${session.user.username}`);
}
