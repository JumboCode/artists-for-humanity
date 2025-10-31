import { getArtworkById } from '@/lib/queries/artwork'

export const LoginButton = () => {
  return (
    <button
      onClick={async () => {
        console.log(await getArtworkById('test'))
      }}
      className="border rounded-[50px] px-[15px] py-2.5 w-fit lg:self-end border-afh-orange text-afh-orange hover:bg-afh-orange hover:text-white transition-colors font-medium"
    >
      Login
    </button>
  )
}
