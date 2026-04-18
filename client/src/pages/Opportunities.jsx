import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import OpportunityCard from '../components/OpportunityCard';
import ApplicationModal from '../components/ApplicationModal';
import api from '../services/api';
import { Search, Filter, Briefcase, Trophy, Code, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Opportunities = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    search: ''
  });
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [appliedOppIds, setAppliedOppIds] = useState(new Set());
  const navigate = useNavigate();

  const types = [
    { value: 'all', label: 'All', icon: Filter },
    { value: 'internship', label: 'Internships', icon: Briefcase },
    { value: 'hackathon', label: 'Hackathons', icon: Trophy },
    { value: 'competition', label: 'Competitions', icon: Code },
    { value: 'job', label: 'Jobs', icon: Building }
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.type !== 'all') {
          params.append('type', filters.type);
        }

        const [oppsResult, appsResult] = await Promise.allSettled([
          api.get(`/opportunities?${params.toString()}`),
          api.get('/applications/my-applications')
        ]);

        if (oppsResult.status === 'fulfilled') {
          setOpportunities(oppsResult.value.data.opportunities || []);
        } else {
          console.error('Failed to fetch opportunities:', oppsResult.reason);
          toast.error('Failed to load opportunities.');
        }

        if (appsResult.status === 'fulfilled') {
          setAppliedOppIds(new Set(appsResult.value.data.applications.map(app => app.opportunityId._id)));
        } else {
          console.error('Failed to fetch student applications:', appsResult.reason);
          toast.error("Could not load your application statuses.");
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        toast.error("An unexpected error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [filters.type]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/opportunities?${params.toString()}`);
      setOpportunities(response.data.opportunities);
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);      
      toast.error('Failed to search for opportunities.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const handleApplyClick = (opportunity) => {
    setSelectedOpp(opportunity);
    setShowApplyModal(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplyModal(false);
    setSelectedOpp(null);
    navigate('/my-applications');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Opportunities
          </h1>
          <p className="text-slate-400">
            Discover internships, hackathons, and competitions
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search opportunities..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </form>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {types.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setFilters({ ...filters, type: value })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    filters.type === value
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : opportunities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <OpportunityCard 
                key={opportunity._id} 
                opportunity={opportunity}
                onApplyClick={handleApplyClick}
                hasApplied={appliedOppIds.has(opportunity._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No opportunities found</h3>
            <p className="text-slate-400">Try adjusting your filters or search terms</p>
          </div>
        )}

        {showApplyModal && selectedOpp && (
          <ApplicationModal
            opportunity={selectedOpp}
            onClose={() => setShowApplyModal(false)}
            onSuccess={handleApplicationSuccess}
          />
        )}
      </main>
    </div>
  );
};

export default Opportunities;
