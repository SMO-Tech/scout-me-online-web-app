
import { useFetchMatchResult } from '@/hooks';
import { useParams } from 'next/navigation';
import { extractMatchId } from '@/lib/utils/slug';
import MatchAnalysisReport from '../../MatchAnalysisReport';

const MatchAnalysisReportView = () => {
    const params = useParams();
    const slugOrId = params.id as string;
    const matchId = extractMatchId(slugOrId);
    const { data: apiResponse, isLoading, error } = useFetchMatchResult(matchId);
    const matchDetailRaw = apiResponse?.data?.data?.[0];
    return (
        <MatchAnalysisReport matchData={matchDetailRaw} matchResult={apiResponse?.data} />
    )
}

export default MatchAnalysisReportView
