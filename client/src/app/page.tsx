'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './landing.module.css';

const features = [
  {
    icon: '📄',
    title: 'Smart Note Processing',
    desc: 'Upload PDFs or images of your handwritten notes. Our AI extracts, formats, and structures everything automatically.',
    color: '#6366f1',
  },
  {
    icon: '🧠',
    title: 'AI Quiz Generation',
    desc: 'Automatically generate high-quality multiple-choice questions from your study material in seconds.',
    color: '#8b5cf6',
  },
  {
    icon: '🎧',
    title: 'Audio Lectures',
    desc: 'Convert your notes to audio with word-by-word highlighting so you can listen and follow along effortlessly.',
    color: '#06b6d4',
  },
  {
    icon: '🗺️',
    title: 'Memory Maps',
    desc: 'Extract key concepts and create visual knowledge maps to reinforce long-term retention.',
    color: '#10b981',
  },
  {
    icon: '🏆',
    title: 'Live Leaderboards',
    desc: 'Compete with peers in timed quizzes. Rankings update live so you always know where you stand.',
    color: '#f59e0b',
  },
  {
    icon: '🔒',
    title: 'Role-Based Access',
    desc: 'Admins manage content and users. Students access what\'s assigned to them — nothing more, nothing less.',
    color: '#ec4899',
  },
];

const stats = [
  { label: 'Content Types Supported', value: '3+' },
  { label: 'Avg. Quiz Generation Time', value: '<5s' },
  { label: 'Questions Per Upload', value: '10+' },
  { label: 'Formats Supported', value: 'PDF & IMG' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.root}>
      {/* Background Orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Navbar */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>Quizzner</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how" className={styles.navLink}>How It Works</a>
            <Link href="/login/user" className={styles.navCta}>Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.badgeDot} />
          AI-Powered Learning Platform
        </div>
        <h1 className={styles.heroTitle}>
          Transform Your Notes
          <br />
          <span className="text-gradient">Into Mastery</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Upload your study notes and let Quizzner turn them into quizzes, audio lectures, and memory maps — so you can learn more in less time.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/register" className="btn-primary">
            Get Started Free →
          </Link>
          <Link href="/login/user" className="btn-secondary">
            Sign In
          </Link>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Hero Card Preview */}
        <div className={styles.heroCard}>
          <div className={styles.heroCardHeader}>
            <div className={styles.dot} style={{ background: '#f87171' }} />
            <div className={styles.dot} style={{ background: '#fbbf24' }} />
            <div className={styles.dot} style={{ background: '#34d399' }} />
            <span className={styles.heroCardTitle}>quizzner.app — Dashboard</span>
          </div>
          <div className={styles.heroCardBody}>
            <div className={styles.dashPreview}>
              <div className={styles.dashSidebar}>
                {['📊 Dashboard', '📄 Content', '📝 Quizzes', '👥 Users', '⚙️ Settings'].map((item) => (
                  <div key={item} className={styles.dashSidebarItem}>{item}</div>
                ))}
              </div>
              <div className={styles.dashMain}>
                <div className={styles.dashCards}>
                  {[
                    { label: 'Active Quizzes', val: '12', col: '#6366f1' },
                    { label: 'Students', val: '248', col: '#8b5cf6' },
                    { label: 'Avg Score', val: '74%', col: '#10b981' },
                  ].map((c) => (
                    <div key={c.label} className={styles.dashMiniCard} style={{ borderTopColor: c.col }}>
                      <div className={styles.dashMiniVal} style={{ color: c.col }}>{c.val}</div>
                      <div className={styles.dashMiniLabel}>{c.label}</div>
                    </div>
                  ))}
                </div>
                <div className={styles.dashBarChart}>
                  {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
                    <div key={i} className={styles.dashBar} style={{ height: `${h}%`, opacity: 0.5 + i * 0.07 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionLabel}>CAPABILITIES</div>
        <h2 className={styles.sectionTitle}>
          Everything you need to <span className="text-gradient">learn smarter</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          From raw notes to quiz-ready content — Quizzner handles the entire pipeline.
        </p>
        <div className={styles.featuresGrid}>
          {features.map((f) => (
            <div key={f.title} className={`card ${styles.featureCard}`}>
              <div className={styles.featureIcon} style={{ background: `${f.color}18`, color: f.color }}>
                {f.icon}
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className={styles.section}>
        <div className={styles.sectionLabel}>WORKFLOW</div>
        <h2 className={styles.sectionTitle}>
          Three steps to <span className="text-gradient">quiz-ready</span>
        </h2>
        <div className={styles.stepsRow}>
          {[
            { num: '01', title: 'Upload Notes', desc: 'Admin uploads PDFs or images of typed or handwritten notes.', icon: '📤' },
            { num: '02', title: 'AI Processes', desc: 'Our pipeline OCRs, extracts text, generates questions and memory maps.', icon: '⚙️' },
            { num: '03', title: 'Students Learn', desc: 'Students take timed quizzes, listen to audio, and see their rank on the leaderboard.', icon: '🚀' },
          ].map((step, i) => (
            <div key={step.num} className={styles.stepCard}>
              <div className={styles.stepNum}>{step.num}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
              {i < 2 && <div className={styles.stepArrow}>→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to level up your learning?</h2>
          <p className={styles.ctaSubtitle}>
            Join Quizzner today. Admins, start uploading content. Students, start acing quizzes.
          </p>
          <div className={styles.ctaBtns}>
            <Link href="/register" className="btn-primary">Create Account →</Link>
            <Link href="/login/admin" className="btn-secondary">Admin Login</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <span>⚡</span> Quizzner
        </div>
        <p className={styles.footerText}>© 2025 Quizzner. Built for learners, by learners.</p>
        <div className={styles.footerLinks}>
          <Link href="/login/user" className={styles.footerLink}>User Login</Link>
          <Link href="/login/admin" className={styles.footerLink}>Admin Login</Link>
          <Link href="/register" className={styles.footerLink}>Register</Link>
        </div>
      </footer>
    </div>
  );
}
