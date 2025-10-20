'use client'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import InfoIcon from '@mui/icons-material/Info'
import { IconButton, Input, InputAdornment, Link } from '@mui/material'
import { ChangeEventHandler, useState } from 'react'
import { FormFieldWrapper } from './FormFieldWrapper'

interface PasswordTextFieldProps {
  password: string
  onFieldChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  showError: boolean
}

export const PasswordTextField = ({
  password,
  onFieldChange,
  showError,
}: PasswordTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword(show => !show)
  return (
    <FormFieldWrapper
      label="Password"
      errorMessage={showError ? 'Please enter a password' : undefined}
    >
      <Input
        type={showPassword ? 'text' : 'password'}
        value={password}
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
          <InputAdornment position="end" className="pr-4">
            <IconButton onClick={handleClickShowPassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      ></Input>
    </FormFieldWrapper>
  )
}
