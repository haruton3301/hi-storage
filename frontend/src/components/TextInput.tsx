interface TextInputProps {
  label: string
  type: "text" | "password"
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextInput = ({ label, type, value, onChange }: TextInputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        className="input input-bordered w-full"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
