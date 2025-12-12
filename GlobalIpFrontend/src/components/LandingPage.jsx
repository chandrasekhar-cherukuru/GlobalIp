import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Globe, Shield, Bell, BarChart3, Users, Database, CheckCircle, ArrowRight, Lightbulb, Zap, RefreshCw, ChevronDown, Menu, X, Settings } from 'lucide-react';
import { VscAccount, VscDashboard, VscOrganization } from 'react-icons/vsc';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('patents');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Advanced IP Search',
      description: 'Search millions of patents and trademarks across global databases with powerful filters and AI-powered relevance.'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Real-Time Analytics',
      description: 'Track competitor filings, monitor IP landscapes, and get instant alerts on relevant patent activities.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Integration',
      description: 'Connected to WIPO, USPTO, EPO, TMView, and OpenCorporates for comprehensive global IP coverage.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with JWT authentication, OAuth2 integration, and role-based access control.'
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Smart Alerts',
      description: 'Get notified about new filings, status changes, and expiry dates with customizable alert preferences.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Visual Insights',
      description: 'Beautiful dashboards with interactive charts showing IP lifecycle, trends, and competitive landscapes.'
    }
  ];

  const stats = [
    { value: '10M+', label: 'Patents Indexed' },
    { value: '150+', label: 'Countries Covered' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  const outcomes = [
    { icon: <VscAccount className="w-5 h-5" />, text: 'Role-based access for users, analysts, and admins' },
    { icon: <Shield className="w-5 h-5" />, text: 'Secure authentication with JWT and optional OAuth2' },
    { icon: <Search className="w-5 h-5" />, text: 'Search interface for patents and trademarks by keyword, assignee, inventor, jurisdiction' },
    { icon: <Bell className="w-5 h-5" />, text: 'Subscription system for monitoring filings and legal status' },
    { icon: <BarChart3 className="w-5 h-5" />, text: 'Visualization of IP lifecycle and landscape trends' },
    { icon: <Globe className="w-5 h-5" />, text: 'Integration with WIPO, USPTO, EPO, TMView, OpenCorporates APIs' },
    { icon: <VscDashboard className="w-5 h-5" />, text: 'Admin dashboard for API health and usage logs' },
    { icon: <Database className="w-5 h-5" />, text: 'Deployment-ready configuration with PostgreSQL' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-light text-gray-900 dark:text-white">
                GlobalIP Intelligence
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-light">Features</a>
              <a href="#outcomes" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-light">Outcomes</a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-light">Pricing</a>
              <DarkModeToggle />
              <button onClick={() => navigate('/login')} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-light">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="px-5 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium">
                Get Started
              </button>
              <button className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors">
                <VscAccount className="w-5 h-5" />
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <DarkModeToggle />
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-700 dark:text-gray-300">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
                <a href="#outcomes" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Outcomes</a>
                <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</a>
                <button onClick={() => navigate('/login')} className="text-left text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Login
                </button>
                <button onClick={() => navigate('/register')} className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all">
                  Get Started
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 dark:text-white mb-8 tracking-tight">
              Intellectual Property
              <span className="block mt-2 font-normal text-primary-600 dark:text-primary-400">Intelligence Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Search, monitor, and analyze patents and trademarks across 150+ countries with real-time insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-primary-600 text-white rounded-md font-medium text-base hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md">
                Get started
              </button>
              <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md font-medium text-base hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Learn more
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto pt-8 border-t border-gray-200 dark:border-gray-800">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-light text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-4">
              Built for professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              Enterprise-grade tools for modern IP management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 text-primary-600 dark:text-primary-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-4">
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { number: '01', title: 'Search & Discover', desc: 'Enter keywords, assignees, or inventors. Our platform searches across global databases including WIPO, USPTO, EPO, and TMView in real-time.', icon: Search },
              { number: '02', title: 'Monitor & Analyze', desc: 'Set up automated alerts for filing status changes, legal events, and competitor activities. Track trends with advanced analytics.', icon: Bell },
              { number: '03', title: 'Act & Decide', desc: 'Generate custom reports, visualize IP lifecycle data, and make informed decisions with comprehensive intelligence at your fingertips.', icon: BarChart3 }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 h-full hover:border-primary-600 dark:hover:border-primary-600 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-6xl font-light text-gray-200 dark:text-gray-700">{step.number}</div>
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section id="outcomes" className="py-24 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-4">
              Platform capabilities
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {outcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 text-primary-600 dark:text-primary-400 mt-1">
                  {outcome.icon}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light text-lg">{outcome.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-4">
              Trusted worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { name: 'Sarah Johnson', role: 'IP Analyst', company: 'TechCorp', quote: 'The real-time alerts and monitoring capabilities have transformed how we manage our patent portfolio.' },
              { name: 'Michael Chen', role: 'Patent Attorney', company: 'Legal Associates', quote: 'Intuitive search interface that saves hours of work. We can track competitors and analyze trends instantly.' },
              { name: 'Emily Rodriguez', role: 'Innovation Manager', company: 'BioTech Solutions', quote: 'Global database integration provides insights we never had before. Essential tool for our IP strategy.' }
            ].map((testimonial, idx) => (
              <div key={idx} className="">
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed font-light">"{testimonial.quote}"</p>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-light">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              Start free. Upgrade when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* User (Free) */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">User</h3>
                <p className="text-gray-600 dark:text-gray-400 font-light">For individuals</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-light text-gray-900 dark:text-white">Free</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 font-light">Forever</p>
              </div>
              <ul className="space-y-3 mb-10">
                {['Search patents/trademarks', 'View IP details', 'Basic search history'].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-light">{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="w-full px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Get started
              </button>
            </div>

            {/* User Pro */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">User Pro</h3>
                <p className="text-gray-600 dark:text-gray-400 font-light">Enhanced features</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-light text-gray-900 dark:text-white">$49</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2 font-light">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-10">
                {['Everything in User', 'Subscribe to IP filings (10-20 limit)', 'Real-time alerts', 'Filing tracker', 'Advanced visualizations'].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-light">{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="w-full px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Start free trial
              </button>
            </div>

            {/* Analyst (Free) */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Analyst</h3>
                <p className="text-gray-600 dark:text-gray-400 font-light">For professionals</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-light text-gray-900 dark:text-white">Free</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 font-light">Forever</p>
              </div>
              <ul className="space-y-3 mb-10">
                {['Search patents/trademarks', 'View IP details', 'Basic analytics'].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-light">{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="w-full px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Get started
              </button>
            </div>

            {/* Analyst Pro */}
            <div className="bg-white dark:bg-gray-900 border-2 border-primary-600 dark:border-primary-600 rounded-lg p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                Popular
              </div>
              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Analyst Pro</h3>
                <p className="text-gray-600 dark:text-gray-400 font-light">Complete analytics</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-light text-gray-900 dark:text-white">$99</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2 font-light">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-10">
                {['Everything in Analyst', 'Unlimited IP subscriptions', 'Real-time alerts', 'Filing tracker', 'Advanced visualizations', 'Landscape analytics'].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-light">{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="w-full px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors">
                Start free trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6">
            Start managing IP intelligence today
          </h2>
          <p className="text-xl text-primary-100 mb-10 font-light">
            Join thousands of IP professionals worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="px-8 py-3 bg-white text-primary-600 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <span>Get started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white hover:text-primary-600 transition-colors">
              Contact sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-6 h-6 text-primary-500" />
                <span className="font-medium text-lg">GlobalIP</span>
              </div>
              <p className="text-gray-400 text-sm font-light">
                IP intelligence platform for modern professionals
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 font-light">
                <li><a href="#features" className="hover:text-primary-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 font-light">
                <li><a href="#" className="hover:text-primary-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400 font-light">
                <li><a href="#" className="hover:text-primary-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm font-light">
            <p>&copy; 2024 GlobalIP Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
