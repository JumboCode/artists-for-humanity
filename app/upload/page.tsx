'use client'
import { useState, useRef, useEffect, DragEvent } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ImageIcon from '@mui/icons-material/Image'
import AppsIcon from '@mui/icons-material/Apps'
import VideocamIcon from '@mui/icons-material/Videocam'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

type FileType = 'image' | 'gallery' | 'video' | null

const MEDIUM_OPTIONS = [
  'Digital Art',
  'Painting',
  'Photography',
  'Mixed Media',
  'Sculpture',
  'Drawing',
  'Printmaking',
  'Video',
  'Installation',
  'Other',
]

export default function UploadPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    mediums: [] as string[],
    description: '',
    artistName: '', // For guest uploads
    email: '', // For guest uploads
    file: null as File | null,
  })
  const [selectedFileType, setSelectedFileType] = useState<FileType>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [shouldOpenFilePicker, setShouldOpenFilePicker] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const isGuest = !session

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!shouldOpenFilePicker || !fileInputRef.current) return

    const timeoutId = window.setTimeout(() => {
      fileInputRef.current?.click()
      setShouldOpenFilePicker(false)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [shouldOpenFilePicker, selectedFileType])

  // Countdown timer for guest success message
  useEffect(() => {
    if (status === 'success' && !session) {
      setCountdown(30)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [status, session])

  const addErrorMessage = (field: string, message: string) => {
    setStatus('error')
    setErrors(prev => ({ ...prev, [field]: message }))
  }

  const removeErrorMessage = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      setStatus(Object.keys(newErrors).length === 0 ? 'idle' : 'error')
      return newErrors
    })
  }

  const getErrorMessage = () => {
    const errorMessages = Object.values(errors)
    return errorMessages.length > 0 ? errorMessages.join('; ') : null
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target

    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }))

    // Validation
    validate()
  }

  const handleMediumToggle = (medium: string) => {
    setFormData(prev => {
      const isSelected = prev.mediums.includes(medium)
      let newMediums = prev.mediums

      if (isSelected) {
        newMediums = newMediums.filter(m => m !== medium)
      } else {
        newMediums = [...newMediums, medium]
      }

      return { ...prev, mediums: newMediums }
    })

    validate()
  }

  const validate = () => {
    const { title, description, artistName, email } = formData

    // Reset error fields
    setStatus('idle')
    setErrors({})

    // Title
    if (title.length > 200) {
      addErrorMessage('title', 'Title cannot exceed 200 characters')
    }

    // Artist Name (required for guests)
    if (!session && artistName.length > 200) {
      addErrorMessage('artistName', 'Artist name cannot exceed 200 characters')
    }

    // Email validation for guests
    if (!session && email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        addErrorMessage('email', 'Please enter a valid email address')
      }
    }

    // Mediums
    if (formData.mediums.length > 3) {
      addErrorMessage('mediums', 'You can only select up to 3 mediums')
    }

    // Description
    if (description.length > 1000) {
      addErrorMessage(
        'description',
        'Description cannot exceed 1000 characters'
      )
    }

    // File
    if (formData.file) validateFile(formData.file)
  }

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (file.size > maxSize) {
      addErrorMessage('file', 'File size must be less than 10MB')
      return false
    }

    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      gallery: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/quicktime'],
    }

    const validTypes = selectedFileType
      ? allowedTypes[selectedFileType]
      : [...allowedTypes.image, ...allowedTypes.video]

    if (!validTypes.includes(file.type)) {
      addErrorMessage(
        'file',
        `Invalid file type. Please upload a valid ${selectedFileType || 'media'} file.`
      )
      return false
    }

    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (!file) return
    setFormData(prev => ({ ...prev, file }))
    validate()
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
    if (!file) return
    setFormData(prev => ({ ...prev, file }))
    validate()
  }

  const handleFileTypeClick = (type: FileType) => {
    setSelectedFileType(type)
    setShouldOpenFilePicker(true)
  }

  const getUploadBoxClasses = () => {
    if (isDragging) return 'border-afh-orange bg-afh-orange/5'
    if (formData.file) return 'border-green-500 bg-green-50'
    if (errors.file) return 'border-red-500 bg-red-50'
    return 'border-gray-300'
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
    })
  }

  const validateSubmission = (): boolean => {
    if (!formData.title.trim()) {
      addErrorMessage('title', 'Artwork title is required')
      return false
    }

    if (formData.mediums.length === 0) {
      addErrorMessage('mediums', 'Please select at least one artwork medium')
      return false
    }
    
    // We need to check file existence before using it
    const file = formData.file
    if (!file) {
      addErrorMessage('file', 'Please upload a file')
      return false
    }

    // Final form validation
    if (Object.keys(errors).length > 0) {
      return
    }

    // Guest upload validation
    if (isGuest) {
      if (!formData.artistName.trim()) {
        addErrorMessage('artistName', 'Artist name is required for guest uploads')
        return false
      }

      if (!formData.email.trim()) {
        addErrorMessage('email', 'Email is required for guest uploads')
        return false
      }
    }

    return true
  }

  const resetGuestUploadForm = () => {
    setFormData({
      title: '',
      mediums: [],
      description: '',
      artistName: '',
      email: '',
      file: null,
    })
    setSelectedFileType(null)
    setStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('idle')

    if (!validateSubmission()) {
      return
    }

    setIsSubmitting(true)

    try {
      const imageBase64 = await fileToBase64(file)

      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          tools_used: formData.mediums.join(', '),
          image_base64: imageBase64,
          submitted_by_name: isGuest ? formData.artistName : undefined,
          submitted_by_email: isGuest ? formData.email : undefined,
        }),
      })
      
      if (response.status === 413) {
        addErrorMessage('file', 'File size must be less than 10MB')
        return
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      setStatus('success')

      // Handle post-upload based on user type
      if (session) {
        // Redirect authenticated users after brief delay
        setTimeout(() => {
          router.push('/user-portal')
        }, 1500)
      } else {
        // For guests, reset form after showing success message
        setTimeout(() => {
          resetGuestUploadForm()
        }, 30000)
      }
    } catch (error) {
      // Show to user as error message
      addErrorMessage(
        'upload',
        error instanceof Error ? error.message : 'Failed to upload artwork'
      )
      // Print to console for debugging
      console.error('Upload error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-afh-blue text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 flex justify-center">
      <div className="w-full max-w-4xl">
      {/* Header */}
      <section className="mb-6 md:mb-8 text-center animate-fade-in flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 leading-snug max-w-2xl">
          Start building your project
        </h1>
      </section>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-10 sm:space-y-12 animate-fade-in mx-auto"
      >
        {/* Error Message */}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
            <p className="text-red-600 font-light text-base">
              {getErrorMessage()}
            </p>
          </div>
        )}

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
            className={`w-full border-0 border-b focus:border-afh-orange focus:outline-none py-3 text-gray-900 bg-transparent text-lg font-light placeholder-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          <label
            htmlFor="title"
            className={`block mt-2 text-sm font-light ${errors.title ? 'text-red-500' : 'text-gray-700'}`}
          >
            Artwork Title*
          </label>
        </div>

        {/* Artwork Medium */}
        <div className="w-full">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border-0 border-b focus:border-afh-orange focus:outline-none py-3 text-gray-900 bg-transparent text-lg font-light cursor-pointer flex justify-between items-center group"
            >
              <span
                className={
                  formData.mediums.length === 0
                    ? 'text-gray-400'
                    : 'text-gray-900'
                }
              >
                {formData.mediums.length === 0
                  ? 'Select mediums...'
                  : formData.mediums.join(', ')}
              </span>
              <KeyboardArrowDownIcon
                sx={{
                  color: '#F26729',
                  fontSize: 20,
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                  {MEDIUM_OPTIONS.map(medium => (
                    <label
                      key={medium}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.mediums.includes(medium)}
                        onChange={() => handleMediumToggle(medium)}
                        disabled={
                          !formData.mediums.includes(medium) &&
                          formData.mediums.length >= 3
                        }
                        className="w-4 h-4 rounded border-gray-300 text-afh-orange cursor-pointer accent-afh-orange disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-gray-900 font-light">{medium}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <label
            htmlFor="medium"
            className="block mt-2 text-sm font-light text-gray-700"
          >
            Artwork Medium* (select up to 3)
          </label>
        </div>

        {/* Guest Upload Fields - Only show when not logged in */}
        {!session && (
          <>
            {/* Artist Name */}
            <div className="w-full">
              <input
                type="text"
                id="artistName"
                name="artistName"
                value={formData.artistName}
                onChange={handleChange}
                placeholder=""
                required
                className={`w-full border-0 border-b focus:border-afh-orange focus:outline-none py-3 text-gray-900 bg-transparent text-lg font-light placeholder-transparent ${errors.artistName ? 'border-red-500' : 'border-gray-300'}`}
              />
              <label
                htmlFor="artistName"
                className={`block mt-2 text-sm font-light ${errors.artistName ? 'text-red-500' : 'text-gray-700'}`}
              >
                Artist Name* (your name)
              </label>
            </div>

            {/* Email */}
            <div className="w-full">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=""
                required
                className={`w-full border-0 border-b focus:border-afh-orange focus:outline-none py-3 text-gray-900 bg-transparent text-lg font-light placeholder-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              <label
                htmlFor="email"
                className={`block mt-2 text-sm font-light ${errors.email ? 'text-red-500' : 'text-gray-700'}`}
              >
                Email Address*
              </label>
            </div>
          </>
        )}

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
          <label
            htmlFor="description"
            className="block mt-2 text-sm font-light text-gray-700"
          >
            Description / Artist Statement (optional)
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
                  onClick={() => {
                    setFormData(prev => ({ ...prev, file: null }))
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                    removeErrorMessage('file')
                  }}
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
                    onClick={() => handleFileTypeClick('image')}
                    className="bg-afh-orange/10 w-16 h-16 rounded-full flex items-center justify-center hover:bg-afh-orange/20 transition-all focus:outline-none focus:ring-2 focus:ring-afh-orange"
                    title="Upload Image"
                  >
                    <ImageIcon sx={{ color: '#F26729', fontSize: 34 }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFileTypeClick('gallery')}
                    className="bg-afh-orange/10 w-16 h-16 rounded-full flex items-center justify-center hover:bg-afh-orange/20 transition-all focus:outline-none focus:ring-2 focus:ring-afh-orange"
                    title="Upload Gallery"
                  >
                    <AppsIcon sx={{ color: '#F26729', fontSize: 34 }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFileTypeClick('video')}
                    className="bg-afh-orange/10 w-16 h-16 rounded-full flex items-center justify-center hover:bg-afh-orange/20 transition-all focus:outline-none focus:ring-2 focus:ring-afh-orange"
                    title="Upload Video"
                  >
                    <VideocamIcon sx={{ color: '#F26729', fontSize: 34 }} />
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
                selectedFileType === 'video'
                  ? 'video/mp4,video/webm,video/quicktime'
                  : 'image/jpeg,image/png,image/gif,image/webp'
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
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
            <p className="text-red-600 font-light text-base">
              {getErrorMessage()}
            </p>
          </div>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
            {session ? (
              <p className="text-green-600 font-light text-base">
                Artwork submitted successfully! Redirecting to your portal...
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-green-600 font-medium text-base">
                      🎉 Artwork submitted successfully!
                    </p>
                  </div>
                  {/* Circular countdown timer */}
                  <div className="relative flex items-center justify-center w-12 h-12 ml-4">
                    <svg className="transform -rotate-90" width="48" height="48">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#D1FAE5"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#10B981"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - countdown / 30)}`}
                        className="transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-sm font-semibold text-green-700">
                      {countdown}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  Your submission will be reviewed by our team. Once approved, it will be featured in the gallery.
                </p>
                <div className="pt-2 border-t border-green-200">
                  <p className="text-gray-800 text-sm font-medium mb-2">
                    Want to build your portfolio and track your artwork?
                  </p>
                  <a
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-afh-orange text-white rounded-full hover:bg-afh-orange/90 transition-colors text-sm font-medium"
                  >
                    Create Free Account →
                  </a>
                  <p className="text-xs text-gray-500 mt-2">
                    Creating an account allows us to link this artwork to your profile once approved.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full px-10 py-3 border-2 border-afh-orange text-afh-orange hover:bg-afh-orange hover:text-white text-lg font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Uploading...' : 'Confirm Upload'}
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}
