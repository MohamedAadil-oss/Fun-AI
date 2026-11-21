import {
  Coins,
  Crown,
  Flame,
  Heart,
  Shield,
  Sparkles,
  Users,
  Wind,
} from 'lucide-react';
import type { MeterIconName } from '../game/types';

interface MeterIconProps {
  name: MeterIconName;
  className?: string;
}

export function MeterIcon({ name, className = 'w-4 h-4' }: MeterIconProps) {
  switch (name) {
    case 'users':
      return <Users className={className} aria-hidden="true" />;
    case 'coins':
      return <Coins className={className} aria-hidden="true" />;
    case 'heart':
      return <Heart className={className} aria-hidden="true" />;
    case 'crown':
      return <Crown className={className} aria-hidden="true" />;
    case 'flame':
      return <Flame className={className} aria-hidden="true" />;
    case 'wind':
      return <Wind className={className} aria-hidden="true" />;
    case 'shield':
      return <Shield className={className} aria-hidden="true" />;
    case 'sparkles':
      return <Sparkles className={className} aria-hidden="true" />;
    default:
      return <Sparkles className={className} aria-hidden="true" />;
  }
}
