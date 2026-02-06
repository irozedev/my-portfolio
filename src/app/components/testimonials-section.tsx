import { useLanguage } from "../contexts/language-context";
import { useAuth } from "../contexts/auth-context";
import { projectId, publicAnonKey } from "@/utils/supabase/info";

// Default/Featured testimonials
const defaultTestimonials = [
  {
    name: "Alex Johnson",
    role: "CTO",
    company: "TechStart Inc.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    text: "Stepan delivered exceptional work on our e-commerce platform. The performance improvements were beyond our expectations.",
    rating: 5,
    color: "#00d9ff",
    featured: true,
  },
  {
    name: "Maria Garcia",
    role: "Product Manager",
    company: "Digital Solutions",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    text: "Working with Stepan was a pleasure. His expertise in Vue.js and attention to detail helped us create a dashboard that our clients love.",
    rating: 5,
    color: "#a78bfa",
    featured: true,
  },
  {
    name: "David Chen",
    role: "Founder & CEO",
    company: "Innovate Labs",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    text: "Stepan's full-stack development skills are impressive. He built our entire platform from scratch and delivered on time.",
    rating: 5,
    color: "#22c55e",
    featured: true,
  },
  {
    name: "Sarah Williams",
    role: "Marketing Director",
    company: "Growth Co.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    text: "Outstanding developer with great communication skills. The project exceeded our expectations in every way.",
    rating: 5,
    color: "#f59e0b",
    featured: true,
  },
];

export function TestimonialsSection() {
  const { t } = useLanguage();
  const { user, accessToken } = useAuth();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Load testimonials
  const loadTestimonials = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/testimonials`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Combine default testimonials with user testimonials
        const allTestimonials = [...defaultTestimonials, ...data.testimonials];
        setTestimonials(allTestimonials);
      } else {
        setTestimonials(defaultTestimonials);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
      setTestimonials(defaultTestimonials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  // Submit testimonial
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !accessToken) {
      alert('Please sign in to leave a review!');
      return;
    }

    if (!reviewText.trim()) {
      alert('Please write your review!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          text: reviewText,
          rating,
        }),
      });

      if (response.ok) {
        await loadTestimonials();
        setShowAddModal(false);
        setReviewText("");
        setRating(5);
        alert('Thank you for your review! 🎉');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete testimonial
  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        await loadTestimonials();
        alert('Review deleted successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('An error occurred while deleting your review');
    }
  };

  // Check if user already left a review
  const userReview = testimonials.find(t => t.userId === user?.id);

  return (
    <section id="testimonials" className="min-h-screen py-24 md:py-32 px-4 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-[#00d9ff]/20 to-purple-500/20 border border-[#00d9ff]/30 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Star className="w-5 h-5 text-[#00d9ff]" />
              <span className="text-sm md:text-base text-[var(--text-primary)] font-medium">Client Feedback</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-[#00d9ff] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                TESTIMONIALS
              </span>
            </motion.h2>
            
            <motion.div
              className="h-1 w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent mx-auto mb-6"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            />

            <motion.p
              className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto px-4 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              What clients say about working with me
            </motion.p>

            {/* Add Review Button */}
            {user && !userReview && (
              <motion.button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <MessageCircle className="w-5 h-5" />
                Leave a Review
              </motion.button>
            )}
          </div>

          {/* Carousel */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#00d9ff] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="relative px-4 md:px-0">
              <div className="relative overflow-visible -mx-4 md:mx-0" ref={emblaRef}>
                <div className="flex touch-pan-y px-4 md:px-0">
                  {testimonials.map((testimonial, index) => {
                    const isUserReview = testimonial.userId === user?.id;
                    const displayColor = testimonial.color || '#00d9ff';
                    const displayImage = testimonial.userAvatar || testimonial.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop';

                    return (
                      <div 
                        key={testimonial.id || index} 
                        className="flex-[0_0_100%] min-w-0 md:flex-[0_0_90%] lg:flex-[0_0_85%] px-2 md:px-4"
                      >
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 lg:p-12
                          hover:bg-white/10 hover:border-[#00d9ff]/50 transition-all duration-500
                          shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                          
                          {/* Quote Icon */}
                          <div className="absolute -top-6 left-6 md:left-10 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#00d9ff] to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                            <Quote className="w-7 h-7 md:w-8 md:h-8 text-black" />
                          </div>

                          {/* User's own review - Delete button */}
                          {isUserReview && (
                            <div className="absolute top-4 right-4 flex gap-2">
                              <motion.button
                                onClick={() => handleDelete(testimonial.id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-all"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-5 h-5 text-red-400" />
                              </motion.button>
                            </div>
                          )}

                          {/* Content */}
                          <div className="mt-8 md:mt-10">
                            {/* Rating */}
                            <div className="flex gap-1 mb-6">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-5 h-5 md:w-6 md:h-6 fill-[#00d9ff] text-[#00d9ff]"
                                />
                              ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-lg md:text-2xl lg:text-3xl text-[var(--text-primary)] leading-relaxed mb-8 italic font-light">
                              "{testimonial.text || testimonial.content}"
                            </p>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-[#00d9ff]/50 to-transparent mb-8" />

                            {/* Author */}
                            <div className="flex items-center gap-4 md:gap-6">
                              <div className="relative">
                                <div
                                  className="absolute -inset-1 md:-inset-2 rounded-full blur-lg opacity-70"
                                  style={{ backgroundColor: displayColor }}
                                />
                                <img
                                  src={displayImage}
                                  alt={testimonial.userName || testimonial.name}
                                  className="relative w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 md:border-3 border-white/30"
                                />
                              </div>
                              <div>
                                <p className="text-xl md:text-2xl font-semibold text-[var(--text-primary)]">
                                  {testimonial.userName || testimonial.name}
                                  {isUserReview && <span className="ml-2 text-sm text-[#00d9ff]">(You)</span>}
                                </p>
                                <p className="text-base md:text-lg text-[var(--text-secondary)]">{testimonial.userRole || testimonial.role}</p>
                                {(testimonial.userCompany || testimonial.company) && (
                                  <p className="text-sm md:text-base text-[#00d9ff]">{testimonial.userCompany || testimonial.company}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Decorative Gradient */}
                          <div
                            className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                              background: `linear-gradient(135deg, ${displayColor}10 0%, transparent 50%)`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-center items-center gap-6 mt-10 md:mt-12">
                <motion.button
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  className="p-4 md:p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-[#00d9ff]/20 hover:border-[#00d9ff]/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-[#00d9ff]" />
                </motion.button>

                {/* Dots */}
                <div className="flex gap-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => emblaApi?.scrollTo(index)}
                      className={`h-3 rounded-full transition-all ${
                        index === selectedIndex
                          ? "w-12 bg-[#00d9ff]"
                          : "w-3 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  className="p-4 md:p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-[#00d9ff]/20 hover:border-[#00d9ff]/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-[#00d9ff]" />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Review Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="relative w-full max-w-2xl bg-[var(--bg-primary)] border-2 border-[#00d9ff]/50 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,217,255,0.3)]"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="w-6 h-6 text-[var(--text-secondary)]" />
              </button>

              <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">
                Leave Your Review
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-lg font-semibold mb-3 text-[var(--text-primary)]">
                    Your Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= rating ? 'fill-[#00d9ff] text-[#00d9ff]' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-lg font-semibold mb-3 text-[var(--text-primary)]">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us about your experience working with me..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#00d9ff] focus:outline-none resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-[var(--text-secondary)] hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}