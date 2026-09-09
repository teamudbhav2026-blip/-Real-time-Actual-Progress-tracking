import { useState } from "react";
import { X } from "lucide-react";

export default function ActivityModal({ onClose, onAdd }) {
    const [form, setForm] = useState({
        id: "",
        name: "",
        site: "Section A",
        start: "",
        end: "",
        planned: 0,
        actual: 0,
        trust: 80,
        status: "On Track",
    });

    const update = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.id || !form.name || !form.start || !form.end) {
            return;
        }

        onAdd({
            ...form,
            planned: Number(form.planned),
            actual: Number(form.actual),
            trust: Number(form.trust),
            engineer: "Current User",
            capture: "Just now",
            location: "Not captured",
        });
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <div>
                        <p className="eyebrow">NEW WORK ITEM</p>
                        <h2>Add Activity</h2>
                    </div>

                    <button className="icon-btn" onClick={onClose}>
                        <X size={19} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <label>
                            Activity ID
                            <input
                                value={form.id}
                                onChange={(e) => update("id", e.target.value)}
                                placeholder="e.g. 8.4"
                            />
                        </label>

                        <label>
                            Activity Name
                            <input
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                placeholder="e.g. Pipe Welding"
                            />
                        </label>

                        <label>
                            Site
                            <select
                                value={form.site}
                                onChange={(e) => update("site", e.target.value)}
                            >
                                <option>Section A</option>
                                <option>Section B</option>
                                <option>Section C</option>
                                <option>Section D</option>
                            </select>
                        </label>

                        <label>
                            Status
                            <select
                                value={form.status}
                                onChange={(e) => update("status", e.target.value)}
                            >
                                <option>On Track</option>
                                <option>Delayed</option>
                                <option>Needs Review</option>
                                <option>AI Verified</option>
                            </select>
                        </label>

                        <label>
                            Planned Start
                            <input
                                type="date"
                                value={form.start}
                                onChange={(e) => update("start", e.target.value)}
                            />
                        </label>

                        <label>
                            Planned End
                            <input
                                type="date"
                                value={form.end}
                                onChange={(e) => update("end", e.target.value)}
                            />
                        </label>

                        <label>
                            Planned Progress (%)
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={form.planned}
                                onChange={(e) => update("planned", e.target.value)}
                            />
                        </label>

                        <label>
                            Actual Progress (%)
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={form.actual}
                                onChange={(e) => update("actual", e.target.value)}
                            />
                        </label>

                        <label>
                            Trust Score (%)
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={form.trust}
                                onChange={(e) => update("trust", e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="ghost-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="primary-btn">
                            Add Activity
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}