import {
  MapPin,
  ChevronRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const sites = [
  "Section A",
  "Section B",
  "Section C",
  "Section D",
];

export default function SiteOverview({
  activities = [],
  onSite,
}) {
  return (
    <div className="site-grid">

      {sites.map((site) => {

        const siteActivities =
          activities.filter(
            (activity) =>
              activity.site === site
          );

        const planned =
          siteActivities.length
            ? Math.round(
              siteActivities.reduce(
                (sum, activity) =>
                  sum +
                  activity.planned,
                0
              ) /
              siteActivities.length
            )
            : 0;

        const actual =
          siteActivities.length
            ? Math.round(
              siteActivities.reduce(
                (sum, activity) =>
                  sum +
                  activity.actual,
                0
              ) /
              siteActivities.length
            )
            : 0;

        const delayed =
          siteActivities.filter(
            (activity) =>
              activity.status ===
              "Delayed"
          ).length;

        const review =
          siteActivities.filter(
            (activity) =>
              activity.status ===
              "Needs Review"
          ).length;

        const completed =
          siteActivities.filter(
            (activity) =>
              activity.actual >= 100
          ).length;

        const variance =
          actual - planned;

        return (
          <button
            className="site-card advanced-site-card"
            key={site}
            onClick={() =>
              onSite(site)
            }
          >

            {/* HEADER */}

            <div className="site-card-header">

              <div className="site-heading">

                <span className="site-icon">
                  <MapPin
                    size={17}
                  />
                </span>

                <div>
                  <strong>
                    {site}
                  </strong>

                  <span>
                    {
                      siteActivities.length
                    }{" "}
                    activities
                  </span>
                </div>

              </div>

              <ChevronRight
                size={17}
              />

            </div>

            {/* PROGRESS */}

            <div className="site-main-progress">

              <div className="site-progress-value">

                <div>
                  <span>
                    Actual Progress
                  </span>

                  <strong>
                    {actual}%
                  </strong>
                </div>

                <span
                  className={
                    variance >= 0
                      ? "site-positive"
                      : "site-negative"
                  }
                >
                  {variance >= 0
                    ? "+"
                    : ""}
                  {variance}% vs plan
                </span>

              </div>

              <div className="site-progress-track">

                <i
                  style={{
                    width: `${actual}%`,
                  }}
                />

              </div>

              <div className="site-plan-line">

                <span>
                  Planned
                </span>

                <b>
                  {planned}%
                </b>

              </div>

            </div>

            {/* STATS */}

            <div className="site-stat-grid">

              <div>
                <Activity
                  size={14}
                />

                <span>
                  <b>
                    {
                      siteActivities.length
                    }
                  </b>
                  Activities
                </span>
              </div>

              <div>
                <CheckCircle2
                  size={14}
                />

                <span>
                  <b>
                    {completed}
                  </b>
                  Completed
                </span>
              </div>

              <div>
                <AlertTriangle
                  size={14}
                />

                <span>
                  <b>
                    {delayed}
                  </b>
                  Delayed
                </span>
              </div>

              <div>
                <AlertTriangle
                  size={14}
                />

                <span>
                  <b>
                    {review}
                  </b>
                  Review
                </span>
              </div>

            </div>

            {/* FOOTER */}

            <div className="site-card-footer">

              <span>
                Field execution status
              </span>

              <span className="site-open">
                View site
                <ChevronRight
                  size={13}
                />
              </span>

            </div>

          </button>
        );
      })}

    </div>
  );
}