import {
  Eye,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

function StatusBadge({ status }) {
  const className = status.toLowerCase().replaceAll(" ", "-");

  return (
    <span className={`badge ${className}`}>
      {status}
    </span>
  );
}

function ProgressCell({ value }) {
  return (
    <div className="progress-cell">
      <span>
        <b>{value}%</b>
      </span>

      <div>
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ActivityTable({
  activities = [],
  onDetails,
  onDelete,
  onAssign,
}) {
  if (!activities.length) {
    return (
      <div className="empty">
        No activities found.
      </div>
    );
  }

  const engineers = [
    "Mudit",
    "Krishna",
    "Rashmi",
    "Neelam",
    "Megha",
  ];

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>
              Activity
              <ArrowUpDown size={11} />
            </th>
            <th>Site</th>
            <th>Dates</th>
            <th>Planned</th>
            <th>Actual</th>
            <th>Trust Score</th>
            <th>Engineer</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {activities.map((activity) => (
            <tr
              key={activity.id}
              onClick={() => onDetails(activity)}
            >
              <td>
                <span className="activity-id">
                  {activity.id}
                </span>

                <strong>{activity.name}</strong>
              </td>

              <td>{activity.site}</td>

              <td>
                {activity.start}
                <small>to {activity.end}</small>
              </td>

              <td>
                <ProgressCell value={activity.planned} />
              </td>

              <td>
                <ProgressCell value={activity.actual} />
              </td>

              <td>
                <span
                  className={`trust ${
                    activity.trust >= 80
                      ? "high"
                      : activity.trust >= 50
                      ? "medium"
                      : "low"
                  }`}
                >
                  {activity.trust}%
                </span>
              </td>

              <td>
                <select
                  value={activity.engineer || ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();

                    if (onAssign) {
                      onAssign(
                        activity.id,
                        e.target.value
                      );
                    }
                  }}
                >
                  <option value="">
                    Unassigned
                  </option>

                  {engineers.map((engineer) => (
                    <option
                      key={engineer}
                      value={engineer}
                    >
                      {engineer}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                <StatusBadge status={activity.status} />
              </td>

              <td className="row-actions">
                <button
                  title="View details"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetails(activity);
                  }}
                >
                  <Eye size={15} />
                </button>

                <button
                  className="delete"
                  title="Delete activity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(activity.id);
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}