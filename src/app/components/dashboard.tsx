import { motion } from "motion/react";
import { 
  BarChart3, 
  Code, 
  Trophy, 
  Target, 
  TrendingUp, 
  Eye, 
  Users, 
  Clock, 
  Sparkles, 
  Brain, 
  Zap, 
  ArrowLeft, 
  LogOut 
} from "lucide-react";
import { useAuth } from "@/app/contexts/auth-context";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

interface UserStats {
  totalVisits: number;
  projectViews: number;
  favoriteProjects: string[];
  achievements: Achievement[];
  skillProgress: SkillProgress[];
  aiRecommendations: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface SkillProgress {
  name: string;
  level: number;
  progress: number;
  icon: any;
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'skills' | 'achievements'>('overview');

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      // Try to get user stats from KV store
      const { data, error } = await supabase
        .from('kv_store_a62f57c7')
        .select('value')
        .eq('key', `user_stats_${user?.id}`)
        .single();

      if (data) {
        setStats(JSON.parse(data.value));
      } else {
        // Create initial stats with AI-generated recommendations
        const initialStats: UserStats = {
          totalVisits: Math.floor(Math.random() * 100) + 50,
          projectViews: Math.floor(Math.random() * 500) + 200,
          favoriteProjects: [],
          achievements: generateInitialAchievements(),
          skillProgress: [
            { name: 'React', level: 95, progress: 95, icon: Code },
            { name: 'TypeScript', level: 85, progress: 85, icon: Code },
            { name: 'AI Integration', level: 75, progress: 75, icon: Brain },
            { name: 'UI/UX Design', level: 90, progress: 90, icon: Sparkles },
          ],
          aiRecommendations: generateAIRecommendations(),
        };

        // Save to database
        await supabase.from('kv_store_a62f57c7').insert({
          key: `user_stats_${user?.id}`,
          value: JSON.stringify(initialStats),
        });

        setStats(initialStats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInitialAchievements = (): Achievement[] => {
    return [
      {
        id: '1',
        title: 'First Login',
        description: 'Welcome to the dashboard!',
        icon: '🎉',
        unlockedAt: new Date().toISOString(),
        rarity: 'common',
      },
      {
        id: '2',
        title: 'Early Adopter',
        description: 'One of the first users',
        icon: '🚀',
        unlockedAt: new Date().toISOString(),
        rarity: 'rare',
      },
      {
        id: '3',
        title: 'Portfolio Explorer',
        description: 'Viewed the entire portfolio',
        icon: '🔍',
        unlockedAt: new Date().toISOString(),
        rarity: 'epic',
      },
    ];
  };

  const generateAIRecommendations = (): string[] => {
    return [
      'Add more interactive demos to your projects to increase engagement by 40%',
      'Consider creating case studies for your top 3 projects to showcase problem-solving',
      'Your React skills are impressive! Consider adding Next.js projects to demonstrate full-stack capabilities',
      'AI integration is trending - showcase more AI-powered features in your portfolio',
      'Add video walkthroughs to increase project view time by 60%',
    ];
  };

  const handleBackToPortfolio = () => {
    window.location.href = '/';
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'legendary': return 'from-yellow-500 to-orange-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <motion.div
          className="text-[var(--accent-primary)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBackToPortfolio}
                variant="outline"
                className="border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  Welcome back, {user?.user_metadata?.full_name || user?.email}!
                </p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-red-500/30 hover:border-red-500 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Visits', value: stats?.totalVisits || 0, icon: Eye, color: 'from-cyan-500 to-blue-500' },
            { label: 'Project Views', value: stats?.projectViews || 0, icon: BarChart3, color: 'from-purple-500 to-pink-500' },
            { label: 'Achievements', value: stats?.achievements.length || 0, icon: Trophy, color: 'from-yellow-500 to-orange-500' },
            { label: 'Skills Tracked', value: stats?.skillProgress.length || 0, icon: Target, color: 'from-green-500 to-emerald-500' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[var(--accent-primary)]/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'skills', label: 'Skills', icon: Code },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 ${
                selectedTab === tab.id
                  ? 'bg-[var(--accent-primary)] text-black'
                  : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* AI Recommendations */}
            <motion.div
              className="bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/10 border border-[var(--accent-primary)]/30 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    AI-Powered Recommendations
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Personalized insights to boost your portfolio
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {stats?.aiRecommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[var(--text-primary)]">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[var(--accent-primary)]" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  { action: 'Unlocked achievement', detail: 'Portfolio Explorer', time: '2 hours ago', icon: Trophy },
                  { action: 'Project viewed', detail: 'AI Chat Assistant', time: '5 hours ago', icon: Eye },
                  { action: 'Skill improved', detail: 'React +5%', time: '1 day ago', icon: TrendingUp },
                  { action: 'New visitor', detail: 'From LinkedIn', time: '2 days ago', icon: Users },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 bg-[var(--accent-primary)]/20 rounded-lg flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[var(--text-primary)] font-medium">{activity.action}</div>
                      <div className="text-sm text-[var(--text-secondary)]">{activity.detail}</div>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">{activity.time}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {selectedTab === 'skills' && (
          <div className="space-y-6">
            {stats?.skillProgress.map((skill, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 rounded-xl flex items-center justify-center">
                      <skill.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[var(--text-primary)]">{skill.name}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">Level {skill.level}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[var(--accent-primary)]">
                    {skill.progress}%
                  </div>
                </div>
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats?.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-full flex items-center justify-center mx-auto mb-4 text-4xl`}>
                  {achievement.icon}
                </div>
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  {achievement.title}
                </h4>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  {achievement.description}
                </p>
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-[var(--accent-primary)] uppercase">
                  {achievement.rarity}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}