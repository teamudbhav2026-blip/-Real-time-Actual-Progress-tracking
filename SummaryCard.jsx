export default function SummaryCard({
    icon: Icon,
    label,
    value,
    note,
    tone = "blue",
}) {
    return (
        <div className={`summary-card summary-${tone}`}>

            <div className="summary-card-top">
                <div className={`summary-icon ${tone}`}>
                    <Icon size={17} />
                </div>

                <span className="summary-label">
                    {label}
                </span>
            </div>

            <div className="summary-card-value">
                <h3>{value}</h3>
            </div>

            <div className="summary-card-footer">
                <span className="summary-note">
                    {note}
                </span>
            </div>

        </div>
    );
}