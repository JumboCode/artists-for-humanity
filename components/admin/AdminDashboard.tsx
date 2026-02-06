'use client';
import { useEffect, useState } from 'react';
import ArtworkCard from './ArtCard';

//make actual display page for admin dash

export function AdminDashboard() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchQueue();
  }, []);


  async function fetchQueue() { //GET actual artworks... ?
    const res = await fetch('/api/admin/queue');
    const data = await res.json();
    setArtworks(data.artworks);
    setLoading(false);
  }
  

//should display artworks and loading screen while waiting
  if (loading) {
    return <p>Loading pending artwork...</p>;
  }
  if (!loading && artworks.length === 0) {
    return <p>No pending artwork to review</p>;
  }

  //what is this about...
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {artworks.map(a => (
        <ArtworkCard key={a.id} artwork={a} />
      ))}
    </div>
    
  );
}
