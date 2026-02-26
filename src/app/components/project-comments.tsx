import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send, Trash2, User, LogIn, Lock } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { projectId as supabaseProjectId, publicAnonKey } from "@/utils/supabase/info";

interface ProjectCommentsProps {
  projectId: string;
}

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export function ProjectComments({ projectId }: ProjectCommentsProps) {
  const { user, accessToken } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load comments
  const loadComments = async () => {
    try {
      const url = `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-a62f57c7/projects/${projectId}/comments`;
      console.log('Loading comments from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('Comments response:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Comments data:', data);
        setComments(data.comments || []);
      } else {
        const errorData = await response.text();
        console.error('Failed to load comments:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [projectId]);

  // Submit comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !accessToken) {
      alert('Please sign in to comment!');
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-a62f57c7/projects/${projectId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            text: commentText,
          }),
        }
      );

      if (response.ok) {
        setCommentText('');
        await loadComments();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete comment
  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const response = await fetch(
        `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-a62f57c7/projects/${projectId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        await loadComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#00d9ff]/20 to-purple-500/20 rounded-xl border border-[#00d9ff]/30">
            <MessageCircle className="w-5 h-5 text-[#00d9ff]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Discussion
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>
      </div>

      {/* Comment Form - Logged In */}
      {user ? (
        <motion.form 
          onSubmit={handleSubmit} 
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative bg-[var(--bg-secondary)]/60 backdrop-blur-sm border-2 border-[var(--border-color)] rounded-2xl p-4 hover:border-[#00d9ff]/30 transition-all duration-300">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#00d9ff]/50 ring-2 ring-[#00d9ff]/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center ring-2 ring-[#00d9ff]/20">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts about this project..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-0 py-0 bg-transparent border-0 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-0 resize-none font-normal text-base"
                />
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                  <div className="text-xs text-[var(--text-muted)]">
                    {commentText.length}/500 characters
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !commentText.trim() || commentText.length > 500}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_25px_rgba(0,217,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.form>
      ) : (
        /* Sign In Prompt - Not Logged In */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
        >
          <div className="relative bg-gradient-to-br from-[#00d9ff]/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border-2 border-dashed border-[#00d9ff]/30 rounded-2xl p-8">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00d9ff]/5 via-transparent to-purple-500/5 animate-pulse" />
            
            {/* Content */}
            <div className="relative z-10 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00d9ff]/20 to-purple-500/20 rounded-2xl border border-[#00d9ff]/30 mb-2">
                <Lock className="w-8 h-8 text-[#00d9ff]" />
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  Join the Discussion
                </h4>
                <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
                  Sign in to share your thoughts, ask questions, and connect with other developers
                </p>
              </div>

              <motion.button
                onClick={() => {
                  // Scroll to header where sign in button is
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  // Trigger sign in modal after scroll
                  setTimeout(() => {
                    const signInBtn = document.querySelector('[id*="sign-in"]');
                    if (signInBtn) {
                      (signInBtn as HTMLElement).click();
                    }
                  }, 500);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogIn className="w-5 h-5" />
                Sign In to Comment
              </motion.button>

              <div className="flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  Leave feedback
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Build your profile
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[var(--bg-secondary)]/40 rounded-2xl animate-pulse border border-[var(--border-color)]" />
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {comments.map((comment, index) => {
              const isOwnComment = comment.userId === user?.id;

              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="relative bg-[var(--bg-secondary)]/40 backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-5 hover:border-[#00d9ff]/30 transition-all duration-300">
                    {/* Own comment highlight */}
                    {isOwnComment && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00d9ff]/5 to-transparent rounded-2xl pointer-events-none" />
                    )}
                    
                    <div className="relative flex gap-4">
                      <div className="flex-shrink-0">
                        {comment.userAvatar ? (
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="w-11 h-11 rounded-full object-cover border-2 border-[var(--border-color)] ring-2 ring-transparent group-hover:ring-[#00d9ff]/20 transition-all"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-transparent group-hover:ring-purple-500/20 transition-all">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[var(--text-primary)]">
                              {comment.userName}
                            </span>
                            {isOwnComment && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#00d9ff]/20 border border-[#00d9ff]/30 rounded-lg text-xs font-mono text-[#00d9ff]">
                                You
                              </span>
                            )}
                            <span className="text-sm text-[var(--text-muted)]">
                              •
                            </span>
                            <time className="text-sm text-[var(--text-muted)]">
                              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </time>
                          </div>
                          {isOwnComment && (
                            <motion.button
                              onClick={() => handleDelete(comment.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-all group/delete"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4 text-red-400 group-hover/delete:text-red-300" />
                            </motion.button>
                          )}
                        </div>
                        <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap break-words">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 px-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--bg-secondary)]/60 rounded-2xl border border-[var(--border-color)] mb-4">
            <MessageCircle className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            No comments yet
          </h4>
          <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">
            Be the first to share your thoughts about this project!
          </p>
        </motion.div>
      )}
    </div>
  );
}