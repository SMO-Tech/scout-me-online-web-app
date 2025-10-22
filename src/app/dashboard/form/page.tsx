'use client'
import React, { useState, FC } from 'react'
import FormField from '@/components/ui/FormField'
import ManuealPlayerLineUp, { Player } from '@/components/ui/ManuealPlayerLineUp'
import * as yup from 'yup'
const Page = () => {
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  // Centralized form state
  const [formData, setFormData] = useState({
    matchURL: '',
    isLineUpSubmissionAuto: undefined as boolean | undefined,
    players: Array.from({ length: 11 }, () => ({
      playerName: '',
      jerseyNumber: '',
      position: '',
    })) as Player[],
  })

  const handlePrevious = () => setStep(prev => Math.max(1, prev - 1))

  const handleNext = async () => {
    try {
      switch (step) {
        // ✅ STEP 1 — YouTube link validation
        case 1: {
          const youtubeSchema = yup
            .string()
            .required("You must provide a YouTube URL before continuing.")
            .matches(
              /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
              "Please enter a valid YouTube link."
            );

          await youtubeSchema.validate(formData.matchURL);
          setError("");
          setStep((prev) => prev + 1);
          break;
        }

        // ✅ STEP 2 — Lineup method selection
        case 2: {
          if (formData.isLineUpSubmissionAuto === undefined) {
            setError("Please select how you'd like to provide the player lineup.");
            return;
          }
          if (formData.isLineUpSubmissionAuto === true) {
            setError("Please select how you'd like to provide the player lineup.");
            return;
          }

          setError("");
          setStep((prev) => prev + 1);
          break;
        }

        // ✅ STEP 3 — Player data validation
        case 3: {
          const playerSchema = yup.object().shape({
            playerName: yup.string().required("Missing name"),
            jerseyNumber: yup
              .string()
              .matches(/^\d+$/, "Invalid jersey #")
              .required("Missing jersey #"),
            position: yup.string().required("Missing position"),
          });

          const playersSchema = yup
            .array()
            .of(playerSchema)
            .min(11, "Need 11 players")
            .test(
              "unique-jersey",
              "Duplicate jersey #s",
              (players) => {
                const numbers = players?.map((p) => p.jerseyNumber);
                return numbers?.length === new Set(numbers).size;
              }
            );

          await playersSchema.validate(formData.players, { abortEarly: false });
          setError("");

          console.log("All good! Submitting data:", formData);
          break;
        }
        default:
          break;
      }
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        const playerErrors: Record<number, string[]> = {};

        err.inner.forEach((e) => {
          const match = e.path?.match(/\[(\d+)\]/);
          if (match) {
            const index = parseInt(match[1]);
            if (!playerErrors[index]) playerErrors[index] = [];
            playerErrors[index].push(e.message);
          }
        });
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
            <FormField
              labelHtmlFor="matchURL"
              labelName="1. Please paste the match Youtube video link."
              inputType="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.matchURL}
              onChange={(e) => updateFormData('matchURL', e.target.value)}
            />
          )
        case 2:
          return (
            <div className="w-full">
              <h3 className="text-gray-800">
                2. Would you like to complete the Player line up by uploading an image or manually?
              </h3>
              <div className="flex gap-5 py-2">
                <button
                  type="button"
                  className={`rounded text-gray-700 shadow p-1 px-2 
                ${formData.isLineUpSubmissionAuto === true ? 'bg-purple-800 text-white' : 'bg-white/85 hover:bg-gray-300'}`}
                  onClick={() => updateFormData('isLineUpSubmissionAuto', true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`rounded text-gray-700 shadow p-1 px-2 
                ${formData.isLineUpSubmissionAuto === false ? 'bg-purple-800 text-white' : 'bg-white/85 hover:bg-gray-300'}`}
                  onClick={() => updateFormData('isLineUpSubmissionAuto', false)}
                >
                  No
                </button>
              </div>
            </div>
          )
        case 3:
          return (
            <div>
              {formData.isLineUpSubmissionAuto && (
                <div>
                  <label className="text-gray-600" htmlFor="playerLineUpImage">
                    2. Please upload an image to get the player lineup
                    <input
                      className="bg-white border border-gray-300 rounded w-full mt-2"
                      type="file"
                    />
                  </label>
                </div>
              )}
              {formData.isLineUpSubmissionAuto === false && (
                <div className="flex flex-col w-full mt-4">
                  <ManuealPlayerLineUp players={formData.players} onPlayerChange={handlePlayerChange} />
                </div>
              )}
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
              className="text-black border-gray-300 border hover:bg-green-300 w-24 p-1 rounded hover:cursor-pointer"
              onClick={handleNext}
            >
              {step !== 3 ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    )

  }
  export default Page
