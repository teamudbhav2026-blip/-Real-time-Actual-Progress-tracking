import {
    Menu,
    Search,
    Bell,
    ChevronDown,
} from "lucide-react";

export default function Topbar({ onMenu }) {
    return (
        <header className="topbar">
            <div className="crumb">
                <b>OIL India Limited</b>
                <small> / Infrastructure Projects</small>
            </div>

            <div className="top-actions">
                <button className="site-select">
                    <span>All Sites</span>
                    <ChevronDown size={14} />
                </button>

                <button className="search-trigger">
                    <Search size={16} />
                    <span>Search</span>
                    <kbd>⌘ K</kbd>
                </button>

                <button className="icon-btn notification">
                    <Bell size={18} />
                    <i />
                </button>

                <div className="profile">
                    <span>KT</span>
                    <div>
                        <b>Project Engineer</b>
                        <small>Field Operations</small>
                    </div>
                </div>

                <button className="icon-btn mobile-only" onClick={onMenu}>
                    <Menu size={20} />
                </button>
            </div>
        </header>
    );
}