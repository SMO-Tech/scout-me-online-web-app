
"use client"
import Sidebar from '@/components/match/newMatch/ui/Sidebar';
import AnalysisReport from '@/components/match/newMatch/views/AnalysisReport';
import React, { useState } from 'react';

import MatchAnalysisReportView from '@/components/match/newMatch/views/MatchAnalysisReport';


const renderUI = (view: View) => {
    switch (view) {
        case "Analysis":
            return (
                <AnalysisReport />
            )
            break;
        case "MatchAnalyticsReport":
            return (
                <MatchAnalysisReportView />
            )
            break
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