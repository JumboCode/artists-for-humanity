"use client"
import { useState, useRef, useEffect, DragEvent } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ImageIcon from "@mui/icons-material/Image"
import AppsIcon from "@mui/icons-material/Apps"
import VideocamIcon from "@mui/icons-material/Videocam"

type FileType = "image" | "gallery" | "video" | null

export default function UploadPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    medium: "",
    completionDate: "",
    description: "",
    file: null as File | null,
  })
  const [selectedFileType, setSelectedFileType] = useState<FileType>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login")
    }
  }, [sessionStatus, router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (status === "error") setStatus("idle") // Clear error on input
  }

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (file.size > maxSize) {
      setErrorMessage("File size must be less than 10MB")
      return false
    }

    const allowedTypes = {
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      gallery: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      video: ["video/mp4", "video/webm", "video/quicktime"],
    }

    const validTypes = selectedFileType 
      ? allowedTypes[selectedFileType]
      : [...allowedTypes.image, ...allowedTypes.video]

    if (!validTypes.includes(file.type)) {
      setErrorMessage(`Invalid file type. Please upload a valid ${selectedFileType || "media"} file.`)
      return false
    }

    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && validateFile(file)) {
      setFormData((prev) => ({ ...prev, file }))
      setErrorMessage("")
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0] || null
    if (file && validateFile(file)) {
      setFormData((prev) => ({ ...prev, file }))
      setErrorMessage("")
    }
  }

  const handleFileTypeClick = (type: FileType) => {
    setSelectedFileType(type)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const getUploadBoxClasses = () => {
    if (isDragging) return "border-afh-orange bg-afh-orange/5"
    if (formData.file) return "border-green-500 bg-green-50"
    return "border-gray-300"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    
    // Validation
    if (!formData.title.trim()) {
      setStatus("error")
      setErrorMessage("Artwork title is required")
      return
    }
    
    if (!formData.medium) {
      setStatus("error")
      setErrorMessage("Please select an artwork medium")
      return
    }
    
    if (!formData.file) {
      setStatus("error")
      setErrorMessage("Please upload a file")
      return
    }

    if (!session?.user?.id) {
      setStatus("error")
      setErrorMessage("You must be logged in to submit artwork")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare FormData for upload
      const uploadData = new FormData()
      uploadData.append("file", formData.file)
      uploadData.append("title", formData.title)
      uploadData.append("tools_used", formData.medium)
      uploadData.append("project_type", selectedFileType || "image")
      
      if (formData.description) {
        uploadData.append("description", formData.description)
      }
      
      if (formData.completionDate) {
        uploadData.append("completion_date", formData.completionDate)
      }

      const response = await fetch("/api/artworks", {
        method: "POST",
        body: uploadData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      setStatus("success")
      
      // Reset form
      setTimeout(() => {
        router.push("/user-portal")
      }, 2000)
      
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload artwork")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sessionStatus === "loading" || sessionStatus === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-afh-blue text-lg">
          {sessionStatus === "loading" ? "Loading..." : "Redirecting to login..."}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 md:px-16 lg:px-32 py-12 sm:py-16 md:py-20">
      {/* Header */}
      <section className="mb-14 sm:mb-16 md:mb-20 text-left animate-fade-in">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 leading-snug max-w-3xl">
          Start building your project
        </h1>
      </section>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl space-y-10 sm:space-y-12 animate-fade-in"
      >
        {/* Artwork Title */}
        <div className="w-full">
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder=""
            required
            className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-3 text-gray-900 bg-transparent text-lg font-light placeholder-transparent"
          />
          <label htmlFor="title" className="block mt-2 text-sm font-light text-gray-700">
            Artwork Title
          </label>
        </div>

        {/* Artwork Medium */}
        <div className="w-full">
          <select
            id="medium"
            name="medium"
            value={formData.medium}
            onChange={handleChange}
            required
            className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-3 text-gray-900 bg-transparent text-lg font-light cursor-pointer"
          >
            <option value=""></option>
            <option value="Digital Art">Digital Art</option>
            <option value="Painting">Painting</option>
            <option value="Photography">Photography</option>
            <option value="Mixed Media">Mixed Media</option>
            <option value="Sculpture">Sculpture</option>
            <option value="Drawing">Drawing</option>
            <option value="Printmaking">Printmaking</option>
            <option value="Video">Video</option>
            <option value="Installation">Installation</option>
            <option value="Other">Other</option>
          </select>
          <label htmlFor="medium" className="block mt-2 text-sm font-light text-gray-700">
            Artwork Medium
          </label>
        </div>

        {/* Completion Date */}
        <div className="w-full">
          <input
            type="text"
            id="completionDate"
            name="completionDate"
            value={formData.completionDate}
            onChange={handleChange}
            placeholder=""
            className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-3 text-gray-900 bg-transparent text-lg font-light placeholder-transparent"
          />
          <label htmlFor="completionDate" className="block mt-2 text-sm font-light text-gray-700">
            Completion Date
          </label>
        </div>

        {/* Description/Artist Statement */}
        <div className="w-full">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder=""
            rows={4}
            className="w-full border border-gray-300 rounded-lg focus:border-afh-orange focus:outline-none p-4 text-gray-900 bg-transparent text-base font-light placeholder-transparent resize-none"
          />
          <label htmlFor="description" className="block mt-2 text-sm font-light text-gray-700">
            Description / Artist Statement (Optional)
          </label>
        </div>

        {/* File Upload */}
        <div className="w-full">
          <section 
            aria-label="File upload area"
            className={`border-2 border-dashed rounded-lg min-h-[350px] flex flex-col items-center justify-center text-center transition-all ${getUploadBoxClasses()}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {formData.file ? (
              <div className="space-y-4">
                <div className="text-green-600 text-lg font-light">
                  ✓ File selected: {formData.file.name}
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, file: null }))}
                  className="text-sm text-afh-orange hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                {/* Icon group */}
                <div className="flex justify-center items-center gap-8 mb-6">
                  <button
                    type="button"
                    onClick={() => handleFileTypeClick("image")}
                    className="bg-afh-orange/10 w-16 h-16 rounded-full flex items-center justify-center hover:bg-afh-orange/20 transition-all focus:outline-none focus:ring-2 focus:ring-afh-orange"
                    title="Upload Image"
                  >
                    <ImageIcon sx={{ color: "#F26729", fontSize: 34 }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFileTypeClick("gallery")}
                    className="bg-afh-orange/10 w-16 h-16 rounded-full flex items-center justify-center hover:bg-afh-orange/20 transition-all focus:outline-none focus:ring-2 focus:ring-afh-orange"
                    title="Upload Gallery"
                  >
                    <AppsIcon sx={{ color: "#F26729", fontSize: 34 }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFileTypeClick("video")}
                    className="bg-afh-orange/10 w-16 h-16 rounded-full flex items-center justify-center hover:bg-afh-orange/20 transition-all focus:outline-none focus:ring-2 focus:ring-afh-orange"
                    title="Upload Video"
                  >
                    <VideocamIcon sx={{ color: "#F26729", fontSize: 34 }} />
                  </button>
                </div>

                <p className="text-gray-600 font-light text-base">
                  Click an icon or drag and drop your file here
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Maximum file size: 10MB
                </p>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              name="file"
              accept={
                selectedFileType === "video" 
                  ? "video/mp4,video/webm,video/quicktime" 
                  : "image/jpeg,image/png,image/gif,image/webp"
              }
              className="hidden"
              onChange={handleFileChange}
            />
          </section>

          <p className="mt-6 text-gray-700 font-light text-base">
            Choose the medium of your upload.
          </p>
        </div>

        {/* Error Message */}
        {status === "error" && errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
            <p className="text-red-600 font-light text-base">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Success Message */}
        {status === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
            <p className="text-green-600 font-light text-base">
              Artwork submitted successfully! Redirecting...
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full px-10 py-3 border-2 border-afh-orange text-afh-orange hover:bg-afh-orange hover:text-white text-lg font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Uploading..." : "Confirm Upload"}
          </button>
        </div>
      </form>
    </div>
  )
}
