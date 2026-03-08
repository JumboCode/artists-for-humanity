'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// School and year options
const schoolSuggestions = [
  'Tufts University',
  'Harvard University',
  'MIT',
  'Suffolk University',
  'Boston University',
  'Northeastern University',
  'Emerson College',
  'UMass Boston',
  'Boston College',
]
const currentYear = new Date().getFullYear()
const graduationYears = Array.from({ length: 9 }, (_, i) => String(currentYear + i))

type Profile = {
  display_name: string
  bio: string | null
  profile_image_url: string | null
  banner_image_url: string | null
  department: string | null
  school: string | null
  graduation_year: string | null
  instagram: string | null
}

type Artwork = {
  id: string
  title: string
  image_url: string
  thumbnail_url: string | null
  tools_used: string[]
  project_type: string | null
  created_at: string
}

export default function UserPortal() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [onPublished, setOnPublished] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [published, setPublished] = useState<Artwork[]>([])
  const [drafts, setDrafts] = useState<Artwork[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [form, setForm] = useState<Profile>({
    display_name: '',
    bio: null,
    profile_image_url: null,
    banner_image_url: null,
    department: null,
    school: null,
    graduation_year: null,
    instagram: null,
  })

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Fetch user profile and artwork
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile()
      fetchArtwork()
    }
  }, [status])

  async function fetchProfile() {
    try {
      const res = await fetch('/api/users/profile')
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      setProfile(data.profile || {
        display_name: session?.user?.name || '',
        bio: null,
        profile_image_url: null,
        banner_image_url: null,
        department: null,
        school: null,
        graduation_year: null,
        instagram: null,
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchArtwork() {
    try {
      const res = await fetch('/api/users/artwork')
      if (!res.ok) throw new Error('Failed to fetch artwork')
      const data = await res.json()
      setPublished(data.published || [])
      setDrafts(data.drafts || [])
    } catch (error) {
      console.error('Error fetching artwork:', error)
    }
  }

  function openEdit() {
    if (profile) {
      setForm(profile)
      setImagePreview(profile.profile_image_url)
      setBannerPreview(profile.banner_image_url)
      setIsEditing(true)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB')
      return
    }

    setUploadingImage(true)

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'afh-upload')
      formData.append('folder', 'profile-images')

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) throw new Error('Failed to upload image')

      const data = await response.json()
      const imageUrl = data.secure_url

      // Update form state and preview
      setForm({ ...form, profile_image_url: imageUrl })
      setImagePreview(imageUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB')
      return
    }

    setUploadingBanner(true)

    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'afh-upload')
      formData.append('folder', 'banner-images')

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) throw new Error('Failed to upload banner')

      const data = await response.json()
      const imageUrl = data.secure_url

      // Update form state and preview
      setForm({ ...form, banner_image_url: imageUrl })
      setBannerPreview(imageUrl)
    } catch (error) {
      console.error('Error uploading banner:', error)
      alert('Failed to upload banner. Please try again.')
    } finally {
      setUploadingBanner(false)
    }
  }

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.display_name.trim()) {
      alert('Display name is required')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Failed to update profile')

      const data = await res.json()
      setProfile(data.profile)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  function cancelEdit() {
    setIsEditing(false)
    setImagePreview(null)
    setBannerPreview(null)
    if (profile) setForm(profile)
  }

  function navigateToUpload() {
    router.push('/upload')
  }

  const displayName = profile?.display_name || session?.user?.name || 'User'

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 font-secondary">Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-secondary">Failed to load profile</p>
      </div>
    )
  }

  return (
    <div className="bg-afh-white min-w-screen container-afh text-[black]">
      {/* 🔸 FULL-WIDTH HERO IMAGE */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <Image
          src={profile.banner_image_url || '/imgs/profile-banner-temp.png'}
          alt="Banner Image"
          className="w-full h-[30vh] object-cover"
          width={1200}
          height={300}
          priority
        />
      </div>

      <div className="h-full w-full flex max-md:flex-col gap-[50px]">
        <div className="afh-section user-info -translate-y-[30px] w-[30%] md:w-[45%] max-md:w-full max-md:items-center xs: items-center flex flex-col gap-[40px]">
          {/* Profile image and name */}
          <div className="flex flex-col">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white bg-white">
              <Image
                src={profile.profile_image_url || '/imgs/user-stock.png'}
                alt="user profile picture"
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </div>

            <p className="font-primary text-[40px] font-light">
              {displayName}
            </p>
          </div>

          {/* Other user info */}
          <div className="flex flex-col gap-2 justify-start font-secondary font-light text-[16px]">
            {/* Bio/Department */}
            {(profile.bio || profile.department) && (
              <div className="flex items-center gap-2.5">
                <svg
                  width="22"
                  height="15"
                  viewBox="0 0 19 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0714 3.04545C12.0714 3.04545 12.0714 0.5 9.5 0.5C6.92857 0.5 6.92857 3.04545 6.92857 3.04545M4.35714 14.5V3.04545M14.6429 14.5V3.04545M18.5 3.04545H0.5V14.5H18.5V3.04545Z"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>{profile.department || profile.bio}</p>
              </div>
            )}
            
            {/* School & Year */}
            {(profile.school || profile.graduation_year) && (
              <div className="flex items-center gap-2.5">
                <svg
                  width="22"
                  height="18"
                  viewBox="0 0 22 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.9933 13.6822V7.16552L10.8115 11.7933L0.811523 6.12663L10.8115 0.459961L20.8115 6.12663V13.6822H18.9933ZM10.8115 17.46L4.44789 13.8711V9.14885L10.8115 12.7377L17.1752 9.14885V13.8711L10.8115 17.46Z"
                    stroke="#313E48"
                    strokeWidth="0.8"
                  />
                </svg>
                <p>
                  {profile.school && profile.graduation_year ? `${profile.school} ${profile.graduation_year}` : profile.school || profile.graduation_year}
                </p>
              </div>
            )}
            
            {/* Instagram */}
            {profile.instagram && (
              <div className="flex items-center gap-2.5">
              <svg
                width="22"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.21973 1.25H13.7803C16.522 1.25015 18.7499 3.47801 18.75 6.21973V13.7803C18.7499 15.0983 18.2259 16.362 17.2939 17.2939C16.362 18.2259 15.0983 18.7499 13.7803 18.75H6.21973C3.47801 18.7499 1.25015 16.522 1.25 13.7803V6.21973L1.25586 5.97363C1.31678 4.7452 1.83223 3.57988 2.70605 2.70605C3.57988 1.83223 4.7452 1.31678 5.97363 1.25586L6.21973 1.25ZM6.04004 2.5498C5.11443 2.5498 4.22677 2.91776 3.57227 3.57227C2.91776 4.22677 2.5498 5.11443 2.5498 6.04004V13.96C2.5498 15.889 4.11097 17.4502 6.04004 17.4502H13.96C14.8856 17.4502 15.7732 17.0822 16.4277 16.4277C17.0822 15.7732 17.4502 14.8856 17.4502 13.96V6.04004C17.4502 4.11097 15.889 2.5498 13.96 2.5498H6.04004ZM10 5.75C11.1272 5.75 12.2079 6.19809 13.0049 6.99512C13.8019 7.79215 14.25 8.87283 14.25 10C14.25 11.1272 13.8019 12.2079 13.0049 13.0049C12.2079 13.8019 11.1272 14.25 10 14.25C8.87283 14.25 7.79215 13.8019 6.99512 13.0049C6.19809 12.2079 5.75 11.1272 5.75 10C5.75 8.87283 6.19809 7.79215 6.99512 6.99512C7.79215 6.19809 8.87283 5.75 10 5.75ZM10 7.0498C9.21761 7.0498 8.46729 7.36083 7.91406 7.91406C7.36083 8.46729 7.0498 9.21761 7.0498 10C7.0498 10.7824 7.36083 11.5327 7.91406 12.0859C8.46729 12.6392 9.21761 12.9502 10 12.9502C10.7824 12.9502 11.5327 12.6392 12.0859 12.0859C12.6392 11.5327 12.9502 10.7824 12.9502 10C12.9502 9.21761 12.6392 8.46729 12.0859 7.91406C11.5327 7.36083 10.7824 7.0498 10 7.0498ZM14.7246 4.40039C14.9567 4.40039 15.1797 4.49216 15.3438 4.65625C15.5078 4.82034 15.5996 5.04333 15.5996 5.27539C15.5995 5.50727 15.5077 5.72956 15.3438 5.89355C15.1797 6.05765 14.9567 6.15039 14.7246 6.15039C14.4927 6.15029 14.2704 6.05756 14.1064 5.89355C13.9424 5.72955 13.8497 5.50731 13.8496 5.27539C13.8496 5.04333 13.9424 4.82034 14.1064 4.65625C14.2704 4.49231 14.4927 4.40049 14.7246 4.40039Z"
                  fill="black"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
              <a href={`https://instagram.com/${profile.instagram}`} className="hover:text-afh-orange">
                {profile.instagram}
              </a>
            </div>
            )}
          </div>

          <div className="flex flex-col gap-[20px] max-md:items-center">
            <button
              onClick={openEdit}
              className="border-[1px] max-w-[169px] max-h-[43px] items-center text-[20px] lg:text-[15px] md:text-[15px] max-md:text-[15px] btn-outline rounded-full font-primary font-light inline-flex justify-start px-4 py-2 hover:bg-afh-orange hover:text-white transition-colors"
            >
              Edit Profile Info
            </button>
            <button 
              onClick={navigateToUpload}
              className="border-[1px] max-h-[43px] items-center text-[20px] lg:text-[15px] md:text-[15px] max-md:text-[15px] btn-outline rounded-full font-primary font-light inline-flex justify-start px-4 py-2 hover:bg-afh-orange hover:text-white transition-colors"
            >
              Upload a New Project
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="afh-section galery-section w-[70%] md:w-[55%] max-md:w-full max-md:items-center -translate-y-[30px] section-padding flex flex-col gap-[40px]">
          <div className="flex gap-[25px] w-full border-b-2 h-auto">
            <button
              className={`relative h-full border-b-2 bottom-[-2px] ${onPublished ? 'border-black' : 'border-transparent'}`}
              onClick={() => setOnPublished(true)}
            >
              Published
            </button>
            <button
              className={`relative h-full border-b-2 bottom-[-2px] ${onPublished ? 'border-transparent' : 'border-black'}`}
              onClick={() => setOnPublished(false)}
            >
              Drafts
            </button>
          </div>
          {onPublished && (
            <div className="gallery-grid gap-[60px] grid-cols-2 max-lg:grid-cols-1 max-md:items-center font-primary">
              {published.length > 0 ? (
                published.map(art => (
                  <div
                    key={art.id}
                    className="card card-hover bg-white flex flex-col gap-[10px]"
                  >
                    <Image
                      src={art.thumbnail_url || art.image_url}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      alt={art.title}
                      width={600}
                      height={600}
                    />
                    <div className="p-2 flex flex-col gap-1">
                      <p className="font-medium text-[14px]">{art.title}</p>
                      <p className="text-[12px] text-gray-600">
                        {art.tools_used.join(', ') || art.project_type || 'Artwork'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-500 font-secondary">No published artwork yet</p>
                </div>
              )}
            </div>
          )}
          {!onPublished && (
            <div className="gallery-grid gap-[60px] grid-cols-2 max-lg:grid-cols-1 max-md:items-center font-primary text-[10px]">
              <button
                key="addNew"
                onClick={navigateToUpload}
                className="min-h-[300px] card card-hover bg-white flex flex-col items-center justify-center gap-[20px] border-[2px] border-afh-orange cursor-pointer"
              >
                <button className="w-[88px] h-[88px] rounded-full bg-afh-orange/25 flex items-center justify-center text-afh-orange">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.1348 20.5678C28.6803 20.5678 28.2444 20.7484 27.923 21.07C27.6016 21.3916 27.421 21.8277 27.421 22.2825V22.934L24.8846 20.3963C23.989 19.5073 22.7785 19.0085 21.5169 19.0085C20.2553 19.0085 19.0449 19.5073 18.1493 20.3963L16.9496 21.5966L12.6994 17.3441C11.7912 16.4793 10.5855 15.9969 9.33171 15.9969C8.07794 15.9969 6.87218 16.4793 5.96407 17.3441L3.42762 19.8819V10.2796C3.42762 9.82484 3.60819 9.3887 3.92959 9.06714C4.25099 8.74557 4.68691 8.56491 5.14144 8.56491H17.1381C17.5927 8.56491 18.0286 8.38426 18.35 8.06269C18.6714 7.74112 18.8519 7.30499 18.8519 6.85022C18.8519 6.39546 18.6714 5.95932 18.35 5.63775C18.0286 5.31618 17.5927 5.13553 17.1381 5.13553H5.14144C3.77784 5.13553 2.4701 5.67749 1.50589 6.64219C0.541686 7.6069 0 8.91531 0 10.2796V30.8559C0 32.2202 0.541686 33.5286 1.50589 34.4933C2.4701 35.458 3.77784 36 5.14144 36H25.7072C27.0708 36 28.3785 35.458 29.3427 34.4933C30.3069 33.5286 30.8486 32.2202 30.8486 30.8559V22.2825C30.8486 21.8277 30.6681 21.3916 30.3467 21.07C30.0253 20.7484 29.5893 20.5678 29.1348 20.5678ZM5.14144 32.5706C4.68691 32.5706 4.25099 32.39 3.92959 32.0684C3.60819 31.7468 3.42762 31.3107 3.42762 30.8559V24.7345L8.39768 19.7619C8.64946 19.5218 8.98392 19.3879 9.33171 19.3879C9.6795 19.3879 10.014 19.5218 10.2657 19.7619L15.6985 25.1974L23.0679 32.5706H5.14144ZM27.421 30.8559C27.4173 31.184 27.3093 31.5023 27.1125 31.7647L19.3832 23.9972L20.5829 22.7969C20.7058 22.6714 20.8524 22.5717 21.0143 22.5037C21.1761 22.4356 21.3499 22.4006 21.5255 22.4006C21.701 22.4006 21.8748 22.4356 22.0367 22.5037C22.1986 22.5717 22.3452 22.6714 22.4681 22.7969L27.421 27.7866V30.8559ZM35.4931 5.63279L30.3516 0.48871C30.1886 0.332604 29.9964 0.210235 29.7861 0.128625C29.3688 -0.042875 28.9008 -0.042875 28.4836 0.128625C28.2732 0.210235 28.081 0.332604 27.918 0.48871L22.7766 5.63279C22.4538 5.95567 22.2726 6.3936 22.2726 6.85022C22.2726 7.30685 22.4538 7.74477 22.7766 8.06765C23.0993 8.39054 23.537 8.57193 23.9934 8.57193C24.4498 8.57193 24.8875 8.39054 25.2102 8.06765L27.421 5.83855V15.4237C27.421 15.8785 27.6016 16.3146 27.923 16.6362C28.2444 16.9577 28.6803 17.1384 29.1348 17.1384C29.5893 17.1384 30.0253 16.9577 30.3467 16.6362C30.6681 16.3146 30.8486 15.8785 30.8486 15.4237V5.83855L33.0594 8.06765C33.2188 8.22837 33.4083 8.35593 33.6172 8.44298C33.826 8.53004 34.05 8.57486 34.2762 8.57486C34.5025 8.57486 34.7265 8.53004 34.9353 8.44298C35.1442 8.35593 35.3337 8.22837 35.4931 8.06765C35.6537 7.90825 35.7812 7.7186 35.8682 7.50965C35.9552 7.3007 36 7.07658 36 6.85022C36 6.62386 35.9552 6.39974 35.8682 6.19079C35.7812 5.98184 35.6537 5.79219 35.4931 5.63279Z"
                      fill="#F26729"
                    />
                  </svg>
                </button>
                <button className="text-[20px] lg:text-[12px] md:text-[15px] max-md:text-[15px] btn-outline border-[1px] rounded-full font-primary font-light inline-flex justify-start px-4 py-2">
                  + Upload New Project
                </button>
              </button>
              
              {drafts.map(art => (
                <div
                  key={art.id}
                  className="card card-hover bg-white flex flex-col gap-[10px]"
                >
                  <Image
                    src={art.thumbnail_url || art.image_url}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    alt={art.title}
                    width={600}
                    height={600}
                  />
                  <div className="p-2 flex flex-col gap-1">
                    <p className="font-medium text-[14px]">{art.title}</p>
                    <p className="text-[12px] text-gray-600">
                      {art.tools_used.join(', ') || art.project_type || 'Artwork'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 animate-fade-in cursor-default"
            onClick={cancelEdit}
            onKeyDown={(e) => e.key === 'Escape' && cancelEdit()}
            style={{ animationDuration: '200ms' }}
            aria-label="Close modal overlay"
          />
          <form
            onSubmit={saveProfile}
            className="relative bg-white rounded-xl p-8 w-full max-w-3xl mx-4 shadow-afh border border-gray-100 animate-fade-in"
            style={{ animationDuration: '200ms' }}
            aria-label="Edit profile form"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={cancelEdit}
              aria-label="Close edit modal"
              className="absolute top-7 right-6 w-9 h-9 rounded-full bg-white text-afh-orange border-2 border-afh-orange flex items-center justify-center hover:bg-afh-orange hover:text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-afh-orange"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M10.5 1.5L1.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.5 1.5L10.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div>
              <h3 className="text-2xl font-heading text-afh-blue">
                Edit Profile
              </h3>
              <hr className="mt-4 border-t border-afh-blue/10" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              {/* Banner Image Upload */}
              <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/30">
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={bannerPreview || form.banner_image_url || '/imgs/profile-banner-temp.png'}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm font-secondary">
                    {uploadingBanner ? 'Uploading...' : 'Upload Header Banner'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      disabled={uploadingBanner}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500">Recommended: 1200x300px • Max 10MB</p>
                </div>
              </div>

              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={imagePreview || form.profile_image_url || '/imgs/user-stock.png'}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <label className="cursor-pointer px-4 py-2 bg-afh-orange text-white rounded-full hover:bg-afh-orange/90 transition-colors text-sm font-secondary">
                    {uploadingImage ? 'Uploading...' : 'Upload Profile Picture'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500">Max 10MB • JPG, PNG, or GIF</p>
                </div>
              </div>

              <label className="flex flex-col text-sm">
                <span className={`form-label text-[13px] ${form.display_name ? '' : 'text-red-500'}`}>
                  Display Name*
                </span>
                <input
                  value={form.display_name}
                  placeholder="Your full name"
                  onChange={e =>
                    setForm({ ...form, display_name: e.target.value })
                  }
                  className="mt-1 form-input h-11 rounded-md border border-gray-200 placeholder:italic placeholder:text-gray-400 px-3"
                  required
                />
              </label>

              <label className="flex flex-col text-sm">
                <span className="form-label text-[13px]">Bio/Headline</span>
                <textarea
                  value={form.bio || ''}
                  placeholder="Tell us about yourself..."
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  className="mt-1 form-input rounded-md border border-gray-200 placeholder:italic placeholder:text-gray-400 px-3 py-2 min-h-[80px]"
                />
              </label>

              <label className="flex flex-col text-sm">
                <span className="form-label text-[13px]">Department/Title</span>
                <input
                  value={form.department || ''}
                  placeholder="Graphic Designer"
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className="mt-1 form-input h-11 rounded-md border border-gray-200 placeholder:italic placeholder:text-gray-400 px-3"
                />
              </label>

              <div className="flex gap-3">
                <label className="flex-1 flex flex-col text-sm">
                  <span className="form-label text-[13px]">School / High School</span>
                  <input
                    list="school-suggestions"
                    value={form.school || ''}
                    onChange={e =>
                      setForm({ ...form, school: e.target.value })
                    }
                    placeholder="Type or select your school"
                    className="form-input h-11 rounded-md border border-gray-200 px-3 bg-white w-full mt-1"
                  />
                  <datalist id="school-suggestions">
                    {schoolSuggestions.map(s => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </label>
                
                <label className="flex-1 flex flex-col text-sm">
                  <span className="form-label text-[13px]">
                    Graduation Year
                  </span>
                  <input
                    list="graduation-year-suggestions"
                    value={form.graduation_year || ''}
                    onChange={e => setForm({ ...form, graduation_year: e.target.value })}
                    placeholder="Type or select year"
                    className="form-input h-11 rounded-md border border-gray-200 px-3 bg-white w-full mt-1"
                  />
                  <datalist id="graduation-year-suggestions">
                    {graduationYears.map(y => (
                      <option key={y} value={y} />
                    ))}
                  </datalist>
                </label>
              </div>

              <label className="flex flex-col text-sm">
                <span className="form-label text-[13px]">
                  Instagram Username
                </span>
                <input
                  value={form.instagram || ''}
                  placeholder="afhboston"
                  onChange={e =>
                    setForm({ ...form, instagram: e.target.value })
                  }
                  className="mt-1 form-input h-11 rounded-md border border-gray-200 placeholder:italic placeholder:text-gray-400 px-3"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-5 py-2.5 rounded-full font-primary bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-full font-primary bg-afh-orange text-white border-2 border-afh-orange hover:bg-afh-orange/90 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
