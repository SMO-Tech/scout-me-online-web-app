
"use client"
import Sidebar from '@/components/match/newMatch/ui/Sidebar';
import AnalysisReport from '@/components/match/newMatch/views/AnalysisReport';
import React, { useState } from 'react';

import MatchAnalysisReportView from '@/components/match/newMatch/views/MatchAnalysisReport';
import MatchStats from '@/components/match/newMatch/views/MatchStats';


const renderUI = (view: View) => {
    switch (view) {
        case "Analysis":
            return (
                <AnalysisReport />
            )
        case "MatchAnalyticsReport":
            return (
                <MatchAnalysisReportView />
            )
        case "MatchStats":
            return (
                <MatchStats />
            )
        default:
            break;
    }
}
export type View = "Analysis" | "MatchAnalyticsReport" | "MatchStats"

const Page: React.FC = () => {
    const [view, setView] = useState<View>("Analysis")
    return (
        <div className="flex bg-black min-h-screen font-sans">
            <Sidebar
                activeView={view}
                onViewChange={setView}
            />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {renderUI(view)}
            </main>
        </div>
    );
};

export default Page;