import {
    X,
    MapPin,
    User,
    Clock,
    ShieldCheck,
    Video,
    TrendingUp,
    CalendarDays,
    CheckCircle2,
} from "lucide-react";

export default function ActivityDetails({
    activity,
    onClose,
}) {
    if (!activity) return null;

    const variance =
        activity.actual - activity.planned;

    const trustLevel =
        activity.trust >= 80
            ? "High"
            : activity.trust >= 50
                ? "Medium"
                : "Low";

    const progressWidth = Math.min(
        Math.max(activity.actual, 0),
        100
    );

    return (
        <div
            className="modal-backdrop"
            onClick={onClose}
        >
            <aside
                className="details-panel advanced-details"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                {/* HEADER */}
                <div className="modal-head">
                    <div>
                        <p className="eyebrow">
                            ACTIVITY VERIFICATION
                        </p>

                        <h2>{activity.name}</h2>

                        <p className="detail-subtitle">
                            Activity {activity.id} ·{" "}
                            {activity.site}
                        </p>
                    </div>

                    <button
                        className="icon-btn"
                        onClick={onClose}
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* STATUS */}
                <div className="verification-status-row">
                    <span className="badge">
                        {activity.status}
                    </span>

                    <span className="verification-live">
                        <i />
                        Live Record
                    </span>
                </div>

                {/* PROGRESS COMPARISON */}
                <div className="progress-comparison">
                    <div className="section-title">
                        <div>
                            <p className="eyebrow">
                                PROGRESS
                            </p>
                            <h3>
                                Planned vs Actual
                            </h3>
                        </div>

                        <TrendingUp size={19} />
                    </div>

                    <div className="progress-values">
                        <div>
                            <span>
                                Planned
                            </span>
                            <strong>
                                {activity.planned}%
                            </strong>
                        </div>

                        <div className="actual-value">
                            <span>
                                Actual
                            </span>
                            <strong>
                                {activity.actual}%
                            </strong>
                        </div>

                        <div>
                            <span>
                                Variance
                            </span>

                            <strong
                                className={
                                    variance >= 0
                                        ? "positive"
                                        : "negative"
                                }
                            >
                                {variance > 0
                                    ? "+"
                                    : ""}
                                {variance}%
                            </strong>
                        </div>
                    </div>

                    <div className="comparison-track">
                        <div
                            className="planned-line"
                            style={{
                                width: `${activity.planned}%`,
                            }}
                        />

                        <div
                            className="actual-line"
                            style={{
                                width: `${progressWidth}%`,
                            }}
                        />
                    </div>

                    <div className="comparison-labels">
                        <span>
                            0%
                        </span>
                        <span>
                            100%
                        </span>
                    </div>
                </div>

                {/* TRUST SCORE */}
                <div className="trust-panel">
                    <div>
                        <p className="eyebrow">
                            TRUST SCORE
                        </p>

                        <h3>
                            Evidence Reliability
                        </h3>
                    </div>

                    <div className="trust-score">
                        <ShieldCheck size={20} />

                        <strong>
                            {activity.trust}%
                        </strong>

                        <span>
                            {trustLevel}
                        </span>
                    </div>

                    <div className="trust-track">
                        <i
                            style={{
                                width: `${activity.trust}%`,
                            }}
                        />
                    </div>

                    <p className="trust-note">
                        Based on field capture,
                        location and verification
                        signals.
                    </p>
                </div>

                {/* ACTIVITY INFO */}
                <div className="details-info-grid">

                    <div className="info-item">
                        <ShieldCheck size={16} />

                        <div>
                            <span>
                                Activity ID
                            </span>
                            <b>
                                {activity.id}
                            </b>
                        </div>
                    </div>

                    <div className="info-item">
                        <MapPin size={16} />

                        <div>
                            <span>
                                Site
                            </span>
                            <b>
                                {activity.site}
                            </b>
                        </div>
                    </div>

                    <div className="info-item">
                        <CalendarDays size={16} />

                        <div>
                            <span>
                                Planned Dates
                            </span>
                            <b>
                                {activity.start} →{" "}
                                {activity.end}
                            </b>
                        </div>
                    </div>

                    <div className="info-item">
                        <User size={16} />

                        <div>
                            <span>
                                Engineer
                            </span>
                            <b>
                                {activity.engineer ||
                                    "Unassigned"}
                            </b>
                        </div>
                    </div>

                </div>

                {/* FIELD EVIDENCE */}
                <div className="evidence-section">

                    <div className="section-title">
                        <div>
                            <p className="eyebrow">
                                FIELD EVIDENCE
                            </p>

                            <h3>
                                Capture Verification
                            </h3>
                        </div>

                        <CheckCircle2
                            size={19}
                        />
                    </div>

                    <div className="evidence-card">

                        <div className="evidence-icon">
                            <Video size={21} />
                        </div>

                        <div className="evidence-content">
                            <strong>
                                Live field capture
                            </strong>

                            <span>
                                {activity.capture ||
                                    activity.captureTime ||
                                    "No capture submitted"}
                            </span>

                            <span>
                                {activity.location ||
                                    "Location unavailable"}
                            </span>
                        </div>

                        <span className="evidence-tag">
                            {activity.actual > 0
                                ? "SUBMITTED"
                                : "PENDING"}
                        </span>

                    </div>

                    <div className="evidence-card">

                        <div className="evidence-icon">
                            <ShieldCheck
                                size={21}
                            />
                        </div>

                        <div className="evidence-content">
                            <strong>
                                Verification result
                            </strong>

                            <span>
                                Trust score{" "}
                                {activity.trust}%
                            </span>

                            <span>
                                Status:{" "}
                                {activity.status}
                            </span>
                        </div>

                        <span className="evidence-tag">
                            {trustLevel.toUpperCase()}
                        </span>

                    </div>

                </div>

            </aside>
        </div>
    );
}