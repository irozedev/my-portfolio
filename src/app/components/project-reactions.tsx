import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThumbsUp, Heart, Star, Sparkles, X, LogIn } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { projectId as supabaseProjectId, publicAnonKey } from "@/utils/supabase/info";

interface ProjectReactionsProps {
  projectId: string;
  compact?: boolean;
}

const reactionTypes = [
  { id: 'like', icon: ThumbsUp, label: 'Like', color: '#00d9ff' },
  { id: 'love', icon: Heart, label: 'Love', color: '#ec4899' },
  { id: 'star', icon: Star, label: 'Star', color: '#fbbf24' },
  { id: 'sparkle', icon: Sparkles, label: 'Amazing', color: '#a78bfa' },
];

export function ProjectReactions({ projectId, compact = false }: ProjectReactionsProps) {
  const { user, accessToken, signInWithGoogle } = useAuth();
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load reactions
  const loadReactions = async () => {
    try {
      const url = `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-a62f57c7/projects/${projectId}/reactions`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken || publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReactions(data.reactions || {});
        setUserReaction(data.userReaction || null);
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReactions();
  }, [projectId]);

  // Toggle reaction
  const handleReaction = async (reactionType: string) => {
    if (!user || !accessToken) {
      setShowAuthModal(true);
      return;
    }

    const isRemoving = userReaction === reactionType;

    try {
      const response = await fetch(
        `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-a62f57c7/projects/${projectId}/reactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            reactionType: isRemoving ? null : reactionType,
          }),
        }
      );

      if (response.ok) {
        await loadReactions();
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowAuthModal(false);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  if (loading) {
    return <div className="h-12 bg-white/5 rounded-xl animate-pulse" />;
  }

  return (
    <>
      <div className={`flex ${compact ? 'gap-2' : 'flex-wrap gap-3'}`}>
        {reactionTypes.map((reaction) => {
          const Icon = reaction.icon;
          const count = reactions[reaction.id] || 0;
          const isActive = userReaction === reaction.id;

          if (compact) {
            // Compact view - just total count
            const totalCount = Object.values(reactions).reduce((sum, count) => sum + count, 0);
            if (reaction.id === 'like') {
              return (
                <motion.button
                  key="compact"
                  onClick={() => handleReaction('like')}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart 
                    className="w-5 h-5" 
                    style={{ color: userReaction ? '#ec4899' : '#9ca3af' }}
                    fill={userReaction ? '#ec4899' : 'none'}
                  />
                  {totalCount > 0 && (
                    <span className="text-sm font-medium text-white">{totalCount}</span>
                  )}
                </motion.button>
              );
            }
            return null;
          }

          return (
            <motion.button
              key={reaction.id}
              onClick={() => handleReaction(reaction.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                isActive
                  ? 'bg-white/10 border-white/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                borderColor: isActive ? reaction.color : undefined,
              }}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: isActive ? reaction.color : '#9ca3af' }}
                fill={isActive ? reaction.color : 'none'}
              />
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {count > 0 && count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] border-2 border-[#00d9ff]/30 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>

              {/* Content */}
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-[#00d9ff] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Sign in to React
                </h3>

                <p className="text-[var(--text-secondary)] mb-6">
                  Sign in with Google to show your appreciation for this project!
                </p>

                <motion.button
                  onClick={handleSignIn}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn className="w-5 h-5" />
                  Continue with Google
                </motion.button>

                <p className="text-xs text-[var(--text-muted)] mt-4">
                  We'll never post without your permission
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}