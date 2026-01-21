import { useRouter } from 'next/router'
import React from 'react'
import { FiArrowLeft } from 'react-icons/fi'

interface Props{
    path:string;
    name: string
}

const GoBackButton:React.FC<Props> = ({path, name}) => {
    const router = useRouter()
    return (
        <button
            onClick={() => router.push(path)}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
        >
            <FiArrowLeft size={20} />
            <span className="font-semibold">name</span>
        </button>
    )
}

export default GoBackButton
