import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

function isVideoAsset(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || /\/video\/upload\//i.test(url)
}

/** Derive a Cloudinary image thumbnail from a video URL by replacing extension with .jpg */
function cloudinaryVideoThumbnailUrl(videoUrl: string): string {
  // e.g. https://res.cloudinary.com/{cloud}/video/upload/{id}.mp4
  // → https://res.cloudinary.com/{cloud}/video/upload/w_400,h_400,c_fill,q_auto,so_0/{id}.jpg
  return videoUrl
    .replace('/video/upload/', '/video/upload/w_400,h_400,c_fill,q_auto,so_0/')
    .replace(/\.(mp4|webm|mov|m4v)(\?.*)?$/i, '.jpg')
}

type ProfilePageProps = {
  params: Promise<{ username: string }>
}

export default async function PublicProfilePage({ params }: Readonly<ProfilePageProps>) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
      artworks: {
        where: { status: 'APPROVED' },
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          image_url: true,
          thumbnail_url: true,
          project_type: true,
          tools_used: true,
          created_at: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  const displayName = user.profile?.display_name || user.username
  const avatarUrl = user.profile?.profile_image_url
  const bannerUrl = user.profile?.banner_image_url

  return (
    <div className="min-h-screen bg-white py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-block rounded-full border border-afh-orange px-4 py-2 text-sm text-afh-orange transition-colors hover:bg-afh-orange hover:text-white"
          >
            Back to Gallery
          </Link>
        </div>

        <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="relative h-44 w-full overflow-hidden rounded-t-3xl sm:h-56 lg:h-64">
            {bannerUrl ? (
              <Image
                src={bannerUrl}
                alt={`${displayName} banner`}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-[#0B1A2A] via-[#132B44] to-[#1A3C5D]" />
            )}
          </div>

          <div className="px-6 pb-8 pt-0 sm:px-8 lg:px-10">
            <div className="-mt-14 flex flex-col items-center gap-4 text-center sm:-mt-16 sm:items-start sm:text-left">
              <div className="relative z-10 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-100 sm:h-28 sm:w-28">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-gray-500">
                    {displayName.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="w-full">
                <h1 className="text-3xl font-heading font-light text-gray-900 sm:text-4xl">{displayName}</h1>
                <p className="mt-1 text-sm text-gray-500">@{user.username}</p>
                {user.profile?.bio ? (
                  <p className="mx-auto mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-gray-700 sm:mx-0 sm:text-base">
                    {user.profile.bio}
                  </p>
                ) : null}
              </div>
            </div>

            {(user.profile?.department || user.profile?.school || user.profile?.graduation_year || user.profile?.instagram) && (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {user.profile?.department ? (
                  <div className="rounded-2xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Department</p>
                    <p className="mt-1 text-sm text-gray-900">{user.profile.department}</p>
                  </div>
                ) : null}
                {user.profile?.school ? (
                  <div className="rounded-2xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">School</p>
                    <p className="mt-1 text-sm text-gray-900">{user.profile.school}</p>
                  </div>
                ) : null}
                {user.profile?.graduation_year ? (
                  <div className="rounded-2xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Graduation Year</p>
                    <p className="mt-1 text-sm text-gray-900">{user.profile.graduation_year}</p>
                  </div>
                ) : null}
                {user.profile?.instagram ? (
                  <div className="rounded-2xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Instagram</p>
                    <a
                      href={`https://instagram.com/${user.profile.instagram}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-sm text-afh-orange underline-offset-4 hover:underline"
                    >
                      @{user.profile.instagram}
                    </a>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-heading font-light text-gray-900">Gallery</h2>
            <p className="text-sm text-gray-500">{user.artworks.length} piece{user.artworks.length === 1 ? '' : 's'}</p>
          </div>

          {user.artworks.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
              No approved artwork published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {user.artworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/artworks/${artwork.id}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                    {isVideoAsset(artwork.image_url) ? (
                      <video
                        src={artwork.image_url}
                        poster={cloudinaryVideoThumbnailUrl(artwork.image_url)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      >
                        <track kind="captions" label="English captions" />
                      </video>
                    ) : (
                      <Image
                        src={artwork.thumbnail_url || artwork.image_url}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-heading font-light text-gray-900">{artwork.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{artwork.project_type || artwork.tools_used.join(', ') || 'Mixed Media'}</p>
                    {artwork.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{artwork.description}</p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
