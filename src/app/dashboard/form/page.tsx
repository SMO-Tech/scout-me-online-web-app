'use client'
import React, { useState, FC } from 'react'
import { useRouter } from 'next/navigation'
import FormField from '@/components/ui/FormField'
import ManuealPlayerLineUp, { Player } from '@/components/ui/ManuealPlayerLineUp'
import * as yup from 'yup'
import jobsService from '@/services/api/jobs/jobs.service'
import toast from 'react-hot-toast'
import { AuthProvider, useAuth } from '@/lib/AuthContext'
const Page = () => {
  // get user form AuthContext
  const {user} = useAuth()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  // Centralized form state
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    matchURL: '',
    isLineUpSubmissionAuto: undefined as boolean | undefined,
    players: Array.from({ length: 11 }, () => ({
      playerName: '',
      jerseyNumber: '',
      position: '',
    })) as Player[],
    // Additional fields for job creation
    matchDate: new Date().toISOString().split('T')[0],
    teamHome: '',
    teamAway: '',
    league: '',
  })

  const handlePrevious = () => setStep(prev => Math.max(1, prev - 1))

  const handleNext = async () => {
    try {
      switch (step) {
        // ✅ STEP 1 — YouTube link validation
        case 1: {
          const step1Schema = yup.object({
            matchURL: yup
              .string()
              .required("You must provide a YouTube URL before continuing.")
              .matches(
                /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                "Please enter a valid YouTube link."
              ),
            matchDate: yup
              .string()
              .required("Match date is required"),
            teamHome: yup
              .string()
              .required("Home team name is required")
              .min(2, "Team name must be at least 2 characters"),
            teamAway: yup
              .string()
              .required("Away team name is required")
              .min(2, "Team name must be at least 2 characters"),
            league: yup
              .string()
              .required("League name is required")
              .min(2, "League name must be at least 2 characters"),
          });

          await step1Schema.validate({
            matchURL: formData.matchURL,
            matchDate: formData.matchDate,
            teamHome: formData.teamHome,
            teamAway: formData.teamAway,
            league: formData.league,
          }, { abortEarly: false });
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

          setIsSubmitting(true);
          try {
            if (!user) {
              throw new Error('Please login to continue');
            }
           
            const userId = user.uid

            const jobData = {
              video_filename: formData.matchURL.split('v=')[1] + '.mp4',
              video_path: formData.matchURL,
              match_date: formData.matchDate,
              team_home: formData.teamHome,
              team_away: formData.teamAway,
              league: formData.league,
              user_id: Number(user.uid)
            };

            const response = await jobsService.createJob(jobData);
            toast.success('Analysis job created successfully!');
            router.push('/library'); // Redirect to library to see job status
          } catch (error: any) {
            toast.error(error.message || 'Failed to create analysis job');
            setError(error.message || 'Failed to create analysis job');
          } finally {
            setIsSubmitting(false);
          }
          break;
        }
        default:
          break;
      }
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        if (step === 3) {
          // Handle player validation errors
          const playerErrors: Record<number, string[]> = {};
          err.inner.forEach((e) => {
            const match = e.path?.match(/\[(\d+)\]/);
            if (match) {
              const index = parseInt(match[1]);
              if (!playerErrors[index]) playerErrors[index] = [];
              playerErrors[index].push(e.message);
            }
          });
        } else {
          // Handle other validation errors
          const errors = err.inner.map(e => e.message);
          setError(errors.join(', '));
          toast.error(errors.join(', '));
        }
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
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
              <FormField
                labelHtmlFor="matchDate"
                labelName="Match Date"
                inputType="date"
                value={formData.matchDate}
                onChange={(e) => updateFormData('matchDate', e.target.value)} 
                placeholder={''}              
                />
              <FormField
                labelHtmlFor="teamHome"
                labelName="Home Team"
                inputType="text"
                placeholder="Enter home team name"
                value={formData.teamHome}
                onChange={(e) => updateFormData('teamHome', e.target.value)}
              />
              <FormField
                labelHtmlFor="teamAway"
                labelName="Away Team"
                inputType="text"
                placeholder="Enter away team name"
                value={formData.teamAway}
                onChange={(e) => updateFormData('teamAway', e.target.value)}
              />
              <FormField
                labelHtmlFor="league"
                labelName="League"
                inputType="text"
                placeholder="Enter league name"
                value={formData.league}
                onChange={(e) => updateFormData('league', e.target.value)}
              />
            </div>
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
