import { redirect } from 'next/navigation';
import AdminDashboard from "@/components/admin/AdminDashboard"
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

//make page for admin authorization
export default async function AdminPage() {

  //check if user is an admin, otherwise, redirect back
  const session = await getServerSession(authOptions)
  
  //admin check disabled temporarily for testing
  // if (session?.user.role !== 'ADMIN') {
  //   redirect('/');
  // }
  return <AdminDashboard />;
}