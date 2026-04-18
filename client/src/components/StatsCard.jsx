const StatsCard = ({ title, value, subtitle, icon: Icon, gradient }) => {
  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${gradient ? 'gradient-text' : 'text-white'}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient || 'from-primary-500 to-accent-500'} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
