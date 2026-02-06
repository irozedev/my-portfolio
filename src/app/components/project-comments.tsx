import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send, Trash2, User } from "lucide-react";
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
      <div className="flex items-center gap-3">
        <MessageCircle className="w-6 h-6 text-[#00d9ff]" />
        <h3 className="text-xl font-bold text-[var(--text-primary)]">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.name || 'User'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#00d9ff]/50"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#00d9ff] focus:outline-none resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <motion.button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </motion.button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => {
              const isOwnComment = comment.userId === user?.id;

              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      {comment.userAvatar ? (
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-semibold text-[var(--text-primary)]">
                            {comment.userName}
                          </span>
                          {isOwnComment && (
                            <span className="ml-2 text-xs text-[#00d9ff]">(You)</span>
                          )}
                        </div>
                        {isOwnComment && (
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-[var(--text-primary)]">{comment.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-8 text-[var(--text-muted)]">
          No comments yet. Be the first to share your thoughts!
        </div>
      )}
    </div>
  );
}