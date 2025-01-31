interface ErrorMessageProps {
  message: string
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <p id="error" className="text-red-500 mb-4">
      {message}
    </p>
  )
}
