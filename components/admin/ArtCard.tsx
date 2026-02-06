//does this already exist or what...

type Artwork = {
        id: string;
        title: string;
        artistName: string;
        imageUrl: string;
        submittedAt: string;
      };
      
      export default function ArtworkCard({artwork}) {
        return (
          <div className="border rounded p-4">
            <img src={artwork.imageUrl} className="h-32 w-full object-cover" />
            <h2>{artwork.title}</h2>
            <p>{artwork.artistName}</p>
            <p>{new Date(artwork.submittedAt).toLocaleDateString()}</p>

        {/* surely this is wrong */}
            <div className="flex gap-2 mt-3">
                <button className="bg-green-500">Approve</button>
                <button className="bg-red-500">Reject</button>
                <button className="bg-yellow-500">Feature</button>
                <button className="bg-blue-500">Reassign</button>
                </div>
          </div>
          
        );
        
      }
      