import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Calendar, Heart, Moon, Sun } from 'lucide-react';
import './Landing.css';

const textVariants = {
  initial: {
    x: -500,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
  },
};

const sliderVariants = {
  initial: {
    x: '150%',
  },
  animate: {
    x: '-100%',
    transition: {
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
      duration: 35,
    },
  },
};

const scrollButtonVariants = {
  animate: {
    y: [0, 10, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

const Landing = () => {
  const [stats, setStats] = useState({
    donations: 0,
    funds: 0,
    giftPools: 0,
  });

  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const icons = [
    { 
      component: <Gift className="h-10 w-10 text-purple-400" />, 
      label: 'Gift Pooling'
    },
    { 
      component: <Calendar className="h-10 w-10 text-blue-400" />, 
      label: 'Events'
    },
    { 
      component: <Heart className="h-10 w-10 text-red-400" />, 
      label: 'Donations'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [icons.length]);

  useEffect(() => {
    setStats({
      donations: 1250,
      funds: 340,
      giftPools: 89,
    });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('isDarkMode');
    if (saved !== null) {
      const isDark = JSON.parse(saved);
      setIsDarkMode(isDark);
      applyTheme(isDark);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      applyTheme(prefersDark);
    }
  }, []);

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('isDarkMode', JSON.stringify(newMode));
    applyTheme(newMode);
  };

  const handleSignIn = () => {
    window.location.href = '/login';
  };

  const handleCreateAccount = () => {
    window.location.href = '/signup';
  };

  const reviews = [
    {
      id: 1,
      name: 'Arjun Sharma',
      role: 'Event Organizer',
      text: 'NexFund made fundraising incredibly easy and transparent.',
      type: 'event',
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Charity Worker',
      text: 'Best platform for pooling funds. Secure and reliable.',
      type: 'donation',
    },
    {
      id: 3,
      name: 'Rajesh Kumar',
      role: 'Entrepreneur',
      text: 'Collected startup funds in days. Highly recommended!',
      type: 'giftpool',
    },
  ];

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <div className="logo-icon">
              {icons[currentIconIndex].component}
            </div>
            <div className="logo-text">
              <span className="logo-title">NexFund</span>
              <span className="logo-subtitle">{icons[currentIconIndex].label}</span>
            </div>
          </div>
          
          <div className="navbar-links">
            <button 
              onClick={toggleDarkMode} 
              className="theme-toggle-btn"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="toggle-icon">
                <Sun className={`sun-icon ${isDarkMode ? 'hidden' : 'visible'}`} size={20} />
                <Moon className={`moon-icon ${isDarkMode ? 'visible' : 'hidden'}`} size={20} />
              </div>
            </button>
            <button onClick={handleSignIn} className="nav-button login-btn">
              Sign In
            </button>
            <button onClick={handleCreateAccount} className="nav-button signup-btn">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <motion.div
          className="sliding-text-container"
          variants={sliderVariants}
          initial="initial"
          animate="animate"
        >
          Raise Funds • Pool Gifts • Organize Events
        </motion.div>

        <div className="hero-wrapper">
          <motion.div
            className="hero-text-container"
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            <motion.h2 variants={textVariants} className="hero-subtitle">
              POOLING MADE EASY
            </motion.h2>

            <motion.h1 variants={textVariants} className="hero-title">
              NexFund
            </motion.h1>

            <motion.p variants={textVariants} className="hero-description">
              Raise funds, pool gifts, and organize donations with zero hassle.
            </motion.p>

            <motion.p variants={textVariants} className="description-highlight">
              Join thousands raising together.
            </motion.p>

            <motion.div variants={textVariants} className="hero-buttons">
              <motion.button
                className="btn btn-primary"
                onClick={handleSignIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                SIGN IN / LOGIN
              </motion.button>
              <motion.button
                className="btn btn-secondary"
                onClick={handleCreateAccount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CREATE ACCOUNT
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* ANIMATION LAYER */}
        <div className="animation-layer">
          <div className="jar">
            <svg width="120" height="140" viewBox="0 0 120 140">
              <rect className="jar-container" x="20" y="30" width="80" height="90" rx="5"/>
              <rect className="jar-container" x="15" y="20" width="90" height="15" rx="3"/>
            </svg>
            <div className="jar-fill"></div>
          </div>

          {/* LINK ICON - SVG CHAIN LINK (NO ROTATION) */}
          <div className="link-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="50" height="50">
              <path d="M208 352h-64a64 64 0 0 1-64-64v-64a64 64 0 0 1 64-64h64v32h-64a32 32 0 0 0-32 32v64a32 32 0 0 0 32 32h64zm96 0h64a64 64 0 0 0 64-64v-64a64 64 0 0 0-64-64h-64v32h64a32 32 0 0 1 32 32v64a32 32 0 0 1-32 32h-64zm-64-96h-96v32h96zm160 0h-96v32h96z" fill="currentColor"/>
            </svg>
          </div>

          {/* CHECKMARK */}
          <div className="checkmark">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle className="checkmark-circle" cx="30" cy="30" r="28"/>
              <path className="checkmark-check" d="M15 30 L25 40 L45 20"/>
            </svg>
          </div>

          {/* STICK FIGURES */}
          <div className="stick-figure" id="figure1">
            <svg width="60" height="80" viewBox="0 0 60 80">
              <circle className="stick-head" cx="30" cy="15" r="10"/>
              <line className="stick-body" x1="30" y1="25" x2="30" y2="50"/>
              <line className="stick-body" x1="30" y1="35" x2="15" y2="45"/>
              <line className="stick-body" x1="30" y1="35" x2="45" y2="45"/>
              <line className="stick-body" x1="30" y1="50" x2="20" y2="70"/>
              <line className="stick-body" x1="30" y1="50" x2="40" y2="70"/>
            </svg>
          </div>

          <div className="stick-figure" id="figure2">
            <svg width="60" height="80" viewBox="0 0 60 80">
              <circle className="stick-head" cx="30" cy="15" r="10"/>
              <line className="stick-body" x1="30" y1="25" x2="30" y2="50"/>
              <line className="stick-body" x1="30" y1="35" x2="15" y2="45"/>
              <line className="stick-body" x1="30" y1="35" x2="45" y2="45"/>
              <line className="stick-body" x1="30" y1="50" x2="20" y2="70"/>
              <line className="stick-body" x1="30" y1="50" x2="40" y2="70"/>
            </svg>
          </div>

          <div className="stick-figure" id="figure3">
            <svg width="60" height="80" viewBox="0 0 60 80">
              <circle className="stick-head" cx="30" cy="15" r="10"/>
              <line className="stick-body" x1="30" y1="25" x2="30" y2="50"/>
              <line className="stick-body" x1="30" y1="35" x2="15" y2="45"/>
              <line className="stick-body" x1="30" y1="35" x2="45" y2="45"/>
              <line className="stick-body" x1="30" y1="50" x2="20" y2="70"/>
              <line className="stick-body" x1="30" y1="50" x2="40" y2="70"/>
            </svg>
          </div>

          <div className="stick-figure" id="figure4">
            <svg width="60" height="80" viewBox="0 0 60 80">
              <circle className="stick-head" cx="30" cy="15" r="10"/>
              <line className="stick-body" x1="30" y1="25" x2="30" y2="50"/>
              <line className="stick-body" x1="30" y1="35" x2="15" y2="45"/>
              <line className="stick-body" x1="30" y1="35" x2="45" y2="45"/>
              <line className="stick-body" x1="30" y1="50" x2="20" y2="70"/>
              <line className="stick-body" x1="30" y1="50" x2="40" y2="70"/>
            </svg>
          </div>

          <div className="stick-figure" id="figure5">
            <svg width="60" height="80" viewBox="0 0 60 80">
              <circle className="stick-head" cx="30" cy="15" r="10"/>
              <line className="stick-body" x1="30" y1="25" x2="30" y2="50"/>
              <line className="stick-body" x1="30" y1="35" x2="15" y2="45"/>
              <line className="stick-body" x1="30" y1="35" x2="45" y2="45"/>
              <line className="stick-body" x1="30" y1="50" x2="20" y2="70"/>
              <line className="stick-body" x1="30" y1="50" x2="40" y2="70"/>
            </svg>
          </div>

          <div className="stick-figure" id="figure6">
            <svg width="60" height="80" viewBox="0 0 60 80">
              <circle className="stick-head" cx="30" cy="15" r="10"/>
              <line className="stick-body" x1="30" y1="25" x2="30" y2="50"/>
              <line className="stick-body" x1="30" y1="35" x2="15" y2="45"/>
              <line className="stick-body" x1="30" y1="35" x2="45" y2="45"/>
              <line className="stick-body" x1="30" y1="50" x2="20" y2="70"/>
              <line className="stick-body" x1="30" y1="50" x2="40" y2="70"/>
            </svg>
          </div>

          {/* COINS */}
          <div className="coin coin1"></div>
          <div className="coin coin2"></div>
          <div className="coin coin3"></div>
          <div className="coin coin4"></div>
          <div className="coin coin5"></div>
          <div className="coin coin6"></div>
          <div className="coin coin7"></div>
        </div>

        <motion.div
          className="scroll-button"
          variants={scrollButtonVariants}
          animate="animate"
        >
          <span>↓ Scroll to explore</span>
        </motion.div>
      </section>

      <section className="stats-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Impact
        </motion.h2>

        <div className="stats-grid">
          <motion.div
            className="stat-card stat-events"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="stat-icon-container">
              <div className="stat-icon-wrapper stat-icon-events">
                <Calendar className="stat-icon-svg" size={48} />
              </div>
            </div>
            <div className="stat-number">{stats.funds.toLocaleString()}+</div>
            <p className="stat-label">Events/Funds</p>
          </motion.div>

          <motion.div
            className="stat-card stat-donations"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="stat-icon-container">
              <div className="stat-icon-wrapper stat-icon-donations">
                <Heart className="stat-icon-svg" size={48} />
              </div>
            </div>
            <div className="stat-number">{stats.donations.toLocaleString()}+</div>
            <p className="stat-label">Donations Raised</p>
          </motion.div>

          <motion.div
            className="stat-card stat-giftpools"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="stat-icon-container">
              <div className="stat-icon-wrapper stat-icon-giftpools">
                <Gift className="stat-icon-svg" size={48} />
              </div>
            </div>
            <div className="stat-number">{stats.giftPools.toLocaleString()}+</div>
            <p className="stat-label">Gift Pools Created</p>
          </motion.div>
        </div>
      </section>

      <section className="reviews-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          What Users Love
        </motion.h2>

        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className={`review-card review-${review.type}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`review-avatar avatar-${review.type}`}>{review.name.split(' ').map(n => n[0]).join('')}</div>
              <p className="review-text">"{review.text}"</p>
              <p className="review-author">{review.name}</p>
              <p className="review-role">{review.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <motion.div
          className="cta-container"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Start Fundraising?</h2>
          <p>Create your first event, donation, or gift pool today</p>
          <motion.button
            className="btn btn-primary cta-button"
            onClick={handleCreateAccount}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GET STARTED NOW
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
