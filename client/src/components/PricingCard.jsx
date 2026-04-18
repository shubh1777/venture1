import { Check, Sparkles } from 'lucide-react';

const PricingCard = ({ plan, price, features, popular, onSelect, loading }) => {
  return (
    <div className={`relative glass rounded-2xl p-8 card-hover ${popular ? 'gradient-border glow' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          Most Popular
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2 capitalize">{plan}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold gradient-text">₹{price}</span>
          <span className="text-slate-400">/one-time</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-green-400" />
            </div>
            <span className="text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          popular
            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white btn-glow hover:opacity-90'
            : 'bg-white/10 text-white hover:bg-white/20'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Processing...' : 'Get Started'}
      </button>
    </div>
  );
};

export default PricingCard;
