'use client';

import { useEffect, useState } from 'react';
import ArtworkCard from './ArtCard';

type Artwork = {
  title: string;
  name: string;
  year: string;
  image: string;
};

export default function AdminDashboard() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  const [rejectingArtworkId, setRejectingArtworkId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [featuringArtworkId, setFeaturingArtworkId] = useState<string | null>(null);

  const [reassigningArtworkId, setReassigningArtworkId] = useState<string | null>(null);
  const [reassignToUser, setReassignToUser] = useState('');

  useEffect(() => {
    fetchQueue();
  }, []);

  async function fetchQueue() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/queue');
      const data = await res.json();
      setArtworks(data.artwork);
    } catch (err) {
      console.error('Failed to fetch queue', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(title: string) {
    try {
      await fetch(`/api/admin/artworks/${title}/approve`, { method: 'PATCH' });
      fetchQueue();
    } catch (err) {
      console.error('Failed to approve artwork', err);
    }
  }

  function openRejectModal(title: string) {
    setRejectingArtworkId(title);
    setRejectReason('');
  }

  async function handleReject() {
    if (!rejectingArtworkId) return;

    try {
      await fetch(`/api/admin/artworks/${rejectingArtworkId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      });

      setRejectingArtworkId(null);
      setRejectReason('');
      fetchQueue();
    } catch (err) {
      console.error('Failed to reject artwork', err);
    }
  }

  function openFeatureModal(title: string) {
    setFeaturingArtworkId(title);
  }

  async function handleFeature() {
    if (!featuringArtworkId) return;

    try {
      await fetch(`/api/admin/artworks/${featuringArtworkId}/feature`, {
        method: 'PATCH',
      });

      setFeaturingArtworkId(null);
      fetchQueue();
    } catch (err) {
      console.error('Failed to feature artwork', err);
    }
  }

  function openReassignModal(title: string) {
    setReassigningArtworkId(title);
    setReassignToUser('');
  }

  async function handleReassign() {
    if (!reassigningArtworkId) return;

    try {
      await fetch(`/api/admin/artworks/${reassigningArtworkId}/reassign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUserId: reassignToUser }),
      });

      setReassigningArtworkId(null);
      setReassignToUser('');
      fetchQueue();
    } catch (err) {
      console.error('Failed to reassign artwork', err);
    }
  }

  if (loading) return <p className="p-6">Loading pending artwork...</p>;
  if (artworks.length === 0)
    return <p className="p-6">No pending artwork to review.</p>;

  return (
    <div className="p-6">
      <h1 className="text-5xl font-thin text-[#1B264F]">Pending Artwork</h1>

      
{/* Section line */}
  <hr className="border-t-[1px] border-gray-400 my-[60px]" />


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {artworks.map((art) => (
          <ArtworkCard
            key={art.title}
            artwork={art}
            onApprove={() => handleApprove(art.title)}
            onReject={() => openRejectModal(art.title)}
            onFeature={() => openFeatureModal(art.title)}
            onReassign={() => openReassignModal(art.title)}
          />
        ))}
      </div>

      {/* Reject Modal */}
      {rejectingArtworkId && (
        <Modal>
          <h2 className="text-lg font-bold">Reject Artwork</h2>
          <textarea
            className="w-full mt-4 border p-2 rounded text-[#1B264F] bg-white"
            placeholder="Reason for rejection"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <ModalButtons
            onCancel={() => setRejectingArtworkId(null)}
            onConfirm={handleReject}
            confirmLabel="Reject"
            confirmColor="bg-red-500 hover:bg-red-600"
          />
        </Modal>
      )}

      {/* Feature Modal */}
      {featuringArtworkId && (
        <Modal>
          <h2 className="text-lg font-bold">Feature Artwork?</h2>
          <p className="mt-2 text-[#1B264F] bg-white">Do you want to feature this artwork?</p>
          <ModalButtons
            onCancel={() => setFeaturingArtworkId(null)}
            onConfirm={handleFeature}
            confirmLabel="Feature"
            confirmColor="bg-yellow-500 hover:bg-yellow-600"
          />
        </Modal>
      )}

      {/* Reassign Modal */}
      {reassigningArtworkId && (
        <Modal>
          <h2 className="text-lg font-bold">Reassign Artwork</h2>
          <select
            className="w-full mt-4 border p-2 rounded text-[#1B264F] bg-white"
            value={reassignToUser}
            onChange={(e) => setReassignToUser(e.target.value)}
          >
            <option value="" >Select user</option>
            <option value="user1">User 1</option>
            <option value="user2">User 2</option>
          </select>
          <ModalButtons
            onCancel={() => setReassigningArtworkId(null)}
            onConfirm={handleReassign}
            confirmLabel="Reassign"
            confirmColor="bg-blue-500 hover:bg-blue-600"
          />
        </Modal>
      )}
    </div>
  );
}

/* Reusable Modal */
function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-96">{children}</div>
    </div>
  );
}

function ModalButtons({
  onCancel,
  onConfirm,
  confirmLabel,
  confirmColor,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmColor: string;
}) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        className={`px-4 py-2 text-white rounded ${confirmColor}`}
        onClick={onConfirm}
      >
        {confirmLabel}
      </button>
    </div>
  );
}