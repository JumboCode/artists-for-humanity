"use client"
import { useState } from "react"

export default function UploadPage() {
  const [formData, setFormData] = useState({
    artistName: "",
    title: "",
    description: "",
    tools: "",
    projectType: "",
    file: null as File | null,
  })
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    // add later: send data to backend API route
  }

  return (
    <div className="section-padding container-afh">
      <header className="text-center hero-gradient rounded-2xl section-padding mb-16">
        <h1 className="text-brand-secondary mb-4">Upload Your Artwork</h1>
        <p className="text-afh-blue/80 max-w-2xl mx-auto">
          Submit your digital artwork to the Artists For Humanity gallery. Please fill out all required fields below.
        </p>
      </header>

      <form 
        onSubmit={handleSubmit}
        className="card p-8 max-w-2xl mx-auto space-y-6 animate-fade-in"
      >
        {/* Artist Name */}
        <div>
          <label className="form-label">Artist Name *</label>
          <input 
            className="form-input"
            type="text"
            name="artistName"
            value={formData.artistName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Artwork Title */}
        <div>
          <label className="form-label">Artwork Title *</label>
          <input 
            className="form-input"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description / Artist Statement */}
        <div>
          <label className="form-label">Description / Artist Statement</label>
          <textarea
            className="form-input"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us about your artwork..."
          />
        </div>

        {/* Tools Used */}
        <div>
          <label className="form-label">Tools Used</label>
          <select 
            className="form-input"
            name="tools"
            value={formData.tools}
            onChange={handleChange}
          >
            <option value="">Select a tool</option>
            <option value="Adobe Illustrator">Adobe Illustrator</option>
            <option value="Photoshop">Photoshop</option>
            <option value="Procreate">Procreate</option>
            <option value="Mixed Media">Mixed Media</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Project Type */}
        <div>
          <label className="form-label">Project Type</label>
          <select 
            className="form-input"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
          >
            <option value="">Select a project type</option>
            <option value="Client Project">Client Project</option>
            <option value="Personal Work">Personal Work</option>
            <option value="School Project">School Project</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="form-label">Upload File *</label>
          <div className="border-2 border-dashed border-afh-orange/40 rounded-xl p-8 text-center cursor-pointer hover:bg-afh-orange/5 transition-all">
            <input 
              type="file"
              name="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer text-afh-orange font-medium">
              {formData.file ? formData.file.name : "Drag & drop or click to upload"}
            </label>
          </div>
        </div>

        {/* Status Message */}
        {status === "success" && (
          <p className="text-green-600 text-center font-medium animate-fade-in">
                Artwork submitted successfully (mock)!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-center font-medium animate-fade-in">
                Please fill all required fields and upload an image.
          </p>
        )}

        <button type="submit" className="btn-primary w-full">
          Submit Artwork
        </button>
      </form>
    </div>
  )
}
