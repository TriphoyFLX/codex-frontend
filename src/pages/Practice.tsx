import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/* ─── Icons ─────────────────────────────────────────────────── */
const FireIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3a29.3 29.3 0 0 0 3.9 1"/>
  </svg>
);
const TrophyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const CoinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>
  </svg>
);
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const LightbulbIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const TrendUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const BuildingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="2" x2="9" y2="22"/><line x1="15" y1="2" x2="15" y2="22"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="7" x2="9" y2="7"/><line x1="15" y1="7" x2="20" y2="7"/><line x1="4" y1="17" x2="9" y2="17"/><line x1="15" y1="17" x2="20" y2="17"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const AwardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
  </svg>
);
const ChartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const BotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/* ─── Shared style block ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Manrope:wght@300;400;500;600;700&display=swap');
  :root { --acid:#5D45FD; --ink:#FAFAFA; --ink2:#FFFFFF; --line:rgba(0,0,0,0.08); --muted:rgba(0,0,0,0.45); --text:rgba(0,0,0,0.82); }
  .pr * { box-sizing: border-box; }
  .pr { font-family:'Manrope',sans-serif; background:var(--ink); color:var(--text); min-height:100vh; }

  @keyframes reveal { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  .rv{opacity:0;animation:reveal 0.6s cubic-bezier(0.22,1,0.36,1) forwards;}
  .d1{animation-delay:.04s}.d2{animation-delay:.1s}.d3{animation-delay:.17s}.d4{animation-delay:.25s}.d5{animation-delay:.33s}

  .sh{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);}
  .disp{font-family:'Bebas Neue',sans-serif;letter-spacing:0.03em;}
  .mono-sm{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:0.06em;}
  .hr{height:1px;background:var(--line);}
  .badge{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;border:1px solid var(--line);color:var(--muted);padding:3px 8px;display:inline-block;}
  .badge-acid{border-color:rgba(93,69,253,0.4);color:var(--acid);}
  .badge-ok{border-color:rgba(16,185,129,0.35);color:#10b981;}
  .badge-warn{border-color:rgba(245,158,11,0.35);color:#f59e0b;}

  .btn-acid{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:var(--acid);color:#FFFFFF;border:none;padding:12px 22px;cursor:pointer;transition:opacity .15s;white-space:nowrap;border-radius:12px;}
  .btn-acid:hover{opacity:.88;}
  .btn-acid:disabled{opacity:.35;cursor:not-allowed;}
  .btn-ghost{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:transparent;color:var(--muted);border:1px solid var(--line);padding:11px 20px;cursor:pointer;transition:border-color .15s,color .15s;white-space:nowrap;border-radius:12px;}
  .btn-ghost:hover{border-color:rgba(0,0,0,0.25);color:var(--text);}
  .btn-warn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;background:#f59e0b;color:#FFFFFF;border:none;padding:12px 22px;cursor:pointer;transition:opacity .15s;white-space:nowrap;border-radius:12px;}
  .btn-warn:hover{opacity:.88;}
  .btn-warn:disabled{opacity:.35;cursor:not-allowed;}

  .card{border:1px solid var(--line);background:var(--ink2);padding:20px;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.05);}
  .streak-card{background:linear-gradient(135deg,rgba(93,69,253,0.9),rgba(147,51,234,0.9));color:#FFFFFF;padding:24px;border-radius:20px;}
  .leader-row{border:1px solid var(--line);background:var(--ink2);padding:16px;border-radius:12px;display:flex;align-items:center;gap:16px;transition:border-color .2s;}
  .leader-row:hover{border-color:rgba(93,69,253,0.3);}
  .leader-row.gold{border-color:rgba(234,179,8,0.5);background:rgba(234,179,8,0.05);}

  .inp{width:100%;background:rgba(0,0,0,0.03);border:1px solid var(--line);color:var(--text);font-family:'Manrope',sans-serif;font-size:13px;padding:11px 14px;outline:none;transition:border-color .15s;border-radius:12px;}
  .inp:focus{border-color:rgba(93,69,253,0.5);}
  .inp::placeholder{color:var(--muted);}

  .quiz-opt{border:1px solid var(--line);padding:12px 16px;border-radius:10px;cursor:pointer;transition:border-color .15s,background .15s;display:flex;align-items:center;gap:10px;}
  .quiz-opt:hover{border-color:rgba(93,69,253,0.3);background:rgba(93,69,253,0.02);}
  .quiz-opt input{accent-color:var(--acid);}

  .hint-box{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);padding:16px;border-radius:12px;}
  .result-box{padding:20px;border-radius:12px;}
  .result-box.ok{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);}
  .result-box.err{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);}

  .tab-btn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;padding:10px 20px;border-radius:10px;cursor:pointer;transition:all .15s;border:none;background:transparent;color:var(--muted);}
  .tab-btn:hover{color:var(--text);}
  .tab-btn.active{background:var(--acid);color:#FFFFFF;}

  /* Business Game Styles */
  .game-stat{border:1px solid var(--line);background:var(--ink2);padding:16px;border-radius:12px;text-align:center;}
  .game-stat-val{font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--text);}
  .game-stat-label{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted);margin-top:4px;}
  .game-action{border:1px solid var(--line);background:var(--ink2);padding:20px;border-radius:12px;cursor:pointer;transition:border-color .2s,background .2s;}
  .game-action:hover{border-color:rgba(93,69,253,0.3);background:rgba(93,69,253,0.02);}
  .game-action.disabled{opacity:.5;cursor:not-allowed;}
  .game-action.premium{border-color:rgba(234,179,8,0.4);background:rgba(234,179,8,0.05);}
  .game-action.premium:hover{border-color:rgba(234,179,8,0.6);background:rgba(234,179,8,0.1);}
  .game-event{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);padding:20px;border-radius:12px;}
  .game-progress{height:8px;background:rgba(0,0,0,0.05);border-radius:4px;overflow:hidden;}
  .game-progress-bar{height:100%;background:linear-gradient(90deg,var(--acid),#9333ea);transition:width .3s;}
  .achievement{background:linear-gradient(135deg,rgba(234,179,8,0.1),rgba(234,179,8,0.05));border:1px solid rgba(234,179,8,0.3);padding:12px;border-radius:10px;display:flex;align-items:center;gap:10px;}
  .achievement.locked{opacity:.5;filter:grayscale(1);}
  .market-indicator{padding:8px 12px;border-radius:8px;font-family:'DM Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;}
  .market-bull{background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.3);}
  .market-bear{background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.3);}
  .upgrade-card{border:1px solid var(--line);background:var(--ink2);padding:16px;border-radius:12px;cursor:pointer;transition:all .2s;}
  .upgrade-card:hover{border-color:rgba(93,69,253,0.4);transform:translateY(-2px);}
  .upgrade-card.purchased{border-color:rgba(16,185,129,0.4);background:rgba(16,185,129,0.05);}
`;

export default function Practice() {
  const { token } = useAuth();
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [streak, setStreak] = useState<any>(null);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'leaderboard' | 'game'>('daily');
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<any>(null);

  // AI Coding Challenge State
  const [aiTask, setAiTask] = useState<any>(null);
  const [userCode, setUserCode] = useState('');
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Business Game State
  const [gameState, setGameState] = useState<any>(null);
  const [gameEvent, setGameEvent] = useState<any>(null);
  const [showGameEvent, setShowGameEvent] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [gameLevel, setGameLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isGeneratingEvent, setIsGeneratingEvent] = useState(false);

  useEffect(() => { if (token) { loadDailyChallenge(); loadLeaderboard(); } }, [token]);

  const loadDailyChallenge = async () => {
    try {
      const r = await fetch(`${API}/api/challenges/daily`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await r.json();
      setDailyChallenge(json.challenge);
      setStreak(json.streak);
      setAlreadyAttempted(json.alreadyAttempted);
    } catch (e) { console.error(e); }
  };

  const loadLeaderboard = async () => {
    try {
      const r = await fetch(`${API}/api/challenges/leaderboard`, { headers: { Authorization: `Bearer ${token}` } });
      setLeaderboard(await r.json());
    } catch (e) { console.error(e); }
  };

  const getHint = async () => {
    if (!dailyChallenge) return;
    try {
      const r = await fetch(`${API}/api/challenges/${dailyChallenge.id}/hint`, { headers: { Authorization: `Bearer ${token}` } });
      setShowHint((await r.json()).hint);
      setHintUsed(true);
    } catch (e) { alert('Недостаточно монет для подсказки'); }
  };

  const submitAnswer = async () => {
    if (!dailyChallenge || !userAnswer) return;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    try {
      const content = JSON.parse(dailyChallenge.content);
      let answerToSend = userAnswer;
      if (dailyChallenge.type === 'quiz') answerToSend = userAnswer;
      else if (dailyChallenge.type === 'fill_blank') answerToSend = userAnswer;
      else if (dailyChallenge.type === 'matching') answerToSend = JSON.parse(userAnswer);

      const r = await fetch(`${API}/api/challenges/${dailyChallenge.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answer: answerToSend, timeSpent, usedHint: hintUsed }),
      });
      const json = await r.json();
      setResult(json);
      setShowAnswer(true);
      loadDailyChallenge();
    } catch (e) { console.error(e); }
  };

  const startChallenge = () => {
    setStartTime(Date.now());
    setUserAnswer('');
    setShowHint(false);
    setHintUsed(false);
    setResult(null);
    setShowAnswer(false);
  };

  // Business Game Functions
  const startGame = (level: 'easy' | 'medium' | 'hard' = 'easy') => {
    setGameLevel(level);
    const levelConfig = {
      easy: { money: 15000, maxDays: 30, churnRate: 3, customers: 10 },
      medium: { money: 10000, maxDays: 25, churnRate: 5, customers: 0 },
      hard: { money: 5000, maxDays: 20, churnRate: 8, customers: 0 }
    };
    const config = levelConfig[level];
    setGameState({
      money: config.money,
      customers: config.customers,
      team: 1,
      productQuality: 50,
      day: 1,
      maxDays: config.maxDays,
      morale: 100,
      companyName: 'MyStartup',
      marketCondition: 'neutral',
      customerSatisfaction: 70,
      churnRate: config.churnRate,
      upgrades: {
        betterServer: false,
        security: false,
        analytics: false,
        automation: false,
        aiSupport: false
      },
      fundingRound: 0,
      totalRevenue: 0,
      level: level
    });
    setGameEvent(null);
    setShowGameEvent(false);
    setAchievements([]);
    setShowUpgrades(false);
  };

  const saveGame = () => {
    if (!gameState) return;
    const saveData = {
      gameState,
      achievements,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('businessGameSave', JSON.stringify(saveData));
    alert('Игра сохранена!');
  };

  const loadGame = () => {
    const saveData = localStorage.getItem('businessGameSave');
    if (saveData) {
      const data = JSON.parse(saveData);
      setGameState(data.gameState);
      setAchievements(data.achievements || []);
      setGameLevel(data.gameState.level || 'easy');
      alert('Игра загружена!');
    } else {
      alert('Нет сохраненной игры.');
    }
  };

  const makeDecision = (type: string) => {
    if (!gameState) return;
    const newGameState = { ...gameState, day: gameState.day + 1 };

    switch (type) {
      case 'hire':
        if (gameState.money >= 2000) {
          newGameState.money -= 2000;
          newGameState.team += 1;
          newGameState.morale = Math.min(100, newGameState.morale + 10);
        }
        break;
      case 'marketing':
        if (gameState.money >= 1500) {
          newGameState.money -= 1500;
          const gainedCustomers = Math.floor(Math.random() * 30) + 20;
          newGameState.customers += gainedCustomers;
          newGameState.customerSatisfaction = Math.min(100, newGameState.customerSatisfaction + 2);
        }
        break;
      case 'develop':
        if (gameState.money >= 1000) {
          newGameState.money -= 1000;
          newGameState.productQuality = Math.min(100, newGameState.productQuality + 15);
          newGameState.customerSatisfaction = Math.min(100, newGameState.customerSatisfaction + 5);
        }
        break;
      case 'rest':
        newGameState.morale = Math.min(100, newGameState.morale + 20);
        break;
      case 'funding':
        if (gameState.money >= 500 && gameState.fundingRound < 3) {
          newGameState.money -= 500;
          const fundingAmounts = [5000, 25000, 100000];
          newGameState.money += fundingAmounts[gameState.fundingRound];
          newGameState.fundingRound += 1;
          newGameState.customers += Math.floor(fundingAmounts[gameState.fundingRound - 1] / 100);
        }
        break;
      case 'partnership':
        if (gameState.money >= 3000 && gameState.customers >= 50) {
          newGameState.money -= 3000;
          newGameState.customers += Math.floor(gameState.customers * 0.3);
          newGameState.productQuality = Math.min(100, newGameState.productQuality + 10);
        }
        break;
      case 'security':
        if (gameState.money >= 2000 && !gameState.upgrades.security) {
          newGameState.money -= 2000;
          newGameState.upgrades = { ...gameState.upgrades, security: true };
          newGameState.customerSatisfaction = Math.min(100, newGameState.customerSatisfaction + 15);
          newGameState.churnRate = Math.max(0, newGameState.churnRate - 2);
        }
        break;
      case 'analytics':
        if (gameState.money >= 1500 && !gameState.upgrades.analytics) {
          newGameState.money -= 1500;
          newGameState.upgrades = { ...gameState.upgrades, analytics: true };
          newGameState.customers += Math.floor(Math.random() * 20) + 10;
        }
        break;
      case 'automation':
        if (gameState.money >= 3000 && !gameState.upgrades.automation) {
          newGameState.money -= 3000;
          newGameState.upgrades = { ...gameState.upgrades, automation: true };
          newGameState.team = Math.max(1, gameState.team - 1);
          newGameState.morale = Math.min(100, newGameState.morale + 15);
        }
        break;
      case 'ai':
        if (gameState.money >= 5000 && !gameState.upgrades.aiSupport) {
          newGameState.money -= 5000;
          newGameState.upgrades = { ...gameState.upgrades, aiSupport: true };
          newGameState.productQuality = Math.min(100, newGameState.productQuality + 20);
          newGameState.customerSatisfaction = Math.min(100, newGameState.customerSatisfaction + 20);
        }
        break;
    }

    // Market condition effects
    if (newGameState.marketCondition === 'bull') {
      newGameState.customers += Math.floor(newGameState.customers * 0.05);
    } else if (newGameState.marketCondition === 'bear') {
      newGameState.customers = Math.floor(newGameState.customers * 0.95);
    }

    // Calculate daily revenue based on customers, product quality, and satisfaction
    const satisfactionBonus = newGameState.customerSatisfaction / 100;
    const dailyRevenue = Math.floor(newGameState.customers * (newGameState.productQuality / 100) * 5 * satisfactionBonus);
    newGameState.money += dailyRevenue;
    newGameState.totalRevenue += dailyRevenue;

    // Team salary
    newGameState.money -= newGameState.team * 500;

    // Churn
    const churnedCustomers = Math.floor(newGameState.customers * (newGameState.churnRate / 100));
    newGameState.customers -= churnedCustomers;

    // Check for achievements
    checkAchievements(newGameState);

    // Check for random event
    if (Math.random() < 0.3) {
      triggerRandomEvent(newGameState);
    } else {
      setGameState(newGameState);
    }
  };

  const checkAchievements = (state: any) => {
    const newAchievements = [];
    if (state.customers >= 100 && !achievements.includes('first_100')) newAchievements.push('first_100');
    if (state.customers >= 500 && !achievements.includes('first_500')) newAchievements.push('first_500');
    if (state.customers >= 1000 && !achievements.includes('first_1000')) newAchievements.push('first_1000');
    if (state.money >= 50000 && !achievements.includes('rich')) newAchievements.push('rich');
    if (state.fundingRound >= 3 && !achievements.includes('funded')) newAchievements.push('funded');
    if (state.productQuality >= 90 && !achievements.includes('quality')) newAchievements.push('quality');
    if (state.team >= 5 && !achievements.includes('big_team')) newAchievements.push('big_team');
    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements]);
    }
  };

  const triggerRandomEvent = async (state: any) => {
    setIsGeneratingEvent(true);
    try {
      const response = await fetch(`${API}/api/ai/generate-business-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentDay: state.day,
          money: state.money,
          customers: state.customers,
          team: state.team,
          difficulty: gameLevel
        })
      });
      const event = await response.json();
      const newState = { ...state };
      Object.keys(event.effect).forEach(key => {
        if (key === 'marketCondition') {
          (newState as any)[key] = (event.effect as any)[key];
        } else {
          (newState as any)[key] = Math.max(0, ((newState as any)[key] || 0) + (event.effect as any)[key]);
        }
      });
      setGameEvent(event);
      setGameState(newState);
      setShowGameEvent(true);
    } catch (e) {
      console.error(e);
      // Fallback to hardcoded events if AI fails
      const events = [
        { title: 'Инвестор проявил интерес!', effect: { money: 5000 }, description: 'Ангельский инвестор вложил $5000 в ваш проект.' },
        { title: 'Сервер упал!', effect: { customers: -Math.floor(state.customers * 0.2) }, description: 'Временный сбой сервера оттолкнул некоторых клиентов.' },
        { title: 'Вирусный успех!', effect: { customers: 50 }, description: 'О вас написали в популярном блоге. Прилив новых клиентов!' },
        { title: 'Конкурент запустил похожий продукт', effect: { productQuality: -10 }, description: 'Конкурент заставил вас пересмотреть стратегию.' },
        { title: 'Команда выгорела', effect: { morale: -20 }, description: 'Команда устала от переработок.' },
      ];
      const event = events[Math.floor(Math.random() * events.length)];
      const newState = { ...state };
      Object.keys(event.effect).forEach(key => {
        if (key === 'marketCondition') {
          (newState as any)[key] = (event.effect as any)[key];
        } else {
          (newState as any)[key] = Math.max(0, ((newState as any)[key] || 0) + (event.effect as any)[key]);
        }
      });
      setGameEvent(event);
      setGameState(newState);
      setShowGameEvent(true);
    } finally {
      setIsGeneratingEvent(false);
    }
  };

  const closeGameEvent = () => {
    setShowGameEvent(false);
    setGameEvent(null);
  };

  // AI Coding Challenge Functions
  const generateAITask = async () => {
    setIsGeneratingTask(true);
    setAiFeedback(null);
    setUserCode('');
    try {
      const response = await fetch(`${API}/api/ai/generate-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const task = await response.json();
      setAiTask(task);
    } catch (e) {
      console.error(e);
      // Fallback to predefined tasks if API fails
      const tasks = [
        { type: 'frontend', title: 'Создай лендинг', description: 'Напиши HTML/CSS код для простого лендинга страницы с hero секцией, кнопкой CTA и футером.', difficulty: 'Легкий' },
        { type: 'frontend', title: 'Создай форму входа', description: 'Напиши React компонент для формы входа с валидацией email и пароля.', difficulty: 'Средний' },
        { type: 'backend', title: 'REST API эндпоинт', description: 'Напиши Express.js эндпоинт для создания пользователя с валидацией.', difficulty: 'Средний' },
        { type: 'fullstack', title: 'Todo приложение', description: 'Опиши архитектуру и напиши базовый код для простого todo приложения.', difficulty: 'Сложный' },
        { type: 'frontend', title: 'Адаптивная навигация', description: 'Создай адаптивное меню навигации с мобильным гамбургером.', difficulty: 'Средний' },
        { type: 'backend', title: 'Аутентификация JWT', description: 'Реализуй систему аутентификации с JWT токенами.', difficulty: 'Сложный' },
      ];
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      setAiTask(randomTask);
    } finally {
      setIsGeneratingTask(false);
    }
  };

  const submitCodeSolution = async () => {
    if (!userCode.trim() || !aiTask) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API}/api/ai/review-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: aiTask, userCode })
      });
      const feedback = await response.json();
      setAiFeedback(feedback);
    } catch (e) {
      console.error(e);
      // Fallback to simulated feedback if API fails
      const feedback = {
        correct: false,
        score: Math.floor(Math.random() * 30) + 70,
        comment: 'Не удалось получить AI-оценку. Попробуйте еще раз.',
        suggestions: ['Проверьте соединение с сервером', 'Убедитесь, что код корректен'],
        correctSolution: null
      };
      setAiFeedback(feedback);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderChallengeContent = () => {
    if (!dailyChallenge) return null;
    const content = JSON.parse(dailyChallenge.content);
    if (dailyChallenge.type === 'quiz') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {content.questions.map((q: any, idx: number) => (
            <div key={idx} style={{ fontFamily: 'Manrope', fontSize: 13, color: 'var(--text)' }}>
              <p style={{ fontWeight: 600, marginBottom: 12 }}>{q.question}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {q.options.map((opt: string, optIdx: number) => (
                  <label key={optIdx} className="quiz-opt">
                    <input type="radio" name={`q-${idx}`} value={opt} onChange={e => setUserAnswer(e.target.value)} disabled={showAnswer} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (dailyChallenge.type === 'fill_blank') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontFamily: 'Manrope', fontSize: 15, color: 'var(--text)' }}>{content.text.replace('___', '________')}</p>
          <input className="inp" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} disabled={showAnswer} placeholder="Введите ответ" />
        </div>
      );
    }
    return <span className="mono-sm">Тип задания не поддерживается</span>;
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="pr pb-20">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="rv d1" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <div className="sh mb-2">Платформа / Практика</div>
              <h1 className="disp" style={{ fontSize: 'clamp(36px,5vw,56px)', color: 'var(--text)' }}>Практика</h1>
            </div>
            <div className="flex gap-3">
              <button className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => setActiveTab('daily')}>AI Задания</button>
              <button className={`tab-btn ${activeTab === 'game' ? 'active' : ''}`} onClick={() => setActiveTab('game')}>Бизнес-игра</button>
              <button className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>Лидерборд</button>
            </div>
          </div>
        </div>

        {/* ── Streak Card ─────────────────────────────────── */}
        {streak && (
          <div className="rv d2 mt-8 px-8">
            <div className="streak-card">
              <div className="flex items-center justify-between">
                <div>
                  <span className="mono-sm" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 8, display: 'block' }}>Текущий стик</span>
                  <span className="disp flex items-center gap-2" style={{ fontSize: 32, color: '#FFFFFF' }}><FireIcon /> {streak.current} дней</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="mono-sm" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 8, display: 'block' }}>Лучший стик</span>
                  <span className="disp flex items-center gap-2 justify-end" style={{ fontSize: 28, color: '#FFFFFF' }}><TrophyIcon /> {streak.longest}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="mono-sm" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 8, display: 'block' }}>Всего дней</span>
                  <span className="disp flex items-center gap-2 justify-end" style={{ fontSize: 28, color: '#FFFFFF' }}><CalendarIcon /> {streak.totalDays}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Business Game ─────────────────────────────── */}
        {activeTab === 'game' && (
          <div className="rv d3 mt-8 px-8">
            {!gameState ? (
              <div className="card text-center" style={{ padding: 60 }}>
                <div style={{ width: 48, height: 48, color: 'var(--acid)', marginBottom: 20, marginLeft: 'auto', marginRight: 'auto' }}><BuildingIcon /></div>
                <h2 className="disp" style={{ fontSize: 32, color: 'var(--text)', marginBottom: 12 }}>Стартап-симулятор</h2>
                <p style={{ fontFamily: 'Manrope', fontSize: 14, color: 'var(--muted)', marginBottom: 24, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
                  Управляйте своим стартапом! Нанимайте команду, инвестируйте в маркетинг, получайте финансирование и развивайте продукт. AI генерирует уникальные события!
                </p>
                <div style={{ marginBottom: 24 }}>
                  <span className="sh mb-3" style={{ display: 'block' }}>Выберите сложность:</span>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <button className="btn-ghost" onClick={() => startGame('easy')} style={{ border: gameLevel === 'easy' ? '2px solid var(--acid)' : '1px solid var(--line)' }}>Легко</button>
                    <button className="btn-ghost" onClick={() => startGame('medium')} style={{ border: gameLevel === 'medium' ? '2px solid var(--acid)' : '1px solid var(--line)' }}>Средне</button>
                    <button className="btn-ghost" onClick={() => startGame('hard')} style={{ border: gameLevel === 'hard' ? '2px solid var(--acid)' : '1px solid var(--line)' }}>Сложно</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
                  <span className="badge badge-acid">AI События</span>
                  <span className="badge badge-acid">Уровни</span>
                  <span className="badge badge-acid">Сохранение</span>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button className="btn-ghost" onClick={loadGame}>Загрузить</button>
                </div>
              </div>
            ) : gameState.day > gameState.maxDays ? (
              <div className="card text-center" style={{ padding: 60 }}>
                <div style={{ width: 48, height: 48, color: '#eab308', marginBottom: 20, marginLeft: 'auto', marginRight: 'auto' }}><TrophyIcon /></div>
                <h2 className="disp" style={{ fontSize: 32, color: 'var(--text)', marginBottom: 12 }}>Игра окончена!</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 600, margin: '0 auto 24px' }}>
                  <div className="game-stat">
                    <div className="game-stat-val">${gameState.money.toLocaleString()}</div>
                    <div className="game-stat-label">Капитал</div>
                  </div>
                  <div className="game-stat">
                    <div className="game-stat-val">{gameState.customers}</div>
                    <div className="game-stat-label">Клиенты</div>
                  </div>
                  <div className="game-stat">
                    <div className="game-stat-val">${gameState.totalRevenue.toLocaleString()}</div>
                    <div className="game-stat-label">Всего доход</div>
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <span className="mono-sm">Достижения: {achievements.length}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button className="btn-acid" onClick={() => startGame(gameLevel)}>Играть снова</button>
                  <button className="btn-ghost" onClick={saveGame}>Сохранить результат</button>
                </div>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
                  <div className="game-stat">
                    <div className="game-stat-val" style={{ fontSize: 22 }}>${gameState.money.toLocaleString()}</div>
                    <div className="game-stat-label">Капитал</div>
                  </div>
                  <div className="game-stat">
                    <div className="game-stat-val" style={{ fontSize: 22 }}>{gameState.customers}</div>
                    <div className="game-stat-label">Клиенты</div>
                  </div>
                  <div className="game-stat">
                    <div className="game-stat-val" style={{ fontSize: 22 }}>{gameState.team}</div>
                    <div className="game-stat-label">Команда</div>
                  </div>
                  <div className="game-stat">
                    <div className="game-stat-val" style={{ fontSize: 22 }}>{gameState.productQuality}%</div>
                    <div className="game-stat-label">Качество</div>
                  </div>
                  <div className="game-stat">
                    <div className="game-stat-val" style={{ fontSize: 22 }}>{gameState.customerSatisfaction}%</div>
                    <div className="game-stat-label">Удовлетворенность</div>
                  </div>
                  <div className="game-stat">
                    <div className="game-stat-val" style={{ fontSize: 22 }}>{gameState.churnRate}%</div>
                    <div className="game-stat-label">Отток</div>
                  </div>
                </div>

                {/* Progress & Market */}
                <div className="card" style={{ marginBottom: 24 }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="sh">День {gameState.day} из {gameState.maxDays} • Уровень: {gameLevel === 'easy' ? 'Легко' : gameLevel === 'medium' ? 'Средне' : 'Сложно'}</span>
                    <div className="flex gap-3">
                      <span className="mono-sm">Мораль: {gameState.morale}%</span>
                      <button className="btn-ghost" onClick={saveGame} style={{ padding: '4px 12px', fontSize: 12 }}>Сохранить</button>
                      <span className={`market-indicator ${gameState.marketCondition === 'bull' ? 'market-bull' : gameState.marketCondition === 'bear' ? 'market-bear' : ''}`}>
                        {gameState.marketCondition === 'bull' ? '📈 Бычий рынок' : gameState.marketCondition === 'bear' ? '📉 Медвежий рынок' : '➡️ Нейтрально'}
                      </span>
                    </div>
                  </div>
                  <div className="game-progress">
                    <div className="game-progress-bar" style={{ width: `${(gameState.day / gameState.maxDays) * 100}%` }} />
                  </div>
                </div>

                {/* Achievements */}
                {achievements.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <span className="sh mb-3" style={{ display: 'block' }}>Достижения ({achievements.length})</span>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {achievements.map(a => (
                        <span key={a} className="badge badge-ok"><AwardIcon /> {a.replace('_', ' ')}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Basic Actions */}
                <div style={{ marginBottom: 24 }}>
                  <span className="sh mb-3" style={{ display: 'block' }}>Базовые действия</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                    <div 
                      className={`game-action ${gameState.money < 2000 ? 'disabled' : ''}`}
                      onClick={() => gameState.money >= 2000 && makeDecision('hire')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <UsersIcon />
                        <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Нанять сотрудника</span>
                      </div>
                      <span className="mono-sm">-$2,000 | +1 команда | +10 мораль</span>
                    </div>
                    <div 
                      className={`game-action ${gameState.money < 1500 ? 'disabled' : ''}`}
                      onClick={() => gameState.money >= 1500 && makeDecision('marketing')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <TrendUpIcon />
                        <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Маркетинг</span>
                      </div>
                      <span className="mono-sm">-$1,500 | +20-50 клиентов</span>
                    </div>
                    <div 
                      className={`game-action ${gameState.money < 1000 ? 'disabled' : ''}`}
                      onClick={() => gameState.money >= 1000 && makeDecision('develop')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <ZapIcon />
                        <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Улучшить продукт</span>
                      </div>
                      <span className="mono-sm">-$1,000 | +15 качество</span>
                    </div>
                    <div 
                      className="game-action"
                      onClick={() => makeDecision('rest')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <LightbulbIcon />
                        <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>День отдыха</span>
                      </div>
                      <span className="mono-sm">+$0 | +20 мораль</span>
                    </div>
                  </div>
                </div>

                {/* Premium Actions */}
                <div style={{ marginBottom: 24 }}>
                  <span className="sh mb-3" style={{ display: 'block' }}>Продвинутые действия</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    <div 
                      className={`game-action premium ${gameState.money < 500 || gameState.fundingRound >= 3 ? 'disabled' : ''}`}
                      onClick={() => gameState.money >= 500 && gameState.fundingRound < 3 && makeDecision('funding')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <CoinIcon />
                        <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Финансирование</span>
                      </div>
                      <span className="mono-sm">Раунд {gameState.fundingRound + 1}/3</span>
                    </div>
                    <div 
                      className={`game-action premium ${gameState.money < 3000 || gameState.customers < 50 ? 'disabled' : ''}`}
                      onClick={() => gameState.money >= 3000 && gameState.customers >= 50 && makeDecision('partnership')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <GlobeIcon />
                        <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Партнерство</span>
                      </div>
                      <span className="mono-sm">-$3,000 | +30% клиентов</span>
                    </div>
                    <div 
                      className={`game-action premium ${gameState.money < 5000 || gameState.upgrades.aiSupport ? 'disabled' : ''}`}
                      onClick={() => gameState.money >= 5000 && !gameState.upgrades.aiSupport && makeDecision('ai')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <ChartIcon />
                        <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>AI Поддержка</span>
                      </div>
                      <span className="mono-sm">-$5,000 | +20 качество</span>
                    </div>
                  </div>
                </div>

                {/* Upgrades */}
                <div>
                  <span className="sh mb-3" style={{ display: 'block' }}>Апгрейды</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    <div 
                      className={`upgrade-card ${gameState.upgrades.security ? 'purchased' : ''} ${gameState.money < 2000 ? 'disabled' : ''}`}
                      onClick={() => gameState.money >= 2000 && !gameState.upgrades.security && makeDecision('security')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <ShieldIcon />
                        <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Безопасность</span>
                      </div>
                      <span className="mono-sm">{gameState.upgrades.security ? '✓ Куплено' : '-$2,000'}</span>
                    </div>
                    <div 
                      className={`upgrade-card ${gameState.upgrades.analytics ? 'purchased' : ''} ${gameState.money < 1500 ? 'disabled' : ''}`}
                      onClick={() => gameState.money >= 1500 && !gameState.upgrades.analytics && makeDecision('analytics')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <ChartIcon />
                        <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Аналитика</span>
                      </div>
                      <span className="mono-sm">{gameState.upgrades.analytics ? '✓ Куплено' : '-$1,500'}</span>
                    </div>
                    <div 
                      className={`upgrade-card ${gameState.upgrades.automation ? 'purchased' : ''} ${gameState.money < 3000 ? 'disabled' : ''}`}
                      onClick={() => gameState.money >= 3000 && !gameState.upgrades.automation && makeDecision('automation')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <ZapIcon />
                        <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Автоматизация</span>
                      </div>
                      <span className="mono-sm">{gameState.upgrades.automation ? '✓ Куплено' : '-$3,000'}</span>
                    </div>
                  </div>
                </div>

                {/* Event Modal */}
                {showGameEvent && gameEvent && (
                  <div className="panel" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="game-event" style={{ maxWidth: 400, margin: '0 16px' }}>
                      <h3 className="disp" style={{ fontSize: 20, color: 'var(--text)', marginBottom: 12 }}>{gameEvent.title}</h3>
                      <p style={{ fontFamily: 'Manrope', fontSize: 13, color: 'var(--text)', marginBottom: 20 }}>{gameEvent.description}</p>
                      <button className="btn-acid w-full" onClick={closeGameEvent}>Понятно</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── AI Coding Challenge ─────────────────────────────── */}
        {activeTab === 'daily' && (
          <div className="rv d3 mt-8 px-8">
            {!aiTask ? (
              <div className="card text-center" style={{ padding: 60 }}>
                <div style={{ width: 48, height: 48, color: 'var(--acid)', marginBottom: 20, marginLeft: 'auto', marginRight: 'auto' }}><BotIcon /></div>
                <h2 className="disp" style={{ fontSize: 32, color: 'var(--text)', marginBottom: 12 }}>AI Кодинг-челлендж</h2>
                <p style={{ fontFamily: 'Manrope', fontSize: 14, color: 'var(--muted)', marginBottom: 24, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
                  Получай кодинг-задания от AI и получай мгновенную обратную связь! Практикуй реальные задачи: лендинги, API, формы и многое другое.
                </p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
                  <span className="badge badge-acid">Frontend</span>
                  <span className="badge badge-acid">Backend</span>
                  <span className="badge badge-acid">Fullstack</span>
                </div>
                <button className="btn-acid" onClick={generateAITask} disabled={isGeneratingTask}>
                  {isGeneratingTask ? 'Генерация...' : 'Получить задание'}
                </button>
              </div>
            ) : (
              <div className="card">
                <div style={{ padding: 24, background: 'linear-gradient(135deg,rgba(93,69,253,0.1),rgba(147,51,234,0.1))', borderRadius: 16, marginBottom: 20 }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ color: 'var(--acid)' }}><BotIcon /></span>
                        <span className="badge badge-acid">AI Задание</span>
                      </div>
                      <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>{aiTask.title}</h3>
                      <p style={{ fontFamily: 'Manrope', fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{aiTask.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="badge">{aiTask.type}</span>
                      <span className="badge badge-warn">{aiTask.difficulty}</span>
                    </div>
                  </div>
                </div>

                {!aiFeedback ? (
                  <>
                    <textarea
                      className="inp"
                      value={userCode}
                      onChange={e => setUserCode(e.target.value)}
                      placeholder="Напиши свой код здесь..."
                      rows={12}
                      style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, marginBottom: 16 }}
                    />
                    <div className="flex gap-3">
                      <button className="btn-ghost" onClick={() => { setAiTask(null); setUserCode(''); }}>
                        Новое задание
                      </button>
                      <button className="btn-acid flex-1" onClick={submitCodeSolution} disabled={!userCode.trim() || isSubmitting}>
                        {isSubmitting ? 'Анализ...' : 'Отправить решение'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={`result-box ${aiFeedback.correct ? 'ok' : 'err'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {aiFeedback.correct ? <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><CheckIcon /></div> : <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}><XIcon /></div>}
                        <span className="disp" style={{ fontSize: 24, color: aiFeedback.correct ? '#10b981' : '#ef4444' }}>
                          {aiFeedback.correct ? 'Правильно!' : 'Неправильно'}
                        </span>
                        <span className="badge" style={{ marginLeft: 8 }}>Оценка: {aiFeedback.score}/100</span>
                      </div>
                      <button className="btn-ghost" onClick={() => { setAiTask(null); setAiFeedback(null); setUserCode(''); }}>
                        Новое задание
                      </button>
                    </div>
                    <p style={{ fontFamily: 'Manrope', fontSize: 14, color: 'var(--text)', marginBottom: 16 }}>{aiFeedback.comment}</p>
                    {aiFeedback.suggestions && aiFeedback.suggestions.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <span className="sh mb-3" style={{ display: 'block' }}>Рекомендации:</span>
                        <ul style={{ fontFamily: 'Manrope', fontSize: 13, color: 'var(--text)', paddingLeft: 18, margin: 0 }}>
                          {aiFeedback.suggestions.map((s: string, i: number) => (
                            <li key={i} style={{ marginBottom: 4 }}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!aiFeedback.correct && aiFeedback.correctSolution && (
                      <div style={{ marginTop: 20 }}>
                        <span className="sh mb-3" style={{ display: 'block', color: '#ef4444' }}>Правильное решение:</span>
                        <pre style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--text)', background: 'rgba(0,0,0,0.03)', padding: 16, borderRadius: 8, overflow: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                          {aiFeedback.correctSolution}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Leaderboard ─────────────────────────────────── */}
        {activeTab === 'leaderboard' && (
          <div className="rv d3 mt-8 px-8">
            <div className="flex items-center gap-6 pb-5">
              <span className="sh">Лидерборд</span>
              <span className="mono-sm">{leaderboard.length} участников</span>
            </div>
            <div className="hr" />
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {leaderboard.map((entry, idx) => (
                <div key={entry.id} className={`leader-row ${idx === 0 ? 'gold' : ''}`}>
                  <span className="disp" style={{ fontSize: 24, width: 32, textAlign: 'center', color: idx === 0 ? '#eab308' : idx === 1 ? '#9ca3af' : idx === 2 ? '#b45309' : 'var(--muted)' }}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{entry.user?.profile?.username || entry.user?.email}</span>
                    <div className="flex gap-4 mt-1">
                      <span className="mono-sm flex items-center gap-2"><FireIcon /> {entry.current_streak} дней</span>
                      <span className="mono-sm flex items-center gap-2"><CalendarIcon /> {entry.total_practice_days} всего</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="mono-sm" style={{ display: 'block', marginBottom: 4 }}>Лучший стик</span>
                    <span className="disp flex items-center gap-2 justify-end" style={{ fontSize: 20, color: '#f97316' }}><FireIcon /> {entry.longest_streak}</span>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <div className="card text-center">
                  <span className="mono-sm">Лидерборд пуст. Будьте первым!</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
