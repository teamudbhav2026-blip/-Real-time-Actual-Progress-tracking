import {
    BrainCircuit,
    Video,
    Mic2,
    ScanSearch,
    ShieldCheck,
    Activity,
    Target,
    CheckCircle2,
} from "lucide-react";

export default function AIInsights({ activities = [] }) {
    const processedActivities = activities.filter(
        (activity) => activity.aiResult
    );

    const processed = processedActivities.length;

    const averageTrust = processed
        ? Math.round(
            processedActivities.reduce(
                (sum, activity) =>
                    sum + Number(activity.aiResult?.trustScore || 0),
                0
            ) / processed
        )
        : 0;

    const latest = processedActivities[0];

    return (
        <section className="ai-page">

            <div className="ai-hero panel">
                <div className="ai-hero-icon">
                    <BrainCircuit size={25} />
                </div>

                <div>
                    <p className="eyebrow">AI ANALYTICS</p>

                    <h2>
                        Construction Intelligence
                    </h2>

                    <p>
                        AI-assisted analysis of field evidence,
                        activity matching and progress estimation.
                    </p>
                </div>

                <span className="ai-status">
                    <i />
                    AI ENGINE READY
                </span>
            </div>

            <div className="ai-metrics">

                <div className="ai-metric panel">
                    <Video size={19} />
                    <span>Evidence Processed</span>
                    <strong>{processed}</strong>
                    <small>
                        Field captures analysed
                    </small>
                </div>

                <div className="ai-metric panel">
                    <ScanSearch size={19} />
                    <span>Object Analysis</span>
                    <strong>
                        {processed ? "Active" : "Ready"}
                    </strong>
                    <small>
                        Construction objects detected
                    </small>
                </div>

                <div className="ai-metric panel">
                    <Mic2 size={19} />
                    <span>Voice Matching</span>
                    <strong>
                        {latest?.aiResult
                            ? `${latest.aiResult.voiceMatch}%`
                            : "Ready"}
                    </strong>
                    <small>
                        Engineer activity matching
                    </small>
                </div>

                <div className="ai-metric panel">
                    <ShieldCheck size={19} />
                    <span>Average Trust</span>
                    <strong>
                        {averageTrust
                            ? `${averageTrust}%`
                            : "—"}
                    </strong>
                    <small>
                        Evidence reliability
                    </small>
                </div>

            </div>

            <div className="ai-grid">

                <div className="panel ai-analysis">

                    <div className="panel-head">
                        <div>
                            <p className="eyebrow">
                                AI ANALYSIS
                            </p>

                            <h2>
                                Evidence Intelligence
                            </h2>
                        </div>

                        <BrainCircuit size={20} />
                    </div>

                    {!processedActivities.length ? (

                        <div className="ai-empty">
                            <Activity size={30} />

                            <strong>
                                No AI analysis available
                            </strong>

                            <span>
                                Submit field evidence to start AI analysis.
                            </span>
                        </div>

                    ) : (

                        <div className="ai-activity-list">

                            {processedActivities
                                .slice(0, 6)
                                .map((activity) => {

                                    const result =
                                        activity.aiResult;

                                    return (
                                        <div
                                            className="ai-activity"
                                            key={activity.id}
                                        >

                                            <div className="ai-activity-icon">
                                                <ScanSearch size={17} />
                                            </div>

                                            <div className="ai-activity-main">

                                                <span>
                                                    {activity.id}
                                                </span>

                                                <strong>
                                                    {activity.name}
                                                </strong>

                                                <div className="ai-analysis-row">
                                                    <small>
                                                        AI Progress Estimate
                                                    </small>

                                                    <b>
                                                        {result.estimatedProgress}%
                                                    </b>
                                                </div>

                                                <div className="ai-track">
                                                    <i
                                                        style={{
                                                            width: `${result.estimatedProgress}%`,
                                                        }}
                                                    />
                                                </div>

                                                <div className="ai-result-tags">

                                                    <span>
                                                        <ScanSearch size={11} />
                                                        {result.objectsDetected?.length || 0}
                                                        {" "}objects
                                                    </span>

                                                    <span>
                                                        <Mic2 size={11} />
                                                        Voice {result.voiceMatch}%
                                                    </span>

                                                    <span>
                                                        <Target size={11} />
                                                        Match {result.activityMatch}%
                                                    </span>

                                                </div>

                                            </div>

                                            <div className="ai-confidence">

                                                <span>
                                                    Confidence
                                                </span>

                                                <strong>
                                                    {result.confidence}%
                                                </strong>

                                                <small>
                                                    {result.result}
                                                </small>

                                            </div>

                                        </div>
                                    );
                                })}

                        </div>
                    )}

                </div>

                <div className="panel ai-pipeline">

                    <div className="panel-head">
                        <div>
                            <p className="eyebrow">
                                LATEST RESULT
                            </p>

                            <h2>
                                Verification Result
                            </h2>
                        </div>

                        <ShieldCheck size={20} />
                    </div>

                    {!latest ? (

                        <div className="ai-empty">
                            <BrainCircuit size={30} />

                            <strong>
                                Waiting for evidence
                            </strong>

                            <span>
                                AI results will appear here after capture.
                            </span>
                        </div>

                    ) : (

                        <div className="ai-result-panel">

                            <div className="ai-result-status">
                                <div>
                                    <CheckCircle2 size={20} />

                                    <strong>
                                        {latest.aiResult.result}
                                    </strong>
                                </div>

                                <span>
                                    {latest.aiResult.confidence}% confidence
                                </span>
                            </div>

                            <div className="ai-result-row">
                                <span>Activity Match</span>
                                <b>
                                    {latest.aiResult.activityMatch}%
                                </b>
                            </div>

                            <div className="ai-result-row">
                                <span>Voice Match</span>
                                <b>
                                    {latest.aiResult.voiceMatch}%
                                </b>
                            </div>

                            <div className="ai-result-row">
                                <span>Estimated Progress</span>
                                <b>
                                    {latest.aiResult.estimatedProgress}%
                                </b>
                            </div>

                            <div className="ai-result-row">
                                <span>Trust Score</span>
                                <b>
                                    {latest.aiResult.trustScore}/100
                                </b>
                            </div>

                            <div className="ai-detected">

                                <p>
                                    DETECTED OBJECTS
                                </p>

                                <div>
                                    {latest.aiResult.objectsDetected?.map(
                                        (object) => (
                                            <span key={object}>
                                                {object}
                                            </span>
                                        )
                                    )}
                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </section>
    );
}