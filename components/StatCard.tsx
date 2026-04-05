interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  changeType: 'up' | 'down';
  color: 'yellow' | 'green' | 'red' | 'blue';
}

const colorClasses = {
  yellow: {
    bg: 'stat-card yellow',
    value: 'text-accent',
    accent: 'var(--accent)',
  },
  green: {
    bg: 'stat-card green',
    value: 'text-success',
    accent: 'var(--success)',
  },
  red: {
    bg: 'stat-card red',
    value: 'text-accent2',
    accent: 'var(--accent2)',
  },
  blue: {
    bg: 'stat-card blue',
    value: 'text-accent3',
    accent: 'var(--accent3)',
  },
};

export default function StatCard({ label, value, change, changeType, color }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-3 sm:p-4 md:p-5 relative overflow-hidden transition-colors hover:border-accent/30">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full opacity-6 pointer-events-none`} style={{ background: colorClasses[color].accent }}></div>

      <div className="font-mono text-8px sm:text-xs md:text-sm text-muted uppercase tracking-widest mb-1 sm:mb-2">{label}</div>
      <div className={`font-bebas text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none ${colorClasses[color].value}`}>{value}</div>
      <div className="text-8px sm:text-xs text-muted mt-1 sm:mt-1.5">
        <span className={changeType === 'up' ? 'text-success' : 'text-accent2'}>{changeType === 'up' ? '↑' : '↓'} {change}</span>
      </div>
    </div>
  );
}
