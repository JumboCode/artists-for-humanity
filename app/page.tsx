"use client"

import React, { useState } from 'react';
import { Upload, X, Loader2, Send, LogIn } from 'lucide-react';

const useSession = () => ({ 
    status: 'authenticated', 
    data: { 
        user: { 
            id: 'mock-user-1234', 
            name: 'Demo User' 
        } 
    } 
}); 
const artworks = [
    // ... (Your artworks array remains the same)
    { id: 1, name: "Alice Johnson", title: "Sunset Dreams", medium: "Adobe Illustrator", year: 2023, image: "/imgs/meow.jpg" },
    { id: 2, name: "Mark Lee", title: "Urban Flow", medium: "Photography", year: 2022, image: "/imgs/meow.jpg" },
    { id: 3, name: "Sophia Kim", title: "Color Burst", medium: "Watercolor", year: 2023, image: "/imgs/meow.jpg" },
    { id: 4, name: "Ethan Brown", title: "Abstract Lines", medium: "Adobe Photoshop", year: 2021, image: "/imgs/meow.jpg" },
    { id: 5, name: "Lily Chen", title: "Nature's Path", medium: "Oil Painting", year: 2022, image: "/imgs/meow.jpg" },
    { id: 6, name: "David Park", title: "Geometric Dreams", medium: "Sketching", year: 2023, image: "/imgs/meow.jpg" },
];

  const initialFormData = {
  title: '',
  description: '',
  tools_used: '',
  project_type: '',
  submitted_by_name: '',
  submitted_by_email: '',
};

const Input = ({ label, name, type = "text", required = false, isTextArea = false, helpText = null, formData, handleChange }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextArea ? (
        <textarea 
          id={name} 
          name={name} 
          value={formData[name] || ''} 
          onChange={handleChange} 
          rows="3"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#F26729] focus:border-[#F26729] transition duration-150"
        ></textarea>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          required={required}
          value={formData[name] || ''} 
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#F26729] focus:border-[#F26729] transition duration-150"
        />
      )}
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );

export default function HomePage() {
  const { status: authStatus } = useSession(); 
  const artwork = artworks; 
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    // Crucial Fix: Ensure we are correctly updating the state based on the input name
    setFormData(prevData => ({ 
        ...prevData, 
        [e.target.name]: e.target.value 
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
        setSelectedFile(null); // Clear file if selection is cancelled
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authStatus !== 'authenticated') {
        setMessage('You must be logged in to submit artwork.');
        return;
    }
    if (!selectedFile) {
        setMessage('Please select an image file to upload.');
        return;
    }
    if (!formData.title.trim()) {
        setMessage('Artwork Title is required.');
        return;
    }

    setLoading(true);
    setMessage('Uploading image and submitting artwork...');

    // 1. Create FormData object
    const data = new FormData();
    data.append('file', selectedFile); 
    
    // 2. Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
    });

    const sessionData = useSession().data; 
    data.append('userId', sessionData.user.id);
    data.append('submitted_by', sessionData.user.name);

    try {
      const response = await fetch('/api/artwork', {
        method: 'POST',
        body: data, 
      });

      if (!response.ok) {
        // Critical Frontend Fix: Check for JSON response before parsing
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json(); 
            throw new Error(errorData.error || `Submission failed with status ${response.status}.`);
        } else {
            const errorText = await response.text();
            console.error("Server Error Detail:", errorText);
            throw new Error(`Server returned a non-JSON response (Status: ${response.status}). Check backend logs.`);
        }
      }

      const result = await response.json();
      setMessage(`Success! Artwork "${result.title}" has been submitted for review.`);
      //const image_url = result.image_url;

      setTimeout(() => {
        setIsFormOpen(false); 
        setFormData(initialFormData);
        setSelectedFile(null);
        setMessage('');
      }, 3000); 

    } catch (error) {
      console.error("Submission Error:", error);
      setMessage(error.message || 'An unexpected error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
    <div className="section-padding" style={{ backgroundColor: "#ffffffff" }}>
      {/* Intro Section*/}
      <section className="flex flex-col w-[1392px] h-auto pt-[200px] pr-[500px] pl-[10px] gap-[10px] mx-auto max-w-full">
        <h2 className="text-left text-black font-heading font-light leading-snug text-2xl sm:text-3xl md:text-4xl">
          Showcasing the Next Generation of Creative Voices
        </h2>

        <p className="text-left text-black font-secondary text-light">
          Explore the work of AFH’s young artists — a living showcase of design, creativity, and growth through real-world projects and personal expression.
        </p>

        <div className="flex space-x-[10px gap-[20px] mt-[20px] ">
          <button className="inline-flex items-center justify-center min-w-[90px] h-[40px] px-[15px] py-[10px] rounded-[50px] border-[1px] border-[#F26729] text-[#F26729] gap-[10px] font-secondary text-base transition-colors duration-300 hover:bg-[#F26729] hover:text-white cursor-pointer">
            Exhibition Name
          </button>
          <button className="inline-flex items-center justify-center min-w-[90px] h-[40px] px-[15px] py-[10px] rounded-[50px] border-[1px] border-[#F26729] text-[#F26729] gap-[10px] font-secondary text-base transition-colors duration-300 hover:bg-[#F26729] hover:text-white cursor-pointer">
            Exhibition Name
          </button>
          <button className="inline-flex items-center justify-center min-w-[90px] h-[40px] px-[15px] py-[10px] rounded-[50px] border-[1px] border-[#F26729] text-[#F26729] gap-[10px] font-secondary text-base transition-colors duration-300 hover:bg-[#F26729] hover:text-white cursor-pointer">
            Exhibition Name
          </button>
        </div>
      </section>

      {/* Carousel Section */}
<section className="w-full mt-16">

  <div className="relative w-full overflow-hidden">
    {/* Carousel container */}
    <div className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-2">
      {artwork.map((art) => (
        <div
          key={art.id}
          className="min-w-[400px] sm:min-w-[500px] md:min-w-[500px] snap-center bg-white rounded-2xl flex-shrink-0"
        >
          <div className="w-full h-64 overflow-hidden rounded-t-2xl">
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="p-4">
        <div className="flex items-center font-body font-light justify-between flex-wrap gap-x-2 text-base text-black">
          {/* Left side: Artist + Title */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{art.name}</span>
            <span className="text-gray-500 font-light">|</span>
            <span className="text-gray-800">{art.title}</span>
          </div>

          {/* Right side: Medium + Year */}
          <div className="flex items-center gap-2 flex-shrink-0 text-gray-500 text-light">
            <span>{art.medium}</span>
            <span className="text-gray-500">|</span>
            <span>{art.year}</span>
          </div>
        </div>
      </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      
{/* Section line */}
<hr className=" border-t-[1px] border-gray-#69737B my-[60px]" />
{/* Artwork gallery */}
<div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
  {artwork.map((art) => (
    <div key={art.id} className="bg-white shadow-none">
      
      {/* Image Section */}
      <div className="w-full image-hover animate-slide-up flex items-center justify-center">
        <img
          src={art.image}
          alt={art.title}
          className="w-full h-[300px] object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Artwork info */}
      <div className="flex font-body font-light items-center justify-between flex-wrap gap-x-2 text-base text-black mt-2">
        {/* Left side: Artist + Title */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold">{art.name}</span>
          <span className="text-gray-400 font-light">|</span>
          <span className="text-gray-600">{art.title}</span>
        </div>

        {/* Right side: Medium + Year */}
        <div className="flex items-center gap-2 flex-shrink-0 text-gray-500">
          <span>{art.medium}</span>
          <span className="text-gray-300">|</span>
          <span>{art.year}</span>
        </div>
      </div>
    </div>
  ))}
</div>

  
  <hr className=" border-t-[1px] border-gray-#69737B my-[60px]" />

  <div className='flex flex-col items-left justify-center text-left '>
        <h2 className="text-black font-heading font-light leading-snug text-2xl sm:text-3xl md:text-4xl mb-4">
          Do you also want to showcase your art on our homepage? Upload your work below.
        </h2>
        {authStatus === 'authenticated' ? (
            <button 
                onClick={() => {
                    setIsFormOpen(true);
                    setMessage('');
                    setFormData(initialFormData);
                    setSelectedFile(null);
                }}
                className="inline-flex items-center justify-center min-w-[150px] h-[48px] px-6 py-3 rounded-[50px] border-2 border-[#F26729] text-[#F26729] gap-2 font-secondary text-base font-semibold transition-colors duration-300 hover:bg-[#F26729] hover:text-white shadow-lg hover:shadow-xl cursor-pointer my-8"
            >
                <Upload size={20} />
                Submit Artwork
            </button>
        ) : (
            <button 
                // In a real app, this would redirect or open a sign-in modal
                className="inline-flex items-center justify-center max-w-[200px] h-[48px] px-6 py-3 rounded-[50px] border-2 border-gray-500 text-gray-500 gap-2 font-secondary text-base font-semibold bg-gray-100 cursor-not-allowed my-8"
                disabled
            >
                <LogIn size={20} />
                Log In to Submit
            </button>
        )}
        {authStatus !== 'authenticated' && <p className='text-red-500 font-medium'>Submission requires login via NextAuth.</p>}
      </div>

      {/* Submission Modal */}
      {isFormOpen && authStatus === 'authenticated' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full transition"
            >
              <X size={24} />
            </button>
            <h3 className="text-3xl font-bold font-heading text-gray-800 mb-6 border-b pb-2">Submit New Artwork</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="border-2 border-dashed border-[#F26729]/50 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <label htmlFor="file" className="cursor-pointer block">
                  <Upload className="mx-auto text-[#F26729] mb-2" size={32} />
                  <p className="font-semibold text-lg text-gray-800">
                    {selectedFile ? selectedFile.name : 'Click to select your image file (required)'}
                  </p>
                  <input type="file" id="file" name="file" accept="image/*" required onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {/* 💡 FIX: Correctly pass props to the Input component */}
              <Input label="Artwork Title" name="title" required formData={formData} handleChange={handleChange} />
              <Input label="Description" name="description" isTextArea formData={formData} handleChange={handleChange} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    label="Tools Used" 
                    name="tools_used" 
                    helpText="Separate tools with commas (e.g., Figma, Photoshop, Blender)"
                    formData={formData} handleChange={handleChange}
                />
                <Input label="Project Type (e.g., Digital Painting, 3D Model)" name="project_type" formData={formData} handleChange={handleChange} />
              </div>
              
              <button
                type="submit"
                disabled={loading || !selectedFile || !formData.title.trim()} // 💡 FIX: Check for empty title string
                className="w-full flex items-center justify-center bg-[#F26729] text-white p-3 rounded-full font-bold text-lg hover:bg-opacity-90 disabled:bg-gray-400 transition duration-300 shadow-md mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Submit Artwork for Review
                  </>
                )}
              </button>
              
              {message && (
                <p className={`mt-4 text-center text-sm p-3 rounded-lg ${message.startsWith('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}