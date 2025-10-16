import React from 'react';

// Import each page component from its own file


// these don't exist yet
import HomePage from './pages/page';
// import AboutPage from './pages/AboutPage.jsx';
// import ServicesPage from './pages/ServicesPage.jsx';
// import ContactPage from './pages/ContactPage.jsx';
// import NotFoundPage from './pages/NotFoundPage.jsx';




/* temporary!!!!!!






*/
const Login = () => (
  <div className="flex flex-col items-center justify-center h-full p-8">
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
      <form className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" id="email" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </div>
  </div>
);

const UserPortal = () => (
  <div className="p-8 max-w-4xl mx-auto">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">User Portal</h1>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Welcome, User!</h2>
      <p>This is your personal portal. From here you can manage your account, view your activity, and access exclusive content.</p>
    </div>
  </div>
);

const Upload = () => (
  <div className="p-8 max-w-2xl mx-auto text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Upload Files</h1>
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex text-sm text-gray-600">
          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            <span>Upload a file</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  </div>
);





// current 404 bad path landing page.
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <h1 className="text-9xl font-black text-gray-400">404</h1>
    <p className="text-2xl font-bold text-gray-700 mt-4">Page Not Found</p>
    <p className="text-gray-500 mt-2">Sorry, the page you are looking for does not exist.</p>
  </div>
);
  
// --- Router Component ---
// This component now acts as a switchboard, rendering the correct component based on the 'page' prop.
// --- Router Component ---
// This component now switches based on the URL path prop.
const Router = ({ path }) => {
    path = '/login';
  switch (path) {
    case '/':
      return <HomePage />;
    case '/login':
      return <Login />;
    case '/user-portal':
      return <UserPortal />;
    case '/upload':
      return <Upload />;
    default:
      return <NotFoundPage />;
  }
};

export default Router;