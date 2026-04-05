interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'accent' | 'success' | 'accent2' | 'accent3';
  className?: string;
}

const colorStyles = {
  accent: 'bg-accent',
  success: 'bg-success',
  accent2: 'bg-accent2',
  accent3: 'bg-accent3',
};

export default function ProgressBar({
  value,
  max = 100,
  color = 'accent',
  className = '',
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  return (
    <div className={`h-1.5 bg-surface2 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all ${colorStyles[color]}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
