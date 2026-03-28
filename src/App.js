import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// GLOBAL STYLES — with glassmorphism, animations, transitions
// ============================================================
const GlobalStyles = ({ theme, accent }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:     ${theme === "dark" ? "#07090f" : "#f0f4f8"};
      --bg2:    ${theme === "dark" ? "#0d1117" : "#ffffff"};
      --bg3:    ${theme === "dark" ? "#161b24" : "#e8edf5"};
      --bg4:    ${theme === "dark" ? "#1e2633" : "#dce4ef"};
      --border: ${theme === "dark" ? "#2a3447" : "#c8d4e3"};
      --border2:${theme === "dark" ? "#3d4f6b" : "#a0b4cc"};
      --text:   ${theme === "dark" ? "#e8edf5" : "#0d1117"};
      --text2:  ${theme === "dark" ? "#8fa3c2" : "#4a5f7a"};
      --text3:  ${theme === "dark" ? "#4f6180" : "#7a90aa"};
      --glass:  ${theme === "dark" ? "rgba(13,17,23,0.7)" : "rgba(255,255,255,0.7)"};
      --accent: ${accent};
      --accent2:${accent}cc;
      --accent3:${accent}88;
      --green:  #22d3a0;
      --red:    #f43f5e;
      --orange: #f97316;
      --purple: #a78bfa;
      --yellow: #fbbf24;
      --glow:   0 0 28px ${accent}30;
    }
    html { scroll-behavior: smooth; }
    body { font-family: 'Syne', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; transition: background 0.4s, color 0.4s; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
    .mono { font-family: 'JetBrains Mono', monospace; }

    input, textarea, select {
      font-family: 'Syne', sans-serif; background: var(--bg3); border: 1px solid var(--border);
      color: var(--text); border-radius: 8px; padding: 10px 14px; font-size: 14px; outline: none; width: 100%;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus, textarea:focus, select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px ${accent}20; }
    select option { background: var(--bg3); color: var(--text); }
    button { font-family: 'Syne', sans-serif; cursor: pointer; border: none; outline: none; transition: all 0.2s; }

    .btn-primary { background: var(--accent); color: #fff; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 600; }
    .btn-primary:hover { filter: brightness(1.15); transform: translateY(-1px); box-shadow: var(--glow); }
    .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 500; }
    .btn-ghost:hover { border-color: var(--accent); color: var(--accent); background: ${accent}10; }
    .btn-danger { background: rgba(244,63,94,0.12); color: var(--red); border: 1px solid rgba(244,63,94,0.25); border-radius: 8px; padding: 8px 16px; font-size: 13px; }
    .btn-danger:hover { background: rgba(244,63,94,0.22); }

    /* Glassmorphism card */
    .card {
      background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 20px;
      transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
    }
    .card-glass {
      background: var(--glass); border: 1px solid var(--border); border-radius: 14px; padding: 20px;
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      transition: all 0.3s;
    }
    .card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.15); }

    .section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text3); margin-bottom: 16px; }
    .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; }
    .tag { display: inline-block; background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; padding: 2px 8px; font-size: 11px; color: var(--text2); margin: 2px; }
    .notif-dot { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: var(--red); border-radius: 50%; border: 2px solid var(--bg2); animation: pulse 2s infinite; }

    input[type=range] { -webkit-appearance: none; appearance: none; height: 4px; background: var(--border); border-radius: 2px; border: none; padding: 0; cursor: pointer; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--accent); cursor: pointer; }

    /* PAGE TRANSITION */
    .page-enter { animation: pageEnter 0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
    @keyframes pageEnter { from { opacity: 0; transform: translateY(18px) scale(0.985); } to { opacity: 1; transform: translateY(0) scale(1); } }

    /* STAGGERED CHILDREN */
    .stagger > * { animation: staggerIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
    .stagger > *:nth-child(1) { animation-delay: 0.04s; }
    .stagger > *:nth-child(2) { animation-delay: 0.09s; }
    .stagger > *:nth-child(3) { animation-delay: 0.14s; }
    .stagger > *:nth-child(4) { animation-delay: 0.19s; }
    .stagger > *:nth-child(5) { animation-delay: 0.24s; }
    .stagger > *:nth-child(6) { animation-delay: 0.29s; }
    @keyframes staggerIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

    /* PULSE */
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

    /* SHIMMER SKELETON */
    .skeleton { background: linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    /* TOOLTIP */
    .tooltip-wrap { position: relative; display: inline-flex; }
    .tooltip-wrap .tooltip {
      position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
      background: #1e2633; color: #e8edf5; padding: 5px 10px; border-radius: 6px;
      font-size: 11px; white-space: nowrap; pointer-events: none; opacity: 0;
      transition: opacity 0.18s; z-index: 999; border: 1px solid #2a3447;
    }
    .tooltip-wrap:hover .tooltip { opacity: 1; }

    /* SIDEBAR HOVER GLOW */
    .nav-item:hover { background: ${accent}10 !important; color: ${accent} !important; }

    /* PROGRESS RING ANIMATION */
    @keyframes ringFill { from { stroke-dashoffset: 283; } }

    /* MILESTONE CELEBRATE */
    @keyframes celebrate { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
    .celebrate { animation: celebrate 0.5s ease; }

    /* CARD HOVER LIFT */
    .card-hover { transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s; }
    .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.22); border-color: var(--border2) !important; }
  `}</style>
);

// ============================================================
// DATA — 2026 dates, real team
// ============================================================
const INITIAL_USER = { id: "u1", name: "Ayush Nagdive", email: "ayushnn@devplan.io", role: "Team Lead", avatar: "AN" };

const SAMPLE_PROJECTS = [
  { id: "p1", name: "E-Commerce Platform", description: "Full-stack marketplace with real-time features", domain: "Web", teamSize: 4, kloc: 45, complexity: "Semi-Detached", stack: ["React", "Python", "MongoDB"], model: "Agile", status: "active", created: "2026-01-05", progress: 68 },
  { id: "p2", name: "Banking Core System", description: "Mission-critical financial transaction system", domain: "Finance", teamSize: 4, kloc: 80, complexity: "Embedded", stack: ["Java", "Spring", "Oracle"], model: "Waterfall", status: "active", created: "2026-02-01", progress: 34 },
  { id: "p3", name: "Analytics Dashboard", description: "Data visualization and reporting platform", domain: "Data", teamSize: 4, kloc: 18, complexity: "Organic", stack: ["React", "Python", "PostgreSQL"], model: "Incremental", status: "completed", created: "2026-01-15", progress: 100 },
];

const SAMPLE_TASKS = [
  { id: "t1", title: "Design database schema", projectId: "p1", assignee: "Nikhil Shirbhate", priority: "High", status: "Completed", deadline: "2026-01-20", phase: "Design", storyPoints: 5, sprint: "Sprint 1" },
  { id: "t2", title: "Implement auth middleware", projectId: "p1", assignee: "Ayush Nagdive", priority: "High", status: "In Progress", deadline: "2026-02-10", phase: "Development", storyPoints: 8, sprint: "Sprint 1" },
  { id: "t3", title: "Write API documentation", projectId: "p1", assignee: "Nikhil Shirbhate", priority: "Medium", status: "To Do", deadline: "2026-02-20", phase: "Development", storyPoints: 3, sprint: "Sprint 2" },
  { id: "t4", title: "Unit testing for checkout", projectId: "p1", assignee: "Mayur Waghmare", priority: "High", status: "Testing", deadline: "2026-02-28", phase: "Testing", storyPoints: 5, sprint: "Sprint 2" },
  { id: "t5", title: "Build product listing UI", projectId: "p1", assignee: "Shreya Deshmukh", priority: "Medium", status: "In Progress", deadline: "2026-02-15", phase: "Development", storyPoints: 8, sprint: "Sprint 1" },
  { id: "t6", title: "Requirement elicitation", projectId: "p2", assignee: "Nikhil Shirbhate", priority: "Critical", status: "Completed", deadline: "2026-01-25", phase: "Requirements", storyPoints: 13, sprint: "Sprint 1" },
  { id: "t7", title: "System architecture design", projectId: "p2", assignee: "Ayush Nagdive", priority: "Critical", status: "In Progress", deadline: "2026-03-10", phase: "Design", storyPoints: 13, sprint: "Sprint 1" },
  { id: "t8", title: "Frontend dashboard components", projectId: "p3", assignee: "Shreya Deshmukh", priority: "High", status: "Completed", deadline: "2026-02-05", phase: "Development", storyPoints: 8, sprint: "Sprint 1" },
  { id: "t9", title: "API endpoint testing", projectId: "p2", assignee: "Mayur Waghmare", priority: "High", status: "To Do", deadline: "2026-03-20", phase: "Testing", storyPoints: 5, sprint: "Sprint 2" },
];

const SAMPLE_RISKS = [
  { id: "r1", title: "Key developer turnover", projectId: "p1", description: "Risk of losing senior engineers mid-project", probability: 0.3, impact: 4, category: "Resource", status: "Active" },
  { id: "r2", title: "Scope creep", projectId: "p1", description: "Undefined requirements may expand project scope", probability: 0.6, impact: 3, category: "Scope", status: "Active" },
  { id: "r3", title: "Third-party API instability", projectId: "p1", description: "Payment gateway may have downtime", probability: 0.2, impact: 5, category: "Technical", status: "Mitigated" },
  { id: "r4", title: "Regulatory compliance delay", projectId: "p2", description: "Banking regulations may require rework", probability: 0.4, impact: 5, category: "Legal", status: "Active" },
  { id: "r5", title: "Data migration complexity", projectId: "p2", description: "Legacy system migration may be complex", probability: 0.5, impact: 4, category: "Technical", status: "Active" },
];

const SAMPLE_TEAM = [
  { id: "m1", name: "Ayush Nagdive",   role: "Team Lead & Backend", email: "Ayush@gmail.com",  skills: ["Python", "AI/ML", "FastAPI"],         availability: 100, projects: ["p1","p2"], avatar: "AN", joined: "2026-01-10" },
  { id: "m2", name: "Mayur Waghmare",  role: "QA Engineer",         email: "mayur@gmail.com",  skills: ["Selenium", "JavaScript", "Postman"],  availability: 80,  projects: ["p1","p2"], avatar: "MW", joined: "2026-01-15" },
  { id: "m3", name: "Nikhil Shirbhate",role: "Business Analyst",    email: "nikhil@gmail.com", skills: ["Microsoft Excel", "Jira", "UML"],     availability: 70,  projects: ["p2"],      avatar: "NS", joined: "2026-02-01" },
  { id: "m4", name: "Shreya Deshmukh", role: "Frontend Developer",  email: "shreya@gmail.com", skills: ["React", "JavaScript", "Figma"],       availability: 90,  projects: ["p1","p3"], avatar: "SD", joined: "2026-01-20" },
];

const SAMPLE_SPRINTS = [
  { id: "s1", name: "Sprint 1", projectId: "p1", startDate: "2026-01-05", endDate: "2026-01-19", velocity: 21, planned: 21, status: "Completed" },
  { id: "s2", name: "Sprint 2", projectId: "p1", startDate: "2026-01-20", endDate: "2026-02-03", velocity: 16, planned: 18, status: "Active" },
  { id: "s3", name: "Sprint 3", projectId: "p1", startDate: "2026-02-04", endDate: "2026-02-18", velocity: 0,  planned: 16, status: "Planned" },
];

const SAMPLE_MILESTONES = [
  { id: "ml1", title: "Project Kickoff", projectId: "p1", date: "2026-01-05", achieved: true,  description: "Team assembled, requirements locked" },
  { id: "ml2", title: "MVP Backend Ready", projectId: "p1", date: "2026-02-10", achieved: true,  description: "Core APIs live and tested" },
  { id: "ml3", title: "Frontend Beta", projectId: "p1", date: "2026-03-01", achieved: false, description: "UI complete, user testing begins" },
  { id: "ml4", title: "Production Release", projectId: "p1", date: "2026-03-25", achieved: false, description: "Full deployment to production" },
  { id: "ml5", title: "Requirements Sign-off", projectId: "p2", date: "2026-01-25", achieved: true,  description: "All stakeholders approved" },
  { id: "ml6", title: "Architecture Review", projectId: "p2", date: "2026-03-10", achieved: false, description: "Technical design review complete" },
];

const SAMPLE_NOTIFICATIONS = [
  { id: "n1", type: "warning", message: "Task 'Unit testing for checkout' due in 2 days", time: "2h ago", read: false },
  { id: "n2", type: "risk",    message: "High risk 'Scope creep' needs attention on E-Commerce", time: "5h ago", read: false },
  { id: "n3", type: "success", message: "Sprint 1 completed — 21/21 story points ✅", time: "1d ago", read: false },
  { id: "n4", type: "info",    message: "Shreya Deshmukh completed 'Frontend dashboard components'", time: "2d ago", read: true },
  { id: "n5", type: "warning", message: "Banking Core System budget may exceed estimate by 12%", time: "3d ago", read: true },
];

const ACCENT_COLORS = ["#3b82f6","#22d3a0","#a78bfa","#f97316","#f43f5e","#fbbf24"];

// ============================================================
// ICONS
// ============================================================
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    dashboard:<path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    project:  <path d="M2 7l10-5 10 5v10l-10 5L2 17V7z" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    sdlc:     <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    estimate: <path d="M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-3M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M9 7h6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    task:     <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6m-3 4v6m-3-3h6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    risk:     <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    analytics:<path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    report:   <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    logout:   <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    plus:     <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round"/>,
    trash:    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    edit:     <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    check:    <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    user:     <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    compare:  <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    timeline: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    budget:   <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    close:    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>,
    moon:     <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    sun:      <><circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" fill="none"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    bell:     <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    search:   <><circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.5" fill="none"/><path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    team:     <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    sprint:   <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    calendar: <path d="M3 4h18v18H3zM16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    burn:     <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4l3 3" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    velocity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    evm:      <path d="M21 21H3V3M7 16l4-8 4 4 4-6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    milestone:<path d="M3 12l18-9-9 18-2-8-7-1z" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    palette:  <><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none"/><circle cx="8" cy="10" r="1.5" fill={color}/><circle cx="12" cy="8" r="1.5" fill={color}/><circle cx="16" cy="10" r="1.5" fill={color}/><circle cx="16" cy="14" r="1.5" fill={color}/><circle cx="8" cy="14" r="1.5" fill={color}/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display:"inline-block", verticalAlign:"middle", flexShrink:0 }}>{icons[name]||null}</svg>;
};

// ============================================================
// ANIMATED COUNTER — counts up on mount
// ============================================================
const AnimatedCounter = ({ target, duration = 900, color, suffix = "" }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const isFloat = String(target).includes(".");
    const num = parseFloat(target) || 0;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal(isFloat ? (num * ease).toFixed(1) : Math.round(num * ease));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <span style={{ color }}>{val}{suffix}</span>;
};

// ============================================================
// PROGRESS RING — animated SVG ring
// ============================================================
const ProgressRing = ({ pct, size = 80, stroke = 7, color = "var(--accent)", label, sublabel }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg3)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)", animation:"ringFill 1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      {label && <div style={{ fontSize:13, fontWeight:700, marginTop:-4 }}>{label}</div>}
      {sublabel && <div style={{ fontSize:10, color:"var(--text3)" }}>{sublabel}</div>}
    </div>
  );
};

// ============================================================
// TOOLTIP WRAPPER
// ============================================================
const Tip = ({ text, children }) => (
  <div className="tooltip-wrap" style={{ display:"inline-flex" }}>
    {children}
    <div className="tooltip">{text}</div>
  </div>
);

// ============================================================
// CHARTS
// ============================================================
const MiniBarChart = ({ data, colors, height = 60 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"), w = c.width, h = c.height;
    ctx.clearRect(0,0,w,h);
    const max = Math.max(...data.map(d=>d.value),1);
    const bw = (w - data.length*6)/data.length;
    let frame = 0;
    const animate = () => {
      frame = Math.min(frame+0.06, 1);
      ctx.clearRect(0,0,w,h);
      data.forEach((d,i) => {
        const bh = (d.value/max)*(h-20)*frame, x=i*(bw+6), y=h-bh-10;
        const g = ctx.createLinearGradient(0,y,0,h);
        g.addColorStop(0, colors[i%colors.length]+"dd");
        g.addColorStop(1, colors[i%colors.length]+"22");
        ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(x,y,bw,bh,4); ctx.fill();
      });
      if (frame<1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [data, colors]);
  return <canvas ref={ref} width={300} height={height} style={{width:"100%",height}} />;
};

const PieChart = ({ data, size=140 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"), cx=size/2, cy=size/2, r=size/2-10;
    const total = data.reduce((s,d)=>s+d.value,0);
    let frame = 0;
    const animate = () => {
      frame = Math.min(frame+0.06, 1);
      ctx.clearRect(0,0,size,size);
      let angle = -Math.PI/2;
      data.forEach(d => {
        const sweep = (d.value/total)*Math.PI*2*frame;
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,angle,angle+sweep); ctx.closePath();
        ctx.fillStyle=d.color; ctx.fill();
        ctx.strokeStyle="var(--bg)"; ctx.lineWidth=2; ctx.stroke();
        angle += sweep;
      });
      ctx.beginPath(); ctx.arc(cx,cy,r*0.55,0,Math.PI*2); ctx.fillStyle="var(--bg2)"; ctx.fill();
      if (frame<1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [data, size]);
  return <canvas ref={ref} width={size} height={size} />;
};

const RadarChart = ({ data, size=200 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"), cx=size/2, cy=size/2, r=size/2-30;
    ctx.clearRect(0,0,size,size);
    const n = data[0]?.labels?.length||5, labels=data[0]?.labels||[];
    const angles = labels.map((_,i)=>(i/n)*Math.PI*2-Math.PI/2);
    [0.25,0.5,0.75,1].forEach(s=>{
      ctx.beginPath();
      angles.forEach((a,i)=>{const x=cx+Math.cos(a)*r*s,y=cy+Math.sin(a)*r*s; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
      ctx.closePath(); ctx.strokeStyle="var(--border)"; ctx.lineWidth=1; ctx.stroke();
    });
    angles.forEach(a=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.strokeStyle="var(--border)";ctx.lineWidth=1;ctx.stroke();});
    data.forEach(s=>{
      ctx.beginPath();
      s.values.forEach((val,i)=>{const x=cx+Math.cos(angles[i])*r*val,y=cy+Math.sin(angles[i])*r*val;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
      ctx.closePath(); ctx.fillStyle=s.color+"33"; ctx.fill(); ctx.strokeStyle=s.color; ctx.lineWidth=2; ctx.stroke();
    });
    ctx.fillStyle="var(--text2)"; ctx.font="11px Syne,sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
    labels.forEach((l,i)=>{const x=cx+Math.cos(angles[i])*(r+18),y=cy+Math.sin(angles[i])*(r+18);ctx.fillText(l,x,y);});
  }, [data, size]);
  return <canvas ref={ref} width={size} height={size} style={{display:"block"}} />;
};

const LineChart = ({ datasets, labels, height=160 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"), w=c.width, h=c.height;
    ctx.clearRect(0,0,w,h);
    const pad={t:10,r:10,b:30,l:35}, cw=w-pad.l-pad.r, ch=h-pad.t-pad.b;
    const allVals=datasets.flatMap(d=>d.values);
    const maxV=Math.max(...allVals,1);
    const xStep=cw/Math.max(labels.length-1,1);
    [0,0.25,0.5,0.75,1].forEach(f=>{
      const y=pad.t+ch*(1-f);
      ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cw,y);
      ctx.strokeStyle="rgba(42,52,71,0.5)";ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle="#4f6180";ctx.font="9px Syne";ctx.textAlign="right";
      ctx.fillText(Math.round(maxV*f),pad.l-4,y+3);
    });
    ctx.fillStyle="#4f6180";ctx.font="9px Syne";ctx.textAlign="center";
    labels.forEach((l,i)=>ctx.fillText(l,pad.l+i*xStep,h-8));
    datasets.forEach(ds=>{
      ctx.beginPath();
      ds.values.forEach((v,i)=>{const x=pad.l+i*xStep,y=pad.t+ch*(1-v/maxV);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
      ctx.strokeStyle=ds.color;ctx.lineWidth=2.5;ctx.stroke();
      ctx.beginPath();
      ds.values.forEach((v,i)=>{const x=pad.l+i*xStep,y=pad.t+ch*(1-v/maxV);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
      ctx.lineTo(pad.l+(ds.values.length-1)*xStep,pad.t+ch);ctx.lineTo(pad.l,pad.t+ch);ctx.closePath();
      ctx.fillStyle=ds.color+"18";ctx.fill();
      ds.values.forEach((v,i)=>{
        const x=pad.l+i*xStep,y=pad.t+ch*(1-v/maxV);
        ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle=ds.color;ctx.fill();
        ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();
      });
    });
  }, [datasets, labels, height]);
  return <canvas ref={ref} width={500} height={height} style={{width:"100%",height}} />;
};

const GanttChart = ({ phases }) => {
  const total = phases.reduce((s,p)=>s+p.duration,0);
  const colors = ["#3b82f6","#22d3a0","#f97316","#a78bfa","#fbbf24","#f43f5e"];
  return (
    <div style={{overflowX:"auto"}}>
      <div style={{minWidth:500}}>
        {phases.map((ph,i)=>{
          const offset=phases.slice(0,i).reduce((s,p)=>s+p.duration,0);
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:130,fontSize:12,color:"var(--text2)",textAlign:"right",flexShrink:0}}>{ph.name}</div>
              <div style={{flex:1,background:"var(--bg3)",borderRadius:6,height:28,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",left:`${(offset/total)*100}%`,width:`${(ph.duration/total)*100}%`,height:"100%",background:colors[i%colors.length]+"cc",borderRadius:6,display:"flex",alignItems:"center",paddingLeft:8,fontSize:11,color:"#fff",fontWeight:600,transition:"width 0.8s cubic-bezier(0.22,1,0.36,1)"}}>{ph.duration}w</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// STAT CARD — with animated counter
// ============================================================
const StatCard = ({ label, value, sub, color="var(--accent)", icon, animate=true }) => {
  const num = parseFloat(String(value).replace(/[^0-9.]/g,""));
  const prefix = String(value).match(/^\$/) ? "$" : "";
  const suffix = String(value).match(/%$/) ? "%" : String(value).match(/k$/) ? "k" : "";
  return (
    <div className="card card-hover" style={{flex:1,minWidth:150}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:11,color:"var(--text3)",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{label}</div>
          <div style={{fontSize:28,fontWeight:800,letterSpacing:"-0.03em",color}}>
            {prefix}{animate && !isNaN(num) ? <AnimatedCounter target={num} color={color} suffix={suffix} /> : value}
          </div>
          {sub && <div style={{fontSize:12,color:"var(--text3)",marginTop:4}}>{sub}</div>}
        </div>
        {icon && <div style={{width:36,height:36,background:color+"18",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={icon} size={18} color={color}/></div>}
      </div>
    </div>
  );
};

// ============================================================
// NOTIFICATIONS PANEL
// ============================================================
const NotificationsPanel = ({ notifications, setNotifications, onClose }) => {
  const unread = notifications.filter(n=>!n.read).length;
  const typeColors={warning:"var(--orange)",risk:"var(--red)",success:"var(--green)",info:"var(--accent)"};
  const typeIcons={warning:"⚠️",risk:"🔴",success:"✅",info:"ℹ️"};
  return (
    <div style={{position:"fixed",top:60,right:20,width:340,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,boxShadow:"0 20px 40px rgba(0,0,0,0.4)",zIndex:1000,animation:"pageEnter 0.25s ease"}}>
      <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontWeight:700,fontSize:14}}>Notifications {unread>0&&<span className="badge" style={{background:"var(--red)",color:"#fff",marginLeft:6}}>{unread}</span>}</div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-ghost" style={{padding:"4px 10px",fontSize:11}} onClick={()=>setNotifications(p=>p.map(n=>({...n,read:true})))}>Mark all read</button>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
        </div>
      </div>
      <div style={{maxHeight:360,overflowY:"auto"}}>
        {notifications.map(n=>(
          <div key={n.id} onClick={()=>setNotifications(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))} style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",cursor:"pointer",background:n.read?"transparent":"rgba(59,130,246,0.04)",transition:"background 0.2s"}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:16}}>{typeIcons[n.type]}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,lineHeight:1.5,color:n.read?"var(--text2)":"var(--text)"}}>{n.message}</div>
                <div style={{fontSize:11,color:"var(--text3)",marginTop:3}}>{n.time}</div>
              </div>
              {!n.read&&<div style={{width:6,height:6,borderRadius:"50%",background:typeColors[n.type],flexShrink:0,marginTop:5}}/>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// GLOBAL SEARCH
// ============================================================
const SearchPanel = ({ projects, tasks, risks, team, onClose, onNav }) => {
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(()=>{ ref.current?.focus(); },[]);
  const results = q.trim().length<2 ? [] : [
    ...projects.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())).map(p=>({type:"Project",label:p.name,sub:p.description,icon:"project",nav:"projects",color:"var(--accent)"})),
    ...tasks.filter(t=>t.title.toLowerCase().includes(q.toLowerCase())).map(t=>({type:"Task",label:t.title,sub:t.assignee+" · "+t.status,icon:"task",nav:"tasks",color:"var(--green)"})),
    ...risks.filter(r=>r.title.toLowerCase().includes(q.toLowerCase())).map(r=>({type:"Risk",label:r.title,sub:r.category,icon:"risk",nav:"risks",color:"var(--red)"})),
    ...team.filter(m=>m.name.toLowerCase().includes(q.toLowerCase())).map(m=>({type:"Member",label:m.name,sub:m.role,icon:"user",nav:"team",color:"var(--purple)"})),
  ];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:2000,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:80}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:560,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden",boxShadow:"0 30px 60px rgba(0,0,0,0.5)",animation:"pageEnter 0.22s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:"1px solid var(--border)"}}>
          <Icon name="search" size={16} color="var(--text3)"/>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search projects, tasks, risks, team..." style={{border:"none",background:"transparent",fontSize:15,flex:1,padding:0}}/>
          <kbd style={{padding:"2px 6px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:4,fontSize:11,color:"var(--text3)"}}>ESC</kbd>
        </div>
        {q.trim().length>=2 ? (
          <div style={{maxHeight:380,overflowY:"auto"}}>
            {results.length===0 ? <div style={{padding:24,textAlign:"center",color:"var(--text3)",fontSize:13}}>No results for "{q}"</div>
            : results.map((r,i)=>(
              <div key={i} onClick={()=>{onNav(r.nav);onClose();}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:"1px solid var(--border)",cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--bg3)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:32,height:32,borderRadius:8,background:r.color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={r.icon} size={15} color={r.color}/></div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{r.label}</div><div style={{fontSize:11,color:"var(--text3)"}}>{r.sub}</div></div>
                <span className="badge" style={{background:r.color+"18",color:r.color}}>{r.type}</span>
              </div>
            ))}
          </div>
        ):(
          <div style={{padding:16,display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Projects","Tasks","Risks","Team"].map(h=>(
              <button key={h} onClick={()=>setQ(h.toLowerCase())} style={{padding:"6px 12px",borderRadius:20,background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text2)",fontSize:12,cursor:"pointer"}}>🔍 {h}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// SIDEBAR
// ============================================================
const Sidebar = ({ current, onNav, user, onLogout, theme, setTheme, accent, setAccent }) => {
  const items = [
    {id:"dashboard",label:"Dashboard",icon:"dashboard"},
    {id:"projects",label:"Projects",icon:"project"},
    {id:"team",label:"Team",icon:"team"},
    {id:"sdlc",label:"SDLC Simulator",icon:"sdlc"},
    {id:"estimate",label:"COCOMO",icon:"estimate"},
    {id:"threepoint",label:"3-Point PERT",icon:"evm"},
    {id:"compare",label:"Model Compare",icon:"compare"},
    {id:"timeline",label:"Timeline",icon:"timeline"},
    {id:"sprint",label:"Sprint Board",icon:"sprint"},
    {id:"tasks",label:"Task Manager",icon:"task"},
    {id:"risks",label:"Risk Analysis",icon:"risk"},
    {id:"budget",label:"Budget",icon:"budget"},
    {id:"burndown",label:"Burndown",icon:"burn"},
    {id:"velocity",label:"Velocity & EVM",icon:"velocity"},
    {id:"milestones",label:"Milestones",icon:"milestone"},
    {id:"calendar",label:"Calendar",icon:"calendar"},
    {id:"analytics",label:"Analytics",icon:"analytics"},
    {id:"reports",label:"Reports",icon:"report"},
  ];
  return (
    <div style={{width:210,flexShrink:0,background:"var(--bg2)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,overflow:"hidden"}}>
      <div style={{padding:"14px 12px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,background:"var(--accent)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 0 12px var(--accent)44"}}>
          <span style={{color:"#fff",fontWeight:800,fontSize:15}}>D</span>
        </div>
        <div>
          <div style={{fontWeight:800,fontSize:13,letterSpacing:"-0.02em"}}>DevPlan Pro</div>
          <div style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.08em"}}>ENGINEERING SUITE v3</div>
        </div>
      </div>
      <nav style={{flex:1,padding:"8px 5px",overflowY:"auto"}}>
        {items.map(item=>(
          <button key={item.id} className="nav-item" onClick={()=>onNav(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:7,marginBottom:1,background:current===item.id?"var(--accent)18":"transparent",color:current===item.id?"var(--accent)":"var(--text2)",border:"1px solid "+(current===item.id?"var(--accent)33":"transparent"),fontSize:11.5,fontWeight:current===item.id?700:400,transition:"all 0.15s",textAlign:"left",cursor:"pointer"}}>
            <Icon name={item.icon} size={13} color={current===item.id?"var(--accent)":"var(--text3)"}/>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{padding:"8px 5px",borderTop:"1px solid var(--border)"}}>
        {/* Accent color picker */}
        <div style={{padding:"6px 9px",marginBottom:4}}>
          <div style={{fontSize:10,color:"var(--text3)",marginBottom:5,letterSpacing:"0.06em",textTransform:"uppercase"}}>Accent Color</div>
          <div style={{display:"flex",gap:5}}>
            {ACCENT_COLORS.map(c=>(
              <Tip key={c} text={c}>
                <button onClick={()=>setAccent(c)} style={{width:18,height:18,borderRadius:"50%",background:c,border:`2px solid ${accent===c?"#fff":"transparent"}`,cursor:"pointer",padding:0,transition:"transform 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.3)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
              </Tip>
            ))}
          </div>
        </div>
        <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:7,background:"var(--bg3)",border:"1px solid var(--border)",color:"var(--text2)",fontSize:11.5,cursor:"pointer",marginBottom:3}}>
          <Icon name={theme==="dark"?"sun":"moon"} size={13}/>{theme==="dark"?"Light Mode":"Dark Mode"}
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 9px"}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,var(--accent),var(--purple))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{user.avatar}</div>
          <div style={{overflow:"hidden"}}><div style={{fontSize:11.5,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div><div style={{fontSize:10,color:"var(--text3)"}}>{user.role}</div></div>
        </div>
        <button onClick={onLogout} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"6px 9px",borderRadius:7,background:"transparent",color:"var(--text3)",fontSize:11.5,border:"none",cursor:"pointer"}}>
          <Icon name="logout" size={13}/> Sign out
        </button>
      </div>
    </div>
  );
};

// ============================================================
// LOGIN
// ============================================================
const LoginScreen = ({ onLogin, theme, accent }) => {
  const [isReg,setIsReg]=useState(false);
  const [form,setForm]=useState({email:"ayushnn@devplan.io",password:"password123",name:""});
  const [loading,setLoading]=useState(false);
  const handle=async()=>{setLoading(true);await new Promise(r=>setTimeout(r,700));setLoading(false);onLogin(INITIAL_USER);};
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",backgroundImage:`radial-gradient(ellipse at 20% 50%, ${accent}12 0%,transparent 60%), radial-gradient(ellipse at 80% 20%, ${accent}08 0%,transparent 50%)`}}>
      {/* Animated grid */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",opacity:0.4}}>
        {[...Array(12)].map((_,i)=><div key={i} style={{position:"absolute",left:`${(i%4)*25+5}%`,top:`${Math.floor(i/4)*33+10}%`,width:1,height:`${50+i*8}px`,background:`linear-gradient(180deg,transparent,${accent}44,transparent)`,animation:`pulse ${2+i*0.3}s ${i*0.2}s infinite`}}/>)}
      </div>
      <div className="page-enter" style={{width:"100%",maxWidth:400,padding:"0 20px",position:"relative"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:12,padding:"10px 20px",marginBottom:18,boxShadow:`0 0 20px ${accent}20`}}>
            <div style={{width:28,height:28,background:"var(--accent)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 12px ${accent}66`}}><span style={{color:"#fff",fontWeight:800,fontSize:14}}>D</span></div>
            <span style={{fontWeight:800,fontSize:17,letterSpacing:"-0.02em"}}>DevPlan Pro</span>
          </div>
          <h1 style={{fontSize:24,fontWeight:800,letterSpacing:"-0.03em",marginBottom:6}}>{isReg?"Create account":"Welcome back"}</h1>
          <p style={{color:"var(--text2)",fontSize:13}}>Software Engineering Planning Suite v3</p>
        </div>
        <div className="card" style={{padding:26}}>
          {isReg&&<div style={{marginBottom:14}}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>NAME</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name"/></div>}
          <div style={{marginBottom:14}}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>EMAIL</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div style={{marginBottom:18}}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>PASSWORD</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
          <button className="btn-primary" style={{width:"100%",padding:12}} onClick={handle} disabled={loading}>{loading?"Authenticating...":isReg?"Register":"Sign In"}</button>
          <p style={{textAlign:"center",marginTop:14,fontSize:12,color:"var(--text3)"}}>{isReg?"Have an account? ":"New here? "}<span style={{color:"var(--accent)",cursor:"pointer",fontWeight:600}} onClick={()=>setIsReg(!isReg)}>{isReg?"Sign in":"Register"}</span></p>
        </div>
        <p style={{textAlign:"center",marginTop:12,fontSize:11,color:"var(--text3)"}}>Demo: ayushnn@devplan.io / password123</p>
      </div>
    </div>
  );
};

// ============================================================
// DASHBOARD
// ============================================================
const DashboardPage = ({ projects, tasks, risks, team }) => {
  const effortData=[{label:"Req",value:15,color:"#3b82f6"},{label:"Design",value:20,color:"#22d3a0"},{label:"Dev",value:40,color:"#f97316"},{label:"Test",value:18,color:"#a78bfa"},{label:"Maint",value:7,color:"#fbbf24"}];
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Engineering Dashboard</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Real-time overview — March 2026</p></div>
      <div className="stagger" style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:20}}>
        <StatCard label="Active Projects" value={projects.filter(p=>p.status==="active").length} sub="Jan–Mar 2026" color="var(--accent)" icon="project"/>
        <StatCard label="Open Tasks" value={tasks.filter(t=>t.status!=="Completed").length} sub="Across all projects" color="var(--green)" icon="task"/>
        <StatCard label="High Risks" value={risks.filter(r=>r.probability*r.impact>=2).length} sub="Needs attention" color="var(--red)" icon="risk"/>
        <StatCard label="Team Members" value={team.length} sub="Active contributors" color="var(--purple)" icon="team"/>
      </div>

      {/* Progress Rings */}
      <div className="card" style={{marginBottom:18}}>
        <div className="section-title">Project Completion Rings</div>
        <div className="stagger" style={{display:"flex",gap:32,justifyContent:"center",padding:"10px 0",flexWrap:"wrap"}}>
          {projects.map((p,i)=>(
            <div key={p.id} style={{textAlign:"center"}}>
              <ProgressRing pct={p.progress} size={90} color={["var(--accent)","var(--green)","var(--purple)"][i%3]} label={p.progress+"%"} sublabel={p.name.split(" ")[0]}/>
              <div style={{fontSize:11,color:"var(--text2)",marginTop:6,maxWidth:80}}>{p.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        <div className="card"><div className="section-title">Project Progress</div><MiniBarChart data={projects.map(p=>({label:p.name.split(" ")[0],value:p.progress}))} colors={["#3b82f6","#22d3a0","#f97316"]} height={90}/></div>
        <div className="card" style={{display:"flex",flexDirection:"column"}}>
          <div className="section-title">Effort Distribution</div>
          <div style={{display:"flex",alignItems:"center",gap:16,flex:1}}>
            <PieChart data={effortData} size={110}/>
            <div style={{flex:1}}>{effortData.map(d=>(<div key={d.label} style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}><span style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:2,background:d.color}}/>{d.label}</span><span style={{fontWeight:600,color:d.color}}>{d.value}%</span></div>))}</div>
          </div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card">
          <div className="section-title">Recent Projects</div>
          {projects.map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
              <div><div style={{fontSize:13,fontWeight:600}}>{p.name}</div><div style={{fontSize:11,color:"var(--text3)"}}>{p.model} · {p.teamSize} devs · {p.created}</div></div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:700,color:p.progress===100?"var(--green)":"var(--accent)"}}>{p.progress}%</div>
                <div style={{width:60,height:3,background:"var(--border)",borderRadius:2,marginTop:3}}><div style={{width:`${p.progress}%`,height:"100%",background:p.progress===100?"var(--green)":"var(--accent)",borderRadius:2,transition:"width 1s ease"}}/></div>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="section-title">Team Availability</div>
          {team.map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,var(--accent),var(--purple))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{m.avatar}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600}}>{m.name}</div>
                <div style={{height:3,background:"var(--border)",borderRadius:2,marginTop:4}}><div style={{width:`${m.availability}%`,height:"100%",background:m.availability>80?"var(--green)":m.availability>60?"var(--orange)":"var(--red)",borderRadius:2,transition:"width 1s ease"}}/></div>
              </div>
              <span style={{fontSize:11,color:"var(--text3)",fontWeight:600}}>{m.availability}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PROJECTS
// ============================================================
const ProjectsPage = ({ projects, setProjects }) => {
  const [showForm,setShowForm]=useState(false);
  const [editId,setEditId]=useState(null);
  const blank={name:"",description:"",domain:"Web",teamSize:4,kloc:20,complexity:"Organic",stack:"",model:"Agile"};
  const [form,setForm]=useState(blank);
  const save=()=>{
    if(!form.name)return;
    const stackArr=typeof form.stack==="string"?form.stack.split(",").map(s=>s.trim()).filter(Boolean):form.stack;
    if(editId)setProjects(prev=>prev.map(p=>p.id===editId?{...p,...form,stack:stackArr}:p));
    else setProjects(prev=>[...prev,{...form,stack:stackArr,id:"p"+Date.now(),status:"active",created:"2026-0"+Math.ceil(Math.random()*3)+"-"+String(Math.ceil(Math.random()*28)).padStart(2,"0"),progress:0}]);
    setShowForm(false);setEditId(null);setForm(blank);
  };
  const complexityColor={Organic:"var(--green)","Semi-Detached":"var(--orange)",Embedded:"var(--red)"};
  return (
    <div className="page-enter">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Projects</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>{projects.length} projects · 2026</p></div>
        <button className="btn-primary" style={{display:"flex",alignItems:"center",gap:5,fontSize:13}} onClick={()=>{setShowForm(true);setEditId(null);setForm(blank);}}><Icon name="plus" size={13}/> New Project</button>
      </div>
      {showForm&&(
        <div className="card" style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{fontSize:14,fontWeight:700}}>{editId?"Edit":"New"} Project</h3><button className="btn-ghost" style={{padding:"4px 8px"}} onClick={()=>{setShowForm(false);setEditId(null);}}><Icon name="close" size={13}/></button></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[["Project Name","name","text","My Project"],["Description","description","text","Brief description"],["Team Size","teamSize","number","4"],["KLOC","kloc","number","20"]].map(([l,k,t,ph])=>(<div key={k}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>{l.toUpperCase()}</label><input type={t} value={form[k]} onChange={e=>setForm({...form,[k]:t==="number"?+e.target.value:e.target.value})} placeholder={ph}/></div>))}
            {[["Domain","domain",["Web","Mobile","Finance","Healthcare","Data","IoT","AI/ML"]],["Complexity","complexity",["Organic","Semi-Detached","Embedded"]],["Model","model",["Waterfall","Agile","Spiral","V-Model","Incremental"]]].map(([l,k,opts])=>(<div key={k}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>{l.toUpperCase()}</label><select value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>))}
            <div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>TECH STACK</label><input value={form.stack} onChange={e=>setForm({...form,stack:e.target.value})} placeholder="React, Python, MongoDB"/></div>
          </div>
          <div style={{marginTop:16,display:"flex",gap:8}}><button className="btn-primary" onClick={save}>{editId?"Save":"Create"}</button><button className="btn-ghost" onClick={()=>{setShowForm(false);setEditId(null);}}>Cancel</button></div>
        </div>
      )}
      <div className="stagger" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {projects.map(p=>(
          <div key={p.id} className="card card-hover">
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{p.name}</div><div style={{fontSize:12,color:"var(--text2)"}}>{p.description}</div></div>
              <span className="badge" style={{background:p.status==="active"?"rgba(34,211,160,0.1)":"rgba(59,130,246,0.1)",color:p.status==="active"?"var(--green)":"var(--accent)",marginLeft:8,alignSelf:"flex-start"}}>{p.status}</span>
            </div>
            <div style={{display:"flex",gap:14,marginBottom:12}}>
              {[["Domain",p.domain],["Team",p.teamSize+" devs"],["KLOC",p.kloc+"k"]].map(([k,v])=>(<div key={k}><div style={{fontSize:9,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{k}</div><div style={{fontSize:12,fontWeight:600,marginTop:2}}>{v}</div></div>))}
              <div><div style={{fontSize:9,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Complexity</div><div style={{fontSize:12,fontWeight:600,marginTop:2,color:complexityColor[p.complexity]}}>{p.complexity}</div></div>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--text3)",marginBottom:3}}><span>Progress</span><span>{p.progress}%</span></div>
              <div style={{height:4,background:"var(--bg3)",borderRadius:2}}><div style={{height:"100%",width:`${p.progress}%`,background:p.progress===100?"var(--green)":"var(--accent)",borderRadius:2,transition:"width 1s ease"}}/></div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:10}}>{(Array.isArray(p.stack)?p.stack:[]).map(t=><span key={t} className="tag">{t}</span>)}</div>
            <div style={{display:"flex",gap:6,borderTop:"1px solid var(--border)",paddingTop:10}}>
              <span style={{fontSize:10,color:"var(--text3)",flex:1}}>{p.model} · {p.created}</span>
              <Tip text="Edit project"><button className="btn-ghost" style={{padding:"3px 8px",fontSize:11}} onClick={()=>{setForm({...p,stack:Array.isArray(p.stack)?p.stack.join(", "):p.stack});setEditId(p.id);setShowForm(true);}}><Icon name="edit" size={11}/></button></Tip>
              <Tip text="Delete project"><button className="btn-danger" style={{padding:"3px 8px",fontSize:11}} onClick={()=>setProjects(prev=>prev.filter(x=>x.id!==p.id))}><Icon name="trash" size={11}/></button></Tip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// TEAM
// ============================================================
const TeamPage = ({ team, setTeam }) => {
  const [showForm,setShowForm]=useState(false);
  const blank={name:"",role:"Developer",email:"",skills:"",availability:100};
  const [form,setForm]=useState(blank);
  const roles=["Team Lead & Backend","Senior Developer","Developer","Frontend Developer","QA Engineer","Business Analyst","DevOps","UI/UX Designer"];
  const add=()=>{
    if(!form.name)return;
    const skillArr=typeof form.skills==="string"?form.skills.split(",").map(s=>s.trim()).filter(Boolean):form.skills;
    setTeam(prev=>[...prev,{...form,skills:skillArr,id:"m"+Date.now(),avatar:form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2),joined:"2026-0"+Math.ceil(Math.random()*3)+"-"+String(Math.ceil(Math.random()*28)).padStart(2,"0")}]);
    setForm(blank);setShowForm(false);
  };
  const del=id=>setTeam(prev=>prev.filter(m=>m.id!==id));
  const roleColor={"Team Lead & Backend":"var(--accent)","Senior Developer":"var(--purple)","Frontend Developer":"var(--green)","QA Engineer":"var(--orange)","Business Analyst":"var(--yellow)"};
  return (
    <div className="page-enter">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Team Management</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>{team.length} members</p></div>
        <button className="btn-primary" style={{display:"flex",alignItems:"center",gap:5,fontSize:13}} onClick={()=>setShowForm(true)}><Icon name="plus" size={13}/> Add Member</button>
      </div>
      {showForm&&(
        <div className="card" style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><h3 style={{fontSize:14,fontWeight:700}}>New Member</h3><button className="btn-ghost" style={{padding:"4px 8px"}} onClick={()=>setShowForm(false)}><Icon name="close" size={13}/></button></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["Full Name","name","Alex Smith"],["Email","email","dev@team.com"]].map(([l,k,ph])=>(<div key={k}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>{l.toUpperCase()}</label><input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={ph}/></div>))}
            <div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>ROLE</label><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>{roles.map(r=><option key={r}>{r}</option>)}</select></div>
            <div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>AVAILABILITY: {form.availability}%</label><input type="range" min={10} max={100} step={10} value={form.availability} onChange={e=>setForm({...form,availability:+e.target.value})}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>SKILLS (comma-separated)</label><input value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} placeholder="React, Python, Testing"/></div>
          </div>
          <div style={{marginTop:14,display:"flex",gap:8}}><button className="btn-primary" onClick={add}>Add</button><button className="btn-ghost" onClick={()=>setShowForm(false)}>Cancel</button></div>
        </div>
      )}
      <div className="stagger" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
        {team.map(m=>(
          <div key={m.id} className="card card-hover">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:46,height:46,borderRadius:"50%",background:`linear-gradient(135deg,var(--accent),var(--purple))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:"#fff",flexShrink:0,boxShadow:"0 4px 12px rgba(0,0,0,0.2)"}}>{m.avatar}</div>
              <div><div style={{fontSize:14,fontWeight:700}}>{m.name}</div><div style={{fontSize:12,color:roleColor[m.role]||"var(--text2)",fontWeight:600}}>{m.role}</div><div style={{fontSize:11,color:"var(--text3)"}}>{m.email}</div></div>
            </div>
            {/* Availability Ring */}
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
              <ProgressRing pct={m.availability} size={64} color={m.availability>80?"var(--green)":m.availability>60?"var(--orange)":"var(--red)"} label={m.availability+"%"} sublabel="Avail."/>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:"var(--text3)",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Skills</div>
                <div>{(m.skills||[]).map(s=><span key={s} className="tag">{s}</span>)}</div>
              </div>
            </div>
            <div style={{fontSize:11,color:"var(--text3)",borderTop:"1px solid var(--border)",paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>📅 Joined {m.joined}</span>
              <Tip text="Remove member"><button className="btn-danger" style={{padding:"3px 8px",fontSize:11}} onClick={()=>del(m.id)}>Remove</button></Tip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// MILESTONES PAGE
// ============================================================
const MilestonesPage = ({ milestones, setMilestones, projects }) => {
  const [projId,setProjId]=useState(projects[0]?.id||"");
  const [showForm,setShowForm]=useState(false);
  const [celebrated,setCelebrated]=useState(null);
  const blank={title:"",date:"",description:""};
  const [form,setForm]=useState(blank);
  const filtered=milestones.filter(m=>m.projectId===projId);
  const add=()=>{
    if(!form.title)return;
    setMilestones(prev=>[...prev,{...form,id:"ml"+Date.now(),projectId:projId,achieved:false}]);
    setForm(blank);setShowForm(false);
  };
  const toggle=(id)=>{
    const ml=milestones.find(m=>m.id===id);
    if(!ml.achieved){setCelebrated(id);setTimeout(()=>setCelebrated(null),600);}
    setMilestones(prev=>prev.map(m=>m.id===id?{...m,achieved:!m.achieved}:m));
  };
  const del=id=>setMilestones(prev=>prev.filter(m=>m.id!==id));
  const achieved=filtered.filter(m=>m.achieved).length;
  return (
    <div className="page-enter">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Milestone Tracker</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>{achieved}/{filtered.length} milestones achieved</p></div>
        <button className="btn-primary" style={{display:"flex",alignItems:"center",gap:5,fontSize:13}} onClick={()=>setShowForm(true)}><Icon name="plus" size={13}/> Add Milestone</button>
      </div>
      <div style={{marginBottom:18}}><select value={projId} onChange={e=>setProjId(e.target.value)} style={{maxWidth:280}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      {showForm&&(
        <div className="card" style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><h3 style={{fontSize:14,fontWeight:700}}>New Milestone</h3><button className="btn-ghost" style={{padding:"4px 8px"}} onClick={()=>setShowForm(false)}><Icon name="close" size={13}/></button></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>TITLE</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Milestone name"/></div>
            <div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>TARGET DATE</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>DESCRIPTION</label><input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What does achieving this mean?"/></div>
          </div>
          <div style={{marginTop:14,display:"flex",gap:8}}><button className="btn-primary" onClick={add}>Add</button><button className="btn-ghost" onClick={()=>setShowForm(false)}>Cancel</button></div>
        </div>
      )}

      {/* Progress bar */}
      <div className="card" style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}}><span style={{fontWeight:600}}>Overall Milestone Progress</span><span style={{color:"var(--green)",fontWeight:700}}>{achieved}/{filtered.length}</span></div>
        <div style={{height:8,background:"var(--bg3)",borderRadius:4}}><div style={{height:"100%",width:`${filtered.length?achieved/filtered.length*100:0}%`,background:"linear-gradient(90deg,var(--accent),var(--green))",borderRadius:4,transition:"width 0.8s ease"}}/></div>
      </div>

      {/* Timeline */}
      <div style={{position:"relative",paddingLeft:24}}>
        <div style={{position:"absolute",left:9,top:0,bottom:0,width:2,background:"var(--border)",borderRadius:1}}/>
        {filtered.map((ml,i)=>(
          <div key={ml.id} style={{position:"relative",marginBottom:20}}>
            <div style={{position:"absolute",left:-24,top:14,width:16,height:16,borderRadius:"50%",background:ml.achieved?"var(--green)":"var(--bg3)",border:`2px solid ${ml.achieved?"var(--green)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s",animation:celebrated===ml.id?"celebrate 0.5s ease":undefined}}>
              {ml.achieved&&<div style={{width:6,height:6,borderRadius:"50%",background:"#fff"}}/>}
            </div>
            <div className="card card-hover" style={{borderLeft:`3px solid ${ml.achieved?"var(--green)":"var(--border)"}`,marginLeft:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:700}}>{ml.title}</span>
                    {ml.achieved&&<span style={{fontSize:16}}>🎉</span>}
                  </div>
                  <div style={{fontSize:12,color:"var(--text2)",marginBottom:6}}>{ml.description}</div>
                  <div style={{fontSize:11,color:"var(--text3)"}}>📅 {ml.date}</div>
                </div>
                <div style={{display:"flex",gap:6,marginLeft:12}}>
                  <Tip text={ml.achieved?"Mark incomplete":"Mark achieved"}>
                    <button onClick={()=>toggle(ml.id)} style={{padding:"6px 12px",borderRadius:8,fontSize:12,fontWeight:600,background:ml.achieved?"var(--green)18":"var(--accent)18",color:ml.achieved?"var(--green)":"var(--accent)",border:`1px solid ${ml.achieved?"var(--green)33":"var(--accent)33"}`,cursor:"pointer",transition:"all 0.2s"}}>
                      {ml.achieved?"✅ Done":"○ Mark Done"}
                    </button>
                  </Tip>
                  <button className="btn-danger" style={{padding:"6px 10px",fontSize:12}} onClick={()=>del(ml.id)}>×</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0&&<div style={{textAlign:"center",padding:32,color:"var(--text3)"}}>No milestones yet. Add your first milestone!</div>}
      </div>
    </div>
  );
};

// ============================================================
// REMAINING PAGES (SDLC, ESTIMATE, THREEPOINT, COMPARE, TIMELINE, SPRINT, TASKS, RISKS, BUDGET, BURNDOWN, VELOCITY, CALENDAR, ANALYTICS, REPORTS)
// All updated with page-enter animation, 2026 dates, real team names
// ============================================================

const SDLCPage = () => {
  const [model,setModel]=useState("Agile");
  const [phases,setPhases]=useState([{name:"Requirements",duration:2,team:"Nikhil Shirbhate",color:"#3b82f6"},{name:"System Design",duration:3,team:"Ayush Nagdive",color:"#22d3a0"},{name:"Development",duration:8,team:"Ayush + Shreya",color:"#f97316"},{name:"Testing",duration:4,team:"Mayur Waghmare",color:"#a78bfa"},{name:"Deployment",duration:1,team:"Ayush Nagdive",color:"#fbbf24"},{name:"Maintenance",duration:6,team:"Full Team",color:"#f43f5e"}]);
  const models={Waterfall:{desc:"Sequential, linear. Each phase must complete before next.",phases:["Requirements","System Design","Implementation","Testing","Deployment","Maintenance"]},Agile:{desc:"Iterative sprints with continuous delivery and collaboration.",phases:["Sprint Planning","Development","Testing","Review","Retrospective","Release"]},Spiral:{desc:"Risk-driven model with iterative prototyping.",phases:["Planning","Risk Analysis","Engineering","Evaluation"]}, "V-Model":{desc:"Each development phase paired with a testing phase.",phases:["Requirements","System Design","Architecture","Coding","Unit Testing","Integration Testing","Acceptance Testing"]},Incremental:{desc:"System built in increments, each adding functionality.",phases:["Requirements","Design","Increment 1","Increment 2","Increment 3","Integration","Deployment"]}};
  const upd=(i,f,v)=>setPhases(prev=>prev.map((p,idx)=>idx===i?{...p,[f]:f==="duration"?+v:v}:p));
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>SDLC Model Simulator</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Visualize and configure development lifecycle phases</p></div>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>{Object.keys(models).map(m=><button key={m} onClick={()=>setModel(m)} style={{padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:600,background:model===m?"var(--accent)":"var(--bg3)",color:model===m?"#fff":"var(--text2)",border:"1px solid "+(model===m?"var(--accent)":"var(--border)"),cursor:"pointer",transition:"all 0.2s"}}>{m}</button>)}</div>
      <div className="card" style={{marginBottom:18}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>{model} <span style={{fontSize:12,color:"var(--text2)",fontWeight:400}}>— {models[model].desc}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:0,overflowX:"auto",padding:"8px 0",flexWrap:"nowrap"}}>
          {models[model].phases.map((ph,i)=>(<div key={i} style={{display:"flex",alignItems:"center"}}><div style={{background:phases[i%phases.length].color+"20",border:`1px solid ${phases[i%phases.length].color}40`,borderRadius:8,padding:"8px 12px",fontSize:11,fontWeight:600,color:phases[i%phases.length].color,whiteSpace:"nowrap",textAlign:"center",minWidth:90}}><div style={{fontSize:9,color:"var(--text3)",marginBottom:2}}>{i+1}</div>{ph}</div>{i<models[model].phases.length-1&&<div style={{color:"var(--text3)",padding:"0 3px"}}>→</div>}</div>))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card">
          <div className="section-title">Phase Configuration</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["Phase","Duration (wk)","Assigned To"].map(h=><th key={h} style={{textAlign:"left",padding:"7px 10px",fontSize:10,color:"var(--text3)",borderBottom:"1px solid var(--border)"}}>{h.toUpperCase()}</th>)}</tr></thead>
            <tbody>{phases.map((p,i)=>(<tr key={i}><td style={{padding:"7px 10px",borderBottom:"1px solid var(--border)"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:7,height:7,borderRadius:2,background:p.color,flexShrink:0}}/>{p.name}</div></td><td style={{padding:"5px 10px",borderBottom:"1px solid var(--border)"}}><input type="number" value={p.duration} onChange={e=>upd(i,"duration",e.target.value)} style={{width:60,padding:"3px 7px",fontSize:12}} min={1}/></td><td style={{padding:"5px 10px",borderBottom:"1px solid var(--border)"}}><input value={p.team} onChange={e=>upd(i,"team",e.target.value)} style={{padding:"3px 7px",fontSize:12}}/></td></tr>))}</tbody>
          </table>
        </div>
        <div className="card"><div className="section-title">Gantt Timeline</div><GanttChart phases={phases}/><div style={{marginTop:12,padding:10,background:"var(--bg3)",borderRadius:8,fontSize:12,color:"var(--text2)"}}>Total: <strong style={{color:"var(--text)"}}>{phases.reduce((s,p)=>s+p.duration,0)} weeks</strong></div></div>
      </div>
    </div>
  );
};

const EstimatePage = ({ projects }) => {
  const [mode,setMode]=useState("basic");
  const [kloc,setKloc]=useState(45);
  const [complexity,setComplexity]=useState("Semi-Detached");
  const [salary,setSalary]=useState(8000);
  const [drivers,setDrivers]=useState({rely:1.0,data:1.0,cplx:1.15,acap:0.86,pcap:0.86,tool:0.91,sced:1.0});
  const params={Organic:{a:2.4,b:1.05,c:2.5,d:0.38},"Semi-Detached":{a:3.0,b:1.12,c:2.5,d:0.35},Embedded:{a:3.6,b:1.20,c:2.5,d:0.32}}[complexity];
  const eaf=Object.values(drivers).reduce((a,b)=>a*b,1);
  const effort=mode==="basic"?params.a*Math.pow(kloc,params.b):params.a*Math.pow(kloc,params.b)*eaf;
  const time=params.c*Math.pow(effort,params.d);
  const teamSize=Math.ceil(effort/time);
  const driverLabels={rely:"Required Reliability",data:"Database Size",cplx:"Product Complexity",acap:"Analyst Capability",pcap:"Programmer Capability",tool:"Dev Tools",sced:"Schedule Constraint"};
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>COCOMO Cost Estimator</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Constructive Cost Model — effort and schedule estimation</p></div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>{["basic","intermediate"].map(m=><button key={m} onClick={()=>setMode(m)} style={{padding:"7px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",background:mode===m?"var(--accent)":"var(--bg3)",color:mode===m?"#fff":"var(--text2)",border:"1px solid "+(mode===m?"var(--accent)":"var(--border)"),textTransform:"capitalize",transition:"all 0.2s"}}>{m} COCOMO</button>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div>
          <div className="card" style={{marginBottom:18}}>
            <div className="section-title">Parameters</div>
            <div style={{marginBottom:14}}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>KLOC: <strong style={{color:"var(--accent)"}}>{kloc}k</strong></label><input type="range" min={1} max={500} value={kloc} onChange={e=>setKloc(+e.target.value)}/></div>
            <div style={{marginBottom:14}}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>PROJECT TYPE</label><select value={complexity} onChange={e=>setComplexity(e.target.value)}>{["Organic","Semi-Detached","Embedded"].map(o=><option key={o}>{o}</option>)}</select></div>
            <div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>SALARY ($/month)</label><input type="number" value={salary} onChange={e=>setSalary(+e.target.value)}/></div>
          </div>
          {mode==="intermediate"&&(
            <div className="card">
              <div className="section-title">Cost Drivers (EAF)</div>
              {Object.entries(drivers).map(([k,v])=>(<div key={k} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><label style={{fontSize:11,color:"var(--text2)"}}>{driverLabels[k]}</label><span style={{fontSize:11,fontWeight:700,color:v>1?"var(--orange)":v<1?"var(--green)":"var(--text2)"}}>{v.toFixed(2)}</span></div><select value={v} onChange={e=>setDrivers({...drivers,[k]:+e.target.value})} style={{padding:"5px 8px",fontSize:11}}>{[0.70,0.85,1.00,1.15,1.30,1.65].map(o=><option key={o} value={o}>{o}</option>)}</select></div>))}
              <div style={{padding:8,background:"var(--bg3)",borderRadius:6,fontSize:12,marginTop:4}}>EAF = <strong style={{color:"var(--accent)"}}>{eaf.toFixed(3)}</strong></div>
            </div>
          )}
        </div>
        <div>
          <div className="stagger" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
            {[["👷","Effort",effort.toFixed(1),"Person-Months","var(--accent)"],["⏱","Dev Time",time.toFixed(1),"Months","var(--green)"],["👥","Team",teamSize,"Developers","var(--purple)"],["💰","Cost","$"+(effort*salary/1000).toFixed(0)+"k","USD Total","var(--yellow)"]].map(([emoji,l,v,u,c])=>(
              <div key={l} className="card card-hover" style={{borderColor:c+"40"}}>
                <div style={{fontSize:18}}>{emoji}</div>
                <div style={{fontSize:22,fontWeight:800,color:c,letterSpacing:"-0.03em",marginTop:3}}><AnimatedCounter target={parseFloat(v)} color={c} suffix={String(v).includes("k")?"k":""}/></div>
                <div style={{fontSize:11,color:"var(--text2)"}}>{u}</div>
                <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{marginBottom:18}}>
            <div className="section-title">Formula Breakdown</div>
            <div className="mono" style={{fontSize:11,lineHeight:2.2,color:"var(--text2)"}}>
              <div style={{color:"var(--accent)"}}>Effort = {params.a} × {kloc}^{params.b}{mode==="intermediate"?` × ${eaf.toFixed(3)}`:""} = <strong>{effort.toFixed(2)} PM</strong></div>
              <div style={{color:"var(--green)"}}>Time = {params.c} × {effort.toFixed(2)}^{params.d} = <strong>{time.toFixed(2)} months</strong></div>
              <div style={{color:"var(--purple)"}}>Team = ⌈{effort.toFixed(2)}/{time.toFixed(2)}⌉ = <strong>{teamSize} devs</strong></div>
            </div>
          </div>
          <div className="card">
            <div className="section-title">Effort by Phase</div>
            {[["Requirements",15],["Design",20],["Development",40],["Testing",18],["Maintenance",7]].map(([name,pct])=>(
              <div key={name} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span>{name}</span><span style={{color:"var(--text2)"}}>{pct}% · {((effort*pct/100)*160).toFixed(0)} hrs</span></div>
                <div style={{height:4,background:"var(--bg3)",borderRadius:2}}><div style={{height:"100%",width:`${pct}%`,background:"var(--accent)",borderRadius:2,transition:"width 0.8s ease"}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ThreePointPage = () => {
  const [tasks,setTasks]=useState([{id:1,name:"Frontend UI (Shreya)",O:5,M:8,P:14},{id:2,name:"Backend API (Ayush)",O:3,M:6,P:10},{id:3,name:"Database Design (Nikhil)",O:2,M:3,P:7},{id:4,name:"QA & Testing (Mayur)",O:4,M:7,P:12},{id:5,name:"Deployment (Ayush)",O:1,M:2,P:5}]);
  const [form,setForm]=useState({name:"",O:"",M:"",P:""});
  const calc=t=>{const E=(t.O+4*t.M+t.P)/6,SD=(t.P-t.O)/6;return{E:E.toFixed(2),SD:SD.toFixed(2),P68:`${(E-SD).toFixed(1)}–${(E+SD).toFixed(1)}`,P95:`${(E-2*SD).toFixed(1)}–${(E+2*SD).toFixed(1)}`};};
  const add=()=>{if(!form.name||!form.O||!form.M||!form.P)return;setTasks(prev=>[...prev,{id:Date.now(),name:form.name,O:+form.O,M:+form.M,P:+form.P}]);setForm({name:"",O:"",M:"",P:""});};
  const del=id=>setTasks(prev=>prev.filter(t=>t.id!==id));
  const totals=tasks.map(calc).reduce((s,r)=>({E:s.E+ +r.E,SD:Math.sqrt(Math.pow(s.SD,2)+Math.pow(+r.SD,2))}),{E:0,SD:0});
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Three-Point Estimation (PERT)</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Optimistic, Most Likely, Pessimistic analysis</p></div>
      <div className="stagger" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:20}}>
        <div className="card card-hover" style={{borderColor:"var(--green)40"}}><div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Total Estimate (E)</div><div style={{fontSize:28,fontWeight:800,color:"var(--green)",marginTop:4}}><AnimatedCounter target={+totals.E.toFixed(1)} color="var(--green)" suffix=" days"/></div></div>
        <div className="card card-hover" style={{borderColor:"var(--orange)40"}}><div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Std Deviation (σ)</div><div style={{fontSize:28,fontWeight:800,color:"var(--orange)",marginTop:4}}><AnimatedCounter target={+totals.SD.toFixed(2)} color="var(--orange)"/></div></div>
        <div className="card card-hover" style={{borderColor:"var(--accent)40"}}><div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>95% Range</div><div style={{fontSize:18,fontWeight:800,color:"var(--accent)",marginTop:4}}>{(totals.E-2*totals.SD).toFixed(1)}–{(totals.E+2*totals.SD).toFixed(1)} days</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"3fr 1fr",gap:18}}>
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div className="section-title" style={{marginBottom:0}}>Task Estimates</div>
            <div style={{display:"flex",gap:6}}>
              {[["name","Task name",200],["O","O",44],["M","M",44],["P","P",44]].map(([k,ph,w])=>(
                <input key={k} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={ph} style={{padding:"5px 8px",fontSize:11,width:w}} type={k==="name"?"text":"number"}/>
              ))}
              <button className="btn-primary" style={{padding:"6px 12px",fontSize:12}} onClick={add}>+</button>
            </div>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["Task","O","M","P","E (PERT)","σ","68% Range",""].map(h=><th key={h} style={{textAlign:"left",padding:"7px 10px",fontSize:10,color:"var(--text3)",borderBottom:"1px solid var(--border)"}}>{h}</th>)}</tr></thead>
            <tbody>{tasks.map(t=>{const r=calc(t);return(<tr key={t.id}><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)",fontWeight:500}}>{t.name}</td>{[t.O,t.M,t.P].map((v,i)=><td key={i} style={{padding:"8px 10px",borderBottom:"1px solid var(--border)",color:["var(--green)","var(--accent)","var(--red)"][i],fontWeight:600}}>{v}d</td>)}<td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)",fontWeight:700,color:"var(--yellow)"}}>{r.E}d</td><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)",color:"var(--orange)"}}>±{r.SD}</td><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)",color:"var(--text2)"}}>{r.P68}d</td><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)"}}><button className="btn-danger" style={{padding:"2px 7px",fontSize:11}} onClick={()=>del(t.id)}>×</button></td></tr>);})}</tbody>
          </table>
        </div>
        <div className="card">
          <div className="section-title">PERT Formula</div>
          <div className="mono" style={{fontSize:11,lineHeight:2.2,color:"var(--text2)"}}>
            <div style={{color:"var(--green)"}}>E = (O+4M+P)/6</div>
            <div style={{color:"var(--orange)"}}>σ = (P-O)/6</div>
            <div style={{marginTop:8,fontSize:10,color:"var(--text3)"}}>Intervals:</div>
            <div style={{fontSize:10}}>68% → E±σ</div>
            <div style={{fontSize:10}}>95% → E±2σ</div>
            <div style={{fontSize:10}}>99.7% → E±3σ</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparePage = () => {
  const [selected,setSelected]=useState(["Waterfall","Agile","Spiral"]);
  const modelData={Waterfall:{cost:3,time:4,risk:4,flexibility:1,customer:2},Agile:{cost:3,time:2,risk:2,flexibility:5,customer:5},Spiral:{cost:5,time:4,risk:1,flexibility:3,customer:3},"V-Model":{cost:3,time:3,risk:3,flexibility:2,customer:2},Incremental:{cost:4,time:3,risk:3,flexibility:4,customer:4}};
  const colors={Waterfall:"#3b82f6",Agile:"#22d3a0",Spiral:"#f97316","V-Model":"#a78bfa",Incremental:"#fbbf24"};
  const toggle=m=>setSelected(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m]);
  const attrs=[{key:"cost",label:"Cost"},{key:"time",label:"Dev Time"},{key:"risk",label:"Risk"},{key:"flexibility",label:"Flexibility"},{key:"customer",label:"Customer Inv."}];
  const radarData=selected.map(m=>({label:m,color:colors[m],labels:["Cost","Time","Risk","Flex","Cust"],values:[modelData[m].cost,modelData[m].time,modelData[m].risk,modelData[m].flexibility,modelData[m].customer].map(v=>v/5)}));
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>SDLC Model Comparison</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Compare methodologies across key attributes</p></div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>{Object.keys(modelData).map(m=><button key={m} onClick={()=>toggle(m)} style={{padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",background:selected.includes(m)?colors[m]+"22":"var(--bg3)",color:selected.includes(m)?colors[m]:"var(--text2)",border:"1px solid "+(selected.includes(m)?colors[m]+"55":"var(--border)"),transition:"all 0.2s"}}>{selected.includes(m)?"✓ ":""}{m}</button>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card"><div className="section-title">Radar Comparison</div><div style={{display:"flex",justifyContent:"center"}}><RadarChart data={radarData} size={210}/></div></div>
        <div className="card"><div className="section-title">Score Table</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr><th style={{textAlign:"left",padding:"7px 0",fontSize:10,color:"var(--text3)",borderBottom:"1px solid var(--border)"}}>Attribute</th>{selected.map(m=><th key={m} style={{textAlign:"center",padding:"7px 5px",fontSize:10,color:colors[m],borderBottom:"1px solid var(--border)"}}>{m}</th>)}</tr></thead>
            <tbody>{attrs.map(a=>(<tr key={a.key}><td style={{padding:"9px 0",color:"var(--text2)",borderBottom:"1px solid var(--border)"}}>{a.label}</td>{selected.map(m=>{const v=modelData[m][a.key];return<td key={m} style={{textAlign:"center",padding:"9px 5px",borderBottom:"1px solid var(--border)"}}><div style={{display:"flex",gap:2,justifyContent:"center"}}>{[1,2,3,4,5].map(n=><div key={n} style={{width:6,height:6,borderRadius:1,background:n<=v?colors[m]:"var(--border)",transition:"background 0.3s"}}/>)}</div></td>;})}  </tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TimelinePage = ({ projects }) => {
  const [projId,setProjId]=useState(projects[0]?.id||"");
  const proj=projects.find(p=>p.id===projId)||projects[0];
  const gen=p=>{if(!p)return[];const bw=Math.ceil(p.kloc/(p.teamSize*0.8));const m={Organic:1,"Semi-Detached":1.2,Embedded:1.5}[p.complexity]||1;const tw=Math.max(8,Math.ceil(bw*m));const names=["Requirements","System Design","Development","Testing","Deployment","Maintenance"];const colors=["#3b82f6","#22d3a0","#f97316","#a78bfa","#fbbf24","#f43f5e"];return names.map((name,i)=>({name,duration:Math.max(1,Math.round(tw*[0.12,0.18,0.40,0.18,0.07,0.05][i])),color:colors[i]}));};
  const tl=gen(proj);
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Timeline Generator</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Auto-generate project timelines from parameters</p></div>
      <div style={{marginBottom:18}}><select value={projId} onChange={e=>setProjId(e.target.value)} style={{maxWidth:280}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      {proj&&<><div className="stagger" style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:18}}>{[["Project",proj.name],["Model",proj.model],["Team",proj.teamSize+" devs"],["KLOC",proj.kloc+"k"],["Total",tl.reduce((s,p)=>s+p.duration,0)+" wks"]].map(([k,v])=><div key={k} className="card" style={{padding:"10px 14px",flex:1,minWidth:100}}><div style={{fontSize:9,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{k}</div><div style={{fontSize:13,fontWeight:700,marginTop:3}}>{v}</div></div>)}</div>
      <div className="card" style={{marginBottom:18}}><div className="section-title">Gantt Chart — {proj.name} (2026)</div><GanttChart phases={tl}/></div>
      <div className="stagger" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12}}>{tl.map((ph,i)=>{const start=tl.slice(0,i).reduce((s,p)=>s+p.duration,0);return<div key={i} className="card card-hover" style={{borderTop:`3px solid ${ph.color}`}}><div style={{fontWeight:600,fontSize:12,marginBottom:5}}>{ph.name}</div><div style={{fontSize:20,fontWeight:800,color:ph.color}}>{ph.duration}<span style={{fontSize:11,color:"var(--text2)",fontWeight:400}}>w</span></div><div style={{fontSize:10,color:"var(--text3)",marginTop:3}}>Week {start+1}</div></div>;})}
      </div></>}
    </div>
  );
};

const SprintPage = ({ sprints, setSprints, tasks, projects }) => {
  const [projId,setProjId]=useState(projects[0]?.id||"");
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({name:"",startDate:"",endDate:"",planned:20});
  const projSprints=sprints.filter(s=>s.projectId===projId);
  const projTasks=tasks.filter(t=>t.projectId===projId);
  const addSprint=()=>{if(!form.name)return;setSprints(prev=>[...prev,{...form,id:"s"+Date.now(),projectId:projId,velocity:0,status:"Planned"}]);setForm({name:"",startDate:"",endDate:"",planned:20});setShowForm(false);};
  const statusColors={Completed:"var(--green)",Active:"var(--accent)",Planned:"var(--text3)"};
  return (
    <div className="page-enter">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Sprint Planning Board</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Jan–Mar 2026 sprint cycles</p></div>
        <button className="btn-primary" style={{display:"flex",alignItems:"center",gap:5,fontSize:13}} onClick={()=>setShowForm(true)}><Icon name="plus" size={13}/> New Sprint</button>
      </div>
      <div style={{marginBottom:18}}><select value={projId} onChange={e=>setProjId(e.target.value)} style={{maxWidth:280}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      {showForm&&(<div className="card" style={{marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><h3 style={{fontSize:13,fontWeight:700}}>New Sprint</h3><button className="btn-ghost" style={{padding:"3px 7px"}} onClick={()=>setShowForm(false)}><Icon name="close" size={13}/></button></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>SPRINT NAME</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Sprint 4"/></div><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>PLANNED POINTS: {form.planned}</label><input type="range" min={5} max={50} value={form.planned} onChange={e=>setForm({...form,planned:+e.target.value})}/></div><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>START DATE</label><input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}/></div><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>END DATE</label><input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}/></div></div><div style={{marginTop:12,display:"flex",gap:8}}><button className="btn-primary" onClick={addSprint}>Create Sprint</button><button className="btn-ghost" onClick={()=>setShowForm(false)}>Cancel</button></div></div>)}
      <div className="stagger" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {projSprints.map(sprint=>{
          const sprintTasks=projTasks.filter(t=>t.sprint===sprint.name);
          const done=sprintTasks.filter(t=>t.status==="Completed").reduce((s,t)=>s+(t.storyPoints||0),0);
          const pct=sprint.planned>0?Math.min(100,(sprint.velocity||done)/sprint.planned*100):0;
          return(
            <div key={sprint.id} className="card card-hover" style={{borderLeft:`3px solid ${statusColors[sprint.status]}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{fontSize:14,fontWeight:700}}>{sprint.name}</div><span className="badge" style={{background:statusColors[sprint.status]+"18",color:statusColors[sprint.status]}}>{sprint.status}</span></div>
              <div style={{display:"flex",gap:16,marginBottom:12}}>
                <div><div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase"}}>Planned</div><div style={{fontSize:18,fontWeight:800,color:"var(--accent)"}}>{sprint.planned}</div></div>
                <div><div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase"}}>Velocity</div><div style={{fontSize:18,fontWeight:800,color:"var(--green)"}}>{sprint.velocity||done}</div></div>
                <div><div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase"}}>Tasks</div><div style={{fontSize:18,fontWeight:800}}>{sprintTasks.length}</div></div>
              </div>
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{color:"var(--text3)"}}>Progress</span><span style={{fontWeight:600}}>{pct.toFixed(0)}%</span></div>
                <div style={{height:5,background:"var(--bg3)",borderRadius:3}}><div style={{height:"100%",width:`${pct}%`,background:pct===100?"var(--green)":"var(--accent)",borderRadius:3,transition:"width 0.8s ease"}}/></div>
              </div>
              {sprint.startDate&&<div style={{fontSize:11,color:"var(--text3)"}}>📅 {sprint.startDate} → {sprint.endDate}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TasksPage = ({ tasks, setTasks, projects, sprints }) => {
  const [view,setView]=useState("kanban");
  const [projId,setProjId]=useState(projects[0]?.id||"");
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({title:"",assignee:"Ayush Nagdive",priority:"Medium",deadline:"",phase:"Development",storyPoints:3,sprint:"Sprint 1"});
  const [dragId,setDragId]=useState(null);
  const filtered=tasks.filter(t=>t.projectId===projId);
  const statuses=["To Do","In Progress","Testing","Completed"];
  const statusColors={"To Do":"var(--text3)","In Progress":"var(--accent)",Testing:"var(--orange)",Completed:"var(--green)"};
  const priorityColors={Critical:"var(--red)",High:"var(--orange)",Medium:"var(--yellow)",Low:"var(--green)"};
  const projSprints=sprints.filter(s=>s.projectId===projId).map(s=>s.name);
  const teamMembers=["Ayush Nagdive","Mayur Waghmare","Nikhil Shirbhate","Shreya Deshmukh"];
  const add=()=>{if(!form.title)return;setTasks(prev=>[...prev,{...form,id:"t"+Date.now(),projectId:projId,status:"To Do"}]);setForm({title:"",assignee:"Ayush Nagdive",priority:"Medium",deadline:"",phase:"Development",storyPoints:3,sprint:projSprints[0]||"Sprint 1"});setShowForm(false);};
  const move=(id,s)=>setTasks(prev=>prev.map(t=>t.id===id?{...t,status:s}:t));
  const del=id=>setTasks(prev=>prev.filter(t=>t.id!==id));
  return (
    <div className="page-enter">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Task Manager</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>{filtered.length} tasks — 2026</p></div>
        <div style={{display:"flex",gap:8}}>
          <div style={{display:"flex",gap:3,background:"var(--bg3)",borderRadius:8,padding:3}}>{["kanban","list"].map(v=><button key={v} onClick={()=>setView(v)} style={{padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",background:view===v?"var(--accent)":"transparent",color:view===v?"#fff":"var(--text2)",fontSize:12,fontWeight:600,textTransform:"capitalize",transition:"all 0.2s"}}>{v}</button>)}</div>
          <button className="btn-primary" style={{display:"flex",alignItems:"center",gap:5,fontSize:13}} onClick={()=>setShowForm(true)}><Icon name="plus" size={13}/> Task</button>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <select value={projId} onChange={e=>setProjId(e.target.value)} style={{maxWidth:240}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
        {statuses.map(s=><span key={s} className="badge" style={{background:statusColors[s]+"18",color:statusColors[s]}}>{s} ({filtered.filter(t=>t.status===s).length})</span>)}
      </div>
      {showForm&&(<div className="card" style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><h3 style={{fontSize:13,fontWeight:700}}>New Task</h3><button className="btn-ghost" style={{padding:"3px 7px"}} onClick={()=>setShowForm(false)}><Icon name="close" size={13}/></button></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:3}}>TITLE</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:3}}>ASSIGNEE</label><select value={form.assignee} onChange={e=>setForm({...form,assignee:e.target.value})}>{teamMembers.map(m=><option key={m}>{m}</option>)}</select></div><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:3}}>PRIORITY</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{["Critical","High","Medium","Low"].map(o=><option key={o}>{o}</option>)}</select></div><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:3}}>STORY POINTS</label><select value={form.storyPoints} onChange={e=>setForm({...form,storyPoints:+e.target.value})}>{[1,2,3,5,8,13,21].map(o=><option key={o}>{o}</option>)}</select></div><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:3}}>SPRINT</label><select value={form.sprint} onChange={e=>setForm({...form,sprint:e.target.value})}>{projSprints.length?projSprints.map(s=><option key={s}>{s}</option>):<option>Sprint 1</option>}</select></div><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:3}}>DEADLINE (2026)</label><input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})}/></div></div><div style={{marginTop:12,display:"flex",gap:8}}><button className="btn-primary" onClick={add}>Add Task</button><button className="btn-ghost" onClick={()=>setShowForm(false)}>Cancel</button></div></div>)}
      {view==="kanban"?(
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {statuses.map(status=>(
            <div key={status} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:10}} onDragOver={e=>e.preventDefault()} onDrop={()=>{if(dragId){move(dragId,status);setDragId(null);}}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:11,fontWeight:700,color:statusColors[status]}}>{status}</span><span className="badge" style={{background:statusColors[status]+"18",color:statusColors[status]}}>{filtered.filter(t=>t.status===status).length}</span></div>
              <div style={{display:"flex",flexDirection:"column",gap:7,minHeight:60}}>
                {filtered.filter(t=>t.status===status).map(task=>(
                  <div key={task.id} draggable onDragStart={()=>setDragId(task.id)} onDragEnd={()=>setDragId(null)} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:7,padding:9,cursor:"grab",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.3)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                    <div style={{fontSize:12,fontWeight:600,marginBottom:5,lineHeight:1.4}}>{task.title}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                      <span className="badge" style={{background:priorityColors[task.priority]+"18",color:priorityColors[task.priority],fontSize:10}}>{task.priority}</span>
                      <span style={{fontSize:10,color:"var(--text3)",fontWeight:700}}>{task.storyPoints}pt</span>
                    </div>
                    {task.assignee&&<div style={{fontSize:10,color:"var(--text3)"}}>👤 {task.assignee}</div>}
                    {task.sprint&&<div style={{fontSize:10,color:"var(--accent)",marginTop:2}}>⚡ {task.sprint}</div>}
                    {task.deadline&&<div style={{fontSize:10,color:"var(--text3)"}}>📅 {task.deadline}</div>}
                    <button onClick={()=>del(task.id)} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:14,float:"right",marginTop:-10}}>×</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ):(
        <div className="card">
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["Task","Assignee","Priority","Points","Sprint","Deadline","Status",""].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",fontSize:10,color:"var(--text3)",fontWeight:600,borderBottom:"1px solid var(--border)"}}>{h.toUpperCase()}</th>)}</tr></thead>
            <tbody>{filtered.map(t=>(<tr key={t.id}><td style={{padding:"9px 10px",borderBottom:"1px solid var(--border)",fontWeight:500}}>{t.title}</td><td style={{padding:"9px 10px",borderBottom:"1px solid var(--border)",color:"var(--text2)"}}>{t.assignee||"—"}</td><td style={{padding:"9px 10px",borderBottom:"1px solid var(--border)"}}><span className="badge" style={{background:priorityColors[t.priority]+"18",color:priorityColors[t.priority]}}>{t.priority}</span></td><td style={{padding:"9px 10px",borderBottom:"1px solid var(--border)",fontWeight:700,color:"var(--accent)"}}>{t.storyPoints}</td><td style={{padding:"9px 10px",borderBottom:"1px solid var(--border)",color:"var(--accent)",fontSize:11}}>{t.sprint}</td><td style={{padding:"9px 10px",borderBottom:"1px solid var(--border)",color:"var(--text2)"}}>{t.deadline||"—"}</td><td style={{padding:"9px 10px",borderBottom:"1px solid var(--border)"}}><select value={t.status} onChange={e=>move(t.id,e.target.value)} style={{padding:"3px 6px",fontSize:11,width:"auto"}}>{statuses.map(s=><option key={s}>{s}</option>)}</select></td><td style={{padding:"9px 10px",borderBottom:"1px solid var(--border)"}}><button className="btn-danger" style={{padding:"2px 7px",fontSize:11}} onClick={()=>del(t.id)}>×</button></td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const RisksPage = ({ risks, setRisks, projects }) => {
  const [projId,setProjId]=useState(projects[0]?.id||"");
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({title:"",description:"",probability:0.5,impact:3,category:"Technical",status:"Active"});
  const filtered=risks.filter(r=>r.projectId===projId);
  const add=()=>{if(!form.title)return;setRisks(prev=>[...prev,{...form,id:"r"+Date.now(),projectId:projId}]);setForm({title:"",description:"",probability:0.5,impact:3,category:"Technical",status:"Active"});setShowForm(false);};
  const del=id=>setRisks(prev=>prev.filter(r=>r.id!==id));
  const lv=s=>s>=2?"High":s>=1?"Medium":"Low";
  const lc={High:"var(--red)",Medium:"var(--orange)",Low:"var(--green)"};
  const matrix=Array.from({length:5},(_,row)=>Array.from({length:5},(_,col)=>{const p=(col+1)/5,imp=5-row,rr=filtered.filter(r=>Math.round(r.probability*5)===col+1&&r.impact===imp),score=p*imp;return{risks:rr,bg:score>=3?"rgba(244,63,94,0.25)":score>=1.5?"rgba(249,115,22,0.2)":"rgba(34,211,160,0.15)"};  }));
  return (
    <div className="page-enter">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Risk Analysis</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Identify, score, and track project risks</p></div>
        <button className="btn-primary" style={{display:"flex",alignItems:"center",gap:5,fontSize:13}} onClick={()=>setShowForm(true)}><Icon name="plus" size={13}/> Add Risk</button>
      </div>
      <div style={{marginBottom:16}}><select value={projId} onChange={e=>setProjId(e.target.value)} style={{maxWidth:280}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      {showForm&&(<div className="card" style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><h3 style={{fontSize:13,fontWeight:700}}>New Risk</h3><button className="btn-ghost" style={{padding:"3px 7px"}} onClick={()=>setShowForm(false)}><Icon name="close" size={13}/></button></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:3}}>TITLE</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:3}}>CATEGORY</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{["Technical","Resource","Scope","Schedule","Legal","Financial","External"].map(o=><option key={o}>{o}</option>)}</select></div><div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:3}}>DESCRIPTION</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2}/></div><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:3}}>PROBABILITY: {form.probability}</label><input type="range" min={0.1} max={1} step={0.1} value={form.probability} onChange={e=>setForm({...form,probability:+e.target.value})}/></div><div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:3}}>IMPACT: {form.impact}/5</label><input type="range" min={1} max={5} step={1} value={form.impact} onChange={e=>setForm({...form,impact:+e.target.value})}/></div></div><div style={{marginTop:12,display:"flex",gap:8}}><button className="btn-primary" onClick={add}>Add Risk</button><button className="btn-ghost" onClick={()=>setShowForm(false)}>Cancel</button></div></div>)}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:16}}>
        <div className="card"><div className="section-title">Risk Matrix (Heatmap)</div><div style={{fontSize:10,color:"var(--text3)",marginBottom:6}}>Probability →  |  ↑ Impact</div><div style={{display:"grid",gridTemplateColumns:"22px repeat(5,1fr)",gap:2}}><div style={{display:"flex",flexDirection:"column",gap:2}}>{[5,4,3,2,1].map(n=><div key={n} style={{height:32,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"var(--text3)",fontWeight:600}}>{n}</div>)}</div>{Array.from({length:5}).map((_,col)=>(<div key={col} style={{display:"flex",flexDirection:"column",gap:2}}>{Array.from({length:5}).map((_,row)=>{const cell=matrix[row][col];return<div key={row} style={{height:32,background:cell.bg,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:cell.risks.length?"#fff":"transparent",transition:"all 0.3s"}} title={cell.risks.map(r=>r.title).join(", ")}>{cell.risks.length||""}</div>;})}  </div>))}</div></div>
        <div className="card"><div className="section-title">Risk Summary</div>{["High","Medium","Low"].map(level=>{const count=filtered.filter(r=>lv(r.probability*r.impact)===level).length;return<div key={level} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)"}}><div style={{display:"flex",alignItems:"center",gap:8,fontSize:13}}><div style={{width:8,height:8,borderRadius:"50%",background:lc[level]}}/>{level} Risk</div><span style={{fontSize:20,fontWeight:800,color:lc[level]}}>{count}</span></div>;})}  </div>
      </div>
      <div className="card"><div className="section-title">All Risks</div>{filtered.length===0?<p style={{color:"var(--text3)",textAlign:"center",padding:20}}>No risks logged</p>:<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr>{["Risk","Category","Prob","Impact","Score","Level","Status",""].map(h=><th key={h} style={{textAlign:"left",padding:"7px 10px",fontSize:10,color:"var(--text3)",borderBottom:"1px solid var(--border)"}}>{h.toUpperCase()}</th>)}</tr></thead><tbody>{filtered.map(r=>{const score=r.probability*r.impact,level=lv(score);return<tr key={r.id}><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)",fontWeight:500}}>{r.title}</td><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)",color:"var(--text2)"}}>{r.category}</td><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)"}}>{(r.probability*100).toFixed(0)}%</td><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)"}}>{r.impact}/5</td><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)",fontWeight:700,color:lc[level]}}>{score.toFixed(2)}</td><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)"}}><span className="badge" style={{background:lc[level]+"18",color:lc[level]}}>{level}</span></td><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)"}}><span className="badge" style={{background:r.status==="Active"?"rgba(244,63,94,0.1)":"rgba(34,211,160,0.1)",color:r.status==="Active"?"var(--red)":"var(--green)"}}>{r.status}</span></td><td style={{padding:"8px 10px",borderBottom:"1px solid var(--border)"}}><button className="btn-danger" style={{padding:"2px 7px",fontSize:11}} onClick={()=>del(r.id)}>×</button></td></tr>;})}  </tbody></table>}</div>
    </div>
  );
};

const BudgetPage = ({ projects }) => {
  const [projId,setProjId]=useState(projects[0]?.id||"");
  const proj=projects.find(p=>p.id===projId)||projects[0];
  const [salary,setSalary]=useState(7500);const [infra,setInfra]=useState(2000);const [tools,setTools]=useState(500);const [overhead,setOverhead]=useState(0.2);
  if(!proj)return null;
  const par={Organic:{a:2.4,b:1.05,c:2.5,d:0.38},"Semi-Detached":{a:3.0,b:1.12,c:2.5,d:0.35},Embedded:{a:3.6,b:1.20,c:2.5,d:0.32}}[proj.complexity]||{a:3.0,b:1.12,c:2.5,d:0.35};
  const effort=par.a*Math.pow(proj.kloc,par.b),time=par.c*Math.pow(effort,par.d);
  const lc=effort*salary,it=infra*Math.ceil(time),tt=tools*Math.ceil(time),oc=lc*overhead,total=lc+it+tt+oc;
  const fmt=n=>"$"+n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",");
  const pie=[{label:"Labor",value:lc,color:"#3b82f6"},{label:"Infrastructure",value:it,color:"#22d3a0"},{label:"Tools",value:tt,color:"#f97316"},{label:"Overhead",value:oc,color:"#a78bfa"}];
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Cost & Budget Calculator</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Full project cost estimation — 2026</p></div>
      <div style={{marginBottom:16}}><select value={projId} onChange={e=>setProjId(e.target.value)} style={{maxWidth:280}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card"><div className="section-title">Parameters</div>{[["Monthly Dev Salary ($)",salary,setSalary],["Monthly Infrastructure ($)",infra,setInfra],["Monthly Tools ($)",tools,setTools]].map(([l,v,s])=>(<div key={l} style={{marginBottom:14}}><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>{l.toUpperCase()}</label><input type="number" value={v} onChange={e=>s(+e.target.value)}/></div>))}<div><label style={{fontSize:11,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:4}}>OVERHEAD: {(overhead*100).toFixed(0)}%</label><input type="range" min={0.1} max={0.5} step={0.05} value={overhead} onChange={e=>setOverhead(+e.target.value)}/></div></div>
        <div>
          <div className="card" style={{marginBottom:14}}>
            <div className="section-title">Total Budget</div>
            <div style={{fontSize:36,fontWeight:800,color:"var(--accent)",letterSpacing:"-0.04em"}}>{fmt(total)}</div>
            <div style={{fontSize:12,color:"var(--text2)",marginTop:3}}>For {proj.name} — 2026</div>
          </div>
          <div className="card"><div className="section-title">Breakdown</div><div style={{display:"flex",alignItems:"center",gap:14}}><PieChart data={pie} size={110}/><div style={{flex:1}}>{pie.map(d=>(<div key={d.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}><div style={{display:"flex",alignItems:"center",gap:5,fontSize:12}}><div style={{width:7,height:7,borderRadius:2,background:d.color}}/>{d.label}</div><div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:700}}>{fmt(d.value)}</div><div style={{fontSize:10,color:"var(--text3)"}}>{(d.value/total*100).toFixed(1)}%</div></div></div>))}</div></div></div>
        </div>
      </div>
    </div>
  );
};

const BurndownPage = ({ sprints, tasks, projects }) => {
  const [projId,setProjId]=useState(projects[0]?.id||"");
  const projSprints=sprints.filter(s=>s.projectId===projId);
  const activeSprint=projSprints.find(s=>s.status==="Active")||projSprints[0];
  const projTasks=tasks.filter(t=>t.projectId===projId&&t.sprint===activeSprint?.name);
  const totalPoints=projTasks.reduce((s,t)=>s+(t.storyPoints||0),0);
  const completed=projTasks.filter(t=>t.status==="Completed").reduce((s,t)=>s+(t.storyPoints||0),0);
  const days=14;
  const ideal=Array.from({length:days+1},(_,i)=>totalPoints-(totalPoints/days)*i);
  const actual=[totalPoints,...Array.from({length:6},(_,i)=>Math.max(0,totalPoints-(completed/6)*(i+1)*(0.8+Math.random()*0.4)))];
  const labels=Array.from({length:days+1},(_,i)=>`D${i}`);
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Burndown Chart</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Sprint progress vs ideal burndown — 2026</p></div>
      <div style={{marginBottom:16}}><select value={projId} onChange={e=>setProjId(e.target.value)} style={{maxWidth:280}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      <div className="stagger" style={{display:"flex",gap:14,marginBottom:18,flexWrap:"wrap"}}>
        <StatCard label="Total Points" value={totalPoints} sub="In this sprint" color="var(--accent)" icon="sprint"/>
        <StatCard label="Completed" value={completed} sub="Done" color="var(--green)" icon="check"/>
        <StatCard label="Remaining" value={totalPoints-completed} sub="Points left" color="var(--orange)" icon="burn"/>
        <StatCard label="Sprint Tasks" value={projTasks.length} color="var(--purple)" icon="task"/>
      </div>
      <div className="card" style={{marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div className="section-title" style={{marginBottom:0}}>Sprint Burndown — {activeSprint?.name||"No Sprint"}</div><div style={{display:"flex",gap:14}}>{[["Ideal","#3b82f6"],["Actual","#22d3a0"]].map(([l,c])=><div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}><div style={{width:20,height:2,background:c}}/>{l}</div>)}</div></div><LineChart datasets={[{label:"Ideal",values:ideal,color:"#3b82f6"},{label:"Actual",values:actual,color:"#22d3a0"}]} labels={labels} height={200}/></div>
    </div>
  );
};

const VelocityPage = ({ sprints, projects }) => {
  const [projId,setProjId]=useState(projects[0]?.id||"");
  const projSprints=sprints.filter(s=>s.projectId===projId);
  const done=projSprints.filter(s=>s.status!=="Planned");
  const avg=done.length>0?(done.reduce((s,sp)=>s+sp.velocity,0)/done.length).toFixed(1):0;
  const proj=projects.find(p=>p.id===projId)||projects[0];
  const BAC=proj?proj.kloc*1000:50000;
  const PV=BAC*(proj?.progress||0)/100,EV=PV*0.92,AC=PV*1.1;
  const SV=EV-PV,CV=EV-AC,SPI=EV/Math.max(PV,1),CPI=EV/Math.max(AC,1),EAC=BAC/Math.max(CPI,0.01);
  const fmt=n=>"$"+Math.abs(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",");
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Velocity & Earned Value (EVM)</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Sprint velocity and earned value analysis — 2026</p></div>
      <div style={{marginBottom:16}}><select value={projId} onChange={e=>setProjId(e.target.value)} style={{maxWidth:280}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      <div className="stagger" style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:18}}>
        <StatCard label="Avg Velocity" value={avg} sub="Story pts/sprint" color="var(--accent)" icon="velocity"/>
        <StatCard label="SPI" value={SPI.toFixed(2)} sub={SPI>=1?"Ahead of schedule":"Behind schedule"} color={SPI>=1?"var(--green)":"var(--red)"} icon="timeline"/>
        <StatCard label="CPI" value={CPI.toFixed(2)} sub={CPI>=1?"Under budget":"Over budget"} color={CPI>=1?"var(--green)":"var(--red)"} icon="budget"/>
        <StatCard label="EAC" value={"$"+(EAC/1000).toFixed(0)+"k"} sub="Est. at completion" color="var(--purple)" icon="analytics"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card"><div className="section-title">Sprint Velocity</div>{projSprints.length>0?<LineChart datasets={[{label:"Planned",values:projSprints.map(s=>s.planned),color:"#3b82f6"},{label:"Velocity",values:projSprints.map(s=>s.velocity||0),color:"#22d3a0"}]} labels={projSprints.map(s=>s.name.replace("Sprint","S"))} height={150}/>:<p style={{color:"var(--text3)",textAlign:"center",padding:20}}>No sprint data</p>}</div>
        <div className="card"><div className="section-title">EVM Metrics</div>{[["Planned Value (PV)",fmt(PV),"var(--accent)"],["Earned Value (EV)",fmt(EV),"var(--green)"],["Actual Cost (AC)",fmt(AC),"var(--orange)"],["Schedule Variance (SV)",(SV>=0?"+":"-")+fmt(SV),SV>=0?"var(--green)":"var(--red)"],["Cost Variance (CV)",(CV>=0?"+":"-")+fmt(CV),CV>=0?"var(--green)":"var(--red)"],["EAC (Forecast)",fmt(EAC),"var(--purple)"]].map(([l,v,c])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--border)",fontSize:12}}><span style={{color:"var(--text2)"}}>{l}</span><span style={{fontWeight:700,color:c}}>{v}</span></div>))}</div>
      </div>
    </div>
  );
};

const CalendarPage = ({ tasks, projects }) => {
  const [date,setDate]=useState(new Date(2026,1,1)); // Feb 2026
  const [projId,setProjId]=useState("all");
  const year=date.getFullYear(),month=date.getMonth();
  const firstDay=new Date(year,month,1).getDay(),daysInMonth=new Date(year,month+1,0).getDate();
  const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const filtered=projId==="all"?tasks:tasks.filter(t=>t.projectId===projId);
  const getDayTasks=day=>filtered.filter(t=>{if(!t.deadline)return false;const d=new Date(t.deadline);return d.getFullYear()===year&&d.getMonth()===month&&d.getDate()===day;});
  const priorityColors={Critical:"#f43f5e",High:"#f97316",Medium:"#fbbf24",Low:"#22d3a0"};
  const today=new Date();
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Project Calendar</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Task deadlines and milestones — 2026</p></div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button className="btn-ghost" style={{padding:"7px 12px"}} onClick={()=>setDate(new Date(year,month-1,1))}>←</button>
          <h2 style={{fontSize:18,fontWeight:700}}>{monthNames[month]} {year}</h2>
          <button className="btn-ghost" style={{padding:"7px 12px"}} onClick={()=>setDate(new Date(year,month+1,1))}>→</button>
        </div>
        <select value={projId} onChange={e=>setProjId(e.target.value)} style={{maxWidth:220}}><option value="all">All Projects</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
      </div>
      <div className="card">
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginBottom:4}}>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div key={d} style={{textAlign:"center",fontSize:11,fontWeight:600,color:"var(--text3)",padding:"6px 0"}}>{d}</div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
          {Array.from({length:firstDay}).map((_,i)=><div key={"e"+i} style={{minHeight:80}}/>)}
          {Array.from({length:daysInMonth},(_,i)=>i+1).map(day=>{
            const dayTasks=getDayTasks(day);
            const isToday=today.getFullYear()===year&&today.getMonth()===month&&today.getDate()===day;
            return(
              <div key={day} style={{minHeight:80,background:isToday?"var(--accent)10":"var(--bg3)",borderRadius:6,padding:6,border:isToday?"1px solid var(--accent)":"1px solid var(--border)",transition:"background 0.15s"}} onMouseEnter={e=>{if(!isToday)e.currentTarget.style.background="var(--bg4)"}} onMouseLeave={e=>{if(!isToday)e.currentTarget.style.background="var(--bg3)"}}>
                <div style={{fontSize:12,fontWeight:isToday?800:500,color:isToday?"var(--accent)":"var(--text2)",marginBottom:3}}>{day}</div>
                {dayTasks.slice(0,2).map(t=><div key={t.id} style={{fontSize:9,background:priorityColors[t.priority]+"30",color:priorityColors[t.priority],borderRadius:3,padding:"2px 4px",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontWeight:600}}>{t.title}</div>)}
                {dayTasks.length>2&&<div style={{fontSize:9,color:"var(--text3)"}}>+{dayTasks.length-2}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage = ({ projects, tasks, risks, team }) => {
  const effortDist=[{label:"Requirements",value:15,color:"#3b82f6"},{label:"Design",value:20,color:"#22d3a0"},{label:"Development",value:40,color:"#f97316"},{label:"Testing",value:18,color:"#a78bfa"},{label:"Maintenance",value:7,color:"#fbbf24"}];
  const riskByCat={};risks.forEach(r=>{riskByCat[r.category]=(riskByCat[r.category]||0)+1;});
  const completionRate=(tasks.filter(t=>t.status==="Completed").length/Math.max(tasks.length,1)*100).toFixed(0);
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Analytics Dashboard</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Comprehensive metrics — Jan to Mar 2026</p></div>
      <div className="stagger" style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:18}}>
        <StatCard label="Task Completion" value={completionRate+"%"} sub={`${tasks.filter(t=>t.status==="Completed").length}/${tasks.length}`} color="var(--green)" icon="check"/>
        <StatCard label="Avg Progress" value={(projects.reduce((s,p)=>s+p.progress,0)/Math.max(projects.length,1)).toFixed(0)+"%"} color="var(--accent)" icon="analytics"/>
        <StatCard label="High Risks" value={risks.filter(r=>r.probability*r.impact>=2).length} color="var(--red)" icon="risk"/>
        <StatCard label="Team Size" value={team.length} color="var(--purple)" icon="team"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        <div className="card"><div className="section-title">Effort Distribution</div><div style={{display:"flex",alignItems:"center",gap:16}}><PieChart data={effortDist} size={120}/><div style={{flex:1}}>{effortDist.map(d=>(<div key={d.label} style={{marginBottom:7}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:12}}><span style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:2,background:d.color}}/>{d.label}</span><span style={{fontWeight:700,color:d.color}}>{d.value}%</span></div><div style={{height:3,background:"var(--bg3)",borderRadius:2}}><div style={{height:"100%",width:`${d.value}%`,background:d.color,borderRadius:2}}/></div></div>))}</div></div></div>
        <div className="card"><div className="section-title">Project Completion Rings</div><div style={{display:"flex",gap:20,justifyContent:"center",padding:"10px 0"}}>{projects.map((p,i)=><div key={p.id} style={{textAlign:"center"}}><ProgressRing pct={p.progress} size={80} color={["var(--accent)","var(--green)","var(--purple)"][i%3]} label={p.progress+"%"} sublabel={p.name.split(" ")[0]}/></div>)}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card"><div className="section-title">Task Status</div>{["To Do","In Progress","Testing","Completed"].map(s=>{const count=tasks.filter(t=>t.status===s).length;const colors2={"To Do":"var(--text3)","In Progress":"var(--accent)",Testing:"var(--orange)",Completed:"var(--green)"};return(<div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:70,fontSize:11,color:"var(--text2)"}}>{s}</div><div style={{flex:1,height:7,background:"var(--bg3)",borderRadius:4}}><div style={{height:"100%",width:`${(count/Math.max(tasks.length,1))*100}%`,background:colors2[s],borderRadius:4,transition:"width 0.8s ease"}}/></div><span style={{width:24,textAlign:"right",fontSize:12,fontWeight:700,color:colors2[s]}}>{count}</span></div>);})}</div>
        <div className="card"><div className="section-title">Risks by Category</div><MiniBarChart data={Object.entries(riskByCat).map(([label,value])=>({label,value}))} colors={["#3b82f6","#22d3a0","#f97316","#a78bfa","#fbbf24"]} height={90}/></div>
      </div>
    </div>
  );
};

const ReportsPage = ({ projects, tasks, risks }) => {
  const [projId,setProjId]=useState(projects[0]?.id||"");
  const [gen,setGen]=useState(null);
  const proj=projects.find(p=>p.id===projId)||projects[0];
  const simulate=async(fmt)=>{setGen(fmt);await new Promise(r=>setTimeout(r,1500));setGen(null);alert(`✅ ${fmt.toUpperCase()} report generated for "${proj?.name}" (2026)!\n\nIncludes: Project details, COCOMO estimation, Risk analysis, Gantt timeline, Task summary, Budget breakdown, Milestone status`);};
  if(!proj)return null;
  const par={Organic:{a:2.4,b:1.05,c:2.5,d:0.38},"Semi-Detached":{a:3.0,b:1.12,c:2.5,d:0.35},Embedded:{a:3.6,b:1.20,c:2.5,d:0.32}}[proj.complexity]||{a:3.0,b:1.12,c:2.5,d:0.35};
  const effort=par.a*Math.pow(proj.kloc,par.b),time=par.c*Math.pow(effort,par.d);
  const pt=tasks.filter(t=>t.projectId===projId),pr=risks.filter(r=>r.projectId===projId);
  return (
    <div className="page-enter">
      <div style={{marginBottom:22}}><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em"}}>Report Generator</h1><p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>Export comprehensive project reports — 2026</p></div>
      <div style={{marginBottom:16}}><select value={projId} onChange={e=>setProjId(e.target.value)} style={{maxWidth:280}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card">
          <div className="section-title">Report Preview</div>
          <div style={{border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"}}>
            <div style={{background:"var(--bg3)",padding:"10px 14px",borderBottom:"1px solid var(--border)"}}><div style={{fontSize:13,fontWeight:700}}>{proj.name} — Report 2026</div><div style={{fontSize:11,color:"var(--text3)"}}>Team: Ayush, Mayur, Nikhil, Shreya · {new Date().toLocaleDateString()}</div></div>
            <div style={{padding:14,fontSize:12,lineHeight:1.8,color:"var(--text2)"}}>
              <div style={{marginBottom:8}}><strong style={{color:"var(--text)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>Overview</strong><br/>{proj.domain} · {proj.model} · {proj.teamSize} devs · {proj.kloc}k LOC</div>
              <div style={{marginBottom:8}}><strong style={{color:"var(--text)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>COCOMO</strong><br/>Effort: {effort.toFixed(1)} PM · Duration: {time.toFixed(1)} months</div>
              <div style={{marginBottom:8}}><strong style={{color:"var(--text)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>Tasks</strong><br/>Total: {pt.length} · Done: {pt.filter(t=>t.status==="Completed").length} · In Progress: {pt.filter(t=>t.status==="In Progress").length}</div>
              <div><strong style={{color:"var(--text)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>Risks</strong><br/>Total: {pr.length} · High: {pr.filter(r=>r.probability*r.impact>=2).length} · Active: {pr.filter(r=>r.status==="Active").length}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="section-title">Export Options</div>
          {[["pdf","PDF Report","Formatted document with charts","📄","var(--red)"],["excel","Excel Spreadsheet","Data tables for analysis","📊","var(--green)"],["word","Word Document","Editable formatted report","📝","var(--accent)"]].map(([fmt,l,desc,icon,c])=>(
            <div key={fmt} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{fontSize:22}}>{icon}</div><div><div style={{fontSize:13,fontWeight:600}}>{l}</div><div style={{fontSize:11,color:"var(--text3)"}}>{desc}</div></div></div>
              <button onClick={()=>simulate(fmt)} disabled={!!gen} style={{padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:600,background:c+"18",color:c,border:`1px solid ${c}33`,cursor:gen?"wait":"pointer",opacity:gen&&gen!==fmt?0.5:1,whiteSpace:"nowrap",transition:"all 0.2s"}}>{gen===fmt?"Generating...":"Export"}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [theme,setTheme]=useState("dark");
  const [accent,setAccent]=useState("#3b82f6");
  const [projects,setProjects]=useState(SAMPLE_PROJECTS);
  const [tasks,setTasks]=useState(SAMPLE_TASKS);
  const [risks,setRisks]=useState(SAMPLE_RISKS);
  const [team,setTeam]=useState(SAMPLE_TEAM);
  const [sprints,setSprints]=useState(SAMPLE_SPRINTS);
  const [milestones,setMilestones]=useState(SAMPLE_MILESTONES);
  const [notifications,setNotifications]=useState(SAMPLE_NOTIFICATIONS);
  const [showNotif,setShowNotif]=useState(false);
  const [showSearch,setShowSearch]=useState(false);
  const unreadCount=notifications.filter(n=>!n.read).length;

  useEffect(()=>{
    const handler=(e)=>{
      if(e.key==="Escape"){setShowSearch(false);setShowNotif(false);}
      if((e.ctrlKey||e.metaKey)&&e.key==="k"){e.preventDefault();setShowSearch(true);}
    };
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[]);

  if(!user)return<><GlobalStyles theme={theme} accent={accent}/><LoginScreen onLogin={setUser} theme={theme} accent={accent}/></>;

  const pages={
    dashboard:<DashboardPage projects={projects} tasks={tasks} risks={risks} team={team}/>,
    projects:<ProjectsPage projects={projects} setProjects={setProjects}/>,
    team:<TeamPage team={team} setTeam={setTeam}/>,
    sdlc:<SDLCPage/>,
    estimate:<EstimatePage projects={projects}/>,
    threepoint:<ThreePointPage/>,
    compare:<ComparePage/>,
    timeline:<TimelinePage projects={projects}/>,
    sprint:<SprintPage sprints={sprints} setSprints={setSprints} tasks={tasks} projects={projects}/>,
    tasks:<TasksPage tasks={tasks} setTasks={setTasks} projects={projects} sprints={sprints}/>,
    risks:<RisksPage risks={risks} setRisks={setRisks} projects={projects}/>,
    budget:<BudgetPage projects={projects}/>,
    burndown:<BurndownPage sprints={sprints} tasks={tasks} projects={projects}/>,
    velocity:<VelocityPage sprints={sprints} projects={projects}/>,
    milestones:<MilestonesPage milestones={milestones} setMilestones={setMilestones} projects={projects}/>,
    calendar:<CalendarPage tasks={tasks} projects={projects}/>,
    analytics:<AnalyticsPage projects={projects} tasks={tasks} risks={risks} team={team}/>,
    reports:<ReportsPage projects={projects} tasks={tasks} risks={risks}/>,
  };

  return (
    <>
      <GlobalStyles theme={theme} accent={accent}/>
      {showSearch&&<SearchPanel projects={projects} tasks={tasks} risks={risks} team={team} onClose={()=>setShowSearch(false)} onNav={setPage}/>}
      <div style={{display:"flex",minHeight:"100vh"}}>
        <Sidebar current={page} onNav={setPage} user={user} onLogout={()=>setUser(null)} theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Top bar */}
          <div style={{background:"var(--bg2)",borderBottom:"1px solid var(--border)",padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:10,flexShrink:0}}>
            <button onClick={()=>setShowSearch(true)} style={{display:"flex",alignItems:"center",gap:8,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"7px 14px",color:"var(--text3)",cursor:"pointer",fontSize:12,transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
              <Icon name="search" size={13}/> Search <kbd style={{padding:"1px 5px",background:"var(--bg4)",border:"1px solid var(--border)",borderRadius:4,fontSize:10}}>⌘K</kbd>
            </button>
            <div style={{position:"relative"}}>
              <Tip text="Notifications">
                <button onClick={()=>setShowNotif(!showNotif)} style={{width:34,height:34,borderRadius:8,background:showNotif?"var(--bg3)":"transparent",border:"1px solid "+(showNotif?"var(--accent)":"var(--border)"),display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--text2)",transition:"all 0.2s"}}>
                  <Icon name="bell" size={15}/>
                  {unreadCount>0&&<div className="notif-dot"/>}
                </button>
              </Tip>
              {showNotif&&<NotificationsPanel notifications={notifications} setNotifications={setNotifications} onClose={()=>setShowNotif(false)}/>}
            </div>
            <Tip text={user.name+" · "+user.role}>
              <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,var(--accent),var(--purple))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer"}}>{user.avatar}</div>
            </Tip>
          </div>
          <main style={{flex:1,padding:"22px 26px",overflowY:"auto"}}>
            {pages[page]||pages.dashboard}
          </main>
        </div>
      </div>
    </>
  );
}
