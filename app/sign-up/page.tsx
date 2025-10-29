export default function SignUpPage() {
  return (
    <div className="pt-[200px] pr-[500px] pl-[60px] gap-[30px]">
      <SignUpForm />
    </div>
  )
}

const SignUpForm = () => {
  return (
    <div className="flex flex-col h-full w-full gap-[30px]">
      <h1 className="font-light text-3xl font-heading text-afh-blue">
        Student Portal Sign Up
      </h1>
      <hr className="border border-gray-300" />
      <SignUpBody />
      <SignUpButton />
    </div>
  )
}

const SignUpBody = () => {
  return (
    <div className="flex flex-col gap-[60px]">
      <div className="flex flex-col">
        <p className="font-light text-lg text-gray-700">Already signed up?</p>
        <p className="font-light text-lg text-gray-700">
          Login{' '}
          <a href={'/login'}>
            <span className="underline font-semibold text-afh-orange">here.</span>
          </a>
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <input className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:border-afh-orange focus:outline-none"></input>
        <p className="text-lg font-light text-afh-blue">Username</p>
      </div>
      <div className="flex flex-col gap-2">
        <input type="password" className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:border-afh-orange focus:outline-none"></input>
        <div className="flex flex-row justify-between">
          <p className="text-lg font-light text-afh-blue">Password</p>
          <p className="text-lg font-light text-gray-600 underline cursor-pointer hover:text-afh-orange transition-colors">Forgot password?</p>
        </div>
      </div>
    </div>
  )
}

const SignUpButton = () => {
  return (
    <button className="border rounded-[50px] px-[15px] py-2.5 w-fit self-end border-afh-orange text-afh-orange hover:bg-afh-orange hover:text-white transition-colors font-medium">
      Sign Up
    </button>
  )
}
