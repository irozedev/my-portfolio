import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart as CartIcon } from "lucide-react";
import { useCart } from "../contexts/cart-context";
import { useState } from "react";
import { ShoppingCart as CartPanel } from "./shopping-cart";

export function CartButton() {
  const { getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = getTotalItems();

  if (totalItems === 0) return null;

  return (
    <>
      <motion.button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-36 right-6 md:bottom-40 md:right-8 z-50 p-4 bg-gradient-to-r from-[#00d9ff] to-cyan-400 rounded-full shadow-[0_0_30px_rgba(0,217,255,0.6)] hover:shadow-[0_0_40px_rgba(0,217,255,0.8)] transition-all group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <CartIcon className="w-6 h-6 text-black" />
        
        {/* Badge */}
        <AnimatePresence>
          <motion.div
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            key={totalItems}
          >
            {totalItems}
          </motion.div>
        </AnimatePresence>

        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#00d9ff]"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.button>

      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}