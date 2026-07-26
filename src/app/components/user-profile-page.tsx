import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/auth-context";
import { projectId } from "@/utils/supabase/info";
import { Camera, Upload, Save, Check, X, User, Briefcase, Building2, Mail } from "lucide-react";

export function UserProfilePage() {
  const { user, accessToken, updateUserMetadata, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || '',
    role: user?.user_metadata?.role || '',
    company: user?.user_metadata?.company || '',
  });
  
  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Update form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.name || user.email?.split('@')[0] || '',
        role: user.user_metadata?.role || '',
        company: user.user_metadata?.company || '',
      });
      setAvatarUrl(user.user_metadata?.avatar_url || user.user_metadata?.picture || '');
    }
  }, [user]);

  // Redirect if not authenticated after loading
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/';
    }
  }, [user, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00d9ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if no user (redirect in progress)
  if (!user) {
    return null;
  }

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload avatar to Supabase Storage
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !accessToken) return null;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('userId', user!.id);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setMessage({ type: 'error', text: 'Failed to upload avatar' });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Save profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      setMessage({ type: 'error', text: 'Please sign in to update your profile' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      let newAvatarUrl = avatarUrl;

      // Upload new avatar if selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          newAvatarUrl = uploadedUrl;
        } else {
          throw new Error('Failed to upload avatar');
        }
      }

      // Update user metadata
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          company: formData.company,
          avatar_url: newAvatarUrl,
        }),
      });

      if (response.ok) {
        await response.json();

        // Update local state
        setAvatarUrl(newAvatarUrl);
        setPreviewUrl('');
        setAvatarFile(null);
        
        // Update auth context
        if (updateUserMetadata) {
          updateUserMetadata({
            name: formData.name,
            role: formData.role,
            company: formData.company,
            avatar_url: newAvatarUrl,
          });
        }

        setMessage({ type: 'success', text: 'Profile updated successfully! 🎉' });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update profile' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const displayAvatar = previewUrl || avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop';

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[#00d9ff] transition-colors mb-4"
            >
              <X className="w-5 h-5" />
              Back to Home
            </button>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00d9ff] via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Profile Settings
            </h1>
            <p className="text-[var(--text-secondary)]">Update your profile information and avatar</p>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl border-2 flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-500/10 border-green-500/50 text-green-400'
                  : 'bg-red-500/10 border-red-500/50 text-red-400'
              }`}
            >
              {message.type === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSave}>
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-2 border-white/10 rounded-3xl p-6 md:p-8 space-y-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  {/* Avatar */}
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#00d9ff]/50 shadow-[0_0_24px_rgba(0,217,255,0.18)]">
                    <img
                      src={displayAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Overlay on hover */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                  </div>

                  {/* Upload indicator */}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-full">
                      <div className="w-8 h-8 border-4 border-[#00d9ff] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#00d9ff]/20 border border-[#00d9ff]/50 rounded-xl text-[#00d9ff] hover:bg-[#00d9ff]/30 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    Change Avatar
                  </button>
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#00d9ff]/50 to-transparent" />

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-lg font-semibold mb-3 text-[var(--text-primary)]">
                    <User className="w-5 h-5 text-[#00d9ff]" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#00d9ff] focus:outline-none transition-all"
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="flex items-center gap-2 text-lg font-semibold mb-3 text-[var(--text-primary)]">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    Role / Position
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Frontend Developer, CTO, Founder"
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#00d9ff] focus:outline-none transition-all"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="flex items-center gap-2 text-lg font-semibold mb-3 text-[var(--text-primary)]">
                    <Building2 className="w-5 h-5 text-green-400" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Tech Corp, Startup Inc."
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#00d9ff] focus:outline-none transition-all"
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="flex items-center gap-2 text-lg font-semibold mb-3 text-[var(--text-primary)]">
                    <Mail className="w-5 h-5 text-orange-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-[var(--text-muted)] cursor-not-allowed"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => window.location.href = '/'}
                  className="flex-1 px-6 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-[var(--text-secondary)] hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button aria-label="Save changes"
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}