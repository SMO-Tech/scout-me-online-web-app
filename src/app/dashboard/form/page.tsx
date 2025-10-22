'use client'
import FormField from '@/components/ui/FormField'
import ManuealPlayerLineUp, { Player } from '@/components/ui/ManuealPlayerLineUp'
import { isAbsolute } from 'path'
import React, { FC, useState } from 'react'


const Page = () => {
  const [isLineUpSubmissionAuto, setIsLineUpSubmissionAuto] = useState<boolean | undefined>()

  const [step, setStep] = useState(2)

  interface ProgressProps {
    step: number,
    circleStep: number
  }
  const ProgressCircle: FC<ProgressProps> = ({ step, circleStep }) => {
    const isActive = circleStep <= step
    const bgColor = isActive ? 'bg-purple-600' : 'bg-purple-300'
    return (
      <div className={`${bgColor} p-1 w-10 h-10 items-center justify-center flex rounded-full`}>
        <p className='text-white'>{circleStep}</p>
      </div>
    )
  }

  const handlePrevious =()=>{
    setStep(prev=>{
      if (prev <= 1) return 1
      return prev - 1
    })
  }

  const handleNext =()=>{
    setStep(prev=>{
      return (
        prev+1
      )
    })
  }

  // Dummy players state (11 players)
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: 11 }, () => ({ playerName: '', jerseyNumber: '', position: '' }))
  )

  const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
    const newPlayers = [...players]
    newPlayers[index][field] = value
    setPlayers(newPlayers)
  }

  const renderUi = () => {
    switch (step) {
      case 1:
        return (
          <FormField
            labelHtmlFor="matchURL"
            labelName="1. Please paste the match Youtube video link."
            inputType="text"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        )
        break;
      case 2:
        return (
          <div className="mt-5 w-full">
            {isLineUpSubmissionAuto === undefined && (
              <>
                <h3 className="text-gray-800">
                  2. Would you like to complete the Player line up by uploading an image or manually?
                </h3>
                <div className="flex gap-5 py-2">
                  <button
                    type="button"
                    className="bg-white/85 rounded text-gray-700 shadow hover:bg-gray-300 p-1 px-2"
                    onClick={() => setIsLineUpSubmissionAuto(true)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="bg-white/85 rounded text-gray-700 shadow hover:bg-gray-300 p-1 px-2"
                    onClick={() => setIsLineUpSubmissionAuto(false)}
                  >
                    No
                  </button>
                </div>
              </>
            )}

            {/* Auto pick-line-up */}
            {isLineUpSubmissionAuto && (
              <div>
                <label className="text-gray-600" htmlFor="playerLineUpImage">
                  2. Please Upload an image to get the player line up
                  <input
                    className="bg-white border border-gray-300 rounded w-full mt-2"
                    type="file"
                  />
                </label>
              </div>
            )}

            {/* Manual line-up selection */}
            {isLineUpSubmissionAuto === false && (
              <div className="flex flex-col w-full mt-4">
                <ManuealPlayerLineUp
                  players={players}
                  onPlayerChange={handlePlayerChange}
                />
              </div>
            )}
          </div>
        )

      default:
        break;
    }
  }

  return (
    <div className=" w-full h-auto bg-white/95 mt-20 px-5 py-10 flex flex-col items-center justify-start">
      <div className="w-full sm:w-[600px] bg-gray-100 p-5 py-10 rounded shadow-gray-500 shadow-sm flex flex-col items-center justify-start h-auto">
        {/* progress bar with cirlce */}
        <div className='flex flex-row gap-15'>
          {[1, 2, 3].map((s) => {
            return (
              <ProgressCircle key={s} step={step} circleStep={s} />
            )
          })}
        </div>
        <form className="w-full">
          {renderUi()}


        </form>
        {/* buttons control */}
        <div className='flex w-full mt-5 items-center justify-between '>
          <button
            className='text-black border-gray-300 border hover:bg-red-300 p-1 rounded hover:cursor-pointer w-24 '
            onClick={handlePrevious}
          >
            Previous
          </button>
          <button
            className='text-black border-gray-300 border hover:bg-green-300 w-24 p-1 rounded hover:cursor-pointer '
            onClick={handleNext}
          >
            Next
          </button>

        </div>
      </div>
    </div>


  )
}

export default Page
