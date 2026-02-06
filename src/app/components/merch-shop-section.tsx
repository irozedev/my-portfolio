import { motion } from "motion/react";
import { ShoppingCart as CartIcon, Sparkles, Package } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/language-context";
import { ProductsCarousel } from "./products-carousel";

interface MerchItem {
  id: number;
  name: string;
  description: string;
  price: number;
  priceWithTax: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  badge?: string;
}

export function MerchShopSection() {
  const { t } = useLanguage();

  const merchItems: MerchItem[] = [
    {
      id: 1,
      name: "ro3e.io Cyber T-Shirt",
      description: "Premium cotton with holographic print - Comfortable and stylish",
      price: 29.99,
      priceWithTax: 36.29,
      image: "https://images.unsplash.com/photo-1647346798253-bfd2ffd574b6?w=800&q=80",
      category: 'Clothing',
      rating: 4.9,
      reviews: 127,
      inStock: true,
      badge: "BESTSELLER"
    },
    {
      id: 2,
      name: "Code Master Hoodie",
      description: "Ultra-soft fleece with ro3e.io branding - Perfect for coding sessions",
      price: 59.99,
      priceWithTax: 72.59,
      image: "https://images.unsplash.com/photo-1637833556150-69cb0d2d8f48?w=800&q=80",
      category: 'Clothing',
      rating: 5.0,
      reviews: 89,
      inStock: true,
      badge: "POPULAR"
    },
    {
      id: 3,
      name: "Developer Sticker Pack",
      description: "50+ unique waterproof stickers - Customize your laptop in style",
      price: 14.99,
      priceWithTax: 18.14,
      image: "https://images.unsplash.com/photo-1519337364444-c5eeec430101?w=800&q=80",
      category: 'Accessories',
      rating: 4.8,
      reviews: 234,
      inStock: true
    },
    {
      id: 4,
      name: "Tech Accessories Bundle",
      description: "Mousepads, cable organizers & more - Complete desk setup",
      price: 39.99,
      priceWithTax: 48.39,
      image: "https://images.unsplash.com/photo-1759975652551-cf4cdcf52973?w=800&q=80",
      category: 'Accessories',
      rating: 4.7,
      reviews: 156,
      inStock: true
    },
    {
      id: 5,
      name: "Premium Tech Backpack",
      description: "Water-resistant with laptop compartment - Perfect for developers on the go",
      price: 79.99,
      priceWithTax: 96.79,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      category: 'Accessories',
      rating: 4.9,
      reviews: 92,
      inStock: true,
      badge: "NEW"
    },
    {
      id: 6,
      name: "Mechanical Keyboard Mat",
      description: "XXL desk mat with anti-slip base - Elevate your workspace",
      price: 34.99,
      priceWithTax: 42.34,
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
      category: 'Accessories',
      rating: 4.6,
      reviews: 178,
      inStock: true
    },
  ];

  return (
    <section id="shop" className="relative py-20 md:py-32 px-4 bg-[var(--bg-primary)] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-40 w-96 h-96 bg-[#00d9ff]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-gradient-to-r from-[#00d9ff]/10 to-purple-500/10 backdrop-blur-sm border border-[#00d9ff]/20 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <CartIcon className="w-5 h-5 text-[#00d9ff]" />
            <span className="text-sm font-medium text-[#00d9ff]">EXCLUSIVE MERCH</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-[#00d9ff] to-purple-400 bg-clip-text text-transparent">
              ro3e.io Store
            </span>
          </h2>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Wear the code. Premium merchandise designed for developers by developers.
          </p>
        </motion.div>

        {/* Products Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ProductsCarousel products={merchItems} itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="p-8 bg-gradient-to-r from-[#00d9ff]/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-[#00d9ff]/20">
            <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
              ✨ Quality Developer Merch
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
              Premium merchandise designed for developers. Free shipping on orders over €75 (excl. BTW) within Belgium.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                onClick={() => window.location.href = '#shop'}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:from-[#00b8dd] hover:to-cyan-300 transition-all shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.5)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CartIcon className="w-5 h-5" />
                <span>Shop Now</span>
              </motion.button>
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-[var(--text-primary)] font-bold rounded-xl hover:border-[#00d9ff] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Package className="w-5 h-5" />
                <span>Bulk Orders</span>
              </motion.a>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 justify-center mt-6 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>High Quality Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}