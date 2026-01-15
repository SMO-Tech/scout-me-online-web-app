import { useParams, useRouter } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'
import LegacyMatchHeader from './legacy/LegacyMatchHeader'
import { useFetchLegacyMatchResult } from '@/hooks'
import { getYouTubeId } from '@/lib/utils/youtubeIdExtractor'
import LegacyMatchScore from './legacy/LegacyMatchScore'
import LegacyMatchFormations from './legacy/LegacyMatchFormations'
import LegacyMatchTiming from './legacy/LegacyMatchTiming'
import LegacyMatchLineups from './legacy/LegacyMatchLineups'

const Overview = () => {
    const params = useParams()
    const router = useRouter()
    const matchId = params.id as string
    const { data } = useFetchLegacyMatchResult(matchId)
    const matchData = data?.data
    // get yotube video id for embeeded view 
    const videoID = getYouTubeId(matchData?.youtube_link! || "")
    console.log(data)

    if (!matchData) {
        return (
            <div>
                <p>No data available!</p>
            </div>
        )
    }

    return (
        <div>
            {/* Back Button */}
            <button
                onClick={() => router.push('/dashboard/matches')}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
            >
                <FiArrowLeft size={20} />
                <span className="font-semibold">Back to Matches</span>
            </button>

            <div className="flex flex-col xl:flex-row gap-6">
                {/* VIDEO */}
                <div className="flex-1 bg-[#151720] rounded-xl overflow-hidden aspect-video">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoID}`}
                        allowFullScreen
                    />
                </div>

                {/* RIGHT ASIDE */}
                <aside className="w-full xl:w-80 bg-[#151720] rounded-xl p-5">
                    <h4 className="font-semibold mb-3">Match Info</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                        <p><span className="text-gray-500">Competition:</span> {matchData.match_info?.competition_name ?? 'N/A'}</p>
                        <p><span className="text-gray-500">Venue:</span> {matchData.match_info?.venue ?? 'N/A'}</p>
                        <p><span className="text-gray-500">Date:</span> {matchData.match_info?.match_date_time ?? 'N/A'}</p>
                        <p><span className="text-gray-500">Level:</span> {matchData.match_info.competition_name ?? 'N/A'}</p>
                    </div>
                </aside>
            </div>
            <div className='flex flex-col my-5 gap-5'>
                <LegacyMatchHeader
                    teams={matchData.teams ?? { my_team: '', opponent_team: '' }}
                    matchInfo={matchData.match_info ?? { match_date_time: '', competition_name: '', venue: '', location: '' }}
                    youtubeLink={matchData.youtube_link ?? ''}
                    user={matchData.user ?? { name: '', email: '' }}
                />
                <LegacyMatchScore score={matchData.score} teams={matchData.teams} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <LegacyMatchFormations teams={matchData.teams} />
                    <LegacyMatchTiming matchTiming={matchData.match_timing} />
                </div>
                <div className="mt-6">
                    <LegacyMatchLineups
                        lineups={matchData.lineups}
                        substitutes={matchData.substitutes}
                        teams={matchData.teams}
                    />
                </div>
            </div>
        </div>
    )
}

export default Overview
