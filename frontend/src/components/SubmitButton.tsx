interface SubmitButtonProps {
  children: React.ReactNode
  disabled: boolean
  onClick: () => void
}

export const SubmitButton = ({
  onClick,
  children,
  disabled,
}: SubmitButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn btn-primary w-full mb-4"
    >
      {children}
    </button>
  )
}
