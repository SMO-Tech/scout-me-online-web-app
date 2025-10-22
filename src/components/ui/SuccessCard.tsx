import React, { FC } from 'react'

interface Props {
    name: string;
    story: string
}

const Card: FC<Props> = ({ name, story }) => {
    return (
        <div className="group shadow-md p-6 rounded-xl bg-white hover:bg-purple-700 hover:shadow-lg transition-all duration-300">
            <p className="text-xl font-semibold text-purple-700 mb-2 transition-colors duration-300 group-hover:text-white">
                {name}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-100">
                {story}
            </p>
        </div>
    )
}




const SuccessCard = () => {
    return (
        <section className='w-full h-auto p-5 bg-white/90'>
            <h2 className='text-5xl font-extrabold text-center text-black/80' >Success Stories</h2>
            <div className='w-full flex-col sm:flex-row  flex h-auto gap-5 p-5' >
                <Card
                    name='Robin Sharma'
                    story='We simplified the data with infographics, heat maps, and a filtering tool that helps players and coaches pinpoint what works best on the field.'
                />
                <Card
                    name='Robin Sharma'
                    story='We simplified the data with infographics, heat maps, and a filtering tool that helps players and coaches pinpoint what works best on the field.'
                />
                <Card
                    name='Robin Sharma'
                    story='We simplified the data with infographics, heat maps, and a filtering tool that helps players and coaches pinpoint what works best on the field.'
                />
            </div>

        </section>
    )
}

export default SuccessCard
