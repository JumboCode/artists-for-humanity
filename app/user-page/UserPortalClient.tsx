"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ProfileFromServer = {
  display_name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  department: string | null;

  headline: string | null;
  school: string | null;
  year: string | null;
  instagram: string | null;

  user: {
    id: string;
    username: string;
  };
};

type ProfileViewProps = {
  profile: ProfileFromServer;
  isOwnProfile: boolean;
};

type EditForm = {
  firstName: string;
  lastName: string;
  headline: string;
  school: string;
  year: string;
  instagram: string;
  bio: string;
};

function splitName(displayName: string | null) {
  const base = (displayName ?? "").trim();
  if (!base) return { firstName: "", lastName: "" };

  const parts = base.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export default function UserPortalClient({ profile, isOwnProfile }: ProfileViewProps) {
  const router = useRouter();
  const { data: session } = useSession();

  // (keeps template behavior: a "Published/Drafts" toggle)
  // But per your request: no gallery images; just keep an upload CTA.
  const [onPublished, setTab] = useState(true);

  const displayName = profile.display_name ?? profile.user.username;

  // Build initial form values from DB profile
  const initialForm: EditForm = useMemo(() => {
    const { firstName, lastName } = splitName(profile.display_name);

    return {
      firstName,
      lastName,
      headline: profile.headline ?? "",
      school: profile.school ?? "",
      year: profile.year ?? "",
      instagram: profile.instagram ?? "",
      bio: profile.bio ?? "",
    };
  }, [profile.display_name, profile.headline, profile.school, profile.year, profile.instagram, profile.bio]);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditForm>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function openEdit() {
    setError(null);
    setSuccess(null);
    setForm(initialForm); // always start from latest DB values
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isOwnProfile) {
      setError("You can only edit your own profile.");
      return;
    }

    const myId = session?.user?.id;
    if (!myId) {
      setError("You are not logged in.");
      return;
    }

    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    try {
      setIsSaving(true);

      const res = await fetch(`/api/users/${myId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          headline: form.headline,
          school: form.school,
          year: form.year,
          instagram: form.instagram,
          bio: form.bio,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setSuccess("Profile updated!");
      setIsEditing(false);

      // IMPORTANT: this makes the SERVER component re-fetch Prisma data
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSaving(false);
    }
  }

  function handleUploadClick() {
    // wire this to your actual upload flow:
    // router.push("/upload") OR open upload modal, etc.
    router.push("/upload");
  }

  return (
    <div className="bg-afh-white min-w-screen container-afh text-[black]">
      {/* 🔸 FULL-WIDTH HERO IMAGE (template style) */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <Image
          src={"/imgs/profile-banner-temp.png"}
          alt="Banner Image"
          className="w-full h-[30vh] object-cover"
          width={1200}
          height={300}
          priority
        />
      </div>

      <div className="h-full w-full flex max-md:flex-col gap-[50px]">
        {/* LEFT: Profile info (synced with server profile) */}
        <div className="afh-section user-info -translate-y-[30px] w-[30%] md:w-[45%] max-md:w-full max-md:items-center flex flex-col gap-[40px]">
          {/* Profile image + name */}
          <div className="flex flex-col">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white bg-white">
              <Image
                src={profile.profile_image_url ?? "/imgs/user-stock.png"}
                alt="user profile picture"
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </div>

            <p className="font-primary text-[40px] font-light">{displayName}</p>
          </div>

          {/* Other user info */}
          <div className="flex flex-col gap-2 justify-start font-secondary font-light text-[16px]">
            <p>@{profile.user.username}</p>
            {profile.headline ? <p>{profile.headline}</p> : null}
            {profile.school || profile.year ? (
              <p>
                {profile.school ?? ""} {profile.year ? `(${profile.year})` : ""}
              </p>
            ) : null}
            {profile.instagram ? (
              <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noreferrer">
                @{profile.instagram}
              </a>
            ) : null}
            {profile.bio ? <p>{profile.bio}</p> : null}
          </div>

          {/* Buttons only for your own profile (template-style CTA area) */}
          {isOwnProfile ? (
            <div className="flex flex-col gap-[20px] max-md:items-center">
              <button
                onClick={openEdit}
                className="border-[1px] max-w-[169px] max-h-[43px] items-center text-[15px] btn-outline rounded-full font-primary font-light inline-flex justify-start"
              >
                Edit Profile Info
              </button>

              <button
                onClick={handleUploadClick}
                className="border-[1px] h-[43px] w-[220px] inline-flex items-center justify-center text-[15px] btn-outline rounded-full font-primary font-light whitespace-nowrap"
              >
                Upload a New Project
              </button>
            </div>
          ) : null}
        </div>

        {/* RIGHT: keep the template section shell, but NO gallery images */}
        <div className="afh-section galery-section w-[70%] md:w-[55%] max-md:w-full max-md:items-center -translate-y-[30px] section-padding flex flex-col gap-[40px]">
          {/* Template tab header */}
          <div className="flex gap-[25px] w-full border-b-2 h-auto">
            <button
              className={`relative h-full border-b-2 bottom-[-2px] ${onPublished ? "border-black" : "border-transparent"}`}
              onClick={() => setTab(true)}
              type="button"
            >
              Published
            </button>
            <button
              className={`relative h-full border-b-2 bottom-[-2px] ${onPublished ? "border-transparent" : "border-black"}`}
              onClick={() => setTab(false)}
              type="button"
            >
              Drafts
            </button>
          </div>

          {/* no gallery images, just keep an upload */}
          {isOwnProfile ? (
            <div className="w-full flex">
              <div className="w-[360px] h-[360px] rounded-2xl bg-white border-[2px] border-afh-orange shadow-sm flex flex-col items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="w-[88px] h-[88px] rounded-full bg-afh-orange/25 flex items-center justify-center text-afh-orange"
                  aria-label="Upload new project"
                >
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18 3v30M3 18h30"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="text-[15px] btn-outline border-[1px] rounded-full font-primary font-light inline-flex justify-start"
                >
                  + Upload New Project
                </button>
              </div>
            </div>
          ) : (
            <p className="font-primary">No public projects to display.</p>
          )}
        </div>
      </div>

      {/* Edit modal (synced version) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={cancelEdit} />

          <form
            onSubmit={handleSave}
            className="relative bg-white rounded-xl p-8 w-full max-w-3xl mx-4 shadow-afh border border-gray-100"
            aria-label="Edit profile form"
          >
            <button
              type="button"
              onClick={cancelEdit}
              aria-label="Close edit modal"
              className="absolute top-7 right-6 w-9 h-9 rounded-full bg-white text-afh-orange border-2 border-afh-orange flex items-center justify-center hover:bg-afh-orange hover:text-white transition-colors duration-150"
            >
              ✕
            </button>

            <h3 className="text-2xl font-heading text-afh-blue">Edit Profile</h3>
            <hr className="mt-4 border-t border-afh-blue/10" />

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="flex gap-3">
                <label className="flex-1 flex flex-col text-sm">
                  <span className="text-[13px]">First name*</span>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="mt-1 h-11 rounded-md border border-gray-200 px-3"
                  />
                </label>

                <label className="flex-1 flex flex-col text-sm">
                  <span className="text-[13px]">Last name</span>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="mt-1 h-11 rounded-md border border-gray-200 px-3"
                  />
                </label>
              </div>

              <label className="flex flex-col text-sm">
                <span className="text-[13px]">Headline</span>
                <input
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  className="mt-1 h-11 rounded-md border border-gray-200 px-3"
                />
              </label>

              <div className="flex gap-3">
                <label className="flex-1 flex flex-col text-sm">
                  <span className="text-[13px]">School</span>
                  <input
                    value={form.school}
                    onChange={(e) => setForm({ ...form, school: e.target.value })}
                    className="mt-1 h-11 rounded-md border border-gray-200 px-3"
                  />
                </label>

                <label className="flex-1 flex flex-col text-sm">
                  <span className="text-[13px]">Graduation Year</span>
                  <input
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="mt-1 h-11 rounded-md border border-gray-200 px-3"
                  />
                </label>
              </div>

              <label className="flex flex-col text-sm">
                <span className="text-[13px]">Instagram</span>
                <input
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  className="mt-1 h-11 rounded-md border border-gray-200 px-3"
                />
              </label>

              <label className="flex flex-col text-sm">
                <span className="text-[13px]">Bio</span>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="mt-1 rounded-md border border-gray-200 px-3 py-2"
                  rows={3}
                />
              </label>
            </div>

            {error ? <p className="text-red-600 text-sm mt-4">{error}</p> : null}
            {success ? <p className="text-green-700 text-sm mt-4">{success}</p> : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-full font-primary bg-white text-afh-orange border-2 border-afh-orange hover:bg-afh-orange hover:text-white transition-colors duration-150 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
