"use client"
import { useState } from "react"
import ImageIcon from "@mui/icons-material/Image"
import AppsIcon from "@mui/icons-material/Apps"
import VideocamIcon from "@mui/icons-material/Videocam"

export default function UploadPage() {
  const [formData, setFormData] = useState({
    artistName: "",
    email: "",
    schoolYear: "",
    completionDate: "",
    title: "",
    tools: "",
    file: null as File | null,
  })
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && !file.type.startsWith("image/")) {
      alert("Please upload an image file (jpg, png, etc.)")
      return
    }
    setFormData((prev) => ({ ...prev, file }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.artistName || !formData.title || !formData.file) {
      setStatus("error")
      return
    }
    setStatus("success")
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 md:px-16 lg:px-32 py-12 sm:py-16 md:py-20">
      {/* Header */}
      <section className="mb-14 sm:mb-16 md:mb-20 text-left animate-fade-in">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-brand-secondary leading-snug max-w-3xl">
          Want to showcase your art on our homepage?
          <br />
          <span className="font-light">Upload your work below.</span>
        </h1>
      </section>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto space-y-14 sm:space-y-16 md:space-y-20 animate-fade-in"
      >
        {/* Row 1: Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div className="flex flex-col">
            <input
              type="text"
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 md:py-3 text-afh-blue bg-transparent text-base sm:text-lg font-light"
            />
            <span className="mt-2 text-sm sm:text-base font-light text-afh-blue">
              Name
            </span>
          </div>

          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 md:py-3 text-afh-blue bg-transparent text-base sm:text-lg font-light"
            />
            <span className="mt-2 text-sm sm:text-base font-light text-afh-blue">
              Email
            </span>
          </div>
        </div>

        {/* Row 2: School Year + Completion Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div className="flex flex-col">
            <select
              name="schoolYear"
              value={formData.schoolYear}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 md:py-3 text-afh-blue bg-transparent text-base sm:text-lg font-light appearance-none"
            >
              <option value="" disabled hidden></option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
            <span className="mt-2 text-sm sm:text-base font-light text-afh-blue">
              School Year
            </span>
          </div>

          <div className="flex flex-col">
            <select
              name="completionDate"
              value={formData.completionDate}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 md:py-3 text-afh-blue bg-transparent text-base sm:text-lg font-light appearance-none"
            >
              <option value="" disabled hidden></option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
            <span className="mt-2 text-sm sm:text-base font-light text-afh-blue">
              Completion Date
            </span>
          </div>
        </div>

        {/* Row 3: Artwork Title + Medium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div className="flex flex-col">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 md:py-3 text-afh-blue bg-transparent text-base sm:text-lg font-light"
            />
            <span className="mt-2 text-sm sm:text-base font-light text-afh-blue">
              Artwork Title
            </span>
          </div>

          <div className="flex flex-col">
            <select
              name="tools"
              value={formData.tools}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 md:py-3 text-afh-blue bg-transparent text-base sm:text-lg font-light appearance-none"
            >
              <option value="" disabled hidden></option>
              <option value="Digital">Digital</option>
              <option value="Painting">Painting</option>
              <option value="Photography">Photography</option>
              <option value="Mixed Media">Mixed Media</option>
            </select>
            <span className="mt-2 text-sm sm:text-base font-light text-afh-blue">
              Artwork Medium
            </span>
          </div>
        </div>

        {/* File Upload */}
        <div className="w-full">
          <div className="border border-[var(--border)] rounded-lg min-h-[250px] sm:min-h-[300px] md:min-h-[350px] flex flex-col items-center justify-center text-center transition-all">
            {/* Icon group */}
            <div className="flex justify-center items-center gap-6 sm:gap-10 flex-wrap">
              <div className="bg-afh-orange/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center hover:bg-afh-orange/20 transition-all">
                <ImageIcon sx={{ color: "#F26729", fontSize: 34 }} />
              </div>
              <div className="bg-afh-orange/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center hover:bg-afh-orange/20 transition-all">
                <AppsIcon sx={{ color: "#F26729", fontSize: 34 }} />
              </div>
              <div className="bg-afh-orange/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center hover:bg-afh-orange/20 transition-all">
                <VideocamIcon sx={{ color: "#F26729", fontSize: 34 }} />
              </div>
            </div>

            <input
              type="file"
              id="file-upload"
              name="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <p className="mt-4 sm:mt-6 text-afh-blue font-light text-sm sm:text-base">
            Choose the medium of your upload.
          </p>
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <p className="text-green-600 font-light text-base animate-fade-in text-center">
            Artwork submitted successfully!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 font-light text-base animate-fade-in text-center">
            Please fill all required fields and upload an image.
          </p>
        )}

        {/* Submit Button */}
        <div className="flex justify-center md:justify-end">
          <button
            type="submit"
            className="rounded-full px-8 py-2 sm:px-10 sm:py-3 border-2 border-afh-orange text-afh-orange hover:bg-afh-orange hover:text-white text-base sm:text-lg font-light transition-all"
          >
            Submit Artwork
          </button>
        </div>
      </form>
    </div>
  )
}
