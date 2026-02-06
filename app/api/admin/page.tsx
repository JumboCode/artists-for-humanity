import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard' 
import { useSession } from "next-auth/react"

//make page for admin authorization
export default async function AdminPage() {

  //check if user is an admin, otherwise, redirect back
  // const session = await getServerSession(authOptions);
  const {data: session} = useSession()
  if (session?.user.role !== 'ADMIN') {
    redirect('/');
  }
  return <AdminDashboard />;
}