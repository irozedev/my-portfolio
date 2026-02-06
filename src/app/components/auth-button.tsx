import { motion } from 'motion/react';
import { User, LogOut, Heart, MessageSquare, Settings } from 'lucide-react';
import { useAuth } from '@/app/contexts/auth-context';
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { AuthModalClean } from './auth-modal-clean';

interface AuthButtonProps {
  onOpenProfile: () => void;
}

export function AuthButton({ onOpenProfile }: AuthButtonProps) {
  const { user, signOut, loading } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowMenu(false);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Button
        onClick={() => setShowAuthModal(true)}
        className="bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-semibold px-6 py-2 text-sm shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all duration-300"
      >
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#00d9ff]/30 hover:border-[#00d9ff] transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata?.name || 'User'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
        
        {/* Online indicator */}
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg-primary)]" />
      </motion.button>

      {/* Dropdown Menu */}
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute right-0 mt-3 w-64 bg-[var(--bg-primary)] border-2 border-[#00d9ff]/30 rounded-2xl shadow-[0_0_30px_rgba(0,217,255,0.2)] overflow-hidden z-[100000]"
        >
          {/* User Info */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-br from-[#00d9ff]/10 to-purple-500/10">
            <div className="flex items-center gap-3">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#00d9ff]/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--text-primary)] truncate">
                  {user.user_metadata?.name || 'User'}
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => {
                onOpenProfile();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <Heart className="w-5 h-5 text-[#00d9ff] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-[var(--text-primary)]">My Profile</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors group"
            >
              <LogOut className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-red-400">Sign Out</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 bg-white/5">
            <p className="text-xs text-[var(--text-secondary)] text-center">
              Signed in with Google
            </p>
          </div>
        </motion.div>
      )}

      {/* Auth Modal */}
      <AuthModalClean
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}