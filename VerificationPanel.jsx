import {
    ShieldCheck,
    Video,
    MapPin,
    Clock3,
    CheckCircle2,
    AlertTriangle,
    Eye,
} from "lucide-react";

export default function VerificationPanel({
    activities = [],
    onStatus,
    onDetails,
}) {
    const reviewItems = activities.filter(
        (activity) =>
            activity.status === "Needs Review" ||
            activity.actual > 0
    );

    if (!reviewItems.length) {
        return (
            <section className="panel verification-panel">
                <div className="panel-head">
                    <div>
                        <p className="eyebrow">
                            VERIFICATION CENTRE
                        </p>

                        <h2>
                            Evidence Review Queue
                        </h2>
                    </div>

                    <ShieldCheck size={20} />
                </div>

                <div className="verification-empty">
                    <CheckCircle2 size={32} />

                    <strong>
                        No evidence awaiting review
                    </strong>

                    <span>
                        New field captures will appear
                        here automatically.
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section className="panel verification-panel">

            <div className="panel-head">

                <div>
                    <p className="eyebrow">
                        VERIFICATION CENTRE
                    </p>

                    <h2>
                        Evidence Review Queue
                    </h2>
                </div>

                <span className="review-count">
                    {reviewItems.length} pending
                </span>

            </div>

            <div className="verification-list">

                {reviewItems.map((activity) => {

                    const trust =
                        activity.trust || 0;

                    const trustClass =
                        trust >= 80
                            ? "high"
                            : trust >= 50
                                ? "medium"
                                : "low";

                    return (
                        <div
                            className="verification-item"
                            key={activity.id}
                        >

                            <div className="verification-icon">
                                {trust >= 80 ? (
                                    <ShieldCheck
                                        size={19}
                                    />
                                ) : (
                                    <AlertTriangle
                                        size={19}
                                    />
                                )}
                            </div>

                            <div className="verification-main">

                                <div className="verification-title">

                                    <div>
                                        <span className="activity-id">
                                            {activity.id}
                                        </span>

                                        <strong>
                                            {activity.name}
                                        </strong>
                                    </div>

                                    <span
                                        className={`trust ${trustClass}`}
                                    >
                                        {trust}% trust
                                    </span>

                                </div>

                                <div className="verification-meta">

                                    <span>
                                        <MapPin
                                            size={13}
                                        />

                                        {activity.site}
                                    </span>

                                    <span>
                                        <Video
                                            size={13}
                                        />

                                        Field capture
                                    </span>

                                    <span>
                                        <Clock3
                                            size={13}
                                        />

                                        {activity.captureTime
                                            ? new Date(
                                                activity.captureTime
                                            ).toLocaleTimeString()
                                            : "Recent"}
                                    </span>

                                </div>

                                <div className="verification-progress">

                                    <div>
                                        <span>
                                            Planned{" "}
                                            {activity.planned}%
                                        </span>

                                        <b>
                                            Actual{" "}
                                            {activity.actual}%
                                        </b>
                                    </div>

                                    <div className="verification-track">

                                        <i
                                            style={{
                                                width: `${Math.min(
                                                    activity.actual,
                                                    100
                                                )}%`,
                                            }}
                                        />

                                    </div>

                                </div>

                                <div className="verification-actions">

                                    <button
                                        className="ghost-btn"
                                        onClick={() =>
                                            onDetails(
                                                activity
                                            )
                                        }
                                    >
                                        <Eye size={14} />
                                        View Evidence
                                    </button>

                                    <button
                                        className="primary-btn"
                                        onClick={() =>
                                            onStatus(
                                                activity.id,
                                                "AI Verified"
                                            )
                                        }
                                    >
                                        <CheckCircle2
                                            size={14}
                                        />
                                        Approve
                                    </button>

                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>

        </section>
    );
}