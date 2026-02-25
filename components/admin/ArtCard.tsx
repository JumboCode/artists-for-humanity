type Artwork = {
  title: string;
  name: string;
  year: string;
  image: string;
};

type Props = {
  artwork: Artwork;
  onApprove?: () => void;
  onReject?: () => void;
  onFeature?: () => void;
  onReassign?: () => void;
};

export default function ArtworkCard({
  artwork,
  onApprove,
  onReject,
  onFeature,
  onReassign,
}: Props) {
  return (
    <div className="bg-white rounded-lg">

      {/* Auto-scaling image */}
      <div className="w-full flex justify-center rounded p-2">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="h-auto w-auto object-contain rounded"
        />
      </div>

      <div className="mt-3">
        <h2 className="text-lg font-semibold">{artwork.title}</h2>
        <p className="text-sm text-gray-600">{artwork.name}</p>
        <p className="text-xs text-gray-400">
          {new Date(artwork.year).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 font-thin">
        <button
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          onClick={onApprove}
        >
          Approve
        </button>

        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          onClick={onReject}
        >
          Reject
        </button>

        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          onClick={onFeature}
        >
          Feature
        </button>

        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={onReassign}
        >
          Reassign
        </button>
      </div>
    </div>
  );
}