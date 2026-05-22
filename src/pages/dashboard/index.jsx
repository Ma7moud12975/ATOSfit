import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AppHeader from '../../components/ui/AppHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import { getAccountId } from '../../utils/localAccountStorage';
import { useLanguage } from '../../contexts/LanguageContext';
import '../../styles/bento-dashboard.css';

// ─── Icons (inline SVG micro-set) ───────────────────────────────────────────
const Ic = ({ d, size = 20, stroke = 'var(--bento-muted)', fill = 'none', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  flame:   'M12 2c0 0-6 5-6 11a6 6 0 0012 0c0-6-6-11-6-11zm0 16c-1.1 0-2-.9-2-2 0-2 2-5 2-5s2 3 2 5c0 1.1-.9 2-2 2z',
  drop:    'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z',
  trend:   ['M23 6l-9.5 9.5-5-5L1 18','M17 6h6v6'],
  play:    'M5 3l14 9-14 9V3z',
  plus:    ['M12 5v14','M5 12h14'],
  star:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  bell:    ['M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 01-3.46 0'],
  crown:   'M2 20h20M5 20V10l7-7 7 7v10',
  check:   'M20 6L9 17l-5-5',
  zap:     'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  trophy:  ['M6 9H3V4h3','M18 9h3V4h-3','M8 21h8','M12 17v4','M7 4h10a1 1 0 010 14.5H7A1 1 0 017 4z'],
  scan:    ['M4 7V5a1 1 0 011-1h2','M17 4h2a1 1 0 011 1v2','M20 17v2a1 1 0 01-1 1h-2','M7 20H5a1 1 0 01-1-1v-2','M8 12h8'],
  fork:    ['M6 2v8','M10 2v8','M6 6h4','M8 10v12','M17 2v20','M14 2h3a3 3 0 013 3v5a3 3 0 01-3 3h-3'],
};

// ─── Ring Progress ────────────────────────────────────────────────────────────
const Ring = ({ pct, r = 44, color = '#FF8A00', trackColor = 'rgba(167,162,137,.18)', sw = 7, size = 110, children }) => {
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`} className="ring-animate" />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        {children}
      </div>
    </div>
  );
};

// ─── Stat Pill ────────────────────────────────────────────────────────────────
const StatPill = ({ label, value, unit, icon, pct, color = '#FF8A00' }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
    <Ring pct={pct} color={color} r={30} sw={5} size={74}>
      <Ic d={ICONS[icon]} size={16} stroke={color} sw={2} />
    </Ring>
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--bento-text)', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:'.65rem', fontWeight:600, color:'var(--bento-muted)', letterSpacing:'.08em', textTransform:'uppercase', marginTop:2 }}>{unit}</div>
    </div>
    <div style={{ fontSize:'.7rem', color:'var(--bento-muted)', fontWeight:500 }}>{label}</div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { language, t } = useLanguage();
  const [user, setUser] = useState({ name: 'Mahmoud Ayman', profilePicture: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [water, setWater] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2500);
  const [waterHistory, setWaterHistory] = useState([]);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const waterPct = Math.min(100, Math.round((water / waterGoal) * 100));
  const waterRemaining = Math.max(waterGoal - water, 0);
  const todayKey = new Date().toISOString().slice(0, 10);

  const quotes = [
    { title:'Hydration Tip', body:'Drink a glass of water 30 min before every workout to boost performance by up to 20%.' },
    { title:'Mindset','body':'Consistency beats intensity. Show up every day, even when you don\'t feel like it.' },
    { title:'Recovery','body':'Sleep is where your muscles are built. Aim for 7–9 hrs to maximize gains.' },
    { title:'Nutrition','body':'Protein within 30 min post-workout accelerates muscle repair and growth.' },
  ];

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u?.name) setUser(u);

      const savedHydration = JSON.parse(localStorage.getItem(`atos_hydration:${getAccountId(u.principal || u.id || u.email || u.name)}`) || '{}');
      if (savedHydration?.date === todayKey) {
        setWater(Number(savedHydration.water) || 0);
        setWaterGoal(Number(savedHydration.goal) || 2500);
        setWaterHistory(Array.isArray(savedHydration.history) ? savedHydration.history : []);
      }
    } catch {}
  }, [todayKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`atos_hydration:${getAccountId(user.principal || user.id || user.email || user.name)}`, JSON.stringify({
        date: todayKey,
        water,
        goal: waterGoal,
        history: waterHistory,
      }));
    } catch {}
  }, [todayKey, water, waterGoal, waterHistory, user]);

  const handleLogout = useCallback(async () => {
    try { await logout(); } catch {}
    localStorage.removeItem('user');
    navigate('/login-screen');
  }, [logout, navigate]);

  const exercises = language === 'ar'
    ? ['ضغط', 'ضغط واسع', 'سكوات', 'بلانك', 'اندفاع', 'متسلق الجبل']
    : ['Push-ups','Wide Push Ups','Squats','Plank','Lunges','Mountain Climbers'];
  const addWater = (amount) => {
    setWater(prev => Math.min(prev + amount, waterGoal));
    setWaterHistory(prev => [...prev, amount].slice(-8));
  };
  const undoWater = () => {
    setWaterHistory(prev => {
      const last = prev[prev.length - 1] || 0;
      if (last) setWater(current => Math.max(current - last, 0));
      return prev.slice(0, -1);
    });
  };
  const resetWater = () => {
    setWater(0);
    setWaterHistory([]);
  };

  return (
    <div className="bento-root">
      {/* Ambient Trails */}
      <div className="trail trail-coral" style={{ width:500, height:500, top:'-10%', right:'5%', opacity:.08 }} />
      <div className="trail trail-olive" style={{ width:400, height:400, bottom:'10%', left:'20%', opacity:.07 }} />

      <AppHeader
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />
      
      <SidebarNavigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* ── Bento Grid ── */}
      <main className="pt-24 lg:pl-72 min-h-screen">
        <div className="px-4 py-6 md:px-8 md:py-8 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[18px]">

            {/* 1. TODAY'S WORKOUT — spans 3 cols */}
            <div className="bento-card col-span-1 md:col-span-2 lg:col-span-3" style={{ minHeight: 200 }}>
              <div className="trail trail-coral" style={{ width: 280, height: 280, top: '-40%', right: '-5%', opacity: .12 }} />
              <div className="p-5 sm:p-7 relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                  <div className="flex-1">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 138, 0,.12)', border: '1px solid rgba(255, 138, 0,.25)', borderRadius: 999, padding: '.3rem .85rem', marginBottom: '.75rem' }}>
                      <Ic d={ICONS.flame} size={13} stroke="#FF8A00" sw={2} />
                      <span style={{ fontSize: '.7rem', color: '#FF8A00', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>{t('dashboard.todaysWorkout')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--bento-text)] m-0 leading-tight tracking-tight">{t('dashboard.fullBodyStrength')}</h2>
                    <p style={{ color: 'var(--bento-muted)', marginTop: 6, fontSize: '.9rem', fontWeight: 500 }}>6 exercises · 45 min · Intermediate</p>
                  </div>
                  <button className="btn-coral w-full sm:w-auto justify-center" onClick={() => navigate('/exercise-workout-screen')}>
                    <Ic d={ICONS.play} size={15} stroke="#181818" fill="#181818" sw={2} />
                    {t('dashboard.startWorkout')}
                  </button>
                </div>
                {/* Exercise chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {exercises.map((ex, i) => (
                    <div key={i} style={{ background: 'var(--bento-chip)', border: '1px solid var(--bento-border)', borderRadius: 999, padding: '.35rem .85rem', fontSize: '.78rem', color: 'var(--bento-soft-text)', fontWeight: 500, cursor: 'pointer', transition: 'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255, 138, 0,.5)'; e.currentTarget.style.color = '#FF8A00'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bento-border)'; e.currentTarget.style.color = 'var(--bento-soft-text)'; }}>
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. WATER INTAKE — 1 col, 2 rows */}
            <div className="bento-card col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-2 flex flex-col p-6 sm:p-7">
              <div className="flex justify-between items-center mb-5">
                <span className="font-extrabold text-[var(--bento-text)] text-base">{t('dashboard.hydration')}</span>
                <Ic d={ICONS.drop} size={18} stroke="#FF8A00" sw={2} fill="rgba(255, 138, 0,.15)" />
              </div>
              {/* Animated liquid ring effect */}
              <div className="flex justify-center mx-auto relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-[rgba(167,162,137,0.18)]">
                <div className="liquid-bg" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${waterPct}%`, transition: 'height 1s ease-in-out' }}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-[var(--bento-text)] drop-shadow-lg">{waterPct}%</span>
                  <span className="text-[0.6rem] sm:text-[0.65rem] color-[#f5f3e5] font-semibold tracking-wider drop-shadow-lg">{t('dashboard.hydrated')}</span>
                </div>
              </div>
              <div className="text-center my-4 sm:my-5">
                <span className="text-xl sm:text-2xl font-extrabold text-[var(--bento-text)]">{water}</span>
                <span className="text-[#a7a289] text-sm font-semibold"> / {waterGoal} ml</span>
                <div className="dash-hydration-note">
                  {waterRemaining > 0 ? t('dashboard.leftToday', { amount: waterRemaining }) : t('dashboard.goalComplete')}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[250, 500].map(v => (
                  <button key={v} className="btn-olive w-full py-2"
                    onClick={() => addWater(v)}>
                    + {v} ml
                  </button>
                ))}
              </div>
              <div className="dash-hydration-tools">
                <button type="button" onClick={undoWater} disabled={waterHistory.length === 0}>{t('dashboard.undo')}</button>
                <button type="button" onClick={resetWater} disabled={water === 0}>{t('dashboard.resetToday')}</button>
              </div>
              <div className="dash-goal-picker" aria-label={t('dashboard.hydrationGoal')}>
                {[2000, 2500, 3000].map(goal => (
                  <button
                    type="button"
                    key={goal}
                    className={waterGoal === goal ? 'active' : ''}
                    onClick={() => setWaterGoal(goal)}
                  >
                    {goal / 1000}L
                  </button>
                ))}
              </div>
            </div>

            {/* 3. UNIFIED PROGRESS HUB — spans 3 cols */}
            <div className="bento-card col-span-1 md:col-span-2 lg:col-span-3 p-6 sm:p-7 dash-readiness-card">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span className="font-extrabold text-[var(--bento-text)] text-base">{t('dashboard.readiness')}</span>
                  <p className="text-[var(--bento-muted)] text-xs mt-1">{t('dashboard.readinessCopy')}</p>
                </div>
                <Ic d={ICONS.zap} size={18} stroke="#FAB406" fill="rgba(250,180,6,.12)" sw={2} />
              </div>
              <div className="dash-readiness-layout">
                <div>
                  <div className="dash-readiness-score">
                    <span>82</span>
                    <small>/100</small>
                  </div>
                  <div className="dash-readiness-status">{t('dashboard.trainToday')}</div>
                </div>
                <div className="dash-readiness-bars">
                  {[
                    { label: t('dashboard.sleep'), val: 76 },
                    { label: t('dashboard.recovery'), val: 84 },
                    { label: t('dashboard.strain'), val: 61 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="dash-bar-row"><span>{item.label}</span><strong>{item.val}%</strong></div>
                      <div className="dash-soft-track"><div style={{ width: `${item.val}%` }} /></div>
                    </div>
                  ))}
                </div>
                <div className="dash-readiness-focus">
                  <span>{t('dashboard.bestNextBlock')}</span>
                  <strong>{t('dashboard.strengthSession')}</strong>
                  <p>{t('dashboard.strengthCopy')}</p>
                </div>
              </div>
            </div>

            <div className="bento-card col-span-1 md:col-span-2 lg:col-span-3" style={{ padding:'1.75rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                <div>
                  <h3 style={{ fontWeight:800, color:'var(--bento-text)', fontSize:'1.05rem', margin:0 }}>{t('dashboard.progressHub')}</h3>
                  <p style={{ color:'#a7a289', fontSize:'.78rem', marginTop:2 }}>{t('dashboard.weeklyOverview')}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255, 138, 0,.1)', borderRadius:999, padding:'.3rem .8rem' }}>
                  <Ic d={ICONS.trend} size={14} stroke="#FF8A00" sw={2} />
                  <span style={{ fontSize:'.72rem', color:'#FF8A00', fontWeight:700 }}>{t('dashboard.weekTrend')}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatPill icon="flame" label={t('dashboard.caloriesBurned')} value="1,842" unit="kcal" pct={73} />
                <StatPill icon="trophy" label={t('nav.achievements')} value="12" unit={t('dashboard.unlocked')} pct={100} />
                <StatPill icon="trend" label={t('dashboard.workouts')} value="4/5" unit={t('dashboard.weeklyGoal')} pct={80} />
              </div>
              {/* Mini progress bars */}
              <div style={{ marginTop:'1.5rem', display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { label:'Push-ups streak', val:78 },
                  { label:'Plank record', val:55 },
                  { label:'Squat volume', val:90 },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:'.75rem', color:'#a7a289', fontWeight:500 }}>{label}</span>
                      <span style={{ fontSize:'.75rem', color:'#FF8A00', fontWeight:700 }}>{val}%</span>
                    </div>
                    <div style={{ height:5, borderRadius:999, background:'rgba(167,162,137,.15)' }}>
                      <div style={{ height:'100%', borderRadius:999, background:'linear-gradient(90deg,#FF8A00,#FAB406)', width:`${val}%`, transition:'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. DAILY DOSE CAROUSEL — spans 2 cols */}
            <div className="bento-card col-span-1 md:col-span-2 lg:col-span-1 p-6 sm:p-7">
              <div className="flex justify-between items-center mb-5">
                <span className="font-extrabold text-[var(--bento-text)] text-base">{t('dashboard.nutrition')}</span>
                <Ic d={ICONS.fork} size={18} stroke="#FF8A00" sw={2} />
              </div>
              <div className="dash-nutrition-hero">
                <strong>620</strong>
                <span>{t('dashboard.kcalRemaining')}</span>
              </div>
              <div className="dash-macro-list">
                {[
                  { label: t('dashboard.protein'), val: 68, text: '102 / 150g' },
                  { label: t('dashboard.carbs'), val: 54, text: '162 / 300g' },
                  { label: t('dashboard.fat'), val: 42, text: '34 / 80g' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="dash-bar-row"><span>{item.label}</span><strong>{item.text}</strong></div>
                    <div className="dash-soft-track"><div style={{ width: `${item.val}%` }} /></div>
                  </div>
                ))}
              </div>
              <button className="btn-olive w-full mt-5" onClick={() => navigate('/food-scanner')}>
                <Ic d={ICONS.scan} size={15} stroke="#FF8A00" sw={2} />
                {t('dashboard.scanNextMeal')}
              </button>
            </div>

            <div className="bento-card col-span-1 lg:col-span-2" style={{ padding:'1.75rem', cursor:'pointer' }}
              onClick={() => setQuoteIdx(i => (i + 1) % quotes.length)}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(167,162,137,.1)', border:'1px solid rgba(167,162,137,.2)', borderRadius:999, padding:'.28rem .7rem' }}>
                  <Ic d={ICONS.star} size={12} stroke="#a7a289" sw={2} />
                  <span style={{ fontSize:'.68rem', color:'#a7a289', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em' }}>{t('dashboard.dailyDose')}</span>
                </div>
                <div style={{ display:'flex', gap:5 }}>
                  {quotes.map((_, i) => (
                    <div key={i} style={{ height:6, borderRadius:999, background: i===quoteIdx ? '#FF8A00' : 'rgba(167,162,137,.25)', width: i===quoteIdx ? 20 : 6, transition:'all .4s ease' }} />
                  ))}
                </div>
              </div>
              <h4 style={{ color:'#FF8A00', fontWeight:700, fontSize:'.85rem', marginBottom:8 }}>{quotes[quoteIdx].title}</h4>
              <p style={{ color:'var(--bento-soft-text)', fontSize:'1.05rem', fontWeight:500, lineHeight:1.6, margin:0 }}>"{quotes[quoteIdx].body}"</p>
              <p style={{ color:'rgba(167,162,137,.5)', fontSize:'.72rem', marginTop:'1rem' }}>Tap to see next →</p>
            </div>

            {/* 5. SUBSCRIPTION CARD — spans 2 cols */}
            <div className="bento-card sub-border col-span-1 lg:col-span-2" style={{ padding:'1.75rem', background:'linear-gradient(135deg,rgba(255, 138, 0,.12) 0%,var(--bento-card-strong) 100%)' }}>
              <div className="trail trail-coral" style={{ width:200, height:200, top:'-30%', right:'-10%', opacity:.18 }} />
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255, 138, 0,.15)', border:'1px solid rgba(255, 138, 0,.35)', borderRadius:999, padding:'.3rem .85rem', marginBottom:'1rem' }}>
                  <Ic d={ICONS.crown} size={13} stroke="#FF8A00" sw={2.2} />
                  <span style={{ fontSize:'.7rem', color:'#FF8A00', fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em' }}>{t('dashboard.proPlan')}</span>
                </div>
                <h3 style={{ fontSize:'1.6rem', fontWeight:900, color:'var(--bento-text)', margin:'0 0 .5rem', lineHeight:1.2 }}>{t('dashboard.unlockElite')}</h3>
                <p style={{ color:'#a7a289', fontSize:'.85rem', lineHeight:1.6, marginBottom:'1.25rem' }}>
                  {t('dashboard.upgradeCopy')}
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:'1.25rem' }}>
                  {['Personalized AI programs','Unlimited food scanning','Advanced performance analytics'].map(f => (
                    <div key={f} style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <Ic d={ICONS.check} size={14} stroke="#FF8A00" sw={2.5} />
                      <span style={{ color:'var(--bento-soft-text)', fontSize:'.8rem', fontWeight:500 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-coral" style={{ width:'100%', justifyContent:'center', padding:'.9rem' }}
                  onClick={() => navigate('/pricing')}>
                  <Ic d={ICONS.zap} size={15} stroke="#181818" fill="#181818" />
                  {t('dashboard.upgradeNow')}
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
