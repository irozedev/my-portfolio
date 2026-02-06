import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, Lock, MapPin, Mail, User, Phone } from "lucide-react";
import { useState } from "react";
import { useCart } from "../contexts/cart-context";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Belgium",
  });

  const VAT_RATE = 0.21;
  const subtotal = getTotalPrice();
  const vat = subtotal * VAT_RATE;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + vat + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate order processing
    toast.success("Order placed successfully! 🎉", {
      description: `Order confirmation sent to ${formData.email}`,
    });
    
    clearCart();
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-[var(--bg-primary)] border border-[var(--card-border)] rounded-2xl z-[9999] overflow-hidden flex flex-col shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)] bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-[#00d9ff]/20 to-purple-500/20 rounded-lg">
                  <Lock className="w-6 h-6 text-[#00d9ff]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Secure Checkout</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Complete your order</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6 text-[var(--text-secondary)]" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Shipping Info */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Shipping Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
                      placeholder="+32 123 45 67 89"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
                        placeholder="Brussels"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
                        placeholder="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
                    >
                      <option value="Belgium">Belgium</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Luxembourg">Luxembourg</option>
                    </select>
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Order Summary</h3>
                  
                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--text-primary)] truncate">{item.name}</p>
                          <p className="text-sm text-[var(--text-secondary)]">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-[var(--text-primary)]">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2 pt-4 border-t border-[var(--card-border)]">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Subtotal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "FREE" : `€${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-purple-400">
                        Free shipping on orders over €50!
                      </p>
                    )}
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>VAT (21%)</span>
                      <span>€{vat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-[var(--text-primary)] pt-2 border-t border-[var(--card-border)]">
                      <span>Total</span>
                      <span className="text-[#00d9ff]">€{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--card-border)]">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-[#00d9ff]" />
                      <p className="font-semibold text-[var(--text-primary)]">Payment Method</p>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      You will be redirected to Stripe for secure payment processing.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#00d9ff] to-cyan-400 rounded-xl font-bold text-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,217,255,0.5)] mt-6"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Lock className="w-5 h-5" />
                    Place Order - €{total.toFixed(2)}
                  </motion.button>

                  <p className="text-xs text-center text-[var(--text-muted)]">
                    🔒 Secure checkout powered by Stripe. Your payment info is never stored.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
