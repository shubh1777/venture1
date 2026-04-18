import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Lock,
  Zap,
  Check
} from 'lucide-react';

const OpportunityCard = ({ opportunity, onApplyClick, hasApplied }) => {
  const typeColors = {
    internship: 'from-blue-500 to-cyan-500',
    hackathon: 'from-purple-500 to-pink-500',
    competition: 'from-orange-500 to-red-500',
    job: 'from-green-500 to-emerald-500'
  };

  return (
    <div className={`glass rounded-2xl overflow-hidden card-hover`}>
      {/* Header with type badge */}
      <div className={`h-2 bg-gradient-to-r ${typeColors[opportunity.type]}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${typeColors[opportunity.type]} text-white`}>
                {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
              </span>
              {opportunity.isPremium && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {opportunity.title}
            </h3>
            <p className="text-slate-400 text-sm">
              {opportunity.company}
            </p>
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-4 line-clamp-2">
          {opportunity.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.tags?.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 rounded-lg bg-white/5 text-slate-400 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{opportunity.location}</span>
          </div>
          {opportunity.stipend && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              <span>{opportunity.stipend}</span>
            </div>
          )}
          {opportunity.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {hasApplied ? (
          <button
            disabled
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-500/20 text-green-400 font-medium cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Applied
          </button>
        ) : (
          <button
            onClick={() => onApplyClick(opportunity)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Apply Now
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;
