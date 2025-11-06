'use client'
import React, { useState, FC } from 'react'
import { useRouter } from 'next/navigation'
import FormField from '@/components/ui/FormField'
import ManuealPlayerLineUp, { Player } from '@/components/ui/ManuealPlayerLineUp'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { AuthProvider, useAuth } from '@/lib/AuthContext'
import { FaFileUpload } from 'react-icons/fa'
import { playerPostition } from '@/lib/constant'
import { getClient } from '@/lib/api/client'
const Page = () => {
  // get user form AuthContext
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // Centralized form state
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLineUpSubmissionAuto, setIsLineUpSubmissionAuto] = useState(false)
  const { replace } = useRouter()
  interface FormData {
    matchURL: string,
    lineUpImageURL?: string | null,
    lineUpImage?: File | null,
    players: Player[],
  }
  const [formData, setFormData] = useState<FormData>({
    matchURL: '',
    lineUpImageURL: '',
    lineUpImage: null,
    players: Array.from({ length: 11 }, () => ({
      name: '',
      jerseyNumber: '',
      position: '',
    })),

  })

  const handlePrevious = () => setStep(prev => Math.max(1, prev - 1))

  const handleNext = async () => {
    setError('');
    setLoading(true)
    try {
      switch (step) {
        //  STEP 1 — YouTube link validation
        case 1: {
          const step1Schema = yup.object({
            matchURL: yup
              .string()
              .required("You must provide a valid YouTube URL before continuing.")
              .matches(
                /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                "Please enter a valid YouTube link."
              ),
          });
          await step1Schema.validate({
            matchURL: formData.matchURL,
          });
          setStep((prev) => prev + 1);
          break;
        }

        // STEP 2 — Lineup method selection
        case 2: {
          if (isLineUpSubmissionAuto === undefined) {
            setError("Please select how you'd like to provide the player lineup.");
            return;
          }
          if (isLineUpSubmissionAuto) {
            setError("Please select how you'd like to provide the player lineup.");
            return;
          }
          setStep((prev) => prev + 1);

        }

        //  STEP 3 — Player data validation
        case 3: {
          const playerSchema = yup.array()
            .of(
              yup.object().shape({
                name: yup.string().required("Player name is required!"),
                jerseyNumber: yup
                  .number()
                  .typeError("Jersey number must be a number!")
                  .required("Jersey number is required!"),
                position: yup
                  .string()
                  .oneOf(playerPostition, "Position must be one of the allowed roles!")
                  .required("Position is required!"),
              })
            )
            .required("Players list is required")
            .min(11, "You must provide exactly 11 players")
            .max(11, "You must provide exactly 11 players");

          await playerSchema.validate(formData.players);
          const client = await getClient()
          // prepare payload 
          const payload = {
            videoUrl: formData.matchURL,
            lineUpUrl: formData.lineUpImageURL,
            players: formData.players.map((p) => ({
              ...p,
              jerseyNumber: Number(p.jerseyNumber), // convert here
            })),
          };

          console.log(payload)
          const { data } = await client.post('/match/request', payload)
          console.log('match requested succesfully')
          toast.success("Your match has been submitted for analysis. We'll notify you once it's ready! ⚡", {
            duration: 4000,
            icon: "✅",
          });
          replace('/dashboard')

          setStep((prev) => prev + 1);

        }
      }
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        setError(err.message)
      } else {
        console.log(err.response.data)
        setError('Something went wrong please try again!')
      }
    }
  }


  // Generic update handler for any field
  const updateFormData = (field: keyof typeof formData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
    const updatedPlayers = [...formData.players]
    updatedPlayers[index][field] = value
    updateFormData('players', updatedPlayers)
  }

  // Progress indicator
  const ProgressCircle: FC<{ step: number; circleStep: number }> = ({ step, circleStep }) => {
    const isActive = circleStep <= step
    const bgColor = isActive ? 'bg-purple-600' : 'bg-purple-300'
    return (
      <div className={`${bgColor} p-1 w-10 h-10 items-center justify-center flex rounded-full`}>
        <p className="text-white">{circleStep}</p>
      </div>
    )
  }

  // Render based on step
  const renderUi = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              labelHtmlFor="matchURL"
              labelName="1. Please paste the match Youtube video link"
              inputType="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.matchURL}
              onChange={(e) => updateFormData('matchURL', e.target.value)}
            />
          </div>
        )
      case 2:
        return (
          <div className="w-full">
            <h3 className="text-gray-800">
              2. Would you like to complete the Player line up by uploading an image or manually?
            </h3>
            <div className="flex flex-col gap-5 py-2">
              <div className='flex gap-5'>
                <button
                  type="button"
                  className={`rounded text-gray-700 shadow p-1 px-2 
                ${isLineUpSubmissionAuto === true ? 'bg-purple-800 text-white' : 'bg-white/85 hover:bg-gray-300'}`}
                  onClick={() => setIsLineUpSubmissionAuto(true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`rounded text-gray-700 shadow p-1 px-2 
                ${isLineUpSubmissionAuto === false ? 'bg-purple-800 text-white' : 'bg-white/85 hover:bg-gray-300'}`}
                  onClick={() => setIsLineUpSubmissionAuto(false)}
                >
                  No
                </button>
              </div>
              {/* if yes we will let user upload teh image */}
              {isLineUpSubmissionAuto && (
                <div className="flex flex-col space-y-2">
                  <label className="block text-gray-800 text-sm font-medium mb-2">
                    Upload Lineup Image
                  </label>
                  <label
                    htmlFor="lineupFile"
                    className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-purple-50 transition-all duration-200"
                  >
                    <FaFileUpload className="text-purple-500 text-3xl mb-2" />
                    {formData.lineUpImage?.name && <p className='text-black text-md' >{formData.lineUpImage?.name}</p>}
                    <span className="text-sm text-gray-600">Click to upload or drag & drop</span>
                    <input
                      id="lineupFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => updateFormData("lineUpImage", e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div >
        )
      case 3:
        return (
          <div>
            <div className="flex flex-col w-full mt-4">
              <ManuealPlayerLineUp players={formData.players} onPlayerChange={handlePlayerChange} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full h-auto bg-white/95 px-5 py-10 flex flex-col items-center justify-start">
      <div className="w-full sm:w-[600px] bg-gray-100 p-5 py-10 rounded shadow-gray-500 shadow-sm flex flex-col items-center justify-start h-auto">
        <div className="flex flex-row gap-5">
          {[1, 2, 3].map((s) => (
            <ProgressCircle key={s} step={step} circleStep={s} />
          ))}
        </div>
        <p className='text-red-800 text-sm mt-5 '>{error && error}</p>

        <form className="w-full mt-5">{renderUi()}</form>

        <div className="flex w-full mt-5 items-center justify-between">
          <button
            className="text-black border-gray-300 border hover:bg-red-300 p-1 rounded hover:cursor-pointer w-24"
            onClick={handlePrevious}
          >
            Previous
          </button>
          <button
            className={`text-black border-gray-300 border hover:bg-green-300 w-24 p-1 rounded hover:cursor-pointer relative ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="opacity-0">{step !== 3 ? 'Next' : 'Submit'}</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              step !== 3 ? 'Next' : 'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  )

}
export default Page
