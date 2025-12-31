import React from 'react'

interface Props {
  labelHtmlFor: string
  labelName: string
  inputType: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FormField: React.FC<Props> = ({
  inputType,
  labelHtmlFor,
  labelName,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={labelHtmlFor}
        className="block text-gray-50 text-sm font-medium mb-2"
      >
        {labelName}
      </label>
      <input
        id={labelHtmlFor}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-600 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-200"
      />
    </div>
  )
}

export default FormField
