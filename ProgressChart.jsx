export default function ProgressChart({ activities = [] }) {
    const getY = (value) => 155 - value * 1.2;

    const visibleActivities = activities.slice(0, 6);

    const plannedPoints = visibleActivities
        .map(
            (activity, index) =>
                `${55 + index * 78},${getY(activity.planned || 0)}`
        )
        .join(" ");

    const actualPoints = visibleActivities
        .map(
            (activity, index) =>
                `${55 + index * 78},${getY(activity.actual || 0)}`
        )
        .join(" ");

    const planned =
        activities.length > 0
            ? Math.round(
                activities.reduce(
                    (sum, item) => sum + Number(item.planned || 0),
                    0
                ) / activities.length
            )
            : 0;

    const actual =
        activities.length > 0
            ? Math.round(
                activities.reduce(
                    (sum, item) => sum + Number(item.actual || 0),
                    0
                ) / activities.length
            )
            : 0;

    const difference = actual - planned;

    return (
        <section className="panel progress-chart-panel">

            <div className="panel-head">
                <div>
                    <p className="eyebrow">PROJECT HEALTH</p>
                    <h2>Planned vs Actual Progress</h2>
                    <span className="chart-subtitle">
                        Activity-level execution comparison
                    </span>
                </div>

                <span
                    className={`badge ${actual >= planned
                            ? "on-track"
                            : "needs-review"
                        }`}
                >
                    {actual >= planned
                        ? "On Track"
                        : "Below Plan"}
                </span>
            </div>

            <div className="progress-metrics">

                <div>
                    <span>Planned</span>
                    <b>{planned}%</b>
                </div>

                <div>
                    <span>Actual</span>
                    <b>{actual}%</b>
                </div>

                <div>
                    <span>Variance</span>
                    <b
                        className={
                            difference < 0
                                ? "negative"
                                : "positive"
                        }
                    >
                        {difference > 0 ? "+" : ""}
                        {difference}%
                    </b>
                </div>

                <div>
                    <span>Activities</span>
                    <b>{activities.length}</b>
                </div>

            </div>

            {visibleActivities.length === 0 ? (
                <div className="chart-empty">
                    <strong>No activity data available</strong>
                    <span>
                        Import a schedule to view progress.
                    </span>
                </div>
            ) : (
                <div className="chart-wrap">

                    <div className="chart-legend">
                        <span>
                            <i className="planned-dot" />
                            Planned
                        </span>

                        <span>
                            <i className="actual-dot" />
                            Actual
                        </span>
                    </div>

                    <svg
                        viewBox="0 0 500 190"
                        preserveAspectRatio="none"
                    >
                        {[25, 50, 75, 100].map(
                            (value) => (
                                <line
                                    key={value}
                                    x1="35"
                                    x2="485"
                                    y1={getY(value)}
                                    y2={getY(value)}
                                    className="grid"
                                />
                            )
                        )}

                        <polyline
                            points={plannedPoints}
                            className="planned-line"
                        />

                        <polyline
                            points={actualPoints}
                            className="actual-line"
                        />

                        {visibleActivities.map(
                            (activity, index) => (
                                <circle
                                    key={activity.id}
                                    cx={55 + index * 78}
                                    cy={getY(
                                        activity.actual || 0
                                    )}
                                    r="4"
                                    className="actual-point"
                                />
                            )
                        )}

                        <g className="axis-labels">
                            {visibleActivities.map(
                                (activity, index) => (
                                    <text
                                        key={activity.id}
                                        x={
                                            55 +
                                            index * 78
                                        }
                                        y="180"
                                        textAnchor="middle"
                                    >
                                        {activity.id}
                                    </text>
                                )
                            )}
                        </g>
                    </svg>

                </div>
            )}

        </section>
    );
}