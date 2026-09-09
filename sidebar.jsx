import {
    LayoutDashboard,
    ClipboardList,
    MapPin,
    ShieldCheck,
    BrainCircuit,
    FileText,
    UserRound,
    Settings,
    ChevronLeft,
} from "lucide-react";

export default function Sidebar({
    page,
    setPage,
    collapsed,
    setCollapsed,
}) {
    const menu = [
        {
            section: "MANAGER",
            items: [
                {
                    name: "Dashboard",
                    icon: LayoutDashboard,
                },
                {
                    name: "Activities",
                    icon: ClipboardList,
                },
                {
                    name: "Sites",
                    icon: MapPin,
                },
                {
                    name: "Verification",
                    icon: ShieldCheck,
                },
                {
                    name: "AI Insights",
                    icon: BrainCircuit,
                },
                {
                    name: "Reports",
                    icon: FileText,
                },
            ],
        },
        {
            section: "ENGINEER",
            items: [
                {
                    name: "My Work",
                    icon: UserRound,
                    page: "Engineer Dashboard",
                },
            ],
        },
        {
            section: "SYSTEM",
            items: [
                {
                    name: "Settings",
                    icon: Settings,
                },
            ],
        },
    ];

    return (
        <aside
            className={`sidebar ${collapsed ? "collapsed" : ""}`}
        >
            {/* BRAND */}

            <div className="sidebar-brand">
                <div className="brand-mark">
                    U
                </div>

                {!collapsed && (
                    <div>
                        <strong>
                            UDBHAV
                        </strong>

                        <span>
                            SIH 2026
                        </span>
                    </div>
                )}
            </div>

            {/* NAVIGATION */}

            <nav className="sidebar-nav">

                {menu.map((group) => (
                    <div
                        className="nav-group"
                        key={group.section}
                    >
                        {!collapsed && (
                            <p className="nav-section">
                                {group.section}
                            </p>
                        )}

                        {group.items.map(
                            ({
                                name,
                                icon: Icon,
                                page: targetPage,
                            }) => {
                                const actualPage =
                                    targetPage ||
                                    name;

                                return (
                                    <button
                                        key={name}
                                        className={`nav-item ${page === actualPage
                                                ? "active"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            setPage(
                                                actualPage
                                            )
                                        }
                                        title={
                                            collapsed
                                                ? name
                                                : ""
                                        }
                                    >
                                        <Icon
                                            size={18}
                                        />

                                        {!collapsed && (
                                            <span>
                                                {name}
                                            </span>
                                        )}
                                    </button>
                                );
                            }
                        )}
                    </div>
                ))}

            </nav>

            {/* COLLAPSE */}

            <button
                className="sidebar-collapse"
                onClick={() =>
                    setCollapsed(!collapsed)
                }
                title={
                    collapsed
                        ? "Expand sidebar"
                        : "Collapse sidebar"
                }
            >
                <ChevronLeft
                    size={17}
                    className={
                        collapsed
                            ? "rotate"
                            : ""
                    }
                />

                {!collapsed && (
                    <span>
                        Collapse
                    </span>
                )}
            </button>
        </aside>
    );
}