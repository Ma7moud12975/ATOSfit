import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import './landing-modern.css';

const features = [
  {
    icon: 'ScanLine',
    title: 'Real-Time Pose Estimation',
    text: 'Detects body landmarks through camera or uploaded video while the workout is happening.',
  },
  {
    icon: 'Activity',
    title: 'Joint Angle Analysis',
    text: 'Measures elbows, knees, hips, shoulders, and posture angles for movement quality.',
  },
  {
    icon: 'Repeat2',
    title: 'Automatic Rep Counting',
    text: 'Counts valid reps only when the movement pattern and posture pass the exercise rules.',
  },
  {
    icon: 'ShieldCheck',
    title: 'AI Form Correction',
    text: 'Gives instant coaching signals when the athlete needs to slow down or fix alignment.',
  },
  {
    icon: 'Utensils',
    title: 'Food Scanner',
    text: 'Turns a meal photo into calories, macros, confidence score, and nutrition guidance.',
  },
  {
    icon: 'MessageCircle',
    title: 'AI Fitness Coach',
    text: 'Answers training, recovery, nutrition, and performance questions inside one product.',
  },
];

const feedbackCards = [
  { tone: 'warning', label: 'Posture Warning', text: 'Keep your back straight' },
  { tone: 'info', label: 'Adjustment', text: 'Lower your hips slightly' },
  { tone: 'success', label: 'Form Score', text: 'Great form' },
  { tone: 'success', label: 'Counter', text: 'Rep counted' },
  { tone: 'danger', label: 'Invalid Rep', text: 'Invalid posture detected' },
];

const previewCards = [
  { icon: 'Dumbbell', title: 'Workout Analysis', stat: '94%', text: 'Form score' },
  { icon: 'Utensils', title: 'Food Scanner', stat: '612', text: 'Calories estimated' },
  { icon: 'Bot', title: 'AI Coach', stat: 'Live', text: 'Recovery guidance' },
  { icon: 'TrendingUp', title: 'Progress', stat: '+18%', text: 'Weekly consistency' },
  { icon: 'Trophy', title: 'Achievement', stat: '12', text: 'Badges unlocked' },
];

const comparison = [
  ['Static workout plans', 'Real-time form analysis'],
  ['Manual tracking', 'Automatic rep counting'],
  ['No movement feedback', 'AI posture correction'],
  ['Separate nutrition apps', 'Integrated food scanner'],
  ['Generic reminders', 'AI coach and smart progress'],
];

const steps = [
  ['Open Camera or Upload Video', 'Start instantly with live tracking or analyze a recorded workout.'],
  ['AI Analyzes Your Movement', 'Landmarks, skeletons, angles, and rep states are processed in real time.'],
  ['Get Feedback and Progress', 'Receive form corrections, scores, calories, and progress signals.'],
];

const navLinks = [
  ['Features', '#features'],
  ['How It Works', '#how-it-works'],
  ['AI Analysis', '#analysis'],
  ['Nutrition', '#nutrition'],
  ['Demo', '#demo'],
];

const MiniSkeleton = () => (
  <div className="atos-skeleton" aria-hidden="true">
    <span className="joint head" />
    <span className="joint shoulder-l" />
    <span className="joint shoulder-r" />
    <span className="joint elbow-l" />
    <span className="joint elbow-r" />
    <span className="joint hand-l" />
    <span className="joint hand-r" />
    <span className="joint hip-l" />
    <span className="joint hip-r" />
    <span className="joint knee-l" />
    <span className="joint knee-r" />
    <span className="joint foot-l" />
    <span className="joint foot-r" />
    <i className="bone spine" />
    <i className="bone shoulders" />
    <i className="bone arm-l-a" />
    <i className="bone arm-l-b" />
    <i className="bone arm-r-a" />
    <i className="bone arm-r-b" />
    <i className="bone hips" />
    <i className="bone leg-l-a" />
    <i className="bone leg-l-b" />
    <i className="bone leg-r-a" />
    <i className="bone leg-r-b" />
  </div>
);

const HeroDevice = () => (
  <div className="hero-product-scene" aria-label="ATOS Fit workout analysis preview">
    <div className="orbit-ring orbit-one" />
    <div className="orbit-ring orbit-two" />
    <div className="phone-device">
      <div className="phone-glass">
        <div className="phone-status">
          <span>9:41</span>
          <strong>LIVE AI</strong>
        </div>
        <div className="phone-camera-feed">
          <MiniSkeleton />
          <div className="angle-tag elbow">Elbow 87 deg</div>
          <div className="angle-tag knee">Knee 112 deg</div>
          <div className="motion-wave" />
        </div>
        <div className="phone-metrics">
          <div><span>Form</span><strong>96%</strong></div>
          <div><span>Reps</span><strong>24</strong></div>
        </div>
      </div>
    </div>

    <div className="holo-panel analysis-hologram">
      <div className="device-topbar">
        <span />
        <strong>Computer Vision Layer</strong>
        <em>TRACKING</em>
      </div>
      <div className="holo-stage">
        <MiniSkeleton />
        <div className="metric-label hero-elbow">Elbow angle</div>
        <div className="metric-label hero-knee">Knee angle</div>
        <div className="metric-label hero-score">Form score 96%</div>
      </div>
    </div>

    <div className="device-bottom hero-coach-strip">
      <div className="pulse-line" />
      <p>AI correction: keep shoulders stacked and slow the descent.</p>
    </div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goToApp = async () => {
    try {
      await login();
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        navigate(user?.name ? '/dashboard' : '/onboarding', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch {
      navigate('/login-screen');
    }
  };

  const goToDemo = () => navigate('/exercise-workout-screen');

  return (
    <main className={`atos-landing ${mounted ? 'is-mounted' : ''}`}>
      <nav className="landing-nav" aria-label="Main navigation">
        <a className="brand-lockup" href="#home" aria-label="ATOS Fit home">
          <img src="/assets/images/atosfit.png" alt="" />
          <span>ATOS Fit</span>
        </a>

        <div className="nav-links">
          {navLinks.map(([label, href]) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </div>

        <div className="nav-actions">
          <button className="ghost-action" onClick={() => navigate('/login-screen')}>Sign In</button>
          <button className="primary-action" onClick={goToDemo}>Try Demo</button>
        </div>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(value => !value)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
        </button>

        {menuOpen && (
          <div className="mobile-panel">
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <button onClick={goToDemo}>Try Demo</button>
          </div>
        )}
      </nav>

      <section id="home" className="hero-section">
        <div className="hero-scene">
          <div className="hero-grid" />
          <div className="cinema-light light-cyan" />
          <div className="cinema-light light-orange" />
          <div className="data-stream stream-a" />
          <div className="data-stream stream-b" />
          <div className="ai-particles" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => <i key={index} />)}
          </div>
          <HeroDevice />
          <div className="floating-card card-calories">
            <Icon name="Flame" size={18} />
            <span>Calories</span>
            <strong>184 kcal</strong>
          </div>
          <div className="floating-card card-heart">
            <Icon name="HeartPulse" size={18} />
            <span>Heart line</span>
            <strong>128 bpm</strong>
          </div>
          <div className="floating-card card-water">
            <Icon name="Droplet" size={18} />
            <span>Hydration</span>
            <strong>72%</strong>
          </div>
          <div className="floating-card card-reps">
            <Icon name="Repeat2" size={18} />
            <span>Rep Count</span>
            <strong>24</strong>
          </div>
          <div className="floating-card card-score">
            <Icon name="ShieldCheck" size={18} />
            <span>Form Score</span>
            <strong>96%</strong>
          </div>
          <div className="fitness-object dumbbell" aria-hidden="true" />
          <div className="fitness-object stopwatch" aria-hidden="true" />
        </div>

        <div className="hero-copy">
          <div className="eyebrow"><span /> AI fitness intelligence</div>
          <h1>Your AI Fitness Coach Powered by Computer Vision</h1>
          <p>
            Computer vision workouts, nutrition intelligence, hydration signals, and AI coaching in one cinematic training system.
          </p>
          <div className="hero-actions">
            <button className="primary-action large" onClick={goToApp} disabled={authLoading}>
              {authLoading ? 'Starting...' : 'Start AI Analysis'}
            </button>
            <button className="secondary-action large" onClick={goToDemo}>
              <Icon name="Play" size={18} />
              Watch Demo
            </button>
          </div>
          <div className="hero-proof">
            <span>Pose landmarks</span>
            <span>Joint angles</span>
            <span>Food AI</span>
            <span>AI Coach</span>
          </div>
        </div>
      </section>

      <section id="features" className="section-shell">
        <div className="section-heading">
          <span>Feature stack</span>
          <h2>A full AI training system, not another workout template.</h2>
        </div>
        <div className="feature-grid">
          {features.map(feature => (
            <article className="glass-card feature-card" key={feature.title}>
              <div className="icon-chip"><Icon name={feature.icon} size={21} /></div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="analysis" className="section-shell analysis-section">
        <div className="section-heading narrow">
          <span>AI motion analysis</span>
          <h2>Landmarks become posture decisions in real time.</h2>
          <p>
            ATOS Fit detects body landmarks, renders a skeleton overlay, calculates joint angles,
            and evaluates exercise form in real time.
          </p>
        </div>
        <div className="analysis-board">
          <div className="movement-panel">
            <div className="person-frame">
              <div className="athlete-silhouette" />
              <div className="floor-shadow" />
            </div>
            <div className="panel-caption">
              <strong>Camera input</strong>
              <span>Live push-up capture</span>
            </div>
          </div>
          <div className="movement-panel skeleton-panel">
            <MiniSkeleton />
            <div className="metric-label label-elbow">Elbow Angle 87 deg</div>
            <div className="metric-label label-knee">Knee Angle 112 deg</div>
            <div className="metric-label label-score">Form Score 96%</div>
            <div className="metric-label label-reps">Rep Count 24</div>
            <div className="metric-label label-warning">Posture Warning</div>
          </div>
        </div>
      </section>

      <section className="section-shell feedback-section">
        <div className="feedback-copy">
          <span>Real-time feedback</span>
          <h2>Correction that feels like a coach watching every rep.</h2>
          <p>
            The interface surfaces clean, immediate coaching signals for posture, tempo,
            rep validity, and movement confidence.
          </p>
        </div>
        <div className="feedback-stack">
          {feedbackCards.map(card => (
            <div className={`feedback-card ${card.tone}`} key={card.text}>
              <span>{card.label}</span>
              <strong>{card.text}</strong>
            </div>
          ))}
        </div>
      </section>

      <section id="nutrition" className="section-shell nutrition-section">
        <div className="food-visual">
          <img src="/scanner.png" alt="AI nutrition scanner interface" />
          <div className="scan-beam" />
          <div className="nutrition-card calories"><span>Calories</span><strong>612</strong></div>
          <div className="nutrition-card protein"><span>Protein</span><strong>42g</strong></div>
          <div className="nutrition-card confidence"><span>Confidence</span><strong>91%</strong></div>
        </div>
        <div className="nutrition-copy">
          <span>Food scanner</span>
          <h2>Scan a meal. Get macros before the plate gets cold.</h2>
          <p>
            Scan your meal and get instant AI-powered nutrition estimates including calories,
            protein, carbs, fats, and confidence score.
          </p>
        </div>
      </section>

      <section className="section-shell coach-section">
        <div className="coach-copy">
          <span>AI coach</span>
          <h2>One assistant for workouts, meals, recovery, and progress.</h2>
          <p>
            Ask ATOS Fit about workouts, nutrition, recovery, and performance.
            Get smart coaching inside one platform.
          </p>
        </div>
        <div className="chat-mockup">
          <div className="chat-top">
            <img src="/artificial-intelligence.png" alt="" />
            <div>
              <strong>ATOS Coach</strong>
              <span>Vision-aware guidance</span>
            </div>
          </div>
          <div className="bubble user">Why did my push-up reps stop counting?</div>
          <div className="bubble ai">Your hip angle dropped below the valid range. Keep your torso line steady for the next set.</div>
          <div className="bubble user">What should I eat after this?</div>
          <div className="bubble ai">Aim for 35g protein, moderate carbs, and 500ml water within the next hour.</div>
        </div>
      </section>

      <section id="how-it-works" className="section-shell steps-section">
        <div className="section-heading">
          <span>How it works</span>
          <h2>Three steps from camera input to useful coaching.</h2>
        </div>
        <div className="steps-line">
          {steps.map(([title, text], index) => (
            <article className="step-card" key={title}>
              <div className="step-node">{index + 1}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="demo" className="section-shell preview-section">
        <div className="section-heading">
          <span>Product preview</span>
          <h2>The app experience, staged as a cinematic control room.</h2>
        </div>
        <div className="preview-cluster">
          {previewCards.map(card => (
            <article className="preview-card" key={card.title}>
              <Icon name={card.icon} size={22} />
              <span>{card.title}</span>
              <strong>{card.stat}</strong>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell comparison-section">
        <div className="section-heading narrow">
          <span>Why ATOS Fit</span>
          <h2>Built for intelligent movement, not manual tracking.</h2>
        </div>
        <div className="comparison-table">
          <div className="comparison-column muted">
            <h3>Normal fitness apps</h3>
            {comparison.map(([normal]) => <p key={normal}>{normal}</p>)}
          </div>
          <div className="comparison-column premium">
            <h3>ATOS Fit</h3>
            {comparison.map(([, atos]) => <p key={atos}>{atos}</p>)}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div>
          <span>Future-ready fitness</span>
          <h2>Train Smarter. Move Better. Track Everything.</h2>
          <p>Experience the future of AI-powered fitness with ATOS Fit.</p>
        </div>
        <div className="hero-actions">
          <button className="primary-action large" onClick={goToApp}>Try ATOS Fit</button>
          <button className="secondary-action large" onClick={goToDemo}>View Demo</button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-brand">
          <img src="/assets/images/atosfit.png" alt="" />
          <div>
            <strong>ATOS Fit</strong>
            <p>AI-powered fitness analysis for form, food, coaching, and progress.</p>
          </div>
        </div>
        <div className="footer-links">
          {navLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </div>
        <div className="socials" aria-label="Social links">
          <span><Icon name="Linkedin" size={18} /></span>
          <span><Icon name="Twitter" size={18} /></span>
          <span><Icon name="Github" size={18} /></span>
        </div>
        <p className="copyright">Copyright 2026 ATOS Fit. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default LandingPage;
