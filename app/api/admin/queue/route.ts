import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 


/** 
 * An endpoint for editing a piece of artwork. Only the right user should be allowed to do this i.e. the user who
 * is logged in can only PATCH their own artwork
 * and also const/adminNotifications for messaging templates and creating an admin action
 */

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  //const { title } = await params
  

  // TASK FOR DEV:
  // 1. Get user ID from session (MUST be admin).
  // 2. Find the artwork by its ID

  const artwork = [
    {
      name: "Ashley Lafortune",
      title: "Sweet Dreams",
      medium: "Digital Illustration",
      year: 2023,
      image: "/Ashley 1.JPG",
    },
    {
      name: "Griffin Lonergan",
      title: "Urban Stories",
      medium: "Mixed Media",
      year: 2023,
      image: "/Griffin 1.jpg",
    },
    {
      name: "Syleah Forde",
      title: "Island Paradise",
      medium: "Digital Art",
      year: 2023,
      image: "/Syleah 2.png",
    },
    {
      name: "Ashley Lafortune",
      title: "Koi Fish",
      medium: "Digital Painting",
      year: 2023,
      image: "/Ashley 2.JPG",
    },
    {
      name: "Griffin Lonergan",
      title: "Mountain Journey",
      medium: "Digital Illustration",
      year: 2022,
      image: "/Griffin 3.jpg",
    },
    {
      name: "Syleah Forde",
      title: "Abstract Expression",
      medium: "Mixed Media",
      year: 2023,
      image: "/Syleah 3.jpg",
    },
    {
      name: "Ashley Lafortune",
      title: "Floral Dreams",
      medium: "Mixed Media",
      year: 2022,
      image: "/Ashley 3.JPG",
    },
    {
      name: "Griffin Lonergan",
      title: "Wild Spirit",
      medium: "Digital Art",
      year: 2023,
      image: "/Griffin 4.jpg",
    },
    {
      name: "Syleah Forde",
      title: "Cultural Fusion",
      medium: "Digital Illustration",
      year: 2022,
      image: "/imgs/carousel3.jpg",
    },
    {
      name: "Griffin Lonergan",
      title: "Dreamscape",
      medium: "Adobe Photoshop",
      year: 2023,
      image: "/Griffin 5.jpg",
    },
    {
      name: "Ashley Lafortune",
      title: "Creative Vision",
      medium: "Digital Art",
      year: 2023,
      image: "/imgs/carousel1.png",
    },
    {
      name: "Griffin Lonergan",
      title: "Portrait Study",
      medium: "Digital Painting",
      year: 2022,
      image: "/imgs/griffin2.jpg",
    },
  ]

  return NextResponse.json({ artwork });
  //return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
}