"use client"
import { useState } from "react"

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
    <div className="min-h-screen bg-white px-6 sm:px-12 md:px-24 py-16">
      {/* Header */}
      <section className="mb-20 animate-fade-in text-left">
        <h1 className="text-3xl md:text-4xl font-medium text-brand-secondary leading-snug">
          Want to showcase your art on our homepage?
          <br />
          <span className="font-normal">Upload your work below.</span>
        </h1>
      </section>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto space-y-16 animate-fade-in"
      >
        {/* Row 1: Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div className="flex flex-col">
            <input
              type="text"
              name="artistName"
              value={formData.artistName}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 text-afh-blue bg-transparent"
            />
            <span className="mt-2 text-sm font-medium text-afh-blue">Name</span>
          </div>

          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 text-afh-blue bg-transparent"
            />
            <span className="mt-2 text-sm font-medium text-afh-blue">Email</span>
          </div>
        </div>

        {/* Row 2: School Year + Completion Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div className="flex flex-col">
            <select
              name="schoolYear"
              value={formData.schoolYear}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 text-afh-blue bg-transparent appearance-none"
            >
              <option value="" disabled hidden>
              </option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
            <span className="mt-2 text-sm font-medium text-afh-blue">
              School Year
            </span>
          </div>

          <div className="flex flex-col">
            <select
              name="completionDate"
              value={formData.completionDate}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 text-afh-blue bg-transparent appearance-none"
            >
              <option value="" disabled hidden>
                
              </option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
            <span className="mt-2 text-sm font-medium text-afh-blue">
              Completion Date
            </span>
          </div>
        </div>

        {/* Row 3: Artwork Title + Medium */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div className="flex flex-col">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 text-afh-blue bg-transparent"
            />
            <span className="mt-2 text-sm font-medium text-afh-blue">
              Artwork Title
            </span>
          </div>

          <div className="flex flex-col">
            <select
              name="tools"
              value={formData.tools}
              onChange={handleChange}
              className="w-full border-0 border-b border-gray-300 focus:border-afh-orange focus:outline-none py-2 text-afh-blue bg-transparent appearance-none"
            >
              <option value="" disabled hidden>
                
              </option>
              <option value="Digital">Digital</option>
              <option value="Painting">Painting</option>
              <option value="Photography">Photography</option>
              <option value="Mixed Media">Mixed Media</option>
            </select>
            <span className="mt-2 text-sm font-medium text-afh-blue">
              Artwork Medium
            </span>
          </div>
        </div>

  

        {/* File Upload */}
        <div>
          <div className="border-2 border-dashed border-afh-orange/40 rounded-xl p-10 text-center cursor-pointer hover:bg-afh-orange/5 transition-all">
            <div className="flex justify-center items-center gap-10">
            <div className="bg-afh-orange/10 w-16 h-16 rounded-full flex items-center justify-center text-afh-orange text-2xl font-semibold hover:bg-afh-orange/20 cursor-pointer transition-all">
              A
            </div>
            <div className="bg-afh-orange/10 w-16 h-16 rounded-full flex items-center justify-center text-afh-orange text-2xl font-semibold hover:bg-afh-orange/20 cursor-pointer transition-all">
              B
            </div>
            <div className="bg-afh-orange/10 w-16 h-16 rounded-full flex items-center justify-center text-afh-orange text-2xl font-semibold hover:bg-afh-orange/20 cursor-pointer transition-all">
              C
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
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-afh-orange font-medium mt-6 block"
            >
              {formData.file
                ? formData.file.name
                : "Drag & drop or click to upload"}
            </label>
          </div>
          <p className="mt-8 text-afh-blue font-medium">
            Choose the medium of your upload.
          </p>
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <p className="text-green-600 font-medium animate-fade-in">
            Artwork submitted successfully!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 font-medium animate-fade-in">
            Please fill all required fields and upload an image.
          </p>
        )}

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="btn-outline rounded-full px-8 py-2 border-2 border-afh-orange text-afh-orange hover:bg-afh-orange hover:text-white transition-all"
          >
            Submit Artwork
          </button>
        </div>
      </form>
    </div>
  )
}
