import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart as CartIcon, Trash2, Plus, Minus, CreditCard, Package } from "lucide-react";
import { useCart } from "../contexts/cart-context";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { toast } from "sonner";
import { useState } from "react";
import { CheckoutModal } from "./checkout-modal";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  
  const VAT_RATE = 0.21; // Belgium VAT
  const subtotal = getTotalPrice();
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Cart Panel */}
            <motion.div
              className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-[var(--bg-primary)] border-l border-[var(--card-border)] z-[9999] flex flex-col shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#00d9ff]/20 to-purple-500/20 rounded-lg">
                    <CartIcon className="w-6 h-6 text-[#00d9ff]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Shopping Cart</h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-[var(--text-secondary)]" />
                </motion.button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="p-6 bg-[var(--card-bg)] rounded-full mb-6">
                      <Package className="w-16 h-16 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                      Add some awesome merch to get started!
                    </p>
                    <motion.button
                      onClick={onClose}
                      className="px-6 py-3 bg-gradient-to-r from-[#00d9ff] to-cyan-400 rounded-xl font-bold text-black shadow-[0_0_20px_rgba(0,217,255,0.5)]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Continue Shopping
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="bg-[var(--card-bg)] backdrop-blur-sm rounded-xl border border-[var(--card-border)] p-4 hover:border-[#00d9ff]/50 transition-all"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                      >
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[var(--text-primary)] truncate mb-1">
                              {item.name}
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)] truncate mb-2">
                              {item.description}
                            </p>
                            <p className="text-lg font-bold text-[#00d9ff]">
                              {item.currency}{item.price.toFixed(2)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            onClick={() => {
                              removeItem(item.id);
                              toast.success("Item removed from cart");
                            }}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0 h-fit"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </motion.button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--card-border)]">
                          <span className="text-sm text-[var(--text-secondary)]">Quantity</span>
                          <div className="flex items-center gap-3">
                            <motion.button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 bg-[var(--bg-secondary)] hover:bg-[#00d9ff]/20 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="w-4 h-4 text-[var(--text-secondary)]" />
                            </motion.button>
                            <span className="w-12 text-center font-bold text-[var(--text-primary)]">
                              {item.quantity}
                            </span>
                            <motion.button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 bg-[var(--bg-secondary)] hover:bg-[#00d9ff]/20 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-4 h-4 text-[var(--text-secondary)]" />
                            </motion.button>
                          </div>
                          <span className="font-bold text-[var(--text-primary)]">
                            {item.currency}{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    {/* Clear Cart Button */}
                    <motion.button
                      onClick={() => {
                        clearCart();
                        toast.success("Cart cleared");
                      }}
                      className="w-full py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20 hover:border-red-500/50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear Cart
                    </motion.button>
                  </>
                )}
              </div>

              {/* Footer - Order Summary */}
              {items.length > 0 && (
                <div className="border-t border-[var(--card-border)] p-6 space-y-4 bg-[var(--bg-secondary)]">
                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Subtotal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>VAT (21%)</span>
                      <span>€{vat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-[var(--text-primary)] pt-2 border-t border-[var(--card-border)]">
                      <span>Total</span>
                      <span className="text-[#00d9ff]">€{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    onClick={() => setCheckoutModalOpen(true)}
                    className="w-full py-4 bg-gradient-to-r from-[#00d9ff] to-cyan-400 rounded-xl font-bold text-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,217,255,0.5)]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CreditCard className="w-5 h-5" />
                    Checkout
                  </motion.button>

                  <p className="text-xs text-center text-[var(--text-muted)]">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </>
  );
}