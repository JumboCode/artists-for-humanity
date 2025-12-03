import { SignUpBody } from '@/components/signup/SignUpBody'

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen w-full flex justify-center items-start 
                    p-4 md:pt-[200px] lg:pr-[500px] lg:pl-[60px] gap-8"
    >
      <SignUpBody />
    </div>
  )
}
