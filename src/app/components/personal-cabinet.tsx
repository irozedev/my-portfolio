import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageSquare, Clock, TrendingUp, Sparkles, Star, Calendar, CheckCircle2, AlertCircle, Package, Code, ShoppingBag, Settings } from 'lucide-react';
import { useAuth } from '@/app/contexts/auth-context';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ProfileSettings } from './profile-settings';

interface PersonalCabinetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FavoriteProject {
  id: string;
  type?: 'project' | 'product';
  projectId: string;
  projectName: string;
  projectImage: string;
  addedAt: string;
  // Product specific fields
  price?: number;
  priceWithTax?: number;
  category?: string;
}

interface QuoteRequest {
  id: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  status: 'pending' | 'reviewed' | 'quoted';
  createdAt: string;
}

export function PersonalCabinet({ isOpen, onClose }: PersonalCabinetProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'quotes' | 'settings'>('overview');
  const [favorites, setFavorites] = useState<FavoriteProject[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [favoriteFilter, setFavoriteFilter] = useState<'all' | 'project' | 'product'>('all');

  // Quote form state
  const [quoteForm, setQuoteForm] = useState({
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen && user) {
      loadUserData();
    }
  }, [isOpen, user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load favorites
      const { data: favData } = await supabase
        .from('kv_store_a62f57c7')
        .select('value')
        .eq('key', `user_favorites_${user?.id}`)
        .single();

      if (favData?.value) {
        setFavorites(JSON.parse(favData.value));
      }

      // Load quote requests
      const { data: quotesData } = await supabase
        .from('kv_store_a62f57c7')
        .select('value')
        .eq('key', `user_quotes_${user?.id}`)
        .single();

      if (quotesData?.value) {
        setQuotes(JSON.parse(quotesData.value));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (projectId: string) => {
    const updatedFavorites = favorites.filter(f => f.projectId !== projectId);
    setFavorites(updatedFavorites);

    await supabase
      .from('kv_store_a62f57c7')
      .upsert({
        key: `user_favorites_${user?.id}`,
        value: JSON.stringify(updatedFavorites),
      });

    toast.success('Removed from favorites');
  };

  const submitQuote = async () => {
    if (!quoteForm.projectType || !quoteForm.budget || !quoteForm.timeline || !quoteForm.description) {
      toast.error('Please fill in all fields');
      return;
    }

    const newQuote: QuoteRequest = {
      id: Date.now().toString(),
      ...quoteForm,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updatedQuotes = [newQuote, ...quotes];
    setQuotes(updatedQuotes);

    await supabase
      .from('kv_store_a62f57c7')
      .upsert({
        key: `user_quotes_${user?.id}`,
        value: JSON.stringify(updatedQuotes),
      });

    setShowQuoteForm(false);
    setQuoteForm({ projectType: '', budget: '', timeline: '', description: '' });
    toast.success('Quote request submitted! I\'ll get back to you soon.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'reviewed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'quoted':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'reviewed':
        return <AlertCircle className="w-4 h-4" />;
      case 'quoted':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100000]"
          />

          {/* Cabinet Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md md:max-w-lg bg-[var(--bg-primary)] border-l border-[#00d9ff]/30 shadow-[-10px_0_50px_rgba(0,217,255,0.2)] z-[100001] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative h-40 sm:h-48 bg-gradient-to-br from-[#00d9ff]/20 via-purple-500/20 to-pink-500/20 border-b border-white/10 flex-shrink-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00d9ff08_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff08_1px,transparent_1px)] bg-[size:2rem_2rem]" />
              
              <button
                onClick={onClose}
                className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="relative h-full flex flex-col justify-end p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.name || 'User'}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#00d9ff]/50 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#00d9ff] to-purple-500 border-4 border-[#00d9ff]/50 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                      {user?.user_metadata?.name || 'Welcome'}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10 bg-[var(--bg-secondary)] flex-shrink-0 overflow-x-auto">
              <div className="flex px-2 sm:px-6 min-w-max">
                {[
                  { id: 'overview', label: 'Overview', icon: TrendingUp },
                  { id: 'favorites', label: 'Wishlist', icon: Heart },
                  { id: 'quotes', label: 'Quotes', icon: MessageSquare },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`relative flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-[#00d9ff]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d9ff]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-12 h-12 border-4 border-[#00d9ff]/30 border-t-[#00d9ff] rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        <div className="p-3 sm:p-6 bg-gradient-to-br from-[#00d9ff]/10 to-cyan-400/10 border border-[#00d9ff]/30 rounded-xl sm:rounded-2xl">
                          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-[#00d9ff] mb-1 sm:mb-2" />
                          <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{favorites.length}</div>
                          <div className="text-xs sm:text-sm text-[var(--text-secondary)]">Favorites</div>
                        </div>
                        <div className="p-3 sm:p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl sm:rounded-2xl">
                          <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mb-1 sm:mb-2" />
                          <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{quotes.length}</div>
                          <div className="text-xs sm:text-sm text-[var(--text-secondary)]">Quotes</div>
                        </div>
                        <div className="p-3 sm:p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl sm:rounded-2xl">
                          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mb-1 sm:mb-2" />
                          <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">
                            {quotes.filter(q => q.status === 'quoted').length}
                          </div>
                          <div className="text-xs sm:text-sm text-[var(--text-secondary)]">Done</div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-3">
                        <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h3>
                        <Button
                          onClick={() => {
                            setActiveTab('quotes');
                            setShowQuoteForm(true);
                          }}
                          className="w-full bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-semibold py-4 sm:py-6"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          Request a Quote
                        </Button>
                      </div>

                      {/* Activity */}
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                          {quotes.slice(0, 3).map((quote) => (
                            <div
                              key={quote.id}
                              className="p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#00d9ff]/30 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm sm:text-base text-[var(--text-primary)] truncate pr-2">{quote.projectType}</span>
                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(quote.status)}`}>
                                  {quote.status}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                                {new Date(quote.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                          {quotes.length === 0 && (
                            <p className="text-center text-sm text-[var(--text-secondary)] py-8">
                              No activity yet. Start by requesting a quote!
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Favorites Tab */}
                  {activeTab === 'favorites' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">Wishlist</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setFavoriteFilter('all')}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${favoriteFilter === 'all' ? 'bg-[#00d9ff]/20 text-[#00d9ff]' : 'bg-white/5 text-[var(--text-secondary)]'} transition-colors`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setFavoriteFilter('project')}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${favoriteFilter === 'project' ? 'bg-[#00d9ff]/20 text-[#00d9ff]' : 'bg-white/5 text-[var(--text-secondary)]'} transition-colors`}
                          >
                            Projects
                          </button>
                          <button
                            onClick={() => setFavoriteFilter('product')}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${favoriteFilter === 'product' ? 'bg-[#00d9ff]/20 text-[#00d9ff]' : 'bg-white/5 text-[var(--text-secondary)]'} transition-colors`}
                          >
                            Products
                          </button>
                        </div>
                      </div>

                      {favorites.length > 0 ? (
                        favorites
                          .filter(fav => favoriteFilter === 'all' || fav.type === favoriteFilter)
                          .length > 0 ? (
                          favorites
                            .filter(fav => favoriteFilter === 'all' || fav.type === favoriteFilter)
                            .map((fav) => (
                              <motion.div
                                key={fav.id}
                                layout
                                className="group relative p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl hover:border-[#00d9ff]/50 transition-all overflow-hidden"
                              >
                                {/* Type Badge */}
                                <div className="absolute top-2 right-2 z-10">
                                  {fav.type === 'product' ? (
                                    <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-xs font-medium text-purple-300">
                                      <ShoppingBag className="w-3 h-3" />
                                      <span>Product</span>
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 px-2 py-1 bg-[#00d9ff]/20 border border-[#00d9ff]/40 rounded-full text-xs font-medium text-[#00d9ff]">
                                      <Code className="w-3 h-3" />
                                      <span>Project</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 sm:gap-4">
                                  <img
                                    src={fav.projectImage}
                                    alt={fav.projectName}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl object-cover flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0 pr-16">
                                    <h4 className="font-semibold text-sm sm:text-base text-[var(--text-primary)] mb-1 truncate">
                                      {fav.projectName}
                                    </h4>
                                    {fav.type === 'product' && fav.priceWithTax && (
                                      <p className="text-sm sm:text-base font-bold text-[#00d9ff] mb-1">
                                        €{fav.priceWithTax.toFixed(2)} <span className="text-xs text-[var(--text-secondary)]">(incl. 21% BTW)</span>
                                      </p>
                                    )}
                                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                                      Added {new Date(fav.addedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => removeFavorite(fav.projectId)}
                                    className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors flex-shrink-0 group-hover:scale-110"
                                    title="Remove from wishlist"
                                  >
                                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 fill-red-400" />
                                  </button>
                                </div>
                              </motion.div>
                            ))
                        ) : (
                          <div className="text-center py-12">
                            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                            <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-2">
                              No {favoriteFilter === 'product' ? 'products' : 'projects'} in wishlist
                            </p>
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                              Try selecting a different filter
                            </p>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-12">
                          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                          <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-2">No favorites yet</p>
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                            Start adding projects and products to your wishlist!
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Quotes Tab */}
                  {activeTab === 'quotes' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {!showQuoteForm ? (
                        <>
                          <Button
                            onClick={() => setShowQuoteForm(true)}
                            className="w-full bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-semibold py-4 sm:py-6 mb-6"
                          >
                            <Sparkles className="w-5 h-5 mr-2" />
                            New Quote Request
                          </Button>

                          {quotes.length > 0 ? (
                            quotes.map((quote) => (
                              <motion.div
                                key={quote.id}
                                layout
                                className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl hover:border-[#00d9ff]/30 transition-all"
                              >
                                <div className="flex items-start justify-between mb-4 gap-3">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-[var(--text-primary)] text-base sm:text-lg mb-1 truncate">
                                      {quote.projectType}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                                      {new Date(quote.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full border whitespace-nowrap ${getStatusColor(quote.status)}`}>
                                    {getStatusIcon(quote.status)}
                                    <span className="text-xs sm:text-sm font-medium capitalize">{quote.status}</span>
                                  </div>
                                </div>
                                <div className="space-y-2 text-xs sm:text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Budget:</span>
                                    <span className="text-[var(--text-primary)] font-medium">{quote.budget}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Timeline:</span>
                                    <span className="text-[var(--text-primary)] font-medium">{quote.timeline}</span>
                                  </div>
                                  <div className="pt-2 border-t border-white/10">
                                    <p className="text-[var(--text-secondary)]">{quote.description}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-12">
                              <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                              <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-2">No quote requests yet</p>
                              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                                Request a quote to get started!
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        /* Quote Form */
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 sm:p-6 bg-white/5 border border-[#00d9ff]/30 rounded-xl sm:rounded-2xl space-y-4"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">New Quote Request</h3>
                            <button
                              onClick={() => setShowQuoteForm(false)}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              <X className="w-5 h-5 text-[var(--text-secondary)]" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                              Project Type
                            </label>
                            <select
                              value={quoteForm.projectType}
                              onChange={(e) => setQuoteForm({ ...quoteForm, projectType: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
                            >
                              <option value="">Select type...</option>
                              <option value="Website Development">Website Development</option>
                              <option value="E-commerce Platform">E-commerce Platform</option>
                              <option value="Web Application">Web Application</option>
                              <option value="Mobile App">Mobile App</option>
                              <option value="UI/UX Design">UI/UX Design</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                              Budget Range (EUR)
                            </label>
                            <select
                              value={quoteForm.budget}
                              onChange={(e) => setQuoteForm({ ...quoteForm, budget: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
                            >
                              <option value="">Select budget...</option>
                              <option value="€500 - €2,000">€500 - €2,000</option>
                              <option value="€2,000 - €5,000">€2,000 - €5,000</option>
                              <option value="€5,000 - €10,000">€5,000 - €10,000</option>
                              <option value="€10,000+">€10,000+</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                              Timeline
                            </label>
                            <select
                              value={quoteForm.timeline}
                              onChange={(e) => setQuoteForm({ ...quoteForm, timeline: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
                            >
                              <option value="">Select timeline...</option>
                              <option value="1-2 weeks">1-2 weeks</option>
                              <option value="2-4 weeks">2-4 weeks</option>
                              <option value="1-2 months">1-2 months</option>
                              <option value="2-3 months">2-3 months</option>
                              <option value="3+ months">3+ months</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                              Project Description
                            </label>
                            <textarea
                              value={quoteForm.description}
                              onChange={(e) => setQuoteForm({ ...quoteForm, description: e.target.value })}
                              rows={4}
                              placeholder="Tell me about your project..."
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[#00d9ff] focus:outline-none transition-colors resize-none"
                            />
                          </div>

                          <Button
                            onClick={submitQuote}
                            className="w-full bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-semibold py-3 sm:py-4"
                          >
                            Submit Request
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <ProfileSettings />
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}