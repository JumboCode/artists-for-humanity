import { Input, InputProps } from '@mui/material'
import { FormFieldWrapper } from './FormFieldWrapper'

export interface FormFieldProps extends InputProps {
  label: string
  errorMessage?: string
  showError: boolean
}

export const FormField = ({
  label,
  errorMessage,
  showError,
  ...rest
}: FormFieldProps) => {
  return (
    <FormFieldWrapper
      label={label}
      errorMessage={showError ? errorMessage : undefined}
    >
      <Input
        inputProps={{ style: { outline: 'none' } }}
        sx={{
          '& .MuiInputBase-input': {
            outline: 'none',
          },
          '&:before': {
            borderBottomColor: showError ? '#f97316' : 'rgba(0, 0, 0, 0.42)',
            borderBottomWidth: showError ? '2px' : '1px',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: showError ? '#f97316' : 'rgba(0, 0, 0, 0.87)',
            borderBottomWidth: showError ? '2px' : '1px',
          },
          '&:after': {
            borderBottomColor: '#f97316',
            borderBottomWidth: '2px',
          },
        }}
        {...rest}
      />
    </FormFieldWrapper>
  )
}
