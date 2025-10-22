import React from 'react'


interface Props {
    labelHtmlFor:string,
    labelName : string,
    inputType :string,
    placeholder : string,


}

const FormField:React.FC<Props> = ({inputType,labelHtmlFor,labelName,placeholder}) => {
    return (
        <div className="mb-4">
            <label
                htmlFor={labelHtmlFor}
                className="block text-gray-800 text-sm font-medium mb-2"
            >
                {labelName}
            </label>
            <input
                type=""
                placeholder={placeholder}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition duration-200"
            />
        </div>
    )
}

export default FormField
