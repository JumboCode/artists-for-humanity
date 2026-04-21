import { LoginBody } from '@/components/login/LoginBody'

export default function LoginPage() {
  return (
    <div
      className="min-h-screen w-full flex justify-center items-start 
                    px-4 sm:px-6 md:px-8 py-16 sm:py-20"
    >
      <div className="w-full max-w-4xl mx-auto flex justify-center">
        <LoginBody />
      </div>
    </div>
  )
}
