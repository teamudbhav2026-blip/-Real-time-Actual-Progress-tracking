import { useEffect, useRef, useState } from "react";

import {
    Camera,
    Clock3,
    Video,
    Square,
    CheckCircle2,
    ShieldCheck,
    Activity,
    Navigation,
    Wifi,
    BrainCircuit,
    ScanSearch,
    Mic2,
    Target,
} from "lucide-react";

export default function LiveCapture({
    activity,
    onClose,
    onSubmit,
}) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const recorderRef = useRef(null);
    const timerRef = useRef(null);
    const aiTimerRef = useRef(null);

    const [recording, setRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);

    const [location, setLocation] = useState(
        "Getting location..."
    );

    const [submitted, setSubmitted] = useState(false);
    const [aiProcessing, setAiProcessing] = useState(false);
    const [aiStep, setAiStep] = useState(0);
    const [aiComplete, setAiComplete] = useState(false);

    const aiSteps = [
        {
            title: "Video Analysis",
            description: "Processing field capture",
            icon: Video,
        },
        {
            title: "Object Detection",
            description: "Detecting construction objects",
            icon: ScanSearch,
        },
        {
            title: "Voice Matching",
            description: "Matching engineer activity",
            icon: Mic2,
        },
        {
            title: "Activity Matching",
            description: "Linking evidence to schedule",
            icon: Target,
        },
        {
            title: "Progress Estimation",
            description: "Estimating actual execution",
            icon: Activity,
        },
    ];

    useEffect(() => {
        startCamera();

        // GPS only — no geofencing
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    setLocation(
                        `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
                    );
                },
                () => {
                    setLocation("Location unavailable");
                }
            );
        } else {
            setLocation("Geolocation unavailable");
        }

        return () => {
            stopCamera();

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            if (aiTimerRef.current) {
                clearInterval(aiTimerRef.current);
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error(
                "Camera access error:",
                error
            );
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current
                .getTracks()
                .forEach((track) => track.stop());
        }
    };

    const startRecording = () => {
        if (!streamRef.current) {
            return;
        }

        const recorder = new MediaRecorder(
            streamRef.current
        );

        recorderRef.current = recorder;

        recorder.start();

        setRecording(true);
        setSeconds(0);

        timerRef.current = setInterval(() => {
            setSeconds((current) => {
                if (current >= 14) {
                    clearInterval(timerRef.current);

                    if (
                        recorderRef.current &&
                        recorderRef.current.state ===
                        "recording"
                    ) {
                        recorderRef.current.stop();
                    }

                    setRecording(false);

                    return 15;
                }

                return current + 1;
            });
        }, 1000);

        recorder.onstop = () => {
            setRecording(false);
        };
    };

    const stopRecording = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        if (
            recorderRef.current &&
            recorderRef.current.state === "recording"
        ) {
            recorderRef.current.stop();
        }

        setRecording(false);
    };

    const runAIProcessing = () => {
        setAiProcessing(true);
        setAiComplete(false);
        setAiStep(0);

        let currentStep = 0;

        aiTimerRef.current = setInterval(() => {
            currentStep += 1;

            if (currentStep < aiSteps.length) {
                setAiStep(currentStep);
            } else {
                clearInterval(aiTimerRef.current);

                setAiStep(aiSteps.length);
                setAiProcessing(false);
                setAiComplete(true);

                const estimatedActual = Math.min(
                    activity.planned,
                    activity.actual + 10
                );

                if (onSubmit) {
                    onSubmit(activity.id, {
                        actual: estimatedActual,
                        status: "AI Verified",
                        trust: 91,
                        captureTime:
                            new Date().toISOString(),
                        location,

                        aiResult: {
                            videoAnalyzed: true,

                            objectsDetected: [
                                "Construction Work",
                                "Equipment",
                                "Work Area",
                            ],

                            voiceMatch: 94,
                            activityMatch: 96,
                            estimatedProgress:
                                estimatedActual,
                            confidence: 93,
                            trustScore: 91,
                            result: "AI Verified",
                        },
                    });
                }
            }
        }, 900);
    };

    const submitCapture = () => {
        setSubmitted(true);

        stopRecording();
        stopCamera();

        runAIProcessing();
    };

    if (!activity) {
        return null;
    }

    return (
        <section className="live-capture-page">

            {/* HEADER */}

            <div className="capture-page-header">

                <div>
                    <div className="capture-breadcrumb">
                        ENGINEER WORKSPACE
                        <span>/</span>
                        FIELD CAPTURE
                    </div>

                    <h1>{activity.name}</h1>

                    <p>
                        Activity {activity.id} ·{" "}
                        {activity.site}
                    </p>
                </div>

                <button
                    className="ghost-btn"
                    onClick={onClose}
                    disabled={aiProcessing}
                >
                    Exit Capture
                </button>

            </div>

            {/* MAIN GRID */}

            <div className="capture-main-grid">

                {/* CAMERA */}

                <div className="capture-camera-card">

                    <div className="capture-camera-top">

                        <div>
                            <span className="camera-title">
                                <Camera size={17} />
                                Live Field Camera
                            </span>

                            <small>
                                Record actual work being
                                performed on site
                            </small>
                        </div>

                        <div className="camera-status">
                            <i />

                            {recording
                                ? "RECORDING"
                                : submitted
                                    ? "CAPTURE COMPLETE"
                                    : "CAMERA READY"}
                        </div>

                    </div>

                    <div className="camera-preview-large">

                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                        />

                        {!recording && !submitted && (
                            <div className="camera-ready-overlay">

                                <div className="camera-ready-icon">
                                    <Camera size={26} />
                                </div>

                                <strong>
                                    Camera ready
                                </strong>

                                <span>
                                    Start capture when
                                    the work area is
                                    visible
                                </span>

                            </div>
                        )}

                        {recording && (
                            <div className="recording-overlay">

                                <div className="recording-top">

                                    <span>
                                        <i />
                                        LIVE
                                    </span>

                                    <strong>
                                        00:
                                        {String(seconds).padStart(
                                            2,
                                            "0"
                                        )}
                                        {" / 00:15"}
                                    </strong>

                                </div>

                                <div className="recording-hint">
                                    Keep the camera moving
                                    around the work area
                                </div>

                            </div>
                        )}

                        {submitted && !aiComplete && (
                            <div className="capture-success-overlay">

                                <div>
                                    <BrainCircuit size={42} />
                                </div>

                                <strong>
                                    AI Processing Evidence
                                </strong>

                                <span>
                                    Analysing field capture...
                                </span>

                            </div>
                        )}

                        {aiComplete && (
                            <div className="capture-success-overlay">

                                <div>
                                    <CheckCircle2 size={42} />
                                </div>

                                <strong>
                                    AI Verification Complete
                                </strong>

                                <span>
                                    Evidence matched
                                    successfully
                                </span>

                            </div>
                        )}

                    </div>

                    {!submitted && (
                        <div className="camera-controls">

                            <div className="capture-timer">

                                <Clock3 size={16} />

                                <span>
                                    {recording
                                        ? `${seconds}s / 15s`
                                        : "15 second capture"}
                                </span>

                            </div>

                            {!recording ? (
                                <button
                                    className="primary-btn capture-start-btn"
                                    onClick={startRecording}
                                >
                                    <Video size={18} />
                                    Start Live Capture
                                </button>
                            ) : (
                                <button
                                    className="danger-btn capture-start-btn"
                                    onClick={stopRecording}
                                >
                                    <Square size={17} />
                                    Stop Recording
                                </button>
                            )}

                        </div>
                    )}

                </div>

                {/* SIDEBAR */}

                <div className="capture-sidebar">

                    {/* ACTIVITY */}

                    <div className="capture-info-card">

                        <div className="card-label">
                            <Activity size={15} />
                            ACTIVITY
                        </div>

                        <h3>{activity.name}</h3>

                        <div className="capture-progress-row">

                            <span>Planned</span>

                            <strong>
                                {activity.planned}%
                            </strong>

                        </div>

                        <div className="capture-progress-track">

                            <i
                                style={{
                                    width: `${activity.planned}%`,
                                }}
                            />

                        </div>

                    </div>

                    {/* FIELD SIGNALS */}

                    {!submitted && (
                        <div className="capture-info-card">

                            <div className="card-label">
                                FIELD SIGNALS
                            </div>

                            <div className="signal-row">

                                <div className="signal-icon">
                                    <Navigation size={16} />
                                </div>

                                <div>
                                    <span>
                                        GPS Location
                                    </span>

                                    <strong>
                                        {location}
                                    </strong>
                                </div>

                                <CheckCircle2 size={16} />

                            </div>

                            <div className="signal-row">

                                <div className="signal-icon">
                                    <Wifi size={16} />
                                </div>

                                <div>
                                    <span>
                                        Capture Mode
                                    </span>

                                    <strong>
                                        Live Camera
                                    </strong>
                                </div>

                                <CheckCircle2 size={16} />

                            </div>

                            <div className="signal-row">

                                <div className="signal-icon">
                                    <ShieldCheck size={16} />
                                </div>

                                <div>
                                    <span>
                                        Evidence Type
                                    </span>

                                    <strong>
                                        Field Proof
                                    </strong>
                                </div>

                                <CheckCircle2 size={16} />

                            </div>

                        </div>
                    )}

                    {/* AI PROCESSING */}

                    {submitted && (
                        <div className="capture-info-card ai-processing-card">

                            <div className="card-label">
                                <BrainCircuit size={15} />
                                AI VERIFICATION
                            </div>

                            <h3>
                                {aiComplete
                                    ? "Analysis Complete"
                                    : "Processing Evidence"}
                            </h3>

                            <div className="ai-capture-steps">

                                {aiSteps.map(
                                    (step, index) => {
                                        const Icon =
                                            step.icon;

                                        const completed =
                                            aiComplete ||
                                            index < aiStep;

                                        const active =
                                            !aiComplete &&
                                            index === aiStep;

                                        return (
                                            <div
                                                className={`ai-capture-step ${completed
                                                        ? "completed"
                                                        : active
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                key={
                                                    step.title
                                                }
                                            >

                                                <div className="ai-step-icon">
                                                    <Icon size={14} />
                                                </div>

                                                <div>

                                                    <strong>
                                                        {
                                                            step.title
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            step.description
                                                        }
                                                    </span>

                                                </div>

                                                {completed && (
                                                    <CheckCircle2
                                                        size={14}
                                                    />
                                                )}

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>
                    )}

                    {/* CHECKLIST */}

                    {!submitted && (
                        <div className="capture-info-card">

                            <div className="card-label">
                                CAPTURE CHECKLIST
                            </div>

                            <div className="check-item">
                                <CheckCircle2 size={16} />
                                Live camera enabled
                            </div>

                            <div className="check-item">
                                <CheckCircle2 size={16} />
                                GPS location detected
                            </div>

                            <div className="check-item">
                                <CheckCircle2 size={16} />
                                Activity linked
                            </div>

                            <div className="check-item">
                                <CheckCircle2 size={16} />
                                Timestamp recorded
                            </div>

                        </div>
                    )}

                    {/* SUBMIT */}

                    {!submitted ? (
                        <button
                            className="primary-btn evidence-submit-btn"
                            disabled={seconds === 0}
                            onClick={submitCapture}
                        >
                            <ShieldCheck size={18} />
                            Submit Evidence
                        </button>
                    ) : aiComplete ? (
                        <button
                            className="primary-btn evidence-submit-btn"
                            onClick={onClose}
                        >
                            <CheckCircle2 size={18} />
                            Return to Workspace
                        </button>
                    ) : (
                        <button
                            className="primary-btn evidence-submit-btn"
                            disabled
                        >
                            <BrainCircuit size={18} />
                            AI Processing...
                        </button>
                    )}

                </div>
            </div>
        </section>
    );
}