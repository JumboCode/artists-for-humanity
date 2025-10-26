"use client"; 
import Image from "next/image";
import banner from "../imgs/profile-banner-temp.png";
import userImg from "../imgs/user-stock.png"
import meow from "../imgs/meow.jpg"
import { useState } from "react";


const profile1 = 
{ 
  name: "John Doe", 
  title: "Graphic Designer", 
  year: "Junior", 
  school: "Tufts", 
  instagram: "Username01", 
  avatar: "/imgs/user-stock.jpg", 
  banner: "/imgs/profile-banner-temp.png" 
}

const publicArtwork = 
[
  {
    image: meow, 
    title: "image 1"
  }, 
  {
    image: meow, 
    title: "image 2"
  }, 
  {
    image: banner, 
    title: "image 3"
  }, 
  {
    image: userImg, 
    title: "image 4"
  }, 
  {
    image: meow, 
    title: "image 5"
  }
]

const privateArtwork = 
[
  {
    image: meow, 
    title: "draft 1"
  },
  {
    image: meow, 
    title: "draft 2"
  },

]

export default function UserPage() {
  const [onPublished, setTab] = useState(true);
  return (
    <div className="bg-afh-white min-w-screen container-afh">
      {/* 🔸 FULL-WIDTH HERO IMAGE */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <Image
          src={banner}
          alt="Banner Image"
          className="w-full h-[30vh]"
          priority
        />
      </div>

      <div className="h-full w-full flex flex gap-[50px]">
        <div className="afh-section user-info -translate-y-[30px] w-[30%] flex flex-col gap-[40px]">
          
          {/* Profile image and name */}
          <div className="flex flex-col">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white bg-white">
              <Image 
                src={userImg}
                alt="user profile picture"
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </div>

            <p className="font-primary text-[40px] font-light">{profile1.name}</p>
          </div>

          {/* Other user info */}
          <div className="flex flex-col gap-2 justify-start font-secondary font-light text-[16px]">
              {/* title */}
              <div className = "flex items-center gap-2.5"> 
                  <svg width="22" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.0714 3.04545C12.0714 3.04545 12.0714 0.5 9.5 0.5C6.92857 0.5 6.92857 3.04545 6.92857 3.04545M4.35714 14.5V3.04545M14.6429 14.5V3.04545M18.5 3.04545H0.5V14.5H18.5V3.04545Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>{profile1.title}</p> 
              </div> 
              {/* year @ school */}
              <div className = "flex items-center gap-2.5"> 
                  <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.9933 13.6822V7.16552L10.8115 11.7933L0.811523 6.12663L10.8115 0.459961L20.8115 6.12663V13.6822H18.9933ZM10.8115 17.46L4.44789 13.8711V9.14885L10.8115 12.7377L17.1752 9.14885V13.8711L10.8115 17.46Z" stroke="#313E48" strokeWidth="0.8"/>
                  </svg>
                  <p>{profile1.year}@{profile1.school}</p>
              </div> 
              {/* instagram */}
              <div className = "flex items-center gap-2.5"> 
                  <svg width="22" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.21973 1.25H13.7803C16.522 1.25015 18.7499 3.47801 18.75 6.21973V13.7803C18.7499 15.0983 18.2259 16.362 17.2939 17.2939C16.362 18.2259 15.0983 18.7499 13.7803 18.75H6.21973C3.47801 18.7499 1.25015 16.522 1.25 13.7803V6.21973L1.25586 5.97363C1.31678 4.7452 1.83223 3.57988 2.70605 2.70605C3.57988 1.83223 4.7452 1.31678 5.97363 1.25586L6.21973 1.25ZM6.04004 2.5498C5.11443 2.5498 4.22677 2.91776 3.57227 3.57227C2.91776 4.22677 2.5498 5.11443 2.5498 6.04004V13.96C2.5498 15.889 4.11097 17.4502 6.04004 17.4502H13.96C14.8856 17.4502 15.7732 17.0822 16.4277 16.4277C17.0822 15.7732 17.4502 14.8856 17.4502 13.96V6.04004C17.4502 4.11097 15.889 2.5498 13.96 2.5498H6.04004ZM10 5.75C11.1272 5.75 12.2079 6.19809 13.0049 6.99512C13.8019 7.79215 14.25 8.87283 14.25 10C14.25 11.1272 13.8019 12.2079 13.0049 13.0049C12.2079 13.8019 11.1272 14.25 10 14.25C8.87283 14.25 7.79215 13.8019 6.99512 13.0049C6.19809 12.2079 5.75 11.1272 5.75 10C5.75 8.87283 6.19809 7.79215 6.99512 6.99512C7.79215 6.19809 8.87283 5.75 10 5.75ZM10 7.0498C9.21761 7.0498 8.46729 7.36083 7.91406 7.91406C7.36083 8.46729 7.0498 9.21761 7.0498 10C7.0498 10.7824 7.36083 11.5327 7.91406 12.0859C8.46729 12.6392 9.21761 12.9502 10 12.9502C10.7824 12.9502 11.5327 12.6392 12.0859 12.0859C12.6392 11.5327 12.9502 10.7824 12.9502 10C12.9502 9.21761 12.6392 8.46729 12.0859 7.91406C11.5327 7.36083 10.7824 7.0498 10 7.0498ZM14.7246 4.40039C14.9567 4.40039 15.1797 4.49216 15.3438 4.65625C15.5078 4.82034 15.5996 5.04333 15.5996 5.27539C15.5995 5.50727 15.5077 5.72956 15.3438 5.89355C15.1797 6.05765 14.9567 6.15039 14.7246 6.15039C14.4927 6.15029 14.2704 6.05756 14.1064 5.89355C13.9424 5.72955 13.8497 5.50731 13.8496 5.27539C13.8496 5.04333 13.9424 4.82034 14.1064 4.65625C14.2704 4.49231 14.4927 4.40049 14.7246 4.40039Z" fill="black" stroke="white" strokeWidth="0.5"/>
                  </svg>
                  <p>{profile1.instagram}</p> 
              </div> 
          </div>

          <div> 
            <button className="text-[20px] btn-outline rounded-full font-primary font-light inline-flex justify-start">Upload a New Project</button>
          </div> 
        </div>

        {/* Galery Section */}
        <div className = "afh-section galery-section w-[70%] -translate-y-[30px] section-padding flex flex-col gap-[40px]">
            <div className= "flex gap-[25px] w-full border-b-2 h-auto">
              <button className = {`relative h-full border-b-2 bottom-[-2px] ${onPublished ? "border-black" : "border-transparent"}`} onClick = {() => setTab(true)}> Published </button>
              <button className = {`relative h-full border-b-2 bottom-[-2px] ${onPublished ? "border-transparent" : "border-black"}`} onClick = {() => setTab(false)}> Drafts </button>
            </div>
            {onPublished && (
              <div className=" gallery-grid gap-[60px] grid-cols-2 font-primary text-[10px]">
                  {publicArtwork.map((art, index) => (
                      <div key ={index} className = "card card-hover bg-white flex flex-col gap-[10px]">
                        <Image  
                          src={art.image}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          alt= {`your published artwork, titled ${art.title}`}
                        />
                        <p className = "p-2"> {art.title} </p>
                      </div>
                  ))} 
              </div>
            )}
            { !onPublished && (
              <div className=" gallery-grid gap-[60px] grid-cols-2 font-primary text-[10px]">
                  {privateArtwork.map((art, index) => (
                      <div key ={index} className = "card card-hover bg-white flex flex-col gap-[10px]">
                        <Image  
                          src={art.image}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          alt= {`your draft titled ${art.title}`}
                        />
                        <p className = "p-2"> {art.title} </p>
                      </div>
                  ))} 
              </div>
            )}
        </div>
      </div>
  </div> 
  );
}
