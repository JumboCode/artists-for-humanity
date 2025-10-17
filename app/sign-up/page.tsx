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
      <h1 className="font-light font-xl font-heading">
        Student Portal Sign Up
      </h1>
      <hr className="border color-black" />
      <SignUpBody />
      <SignUpButton />
    </div>
  )
}

const SignUpBody = () => {
  return (
    <div className="flex flex-col gap-[60px]">
      <div className="flex flex-col">
        <p className="font-light font-xs">Already signed up?</p>
        <p className="font-light font-xs">
          Login{' '}
          <a href={'/login'}>
            <span className="underline font-semibold">here.</span>
          </a>
        </p>
      </div>
      <div className="flex flex-col">
        <input></input>
        <p>Username</p>
      </div>
      <div className="flex flex-col">
        <input></input>
        <div className="flex flex-row justify-between">
          <p>Password</p>
          <p>Forgot password?</p>
        </div>
      </div>
    </div>
  )
}

const SignUpButton = () => {
  return (
    <button className="border rounded-[50px] px-[15px] py-2.5 w-fit self-end border-afh-orange">
      Sign Up
    </button>
  )
}
