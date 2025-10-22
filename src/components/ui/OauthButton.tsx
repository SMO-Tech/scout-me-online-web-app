import React, { FC, ReactNode } from 'react'
interface Props {
    text: string,
    icon: ReactNode,
    onClick(): void
}
const OauthButton: FC<Props> = ({ text, icon, onClick }) => {
    return (
        <button onClick={onClick} className='flex-row flex items-center justify-between min-w-52 gap-2  border border-gray-300 hover:bg-gray-200 text-black rounded p-1'>
            <span className="font-medium">{text}</span>
            <span className="text-lg">{icon}</span>
        </button>
    )
}

export default OauthButton
