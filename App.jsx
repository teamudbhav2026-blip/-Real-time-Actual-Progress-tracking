import { useMemo, useState } from "react";
import AIInsights from "./components/AIInsights";

import {
    ClipboardList,
    CalendarClock,
    Activity,
    TriangleAlert,
    BadgeCheck,
    FileWarning,
    Plus,
    Filter,
    Download,
    FileDown,
    SlidersHorizontal,
    MapPin,
    Clock3,
    Video,
    ShieldCheck,
    Settings,
} from "lucide-react";

import { activities as initialActivities } from "./data/activities";

import Sidebar from "./components/sidebar";
import Topbar from "./components/Topbar";
import SummaryCard from "./components/SummaryCard";
import ProgressChart from "./components/ProgressChart";
import ActivityTable from "./components/ActivityTable";
import ActivityModal from "./components/ActivityModal";
import ActivityDetails from "./components/ActivityDetails";
import LiveCapture from "./components/LiveCapture";
import VerificationPanel from "./components/VerificationPanel";
import SiteOverview from "./components/siteoverview";

const average = (items, key) =>
    items.length
        ? Math.round(
            items.reduce(
                (sum, item) =>
                    sum + Number(item[key] || 0),
                0
            ) / items.length
        )
        : 0;

export default function App() {
    const [page, setPage] = useState("Dashboard");
    const [collapsed, setCollapsed] = useState(false);
    const [items, setItems] = useState(initialActivities);
    const [modal, setModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [captureActivity, setCaptureActivity] = useState(null);
    const [xmlMessage, setXmlMessage] = useState("");

    const [filters, setFilters] = useState({
        query: "",
        site: "All sites",
        status: "All statuses",
        trust: "Any score",
    });

    /* ========================= */
    /* PROJECT STATS */
    /* ========================= */

    const planned = average(items, "planned");
    const actual = average(items, "actual");

    const stats = {
        total: items.length,

        planned,

        actual,

        delayed: items.filter(
            (a) => a.status === "Delayed"
        ).length,

        verified: items.filter(
            (a) => a.status === "AI Verified"
        ).length,

        review: items.filter(
            (a) => a.status === "Needs Review"
        ).length,
    };

    /* ========================= */
    /* FILTERS */
    /* ========================= */

    const filtered = useMemo(() => {
        return items.filter((a) => {
            const q = filters.query
                .toLowerCase()
                .trim();

            return (
                (!q ||
                    a.name
                        .toLowerCase()
                        .includes(q) ||
                    a.id
                        .toLowerCase()
                        .includes(q)) &&

                (
                    filters.site === "All sites" ||
                    a.site === filters.site
                ) &&

                (
                    filters.status === "All statuses" ||
                    a.status === filters.status
                ) &&

                (
                    filters.trust === "Any score" ||

                    (
                        filters.trust === "80–100" &&
                        a.trust >= 80
                    ) ||

                    (
                        filters.trust === "50–79" &&
                        a.trust >= 50 &&
                        a.trust < 80
                    ) ||

                    (
                        filters.trust === "Below 50" &&
                        a.trust < 50
                    )
                )
            );
        });
    }, [items, filters]);

    /* ========================= */
    /* XML IMPORT */
    /* ========================= */

    const handleXMLImport = (file) => {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const parser = new DOMParser();

                const xml = parser.parseFromString(
                    event.target.result,
                    "application/xml"
                );

                const tasks = Array.from(
                    xml.getElementsByTagNameNS(
                        "*",
                        "Task"
                    )
                );

                const importedActivities = tasks
                    .map((task) => {
                        const getValue = (tag) =>
                            task
                                .getElementsByTagNameNS(
                                    "*",
                                    tag
                                )[0]
                                ?.textContent
                                ?.trim() || "";

                        const id = getValue("ID");
                        const name = getValue("Name");
                        const summary = getValue("Summary");

                        if (
                            !id ||
                            !name ||
                            summary === "1"
                        ) {
                            return null;
                        }

                        const start = getValue("Start");
                        const finish = getValue("Finish");
                        const wbs = getValue("WBS");

                        const percent =
                            Number(
                                getValue(
                                    "PercentComplete"
                                )
                            ) || 0;

                        return {
                            id,
                            name,

                            site:
                                wbs ||
                                "Unassigned",

                            start: start
                                ? start.split("T")[0]
                                : "—",

                            end: finish
                                ? finish.split("T")[0]
                                : "—",

                            planned: percent,

                            actual: 0,

                            trust: 0,

                            status: "Pending",

                            wbs,

                            engineer: "",
                        };
                    })
                    .filter(Boolean);

                if (!importedActivities.length) {
                    setXmlMessage(
                        "No activities found in this XML file."
                    );

                    return;
                }

                setItems(importedActivities);

                setXmlMessage(
                    `${importedActivities.length} activities imported successfully`
                );

                setPage("Activities");
            } catch (error) {
                console.error(error);

                setXmlMessage(
                    "Could not read this XML file."
                );
            }
        };

        reader.readAsText(file);
    };

    /* ========================= */
    /* ACTIVITY ACTIONS */
    /* ========================= */

    const changeStatus = (id, status) => {
        setItems((current) =>
            current.map((activity) =>
                activity.id === id
                    ? {
                        ...activity,
                        status,
                    }
                    : activity
            )
        );
    };

    const assignEngineer = (id, engineer) => {
        setItems((current) =>
            current.map((activity) =>
                activity.id === id
                    ? {
                        ...activity,
                        engineer,
                    }
                    : activity
            )
        );
    };

    const deleteActivity = (id) => {
        setItems((current) =>
            current.filter(
                (activity) =>
                    activity.id !== id
            )
        );
    };

    const add = (activity) => {
        setItems((current) => [
            activity,
            ...current,
        ]);

        setModal(false);
        setPage("Activities");
    };

    /* ========================= */
    /* EVIDENCE SUBMISSION */
    /* ========================= */

    const submitEvidence = (activityId, evidence) => {
        setItems((current) =>
            current.map((activity) =>
                activity.id === activityId
                    ? {
                        ...activity,
                        actual: evidence.actual,
                        status: evidence.status,
                        trust: evidence.trust,
                        captureTime: evidence.captureTime,
                        location: evidence.location,
                        aiResult: evidence.aiResult,
                    }
                    : activity
            )
        );
    };
    /* ========================= */
    /* FILTER RESET */
    /* ========================= */

    const clear = () => {
        setFilters({
            query: "",
            site: "All sites",
            status: "All statuses",
            trust: "Any score",
        });
    };

    /* ========================= */
    /* DASHBOARD CARDS */
    /* ========================= */

    const cards = [
        [
            ClipboardList,
            "Total Activities",
            stats.total,
            "Across active sections",
            "blue",
        ],

        [
            CalendarClock,
            "Planned Progress",
            `${stats.planned}%`,
            "Current schedule baseline",
            "indigo",
        ],

        [
            Activity,
            "Actual Progress",
            `${stats.actual}%`,
            `${stats.actual - stats.planned}% against plan`,
            stats.actual >= stats.planned
                ? "green"
                : "amber",
        ],

        [
            TriangleAlert,
            "Delayed Activities",
            stats.delayed,
            stats.delayed
                ? "Requires intervention"
                : "No critical delays",
            "red",
        ],

        [
            BadgeCheck,
            "AI Verified",
            stats.verified,
            `${Math.round(
                (stats.verified / stats.total) * 100
            ) || 0}% of work items`,
            "green",
        ],

        [
            FileWarning,
            "Needs Review",
            stats.review,
            stats.review
                ? "Awaiting validation"
                : "Queue clear",
            "amber",
        ],
    ];

    /* ========================= */
    /* ENGINEER WORK */
    /* ========================= */

    const assignedActivities = items.filter(
        (activity) => activity.engineer
    );

    /* ========================= */
    /* PAGE TITLES */
    /* ========================= */

    const pageTitle = {
        Dashboard:
            "Real-Time Progress Dashboard",

        Activities:
            "Schedule & Activities",

        Sites:
            "Site Overview",

        Verification:
            "Verification Centre",

        "AI Insights":
            "AI Construction Intelligence",

        Reports:
            "Project Reports",

        "Engineer Dashboard":
            "My Work",

        Settings:
            "Workspace Settings",
    }[page];

    return (
        <div className="app">

            {/* ========================= */}
            {/* SIDEBAR */}
            {/* ========================= */}

            <Sidebar
                page={page}
                setPage={setPage}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <main>

                {/* ========================= */}
                {/* TOPBAR */}
                {/* ========================= */}

                <Topbar
                    onMenu={() =>
                        setCollapsed(!collapsed)
                    }
                />

                <div className="content">

                    {/* ========================= */}
                    {/* PAGE HEADER */}
                    {/* ========================= */}

                    <div className="title-row">

                        <div>

                            <p className="eyebrow">
                                SIH 2026 · REAL-TIME
                                ACTUAL PROGRESS
                                TRACKING
                            </p>

                            <h1>
                                {pageTitle}
                            </h1>

                            <p className="subtitle">
                                Planning-to-Execution
                                Bridge

                                <span>•</span>

                                Updated moments ago
                            </p>

                        </div>

                        {(page === "Dashboard" ||
                            page === "Activities") && (
                                <div className="title-actions">

                                    <label className="ghost-btn upload-btn">

                                        <Download size={16} />

                                        Import XML File

                                        <input
                                            type="file"
                                            accept=".xml"
                                            hidden
                                            onChange={(e) => {
                                                const file =
                                                    e.target
                                                        .files?.[0];

                                                if (file) {
                                                    handleXMLImport(
                                                        file
                                                    );
                                                }
                                            }}
                                        />

                                    </label>

                                    <button
                                        className="primary-btn add-btn"
                                        onClick={() =>
                                            setModal(true)
                                        }
                                    >
                                        <Plus size={18} />

                                        Add Activity
                                    </button>

                                </div>
                            )}

                    </div>

                    {/* ========================= */}
                    {/* XML MESSAGE */}
                    {/* ========================= */}

                    {xmlMessage && (
                        <div className="xml-success">

                            <div>
                                <strong>
                                    MS Project XML
                                    Imported
                                </strong>

                                <p>
                                    {xmlMessage}
                                </p>
                            </div>

                            <button
                                className="clear-btn"
                                onClick={() =>
                                    setXmlMessage("")
                                }
                            >
                                Dismiss
                            </button>

                        </div>
                    )}

                    {/* ========================= */}
                    {/* DASHBOARD */}
                    {/* ========================= */}

                    {page === "Dashboard" && (
                        <>

                            <section className="dashboard-command">

                                <div className="command-main">

                                    <div className="command-label">
                                        <span className="live-dot"></span>
                                        LIVE PROJECT STATUS
                                    </div>

                                    <div className="command-title-row">

                                        <div>
                                            <h2>
                                                Overall Construction
                                                Progress
                                            </h2>

                                            <p>
                                                Actual field execution
                                                compared with the
                                                approved schedule.
                                            </p>
                                        </div>

                                        <div className="command-progress-value">
                                            {stats.actual}%
                                        </div>

                                    </div>

                                    <div className="command-progress-track">

                                        <i
                                            style={{
                                                width: `${Math.min(
                                                    stats.actual,
                                                    100
                                                )}%`,
                                            }}
                                        />

                                    </div>

                                    <div className="command-progress-meta">

                                        <span>
                                            Planned{" "}
                                            <b>
                                                {stats.planned}%
                                            </b>
                                        </span>

                                        <span
                                            className={
                                                stats.actual >=
                                                    stats.planned
                                                    ? "command-positive"
                                                    : "command-negative"
                                            }
                                        >
                                            {stats.actual >=
                                                stats.planned
                                                ? "Ahead of schedule"
                                                : "Behind schedule"}

                                            {" · "}

                                            {stats.actual -
                                                stats.planned >
                                                0
                                                ? "+"
                                                : ""}

                                            {stats.actual -
                                                stats.planned}
                                            %
                                        </span>

                                    </div>

                                </div>

                                <div className="command-side">

                                    <div className="command-side-item">
                                        <span>
                                            Activities
                                        </span>

                                        <strong>
                                            {stats.total}
                                        </strong>

                                        <small>
                                            Total schedule items
                                        </small>
                                    </div>

                                    <div className="command-side-item">
                                        <span>
                                            AI Verified
                                        </span>

                                        <strong>
                                            {stats.verified}
                                        </strong>

                                        <small>
                                            Evidence approved
                                        </small>
                                    </div>

                                    <div className="command-side-item warning">
                                        <span>
                                            Needs Review
                                        </span>

                                        <strong>
                                            {stats.review}
                                        </strong>

                                        <small>
                                            Awaiting validation
                                        </small>
                                    </div>

                                    <div className="command-side-item danger">
                                        <span>
                                            Delayed
                                        </span>

                                        <strong>
                                            {stats.delayed}
                                        </strong>

                                        <small>
                                            Requires intervention
                                        </small>
                                    </div>

                                </div>

                            </section>

                            <div className="dashboard-columns">

                                <ProgressChart
                                    activities={items}
                                />

                                <VerificationPanel
                                    activities={items}
                                    onStatus={changeStatus}
                                    onDetails={setSelected}
                                />

                            </div>

                            <section className="panel">

                                <div className="panel-head">

                                    <div>
                                        <p className="eyebrow">
                                            FIELD LOCATIONS
                                        </p>

                                        <h2>
                                            Site performance
                                        </h2>
                                    </div>

                                    <button
                                        className="text-btn"
                                        onClick={() =>
                                            setPage("Sites")
                                        }
                                    >
                                        View all sites →
                                    </button>

                                </div>

                                <SiteOverview
                                    activities={items}
                                    onSite={(site) => {
                                        setFilters({
                                            ...filters,
                                            site,
                                        });

                                        setPage("Activities");
                                    }}
                                />

                            </section>

                        </>
                    )}

                    {/* ========================= */}
                    {/* ACTIVITIES */}
                    {/* ========================= */}

                    {page === "Activities" && (
                        <>

                            <section className="filter-bar">

                                <div className="search-box">

                                    <Filter size={17} />

                                    <input
                                        placeholder="Search activity name or ID"
                                        value={
                                            filters.query
                                        }
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                query:
                                                    e.target
                                                        .value,
                                            })
                                        }
                                    />

                                </div>

                                <select
                                    value={filters.site}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            site:
                                                e.target
                                                    .value,
                                        })
                                    }
                                >
                                    <option>
                                        All sites
                                    </option>

                                    <option>
                                        Section A
                                    </option>

                                    <option>
                                        Section B
                                    </option>

                                    <option>
                                        Section C
                                    </option>

                                    <option>
                                        Section D
                                    </option>
                                </select>

                                <select
                                    value={filters.status}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            status:
                                                e.target
                                                    .value,
                                        })
                                    }
                                >
                                    <option>
                                        All statuses
                                    </option>

                                    <option>
                                        On Track
                                    </option>

                                    <option>
                                        Delayed
                                    </option>

                                    <option>
                                        Needs Review
                                    </option>

                                    <option>
                                        AI Verified
                                    </option>

                                    <option>
                                        Pending
                                    </option>
                                </select>

                                <select
                                    value={filters.trust}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            trust:
                                                e.target
                                                    .value,
                                        })
                                    }
                                >
                                    <option>
                                        Any score
                                    </option>

                                    <option>
                                        80–100
                                    </option>

                                    <option>
                                        50–79
                                    </option>

                                    <option>
                                        Below 50
                                    </option>
                                </select>

                                <button
                                    className="clear-btn"
                                    onClick={clear}
                                >
                                    Clear filters
                                </button>

                            </section>

                            <section className="panel table-panel">

                                <div className="panel-head">

                                    <div>
                                        <p className="eyebrow">
                                            SCHEDULE &
                                            EXECUTION
                                        </p>

                                        <h2>
                                            {filtered.length}{" "}
                                            activities
                                        </h2>
                                    </div>

                                    <button className="ghost-btn">
                                        <SlidersHorizontal
                                            size={15}
                                        />

                                        Configure view
                                    </button>

                                </div>

                                <ActivityTable
                                    activities={filtered}
                                    onDetails={setSelected}
                                    onDelete={deleteActivity}
                                    onAssign={assignEngineer}
                                />

                            </section>

                        </>
                    )}

                    {/* ========================= */}
                    {/* SITES */}
                    {/* ========================= */}

                    {page === "Sites" && (
                        <>

                            <section className="summary-grid compact">

                                {cards
                                    .slice(0, 4)
                                    .map(
                                        ([
                                            icon,
                                            label,
                                            value,
                                            note,
                                            tone,
                                        ]) => (
                                            <SummaryCard
                                                key={label}
                                                icon={icon}
                                                label={label}
                                                value={value}
                                                note={note}
                                                tone={tone}
                                            />
                                        )
                                    )}

                            </section>

                            <SiteOverview
                                activities={items}
                                onSite={(site) => {
                                    setFilters({
                                        ...filters,
                                        site,
                                    });

                                    setPage("Activities");
                                }}
                            />

                        </>
                    )}

                    {/* ========================= */}
                    {/* VERIFICATION */}
                    {/* ========================= */}

                    {page === "Verification" && (
                        <VerificationPanel
                            activities={items}
                            onStatus={changeStatus}
                            onDetails={setSelected}
                        />
                    )}

                    {/* ========================= */}
                    {/* AI INSIGHTS */}
                    {/* ========================= */}

                    {page === "AI Insights" && (
                        <AIInsights
                            activities={items}
                        />
                    )}

                    {/* ========================= */}
                    {/* REPORTS */}
                    {/* ========================= */}

                    {page === "Reports" && (
                        <section className="reports-page">

                            <div className="report-header panel">

                                <div>

                                    <p className="eyebrow">
                                        PROJECT REPORTING
                                    </p>

                                    <h2>
                                        Execution Summary
                                    </h2>

                                    <p>
                                        Decision-ready
                                        overview of schedule
                                        performance,
                                        verification and
                                        field execution.
                                    </p>

                                </div>

                                <div className="report-actions">

                                    <button className="ghost-btn">
                                        <Download size={16} />
                                        Export Report
                                    </button>

                                    <button className="primary-btn">
                                        <FileDown size={16} />
                                        Download Summary
                                    </button>

                                </div>

                            </div>

                            <div className="report-metrics">

                                <div className="report-metric">
                                    <span>
                                        Schedule Performance
                                    </span>

                                    <strong>
                                        {stats.actual >=
                                            stats.planned
                                            ? "On Track"
                                            : "Behind Plan"}
                                    </strong>

                                    <small>
                                        {stats.actual}% actual
                                        vs {stats.planned}%
                                        planned
                                    </small>
                                </div>

                                <div className="report-metric">
                                    <span>
                                        Activities Completed
                                    </span>

                                    <strong>
                                        {
                                            items.filter(
                                                (a) =>
                                                    a.actual >=
                                                    100
                                            ).length
                                        }
                                    </strong>

                                    <small>
                                        of {stats.total}{" "}
                                        activities
                                    </small>
                                </div>

                                <div className="report-metric">
                                    <span>
                                        Verification Queue
                                    </span>

                                    <strong>
                                        {stats.review}
                                    </strong>

                                    <small>
                                        activities need
                                        review
                                    </small>
                                </div>

                                <div className="report-metric">
                                    <span>
                                        Delayed Work
                                    </span>

                                    <strong>
                                        {stats.delayed}
                                    </strong>

                                    <small>
                                        activities delayed
                                    </small>
                                </div>

                            </div>

                            <div className="report-columns">

                                <div className="panel report-health">

                                    <div className="panel-head">

                                        <div>
                                            <p className="eyebrow">
                                                PROJECT HEALTH
                                            </p>

                                            <h2>
                                                Current execution
                                                status
                                            </h2>
                                        </div>

                                    </div>

                                    <div className="health-item">
                                        <span>
                                            Planned Progress
                                        </span>

                                        <strong>
                                            {stats.planned}%
                                        </strong>
                                    </div>

                                    <div className="health-item">
                                        <span>
                                            Actual Progress
                                        </span>

                                        <strong>
                                            {stats.actual}%
                                        </strong>
                                    </div>

                                    <div className="health-item">
                                        <span>
                                            Schedule Variance
                                        </span>

                                        <strong
                                            className={
                                                stats.actual >=
                                                    stats.planned
                                                    ? "positive"
                                                    : "negative"
                                            }
                                        >
                                            {stats.actual -
                                                stats.planned >
                                                0
                                                ? "+"
                                                : ""}

                                            {stats.actual -
                                                stats.planned}
                                            %
                                        </strong>
                                    </div>

                                    <div className="health-bar">

                                        <div>
                                            <span>
                                                Overall execution
                                            </span>

                                            <b>
                                                {stats.actual}%
                                            </b>
                                        </div>

                                        <div className="health-track">

                                            <i
                                                style={{
                                                    width: `${stats.actual}%`,
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>

                                <div className="panel report-verification">

                                    <div className="panel-head">

                                        <div>
                                            <p className="eyebrow">
                                                VERIFICATION
                                            </p>

                                            <h2>
                                                Evidence status
                                            </h2>
                                        </div>

                                        <ShieldCheck size={20} />

                                    </div>

                                    <div className="verification-summary-row">
                                        <span>
                                            AI Verified
                                        </span>

                                        <strong>
                                            {stats.verified}
                                        </strong>
                                    </div>

                                    <div className="verification-summary-row">
                                        <span>
                                            Needs Review
                                        </span>

                                        <strong>
                                            {stats.review}
                                        </strong>
                                    </div>

                                    <div className="verification-summary-row">
                                        <span>
                                            Pending Evidence
                                        </span>

                                        <strong>
                                            {
                                                items.filter(
                                                    (a) =>
                                                        a.actual ===
                                                        0
                                                ).length
                                            }
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            <section className="panel">

                                <div className="panel-head">

                                    <div>
                                        <p className="eyebrow">
                                            SITE PERFORMANCE
                                        </p>

                                        <h2>
                                            Execution by site
                                        </h2>
                                    </div>

                                </div>

                                <SiteOverview
                                    activities={items}
                                    onSite={(site) => {
                                        setFilters({
                                            ...filters,
                                            site,
                                        });

                                        setPage(
                                            "Activities"
                                        );
                                    }}
                                />

                            </section>

                        </section>
                    )}

                    {/* ========================= */}
                    {/* MY WORK / ENGINEER */}
                    {/* ========================= */}

                    {page === "Engineer Dashboard" && (
                        <>

                            <section className="summary-grid compact">

                                <SummaryCard
                                    icon={ClipboardList}
                                    label="Assigned Activities"
                                    value={
                                        assignedActivities.length
                                    }
                                    note="Work assigned by manager"
                                    tone="blue"
                                />

                                <SummaryCard
                                    icon={Activity}
                                    label="In Progress"
                                    value={
                                        assignedActivities.filter(
                                            (activity) =>
                                                activity.actual >
                                                0 &&
                                                activity.actual <
                                                100
                                        ).length
                                    }
                                    note="Currently being executed"
                                    tone="indigo"
                                />

                                <SummaryCard
                                    icon={BadgeCheck}
                                    label="Completed"
                                    value={
                                        assignedActivities.filter(
                                            (activity) =>
                                                activity.actual >=
                                                100
                                        ).length
                                    }
                                    note="Completed field work"
                                    tone="green"
                                />

                                <SummaryCard
                                    icon={TriangleAlert}
                                    label="Needs Action"
                                    value={
                                        assignedActivities.filter(
                                            (activity) =>
                                                activity.status ===
                                                "Needs Review"
                                        ).length
                                    }
                                    note="Requires verification"
                                    tone="amber"
                                />

                            </section>

                            <section className="panel">

                                <div className="panel-head">

                                    <div>
                                        <p className="eyebrow">
                                            FIELD EXECUTION
                                        </p>

                                        <h2>
                                            My Assigned Work
                                        </h2>
                                    </div>

                                </div>

                                {assignedActivities.length ===
                                    0 ? (
                                    <div className="empty">
                                        No activities
                                        assigned yet.
                                    </div>
                                ) : (
                                    <div className="engineer-work-grid">

                                        {assignedActivities.map(
                                            (activity) => (
                                                <div
                                                    className="engineer-work-card"
                                                    key={
                                                        activity.id
                                                    }
                                                >

                                                    <div className="engineer-card-top">

                                                        <span className="activity-id">
                                                            {
                                                                activity.id
                                                            }
                                                        </span>

                                                        <span className="badge pending">
                                                            Assigned
                                                        </span>

                                                    </div>

                                                    <h3>
                                                        {
                                                            activity.name
                                                        }
                                                    </h3>

                                                    <div className="engineer-card-info">

                                                        <span>
                                                            <MapPin size={15} />

                                                            {
                                                                activity.site
                                                            }
                                                        </span>

                                                        <span>
                                                            <Clock3 size={15} />

                                                            {
                                                                activity.start
                                                            }

                                                            {" → "}

                                                            {
                                                                activity.end
                                                            }
                                                        </span>

                                                    </div>

                                                    <div className="engineer-progress">

                                                        <div>
                                                            <span>
                                                                Planned
                                                            </span>

                                                            <b>
                                                                {
                                                                    activity.planned
                                                                }
                                                                %
                                                            </b>
                                                        </div>

                                                        <div className="progress-track">

                                                            <i
                                                                style={{
                                                                    width: `${activity.planned}%`,
                                                                }}
                                                            />

                                                        </div>

                                                    </div>

                                                    <div className="engineer-assigned">

                                                        <small>
                                                            Assigned
                                                            Engineer
                                                        </small>

                                                        <strong>
                                                            {
                                                                activity.engineer
                                                            }
                                                        </strong>

                                                    </div>

                                                    <button
                                                        className="primary-btn engineer-open-btn"
                                                        onClick={() =>
                                                            setCaptureActivity(
                                                                activity
                                                            )
                                                        }
                                                    >
                                                        <Video size={16} />

                                                        Open Activity
                                                    </button>

                                                </div>
                                            )
                                        )}

                                    </div>
                                )}

                            </section>

                        </>
                    )}

                    {/* ========================= */}
                    {/* SETTINGS */}
                    {/* ========================= */}

                    {page === "Settings" && (
                        <section className="settings-page">

                            <div className="settings-header panel">

                                <div>
                                    <p className="eyebrow">
                                        SYSTEM CONFIGURATION
                                    </p>

                                    <h2>
                                        Workspace Settings
                                    </h2>

                                    <p>
                                        Configure project
                                        workspace, field
                                        capture and
                                        verification
                                        behaviour.
                                    </p>
                                </div>

                            </div>

                            <div className="settings-grid">

                                <div className="panel settings-card">

                                    <div className="settings-card-head">

                                        <div>
                                            <p className="eyebrow">
                                                PROJECT
                                            </p>

                                            <h3>
                                                Project
                                                Configuration
                                            </h3>
                                        </div>

                                        <ClipboardList
                                            size={19}
                                        />

                                    </div>

                                    <div className="setting-row">
                                        <div>
                                            <strong>
                                                Project Name
                                            </strong>

                                            <span>
                                                SIH 2026
                                                Real-Time
                                                Progress
                                                Tracking
                                            </span>
                                        </div>
                                    </div>

                                    <div className="setting-row">
                                        <div>
                                            <strong>
                                                Schedule Source
                                            </strong>

                                            <span>
                                                MS Project /
                                                Primavera
                                            </span>
                                        </div>

                                        <span className="setting-badge">
                                            Enabled
                                        </span>
                                    </div>

                                    <div className="setting-row">
                                        <div>
                                            <strong>
                                                Schedule Import
                                            </strong>

                                            <span>
                                                File-based
                                                XML / XER
                                                import
                                            </span>
                                        </div>

                                        <span className="setting-badge">
                                            Active
                                        </span>
                                    </div>

                                </div>

                                <div className="panel settings-card">

                                    <div className="settings-card-head">

                                        <div>
                                            <p className="eyebrow">
                                                FIELD CAPTURE
                                            </p>

                                            <h3>
                                                Evidence
                                                Settings
                                            </h3>
                                        </div>

                                        <Video size={19} />

                                    </div>

                                    <div className="setting-row">
                                        <div>
                                            <strong>
                                                Live Camera
                                                Capture
                                            </strong>

                                            <span>
                                                Engineer
                                                evidence must
                                                be captured
                                                in-app.
                                            </span>
                                        </div>

                                        <span className="toggle active"></span>
                                    </div>

                                    <div className="setting-row">
                                        <div>
                                            <strong>
                                                Gallery Upload
                                            </strong>

                                            <span>
                                                Previously
                                                recorded media
                                                is not
                                                accepted.
                                            </span>
                                        </div>

                                        <span className="setting-badge disabled">
                                            Disabled
                                        </span>
                                    </div>

                                    <div className="setting-row">
                                        <div>
                                            <strong>
                                                GPS Verification
                                            </strong>

                                            <span>
                                                Capture location
                                                is attached to
                                                evidence.
                                            </span>
                                        </div>

                                        <span className="toggle active"></span>
                                    </div>

                                </div>

                                <div className="panel settings-card">

                                    <div className="settings-card-head">

                                        <div>
                                            <p className="eyebrow">
                                                VERIFICATION
                                            </p>

                                            <h3>
                                                Trust Score
                                                Rules
                                            </h3>
                                        </div>

                                        <ShieldCheck
                                            size={19}
                                        />

                                    </div>

                                    <div className="trust-rule">

                                        <span className="trust-dot high"></span>

                                        <div>
                                            <strong>
                                                80–100
                                            </strong>

                                            <span>
                                                Auto-approved
                                            </span>
                                        </div>

                                    </div>

                                    <div className="trust-rule">

                                        <span className="trust-dot medium"></span>

                                        <div>
                                            <strong>
                                                50–79
                                            </strong>

                                            <span>
                                                Spot-check
                                                required
                                            </span>
                                        </div>

                                    </div>

                                    <div className="trust-rule">

                                        <span className="trust-dot low"></span>

                                        <div>
                                            <strong>
                                                0–49
                                            </strong>

                                            <span>
                                                Manual review
                                                required
                                            </span>
                                        </div>

                                    </div>

                                </div>

                                <div className="panel settings-card">

                                    <div className="settings-card-head">

                                        <div>
                                            <p className="eyebrow">
                                                SYSTEM STATUS
                                            </p>

                                            <h3>
                                                Platform
                                                Services
                                            </h3>
                                        </div>

                                        <Settings size={19} />

                                    </div>

                                    <div className="service-row">
                                        <span>
                                            <i></i>
                                            Schedule Parser
                                        </span>

                                        <b>
                                            Operational
                                        </b>
                                    </div>

                                    <div className="service-row">
                                        <span>
                                            <i></i>
                                            Evidence Processing
                                        </span>

                                        <b>
                                            Operational
                                        </b>
                                    </div>

                                    <div className="service-row">
                                        <span>
                                            <i></i>
                                            Database
                                        </span>

                                        <b>
                                            Operational
                                        </b>
                                    </div>

                                    <div className="service-row">
                                        <span>
                                            <i></i>
                                            Sync Service
                                        </span>

                                        <b>
                                            Operational
                                        </b>
                                    </div>

                                </div>

                            </div>

                        </section>
                    )}

                </div>
            </main>

            {/* ========================= */}
            {/* ADD ACTIVITY MODAL */}
            {/* ========================= */}

            {modal && (
                <ActivityModal
                    onClose={() =>
                        setModal(false)
                    }
                    onAdd={add}
                />
            )}

            {/* ========================= */}
            {/* LIVE CAPTURE */}
            {/* ========================= */}

            {captureActivity && (
                <LiveCapture
                    activity={captureActivity}
                    onClose={() =>
                        setCaptureActivity(null)
                    }
                    onSubmit={submitEvidence}
                />
            )}

            {/* ========================= */}
            {/* ACTIVITY DETAILS */}
            {/* ========================= */}

            <ActivityDetails
                activity={selected}
                onClose={() =>
                    setSelected(null)
                }
            />

        </div>
    );
}