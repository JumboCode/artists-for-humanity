interface SignUpButtonProps {
  isLoading?: boolean
}

export const SignUpButton = ({ isLoading = false }: SignUpButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="border rounded-[50px] px-[15px] py-2.5 w-fit lg:self-end border-afh-orange text-afh-orange hover:bg-afh-orange hover:text-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Signing up...' : 'Sign Up'}
    </button>
  )
}
