import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ShoppingCart, Euro, Star, Heart } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/language-context";
import { useCart } from "../contexts/cart-context";
import { useFavorites } from "../hooks/use-favorites";
import { toast } from "sonner";

interface Product {
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

interface ProductsCarouselProps {
  products: Product[];
  itemsPerView?: { mobile: number; tablet: number; desktop: number };
}

export function ProductsCarousel({ 
  products,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 }
}: ProductsCarouselProps) {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Responsive items per view
  const [itemsToShow, setItemsToShow] = useState(() => {
    if (typeof window === 'undefined') return itemsPerView.desktop;
    const width = window.innerWidth;
    if (width < 768) return itemsPerView.mobile;
    if (width < 1024) return itemsPerView.tablet;
    return itemsPerView.desktop;
  });

  // Update items per view on resize
  useState(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setItemsToShow(itemsPerView.mobile);
      else if (width < 1024) setItemsToShow(itemsPerView.tablet);
      else setItemsToShow(itemsPerView.desktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  const maxIndex = Math.max(0, products.length - itemsToShow);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const toggleFavorite = async (product: Product) => {
    const productId = `product_${product.id}`;
    
    if (isFavorite(productId)) {
      await removeFavorite(productId);
    } else {
      await addFavorite(
        productId,
        product.name,
        product.image,
        'product',
        {
          price: product.price,
          priceWithTax: product.priceWithTax,
          category: product.category,
        }
      );
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.priceWithTax,
      currency: "EUR",
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{
            x: `calc(-${currentIndex * (100 / itemsToShow)}% - ${currentIndex * 1.5}rem)`,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="flex-shrink-0"
              style={{
                width: `calc(${100 / itemsToShow}% - ${((itemsToShow - 1) * 1.5) / itemsToShow}rem)`,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ProductCard
                product={product}
                isFavorite={isFavorite(`product_${product.id}`)}
                onToggleFavorite={() => toggleFavorite(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 flex items-center justify-center bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] rounded-full hover:border-[#00d9ff] hover:bg-[#00d9ff]/10 transition-all shadow-lg z-10"
          aria-label="Previous products"
        >
          <ChevronLeft className="w-6 h-6 text-[var(--text-primary)]" />
        </motion.button>
      )}

      {currentIndex < maxIndex && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 flex items-center justify-center bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] rounded-full hover:border-[#00d9ff] hover:bg-[#00d9ff]/10 transition-all shadow-lg z-10"
          aria-label="Next products"
        >
          <ChevronRight className="w-6 h-6 text-[var(--text-primary)]" />
        </motion.button>
      )}

      {/* Progress Dots */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-[#00d9ff]"
                  : "w-2 bg-[var(--text-secondary)]/30 hover:bg-[var(--text-secondary)]/50"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
}) {
  return (
    <motion.div
      className="relative bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--card-border)] rounded-2xl overflow-hidden group hover:border-[#00d9ff]/50 transition-all"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#00d9ff] text-black text-xs font-bold rounded-full">
          {product.badge}
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full hover:bg-black/50 transition-all"
      >
        <Heart
          className={`w-5 h-5 transition-all ${
            isFavorite ? "fill-red-500 text-red-500" : "text-white"
          }`}
        />
      </button>

      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="text-xs font-semibold text-[#00d9ff] uppercase tracking-wider mb-2">
          {product.category}
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating!)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            {product.reviews && (
              <span className="text-xs text-[var(--text-secondary)]">
                ({product.reviews})
              </span>
            )}
          </div>
        )}

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-1">
              <Euro className="w-5 h-5 text-[#00d9ff]" />
              <span className="text-2xl font-bold text-[var(--text-primary)]">
                {product.priceWithTax.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              incl. 21% BTW
            </p>
          </div>
          {product.inStock !== false && (
            <div className="text-xs text-green-400 font-semibold">
              In Stock
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={onAddToCart}
          disabled={product.inStock === false}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            product.inStock === false
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black hover:from-[#00b8dd] hover:to-cyan-300 shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)]"
          }`}
          whileHover={product.inStock !== false ? { scale: 1.02 } : {}}
          whileTap={product.inStock !== false ? { scale: 0.98 } : {}}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{product.inStock === false ? "Out of Stock" : "Add to Cart"}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}