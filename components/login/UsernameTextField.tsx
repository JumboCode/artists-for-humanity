import { Input, InputAdornment, IconButton } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { ChangeEventHandler } from 'react'
import { FormFieldWrapper } from './FormFieldWrapper'

interface UsernameTextFieldProps {
  username: string
  onFieldChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  showError: boolean
}

export const UsernameTextField = ({
  username,
  onFieldChange,
  showError,
}: UsernameTextFieldProps) => {
  return (
    <FormFieldWrapper
      label="Username"
      errorMessage={
        showError ? 'Please enter your username or email address' : undefined
      }
    >
      <Input
        value={username}
        onChange={onFieldChange}
        sx={{
          '&:before': {
            borderBottomColor: showError ? '#f97316' : 'rgba(0, 0, 0, 0.42)', // normal underline
            borderBottomWidth: showError ? '2px' : '1px',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: showError ? '#f97316' : 'rgba(0, 0, 0, 0.87)', // hover color
            borderBottomWidth: showError ? '2px' : '1px',
          },
          '&:after': {
            borderBottomColor: showError ? '#f97316' : '#1976d2', // focused underline
            borderBottomWidth: showError ? '2px' : '2px',
          },
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton edge="end" />
          </InputAdornment>
        }
      />
    </FormFieldWrapper>
  )
}
