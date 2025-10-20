import { ReactNode } from 'react'
import InfoIcon from '@mui/icons-material/Info'

interface FormFieldWrapperProps {
  label: string
  errorMessage?: string
  children: ReactNode
}

export const FormFieldWrapper = ({
  label,
  errorMessage,
  children,
}: FormFieldWrapperProps) => {
  return (
    <div className="flex flex-col gap-2.5">
      {children}
      <div className="flex flex-row justify-between items-center mt-1">
        <label className="text-lg font-light">{label}</label>

        {errorMessage && (
          <div className="flex flex-row gap-1 items-center text-afh-orange text-sm font-extralight font-secondary">
            <InfoIcon />
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  )
}
