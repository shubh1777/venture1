import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Briefcase, 
  Trophy, 
  Code, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Globe,
  Shield
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Briefcase,
      title: 'Exclusive Internships',
      description: 'Access curated internship opportunities from top companies before anyone else.'
    },
    {
      icon: Trophy,
      title: 'Hackathons & Competitions',
      description: 'Stay updated with the latest hackathons and coding competitions.'
    },
    {
      icon: Code,
      title: 'Skill Development',
      description: 'Resources and opportunities to build your technical skills.'
    },
    {
      icon: Users,
      title: 'Referral Rewards',
      description: 'Earn money by referring friends. Get up to ₹40 per successful referral.'
    }
  ];

  const stats = [
    { value: '500+', label: 'Active Opportunities' },
    { value: '10K+', label: 'Students Joined' },
    { value: '₹5L+', label: 'Referral Rewards Paid' },
    { value: '50+', label: 'Partner Companies' }
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">InternConnect</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-300">Join 10,000+ students already on board</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
              <span className="text-white">Your Gateway to</span>
              <br />
              <span className="gradient-text">Dream Opportunities</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Get exclusive access to internships, hackathons, and competitions. 
              Refer friends and earn rewards while building your career.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup"
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-lg btn-glow hover:opacity-90 transition-all"
              >
                Get started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From exclusive opportunities to earning through referrals, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 lg:py-32 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your account and get started in seconds.' },
              { step: '02', title: 'Access Opportunities', desc: 'Browse exclusive internships, hackathons, and competitions.' },
              { step: '03', title: 'Earn by Referring', desc: 'Share your referral code and earn up to ₹40 per referral.' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="glass rounded-2xl p-8 text-center card-hover">
                  <div className="text-5xl font-bold gradient-text mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-12 glow">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Kickstart Your Career?
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Join thousands of students who are already ahead in their career journey.
            </p>
            <Link 
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-lg btn-glow hover:opacity-90 transition-all"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">InternConnect</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2024 InternConnect. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Globe className="w-5 h-5 text-slate-400" />
              <Shield className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
