type BadgeType = 'active' | 'expiring' | 'expired' | 'pending' | 'paid' | 'basic' | 'premium' | 'vip';

interface BadgeProps {
  type: BadgeType;
  children: React.ReactNode;
}

const badgeStyles: Record<BadgeType, string> = {
  active: 'bg-success/12 text-success',
  expiring: 'bg-accent/12 text-accent',
  expired: 'bg-accent2/12 text-accent2',
  pending: 'bg-accent3/12 text-accent3',
  paid: 'bg-success/12 text-success',
  basic: 'bg-muted/15 text-muted',
  premium: 'bg-accent/12 text-accent',
  vip: 'bg-accent2/12 text-pink-400',
};

export default function Badge({ type, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-0.5 font-mono ${badgeStyles[type]}`}>
      {children}
    </span>
  );
}
