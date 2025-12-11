import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { HiLightBulb, HiSearch, HiChartBar, HiGlobe, HiShieldCheck, HiBolt, HiRefresh, HiCheckCircle, HiTrash, HiArrowRight, HiChevronDown } from 'react-icons/hi';
import { FaRecycle, FaLeaf } from 'react-icons/fa';
import { MdAnalytics, MdDashboard, MdPeople } from 'react-icons/md';
import { BsTwitter, BsLinkedin, BsEnvelope } from 'react-icons/bs';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <HiLightBulb className="text-2xl text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                GlobalIP
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Pricing</a>
              <DarkModeToggle />
              <button onClick={() => navigate('/login')} className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all">
                Get Started
              </button>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <HiBolt className="text-xl text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">AI-Powered Life Cycle Assessment</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-gray-900 dark:text-white">Turn IP data into</span>
                <br />
                <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">circular value</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Automated LCA for patents and trademarks. Calculate emissions and energy savings vs primary production. Monitor global filings across 150+ countries.
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <FaRecycle className="text-lg text-green-500" />
                  <span>Circularity metrics: recycling rate, recycled content, end-of-life recovery</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/register')} className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2">
                  <span>Analyze IP Stream</span>
                  <HiArrowRight className="text-xl" />
                </button>
                <button className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all">
                  View Use Cases
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">95%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Energy Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">75%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Less CO2</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Recyclable</div>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-right hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 border border-gray-200 dark:border-gray-700">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-xl">
                    <HiRefresh className="text-6xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">SCROLL TO EXPLORE</h3>
                  <div className="animate-bounce text-4xl"><HiChevronDown className="mx-auto" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <HiChartBar className="text-4xl text-primary-500" />, value: '10M+', label: 'Patents Tracked' },
              { icon: <HiGlobe className="text-4xl text-accent-500" />, value: '150+', label: 'Countries Covered' },
              { icon: <HiBolt className="text-4xl text-primary-500" />, value: '99.9%', label: 'System Uptime' },
              { icon: <HiShieldCheck className="text-4xl text-accent-500" />, value: '24/7', label: 'Real-time Alerts' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-2 animate-fade-in">
                <div>{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Why Recycled Metals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Recycled metals from scrap offer significant advantages over primary production.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <HiBolt className="text-3xl text-white" />,
                title: 'Lower Energy & Emissions',
                stat: '95%',
                label: 'Energy Saved',
                description: 'Recycling aluminum uses 95% less energy than primary production. Copper recycling saves up to 85% energy compared to mining.'
              },
              {
                icon: <HiTrash className="text-3xl text-white" />,
                title: 'Reduced Landfill Waste',
                stat: '0',
                label: 'Waste to Landfill',
                description: 'Divert valuable metals from landfills, improving resource efficiency and reducing environmental contamination.'
              },
              {
                icon: <HiCheckCircle className="text-3xl text-white" />,
                title: 'Better Compliance',
                stat: '100%',
                label: 'Recyclable',
                description: 'Higher recycled content in products helps meet sustainability goals and regulatory requirements for circular economy.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-primary-500 dark:text-primary-400">{feature.stat}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{feature.label}</div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Simple, powerful, and automated</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <HiSearch className="text-4xl text-white" />, title: 'Search & Monitor', desc: 'Search global IP databases and set up automated monitoring' },
              { icon: <MdAnalytics className="text-4xl text-white" />, title: 'Analyze & Compare', desc: 'Get instant analytics, trends, and competitive insights' },
              { icon: <HiChartBar className="text-4xl text-white" />, title: 'Track & Report', desc: 'Generate reports and track your IP portfolio growth' }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {idx < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>
                )}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="text-sm font-bold text-primary-500 dark:text-primary-400 mb-2">STEP {idx + 1}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'User',
                price: '$29',
                icon: <MdPeople className="text-5xl text-primary-500" />,
                features: ['Basic IP Search', '100 Searches/month', 'Email Alerts', 'Basic Analytics', 'Export to PDF']
              },
              {
                name: 'Analyst',
                price: '$99',
                icon: <MdAnalytics className="text-5xl text-primary-500" />,
                popular: true,
                features: ['Advanced Search', 'Unlimited Searches', 'Real-time Alerts', 'Advanced Analytics', 'API Access', 'Priority Support']
              },
              {
                name: 'Admin',
                price: '$299',
                icon: <MdDashboard className="text-5xl text-primary-500" />,
                features: ['Everything in Analyst', 'Team Management', 'Custom Integrations', 'Dedicated Support', 'White-label Options', 'SLA Guarantee']
              }
            ].map((plan, idx) => (
              <div key={idx} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 p-8 ${plan.popular ? 'border-primary-500 scale-105' : 'border-gray-200 dark:border-gray-700'}`}>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-center py-2 rounded-lg mb-6 font-semibold">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center mb-8">
                  <div className="mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                    <span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center space-x-3">
                      <HiCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/register')} className={`w-full py-3 rounded-lg font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-xl' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your IP Intelligence?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of professionals using GlobalIP to monitor and analyze intellectual property worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2">
              <span>Start Free Trial</span>
              <HiArrowRight className="text-xl" />
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <HiLightBulb className="text-xl text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">GlobalIP</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Your trusted partner for global intellectual property intelligence and monitoring.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#features" className="hover:text-primary-500 dark:hover:text-primary-400">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary-500 dark:hover:text-primary-400">Pricing</a></li>
                <li><button className="hover:text-primary-500 dark:hover:text-primary-400">API</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><button className="hover:text-primary-500 dark:hover:text-primary-400">About</button></li>
                <li><button className="hover:text-primary-500 dark:hover:text-primary-400">Blog</button></li>
                <li><button className="hover:text-primary-500 dark:hover:text-primary-400">Careers</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Connect</h4>
              <div className="flex space-x-4">
                <BsTwitter className="text-2xl cursor-pointer hover:scale-110 transition-transform text-gray-600 dark:text-gray-400 hover:text-primary-500" />
                <BsLinkedin className="text-2xl cursor-pointer hover:scale-110 transition-transform text-gray-600 dark:text-gray-400 hover:text-primary-500" />
                <BsEnvelope className="text-2xl cursor-pointer hover:scale-110 transition-transform text-gray-600 dark:text-gray-400 hover:text-primary-500" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 GlobalIP Intelligence Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
