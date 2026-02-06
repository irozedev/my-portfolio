import { Navigation } from './navigation';

interface NavigationWrapperProps {
  onOpenProfile: () => void;
}

export function NavigationWrapper({ onOpenProfile }: NavigationWrapperProps) {
  return <Navigation onOpenProfile={onOpenProfile} />;
}
