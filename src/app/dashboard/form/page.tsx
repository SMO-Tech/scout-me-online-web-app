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
import axios from 'axios'
import { auth } from '@/lib/firebaseConfig'

// Comprehensive list of countries
const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
].sort();
const Page = () => {
  // get user form AuthContext
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // Centralized form state
  const router = useRouter()
  const [isLineUpSubmissionAuto, setIsLineUpSubmissionAuto] = useState<boolean | undefined>(undefined)
  const [selectedTeamForLineup, setSelectedTeamForLineup] = useState<'home' | 'away' | null>(null)
  const [currentLineupTeam, setCurrentLineupTeam] = useState<'home' | 'away'>('home')
  const { replace } = useRouter()
  interface FormData {
    matchURL: string,
    lineUpImageURL?: string | null,
    lineUpImage?: File | null,
    matchLevel: string,
    homePlayers: Player[],
    awayPlayers: Player[],
    homeSubs: Player[],
    awaySubs: Player[],
    homeTeam: {
      clubName: string,
      jerseyColor: string,
      country: string,
    },
    awayTeam: {
      clubName: string,
      jerseyColor: string,
      country: string,
    },
  }
  const [formData, setFormData] = useState<FormData>({
    matchURL: '',
    lineUpImageURL: '',
    lineUpImage: null,
    matchLevel: '',
    homePlayers: Array.from({ length: 11 }, () => ({
      firstName: '',
      lastName: '',
      jerseyNumber: '',
      position: '',
      dateOfBirth: '',
    })),
    awayPlayers: Array.from({ length: 11 }, () => ({
      firstName: '',
      lastName: '',
      jerseyNumber: '',
      position: '',
      dateOfBirth: '',
    })),
    homeSubs: Array.from({ length: 3 }, () => ({
      firstName: '',
      lastName: '',
      jerseyNumber: '',
      position: '',
      dateOfBirth: '',
    })),
    awaySubs: Array.from({ length: 3 }, () => ({
      firstName: '',
      lastName: '',
      jerseyNumber: '',
      position: '',
      dateOfBirth: '',
    })),
    homeTeam: {
      clubName: '',
      jerseyColor: '',
      country: '',
    },
    awayTeam: {
      clubName: '',
      jerseyColor: '',
      country: '',
    },
  })

  const handlePrevious = () => setStep(prev => Math.max(1, prev - 1))

  const handleNext = async () => {
    setError("");
    setLoading(true);

    try {
      switch (step) {
        // STEP 1 — YouTube validation
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

          await step1Schema.validate({ matchURL: formData.matchURL });
          setStep((prev) => prev + 1);
          // here shoudl be the API call
          const client = await getClient()
          await client.post("/match", {
            "videoUrl": formData.matchURL
          });

          toast.success("Your match has been submitted!", { duration: 4000, icon: "✅" });
          replace("/dashboard");


          break;
        }

        // STEP 2 — Validate team details and match level
        case 2: {
          const step2Schema = yup.object({
            homeTeam: yup.object({
              clubName: yup.string().required("Your team club name is required"),
              jerseyColor: yup.string().required("Your team jersey color is required"),
              country: yup.string().required("Your team country is required"),
            }),
            awayTeam: yup.object({
              clubName: yup.string().required("Opponent team club name is required"),
              jerseyColor: yup.string().required("Opponent team jersey color is required"),
              country: yup.string().required("Opponent team country is required"),
            }),
            matchLevel: yup.string()
              .required("Match level is required")
              .oneOf(['PROFESSIONAL', 'SEMI_PROFESSIONAL', 'ACADEMIC_TOP_TIER', 'ACADEMIC_AMATEUR', 'SUNDAY_LEAGUE'], "Please select a valid match level"),
          });

          await step2Schema.validate({
            homeTeam: formData.homeTeam,
            awayTeam: formData.awayTeam,
            matchLevel: formData.matchLevel,
          });

          setStep((prev) => prev + 1);
          break;
        }

        // // STEP 3 — image upload or continue manually
        // case 3: {
        //   // Require user to make a choice
        //   if (isLineUpSubmissionAuto === undefined) {
        //     setError("Please choose to upload an image or continue manually.");
        //     return;
        //   }

        //   // If user chose to upload image, process it
        //   if (isLineUpSubmissionAuto === true) {
        //     if (!formData.lineUpImage) {
        //       setError("Please upload a valid lineup image!");
        //       return;
        //     }

        //     // File → Base64
        //     const fileToBase64 = (file: File): Promise<string> =>
        //       new Promise((resolve, reject) => {
        //         const reader = new FileReader();
        //         reader.readAsDataURL(file);
        //         reader.onload = () => resolve(reader.result as string);
        //         reader.onerror = reject;
        //       });

        //     const base64string = await fileToBase64(formData.lineUpImage);

        //     const payload = {
        //       version: "2.0",
        //       routeKey: "POST /",
        //       rawPath: "/",
        //       rawQueryString: "",
        //       headers: { "content-type": "application/json" },
        //       requestContext: { http: { method: "POST" } },
        //       body: JSON.stringify({ image: base64string }),
        //       isBase64Encoded: true,
        //     };

        //     const url = process.env.NEXT_PUBLIC_IMAGE_ANALYSIS_URL!;
        //     const res = await axios.post(url, payload);
        //     console.log(res.data)

        //     const parsed = JSON.parse(res.data.body);
        //     // prepare players - split name into firstName and lastName
        //     const players: Player[] = parsed.structured_output.starting_xi.map((p:any) => {
        //       const fullName = p.name || '';
        //       const nameParts = fullName.trim().split(/\s+/);
        //       const firstName = nameParts[0] || '';
        //       const lastName = nameParts.slice(1).join(' ') || '';

        //       return {
        //         firstName,
        //         lastName,
        //         jerseyNumber: p.number ? String(p.number) : '',
        //         position: p.position || '',
        //         dateOfBirth: '',
        //       };
        //     });

        //     // Note: Image upload typically fills one team at a time
        //     // For now, we'll fill the home team. User can adjust in step 2 if needed.
        //     // Or we could ask which team the image is for, but for simplicity, let's fill home team
        //     setFormData((prev) => ({
        //       ...prev,
        //       homePlayers: players,
        //     }));
        //   }
        //   // If user chose manual (isLineUpSubmissionAuto === false), they already entered data in step 2, so just continue

        //   // Always go to next step
        //   setStep((prev) => prev + 1);
        //   break;
        // }

        // // STEP 4 — player validation + submit
        // case 4: {
        //   const playerSchema = yup.array().of(
        //     yup.object().shape({
        //       firstName: yup.string().required("Player first name is required"),
        //       lastName: yup.string().required("Player last name is required"),
        //       jerseyNumber: yup.number().typeError("Jersey number must be a number!").required("Jersey number is required"),
        //       position: yup.string()
        //         .trim()
        //         .oneOf(playerPostition, `Position must be one of: ${playerPostition.join(', ')}`)
        //         .required("Position is required"),
        //     })
        //   );

        //   // Validate My Team (Home) - REQUIRED
        //   const incompleteHomePlayers = formData.homePlayers.filter(p => !p.firstName || !p.lastName || !p.jerseyNumber || !p.position);
        //   if (incompleteHomePlayers.length > 0) {
        //     setError(`Please fill in all details for all 11 players in My Team lineup.`);
        //     return;
        //   }

        //   // Check for invalid positions in My Team
        //   const invalidHomePositions = formData.homePlayers
        //     .map((p, idx) => ({ player: idx + 1, position: p.position.trim() }))
        //     .filter(({ position }) => position && !playerPostition.includes(position));

        //   if (invalidHomePositions.length > 0) {
        //     const invalidList = invalidHomePositions.map(({ player, position }) => `My Team - Player ${player}: "${position}"`).join(', ');
        //     setError(`Invalid positions found: ${invalidList}. Please select from the dropdown.`);
        //     return;
        //   }

        //   // Validate My Team with schema
        //   await playerSchema.validate(formData.homePlayers);

        //   // Validate Opponent Team (Away) - OPTIONAL
        //   // Only validate if user has started filling in opponent players
        //   const filledAwayPlayers = formData.awayPlayers.filter(p => p.firstName || p.lastName || p.jerseyNumber || p.position);
        //   if (filledAwayPlayers.length > 0) {
        //     // If any opponent player field is filled, all 11 must be complete
        //     const incompleteAwayPlayers = formData.awayPlayers.filter(p => !p.firstName || !p.lastName || !p.jerseyNumber || !p.position);
        //     if (incompleteAwayPlayers.length > 0) {
        //       setError(`If you start filling in Opponent Team players, please complete all 11 players. Otherwise, leave all opponent fields empty.`);
        //       return;
        //     }

        //     // Check for invalid positions in Opponent Team
        //     const invalidAwayPositions = formData.awayPlayers
        //       .map((p, idx) => ({ player: idx + 1, position: p.position.trim() }))
        //       .filter(({ position }) => position && !playerPostition.includes(position));

        //     if (invalidAwayPositions.length > 0) {
        //       const invalidList = invalidAwayPositions.map(({ player, position }) => `Opponent Team - Player ${player}: "${position}"`).join(', ');
        //       setError(`Invalid positions found: ${invalidList}. Please select from the dropdown.`);
        //       return;
        //     }

        //     // Validate Opponent Team with schema
        //     await playerSchema.validate(formData.awayPlayers);
        //   }

        //   // Validate substitutions for My Team if any are filled (optional but must be valid if filled)
        //   const filledHomeSubs = formData.homeSubs.filter(p => p.firstName || p.lastName || p.jerseyNumber || p.position);
        //   if (filledHomeSubs.length > 0) {
        //     // If any substitution field is filled, all fields for that sub must be filled
        //     const incompleteHomeSubs = filledHomeSubs.filter(p => !p.firstName || !p.lastName || !p.jerseyNumber || !p.position);
        //     if (incompleteHomeSubs.length > 0) {
        //       setError("If you add substitutions for My Team, please fill in all details (first name, last name, jersey number, and position) for each substitution.");
        //       return;
        //     }
        //     // Validate positions for filled substitutions
        //     const invalidHomeSubPositions = filledHomeSubs
        //       .map((p, idx) => ({ sub: idx + 1, position: p.position.trim() }))
        //       .filter(({ position }) => position && !playerPostition.includes(position));
        //     if (invalidHomeSubPositions.length > 0) {
        //       const invalidList = invalidHomeSubPositions.map(({ sub, position }) => `My Team - Sub ${sub}: "${position}"`).join(', ');
        //       setError(`Invalid positions in substitutions: ${invalidList}. Please select from the dropdown.`);
        //       return;
        //     }
        //     await playerSchema.validate(filledHomeSubs);
        //   }

        //   // Validate substitutions for Opponent Team if any are filled (optional but must be valid if filled)
        //   const filledAwaySubs = formData.awaySubs.filter(p => p.firstName || p.lastName || p.jerseyNumber || p.position);
        //   if (filledAwaySubs.length > 0) {
        //     // If any substitution field is filled, all fields for that sub must be filled
        //     const incompleteAwaySubs = filledAwaySubs.filter(p => !p.firstName || !p.lastName || !p.jerseyNumber || !p.position);
        //     if (incompleteAwaySubs.length > 0) {
        //       setError("If you add substitutions for Opponent Team, please fill in all details (first name, last name, jersey number, and position) for each substitution.");
        //       return;
        //     }
        //     // Validate positions for filled substitutions
        //     const invalidAwaySubPositions = filledAwaySubs
        //       .map((p, idx) => ({ sub: idx + 1, position: p.position.trim() }))
        //       .filter(({ position }) => position && !playerPostition.includes(position));
        //     if (invalidAwaySubPositions.length > 0) {
        //       const invalidList = invalidAwaySubPositions.map(({ sub, position }) => `Opponent Team - Sub ${sub}: "${position}"`).join(', ');
        //       setError(`Invalid positions in substitutions: ${invalidList}. Please select from the dropdown.`);
        //       return;
        //     }
        //     await playerSchema.validate(filledAwaySubs);
        //   }

        //   const client = await getClient();

        //   // Transform clubs data to match API format
        //   const clubs = [
        //     {
        //       name: formData.homeTeam.clubName.trim(),
        //       country: formData.homeTeam.country.trim(),
        //       jerseyColor: formData.homeTeam.jerseyColor.trim(),
        //       teamType: "yourTeam" as const,
        //     },
        //     {
        //       name: formData.awayTeam.clubName.trim(),
        //       country: formData.awayTeam.country.trim(),
        //       jerseyColor: formData.awayTeam.jerseyColor.trim(),
        //       teamType: "opponentTeam" as const,
        //     },
        //   ];

        //   // Transform players data to match API format
        //   // Combine all players (home + away + subs) with teamType
        //   // Filter out empty players (players with missing required fields)
        //   const players = [
        //     // Home team players - filter out empty players
        //     ...formData.homePlayers
        //       .filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position)
        //       .map((p) => ({
        //         firstName: p.firstName.trim(),
        //         lastName: p.lastName.trim(),
        //         jerseyNumber: Number(p.jerseyNumber),
        //         ...(p.dateOfBirth && p.dateOfBirth.trim() ? { dateOfBirth: p.dateOfBirth.trim() } : {}),
        //         position: p.position.trim(),
        //         country: formData.homeTeam.country.trim(),
        //         teamType: "yourTeam" as const,
        //       })),
        //     // Away team players - filter out empty players
        //     ...formData.awayPlayers
        //       .filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position)
        //       .map((p) => ({
        //         firstName: p.firstName.trim(),
        //         lastName: p.lastName.trim(),
        //         jerseyNumber: Number(p.jerseyNumber),
        //         ...(p.dateOfBirth && p.dateOfBirth.trim() ? { dateOfBirth: p.dateOfBirth.trim() } : {}),
        //         position: p.position.trim(),
        //         country: formData.awayTeam.country.trim(),
        //         teamType: "opponentTeam" as const,
        //       })),
        //     // Home team substitutions
        //     ...formData.homeSubs
        //       .filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position)
        //       .map((p) => ({
        //         firstName: p.firstName.trim(),
        //         lastName: p.lastName.trim(),
        //         jerseyNumber: Number(p.jerseyNumber),
        //         ...(p.dateOfBirth && p.dateOfBirth.trim() ? { dateOfBirth: p.dateOfBirth.trim() } : {}),
        //         position: p.position.trim(),
        //         country: formData.homeTeam.country.trim(),
        //         teamType: "yourTeam" as const,
        //       })),
        //     // Away team substitutions
        //     ...formData.awaySubs
        //       .filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position)
        //       .map((p) => ({
        //         firstName: p.firstName.trim(),
        //         lastName: p.lastName.trim(),
        //         jerseyNumber: Number(p.jerseyNumber),
        //         ...(p.dateOfBirth && p.dateOfBirth.trim() ? { dateOfBirth: p.dateOfBirth.trim() } : {}),
        //         position: p.position.trim(),
        //         country: formData.awayTeam.country.trim(),
        //         teamType: "opponentTeam" as const,
        //       })),
        //   ];

        //   const payload = {
        //     videoUrl: formData.matchURL.trim(),
        //     ...(formData.lineUpImageURL && formData.lineUpImageURL.trim() ? { lineUpImage: formData.lineUpImageURL.trim() } : {}),
        //     matchLevel: formData.matchLevel.trim(),
        //     clubs,
        //     players,
        //   };

        //   // Refresh Firebase token before making the request
        //   const currentUser = auth.currentUser;
        //   if (currentUser) {
        //     const freshToken = await currentUser.getIdToken(true);
        //     localStorage.setItem("authToken", freshToken);
        //   }

        //   // Check if token exists
        //   const token = localStorage.getItem("authToken");
        //   if (!token) {
        //     setError("You are not authenticated. Please log in again.");
        //     toast.error("Authentication required. Please log in again.");
        //     return;
        //   }

        //   // Log payload for debugging (remove in production)
        //   console.log("Submitting match with payload:", JSON.stringify(payload, null, 2));
        //   console.log("Auth token exists:", !!token);

        //   await client.post("/match", payload);

        //   toast.success("Your match has been submitted!", { duration: 4000, icon: "✅" });
        //   replace("/dashboard");

        //   setStep((prev) => prev + 1);
        //   break;
        // }
      }
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        setError(err.message);
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('CONNECTION_REFUSED') || err.message?.includes('Network Error') || err.code === 'ECONNREFUSED') {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const errorMsg = baseURL
          ? `Cannot connect to the server at ${baseURL}. Please make sure the backend server is running.`
          : "API base URL is not configured. Please set NEXT_PUBLIC_BASE_URL in your environment variables.";
        setError(errorMsg);
        toast.error("Connection error: Backend server is not reachable. Please check if the server is running.");
        console.error("API Error Details:", {
          message: err.message,
          code: err.code,
          baseURL: baseURL || "NOT SET",
          config: err.config?.url,
        });
      } else if (err.response) {
        // Server responded with error status
        const responseData = err.response.data;
        let errorMessage = responseData?.message || responseData?.error || "Server error occurred";

        // Handle "User not found" error specifically
        if (errorMessage.toLowerCase().includes('user not found') || errorMessage.toLowerCase().includes('user not found!')) {
          errorMessage = "User not found. Please make sure you're logged in and your account is registered. Try logging out and logging back in.";
          toast.error("Authentication issue: User not found. Please try logging in again.");
        }

        // Handle validation errors - check for common validation error formats
        if (responseData?.errors || responseData?.details || responseData?.validation) {
          const validationErrors = responseData.errors || responseData.details || responseData.validation;

          // If it's an array of errors
          if (Array.isArray(validationErrors)) {
            errorMessage = validationErrors.map((err: any) =>
              typeof err === 'string' ? err : err.message || err.msg || JSON.stringify(err)
            ).join('\n');
          }
          // If it's an object with field-specific errors
          else if (typeof validationErrors === 'object') {
            const fieldErrors = Object.entries(validationErrors)
              .map(([field, message]) => `${field}: ${message}`)
              .join('\n');
            errorMessage = `Validation failed:\n${fieldErrors}`;
          }
        }

        setError(errorMessage);
        toast.error(errorMessage.length > 100 ? "Error occurred. Check the error message below." : errorMessage);
        console.error("Server Error Response:", {
          status: err.response.status,
          data: responseData,
          payload: err.config?.data ? JSON.parse(err.config.data) : null,
        });
      } else {
        setError(err.message || "Something went wrong please try again!");
        toast.error("An error occurred. Please try again.");
        console.error("Unexpected Error:", err);
      }
    } finally {
      // ALWAYS turn loading off here
      setLoading(false);
    }
  };



  // Generic update handler for any field
  const updateFormData = (field: keyof typeof formData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePlayerChange = (index: number, field: keyof Player, value: string, isSub: boolean = false) => {
    // Trim whitespace, especially for position field
    const trimmedValue = field === 'position' ? value.trim() : value;

    if (currentLineupTeam === 'home') {
      if (isSub) {
        const updatedSubs = [...formData.homeSubs]
        updatedSubs[index][field] = trimmedValue
        updateFormData('homeSubs', updatedSubs)
      } else {
        const updatedPlayers = [...formData.homePlayers]
        updatedPlayers[index][field] = trimmedValue
        updateFormData('homePlayers', updatedPlayers)
      }
    } else {
      if (isSub) {
        const updatedSubs = [...formData.awaySubs]
        updatedSubs[index][field] = trimmedValue
        updateFormData('awaySubs', updatedSubs)
      } else {
        const updatedPlayers = [...formData.awayPlayers]
        updatedPlayers[index][field] = trimmedValue
        updateFormData('awayPlayers', updatedPlayers)
      }
    }
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
      // case 2:
      //   return (
      //     <div className="w-full">
      //       <h3 className="text-gray-800 font-semibold mb-6 text-center">
      //         2. Enter Team Details
      //       </h3>
      //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      //         {/* Your Team Column */}
      //         <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-200">
      //           <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Your Team</h4>

      //           {/* Team Details Section */}
      //           <div className="bg-white p-4 rounded-lg border border-gray-300">
      //             <div className="space-y-3">
      //               <div>
      //                 <label className="block text-xs font-medium text-gray-600 mb-1">Club Name</label>
      //                 <input
      //                   type="text"
      //                   placeholder="Enter your team club name"
      //                   value={formData.homeTeam.clubName}
      //                   onChange={(e) => updateFormData('homeTeam', { ...formData.homeTeam, clubName: e.target.value })}
      //                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
      //                 />
      //               </div>
      //               <div>
      //                 <label className="block text-xs font-medium text-gray-600 mb-1">Jersey Color</label>
      //                 <input
      //                   type="text"
      //                   placeholder="e.g., Blue, Red, White"
      //                   value={formData.homeTeam.jerseyColor}
      //                   onChange={(e) => updateFormData('homeTeam', { ...formData.homeTeam, jerseyColor: e.target.value })}
      //                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
      //                 />
      //               </div>
      //               <div>
      //                 <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
      //                 <select
      //                   value={formData.homeTeam.country}
      //                   onChange={(e) => updateFormData('homeTeam', { ...formData.homeTeam, country: e.target.value })}
      //                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
      //                 >
      //                   <option value="">Select Country</option>
      //                   {ALL_COUNTRIES.map((country) => (
      //                     <option key={country} value={country}>{country}</option>
      //                   ))}
      //                 </select>
      //               </div>
      //             </div>
      //           </div>
      //         </div>

      //         {/* Opponent Team Column */}
      //         <div className="bg-red-50 p-5 rounded-lg border-2 border-red-200">
      //           <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Opponent</h4>

      //           {/* Team Details Section */}
      //           <div className="bg-white p-4 rounded-lg border border-gray-300">
      //             <div className="space-y-3">
      //               <div>
      //                 <label className="block text-xs font-medium text-gray-600 mb-1">Club Name</label>
      //                 <input
      //                   type="text"
      //                   placeholder="Enter opponent team club name"
      //                   value={formData.awayTeam.clubName}
      //                   onChange={(e) => updateFormData('awayTeam', { ...formData.awayTeam, clubName: e.target.value })}
      //                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
      //                 />
      //               </div>
      //               <div>
      //                 <label className="block text-xs font-medium text-gray-600 mb-1">Jersey Color</label>
      //                 <input
      //                   type="text"
      //                   placeholder="e.g., Blue, Red, White"
      //                   value={formData.awayTeam.jerseyColor}
      //                   onChange={(e) => updateFormData('awayTeam', { ...formData.awayTeam, jerseyColor: e.target.value })}
      //                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
      //                 />
      //               </div>
      //               <div>
      //                 <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
      //                 <select
      //                   value={formData.awayTeam.country}
      //                   onChange={(e) => updateFormData('awayTeam', { ...formData.awayTeam, country: e.target.value })}
      //                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
      //                 >
      //                   <option value="">Select Country</option>
      //                   {ALL_COUNTRIES.map((country) => (
      //                     <option key={country} value={country}>{country}</option>
      //                   ))}
      //                 </select>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </div>

      //       {/* Match Level Section */}
      //       <div className="mt-6 bg-gray-50 p-5 rounded-lg border-2 border-gray-300">
      //         <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Match Level</h4>
      //         <div className="bg-white p-4 rounded-lg border border-gray-300">
      //           <label className="block text-xs font-medium text-gray-600 mb-2">Select Match Level</label>
      //           <select
      //             value={formData.matchLevel}
      //             onChange={(e) => updateFormData('matchLevel', e.target.value)}
      //             className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
      //           >
      //             <option value="">Select Match Level</option>
      //             <option value="PROFESSIONAL">PROFESSIONAL</option>
      //             <option value="SEMI_PROFESSIONAL">SEMI_PROFESSIONAL</option>
      //             <option value="ACADEMIC_TOP_TIER">ACADEMIC_TOP_TIER</option>
      //             <option value="ACADEMIC_AMATEUR">ACADEMIC_AMATEUR</option>
      //             <option value="SUNDAY_LEAGUE">SUNDAY_LEAGUE</option>
      //           </select>
      //         </div>
      //       </div>
      //     </div>
      //   )
      // case 3:
      //   return (
      //     <div className="w-full">
      //       <h3 className="text-gray-800 font-semibold mb-6 text-center">
      //         3. Upload Lineup Image or Continue Manually
      //       </h3>
      //       <div className="flex flex-col gap-5 py-2">
      //         <div className='flex gap-5 justify-center'>
      //           <button
      //             type="button"
      //             className={`rounded text-gray-700 shadow p-3 px-6 
      //           ${isLineUpSubmissionAuto === true ? 'bg-purple-800 text-white border-2 border-purple-900' : 'bg-white/85 hover:bg-purple-50 border-2 border-transparent'}`}
      //             onClick={() => setIsLineUpSubmissionAuto(true)}
      //           >
      //             Upload Image
      //           </button>
      //           <button
      //             type="button"
      //             className={`rounded text-gray-700 shadow p-3 px-6 
      //           ${isLineUpSubmissionAuto === false ? 'bg-purple-800 text-white border-2 border-purple-900' : 'bg-white/85 hover:bg-purple-50 border-2 border-transparent'}`}
      //             onClick={() => setIsLineUpSubmissionAuto(false)}
      //           >
      //             Continue Manually
      //           </button>
      //         </div>
      //         {/* if yes we will let user upload the image */}
      //         {isLineUpSubmissionAuto === true && (
      //           <div className="flex flex-col space-y-2 mt-4">
      //             <label className="block text-gray-800 text-sm font-medium mb-2 text-center">
      //               Upload Lineup Image
      //             </label>
      //             <p className="text-xs text-gray-500 mb-3 text-center">
      //               Upload a lineup image to auto-fill player information. This will update the "Your Team" lineup.
      //             </p>
      //             <label
      //               htmlFor="lineupFile"
      //               className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-purple-50 transition-all duration-200"
      //             >
      //               <FaFileUpload className="text-purple-500 text-3xl mb-2" />
      //               {formData.lineUpImage?.name && <p className='text-black text-md mb-2' >{formData.lineUpImage?.name}</p>}
      //               <span className="text-sm text-gray-600">Click to upload or drag & drop</span>
      //               <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</span>
      //               <input
      //                 id="lineupFile"
      //                 type="file"
      //                 accept="image/*"
      //                 onChange={(e) => updateFormData("lineUpImage", e.target.files?.[0])}
      //                 className="hidden"
      //               />
      //             </label>
      //           </div>
      //         )}
      //       </div>
      //     </div >
      //   )
      // case 4:
      //   return (
      //     <div className="w-full">
      //       <div className="mb-4 flex items-center justify-between">
      //         <h3 className="text-gray-800 font-semibold">
      //           4. Enter Player Lineup
      //         </h3>
      //         {/* Team Toggle */}
      //         <div className="flex gap-2 bg-gray-900 p-1 rounded-lg">
      //           <button
      //             type="button"
      //             onClick={() => setCurrentLineupTeam('home')}
      //             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      //               currentLineupTeam === 'home'
      //                 ? 'bg-blue-600 text-white'
      //                 : 'text-gray-700 hover:bg-gray-200'
      //             }`}
      //           >
      //             My Team
      //           </button>
      //           <button
      //             type="button"
      //             onClick={() => setCurrentLineupTeam('away')}
      //             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      //               currentLineupTeam === 'away'
      //                 ? 'bg-red-600 text-white'
      //                 : 'text-gray-700 hover:bg-gray-200'
      //             }`}
      //           >
      //             Opponent Team
      //           </button>
      //         </div>
      //       </div>

      //       {/* Team Info Banner */}
      //       <div className={`mb-4 p-3 rounded-lg ${
      //         currentLineupTeam === 'home' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-red-50 border-2 border-red-200'
      //       }`}>
      //         <p className="text-sm font-medium text-gray-800">
      //           Entering lineup for: <span className="font-bold">
      //             {currentLineupTeam === 'home' 
      //               ? `My Team - ${formData.homeTeam.clubName || 'Your Team'}`
      //               : `Opponent Team - ${formData.awayTeam.clubName || 'Opponent Team'}`}
      //           </span>
      //         </p>
      //       </div>

      //       {/* Starting Lineup */}
      //       <div className="flex flex-col w-full mt-4">
      //         <h4 className="text-lg font-semibold text-gray-800 mb-3">Starting Lineup (11 Players)</h4>
      //         <ManuealPlayerLineUp 
      //           players={currentLineupTeam === 'home' ? formData.homePlayers : formData.awayPlayers} 
      //           onPlayerChange={(index, field, value) => handlePlayerChange(index, field, value, false)} 
      //         />
      //       </div>

      //       {/* Substitutions Section */}
      //       <div className="flex flex-col w-full mt-8">
      //         <h4 className="text-lg font-semibold text-gray-800 mb-3">Substitutions (Optional - Max 3)</h4>
      //         <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
      //           <div className="space-y-4">
      //             {Array.from({ length: 3 }, (_, index) => {
      //               const subs = currentLineupTeam === 'home' ? formData.homeSubs : formData.awaySubs;
      //               const sub = subs[index];
      //               return (
      //                 <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
      //                   <p className="text-sm font-medium text-gray-700 mb-3">Substitution {index + 1}</p>
      //                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
      //                     <div className="flex flex-col">
      //                       <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
      //                       <input
      //                         type="text"
      //                         placeholder="First Name"
      //                         value={sub.firstName || ''}
      //                         onChange={(e) => handlePlayerChange(index, 'firstName', e.target.value, true)}
      //                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300 text-sm h-10"
      //                       />
      //                     </div>
      //                     <div className="flex flex-col">
      //                       <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
      //                       <input
      //                         type="text"
      //                         placeholder="Last Name"
      //                         value={sub.lastName || ''}
      //                         onChange={(e) => handlePlayerChange(index, 'lastName', e.target.value, true)}
      //                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300 text-sm h-10"
      //                       />
      //                     </div>
      //                     <div className="flex flex-col">
      //                       <label className="block text-xs font-medium text-gray-600 mb-1">Jersey Number</label>
      //                       <input
      //                         type="number"
      //                         placeholder="Jersey #"
      //                         min="0"
      //                         max="100"
      //                         value={sub.jerseyNumber}
      //                         onChange={(e) => handlePlayerChange(index, 'jerseyNumber', e.target.value, true)}
      //                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300 text-sm h-10"
      //                       />
      //                     </div>
      //                     <div className="flex flex-col">
      //                       <label className="block text-xs font-medium text-gray-600 mb-1">Position</label>
      //                       <select
      //                         value={sub.position}
      //                         onChange={(e) => handlePlayerChange(index, 'position', e.target.value, true)}
      //                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300 text-sm h-10"
      //                       >
      //                         <option value="">Select Position</option>
      //                         {playerPostition.map((position) => (
      //                           <option key={position} value={position}>{position}</option>
      //                         ))}
      //                       </select>
      //                     </div>
      //                     <div className="flex flex-col">
      //                       <label className="block text-xs font-medium text-gray-600 mb-1">
      //                         Date of Birth <span className="text-gray-400 font-normal">(optional)</span>
      //                       </label>
      //                       <input
      //                         type="date"
      //                         value={sub.dateOfBirth || ''}
      //                         onChange={(e) => handlePlayerChange(index, 'dateOfBirth', e.target.value, true)}
      //                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300 text-sm h-10"
      //                       />
      //                     </div>
      //                   </div>
      //                 </div>
      //               );
      //             })}
      //           </div>
      //           <p className="text-xs text-gray-500 mt-3 italic">Note: Substitutions are optional. Only fill in the substitutions that were used.</p>
      //         </div>
      //       </div>

      //       {/* Completion Status */}
      //       <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      //         <p className="text-sm font-medium text-gray-700 mb-2">Lineup Completion Status:</p>
      //         <div className="space-y-3">
      //           <div className="flex gap-4">
      //             <div className="flex-1">
      //               <div className="flex items-center justify-between mb-1">
      //                 <span className="text-xs text-gray-600">My Team - Starting XI</span>
      //                 <span className="text-xs font-semibold">
      //                   {formData.homePlayers.filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position).length}/11
      //                 </span>
      //               </div>
      //               <div className="w-full bg-gray-200 rounded-full h-2">
      //                 <div 
      //                   className="bg-blue-600 h-2 rounded-full transition-all"
      //                   style={{ width: `${(formData.homePlayers.filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position).length / 11) * 100}%` }}
      //                 ></div>
      //               </div>
      //             </div>
      //             <div className="flex-1">
      //               <div className="flex items-center justify-between mb-1">
      //                 <span className="text-xs text-gray-600">Opponent Team - Starting XI</span>
      //                 <span className="text-xs font-semibold">
      //                   {formData.awayPlayers.filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position).length}/11
      //                 </span>
      //               </div>
      //               <div className="w-full bg-gray-200 rounded-full h-2">
      //                 <div 
      //                   className="bg-red-600 h-2 rounded-full transition-all"
      //                   style={{ width: `${(formData.awayPlayers.filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position).length / 11) * 100}%` }}
      //                 ></div>
      //               </div>
      //             </div>
      //           </div>
      //           <div className="flex gap-4 pt-2 border-t border-gray-200">
      //             <div className="flex-1">
      //               <div className="flex items-center justify-between mb-1">
      //                 <span className="text-xs text-gray-600">My Team - Subs</span>
      //                 <span className="text-xs font-semibold">
      //                   {formData.homeSubs.filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position).length}/3
      //                 </span>
      //               </div>
      //               <div className="w-full bg-gray-200 rounded-full h-2">
      //                 <div 
      //                   className="bg-blue-400 h-2 rounded-full transition-all"
      //                   style={{ width: `${(formData.homeSubs.filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position).length / 3) * 100}%` }}
      //                 ></div>
      //               </div>
      //             </div>
      //             <div className="flex-1">
      //               <div className="flex items-center justify-between mb-1">
      //                 <span className="text-xs text-gray-600">Opponent Team - Subs</span>
      //                 <span className="text-xs font-semibold">
      //                   {formData.awaySubs.filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position).length}/3
      //                 </span>
      //               </div>
      //               <div className="w-full bg-gray-200 rounded-full h-2">
      //                 <div 
      //                   className="bg-red-400 h-2 rounded-full transition-all"
      //                   style={{ width: `${(formData.awaySubs.filter(p => p.firstName && p.lastName && p.jerseyNumber && p.position).length / 3) * 100}%` }}
      //                 ></div>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   )
    }
  }

  return (
    <div className="w-full h-auto bg-black px-5 py-10 flex flex-col items-center justify-start">
      <div className="w-full sm:w-[600px] bg-gray-900 p-5 py-10 rounded shadow-gray-500 shadow-sm flex flex-col items-center justify-start h-auto">
        <div className="flex flex-row gap-5">
          {/* {[1, 2, 3, 4].map((s) => (
            <ProgressCircle key={s} step={step} circleStep={s} />
          ))} */}
        </div>
        <p className='text-red-300 text-sm mt-5 '>{error && error}</p>

        <form className="w-full mt-5">{renderUi()}</form>

        <div className="flex w-full mt-5 items-center justify-between">

          <button
            className={`text-white border-gray-300 border hover:bg-gray-800 w-24 p-1 rounded hover:cursor-pointer relative`}
            onClick={handleNext}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  )

}
export default Page
