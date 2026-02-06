import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface FavoriteProject {
  id: string;
  type: 'project' | 'product';
  projectId: string;
  projectName: string;
  projectImage: string;
  addedAt: string;
  // Product specific fields
  price?: number;
  priceWithTax?: number;
  category?: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data } = await supabase
        .from('kv_store_a62f57c7')
        .select('value')
        .eq('key', `user_favorites_${user.id}`)
        .single();

      if (data?.value) {
        setFavorites(JSON.parse(data.value));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (
    projectId: string, 
    projectName: string, 
    projectImage: string,
    type: 'project' | 'product' = 'project',
    additionalData?: { price?: number; priceWithTax?: number; category?: string }
  ) => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return false;
    }

    // Check if already favorited
    if (favorites.some(f => f.projectId === projectId)) {
      toast.info('Already in your wishlist');
      return false;
    }

    const newFavorite: FavoriteProject = {
      id: Date.now().toString(),
      type,
      projectId,
      projectName,
      projectImage,
      addedAt: new Date().toISOString(),
      ...additionalData,
    };

    const updatedFavorites = [newFavorite, ...favorites];
    setFavorites(updatedFavorites);

    try {
      await supabase
        .from('kv_store_a62f57c7')
        .upsert({
          key: `user_favorites_${user.id}`,
          value: JSON.stringify(updatedFavorites),
        });

      toast.success('Added to wishlist!');
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      setFavorites(favorites); // Revert on error
      toast.error('Failed to add favorite');
      return false;
    }
  };

  const removeFavorite = async (projectId: string) => {
    if (!user) return false;

    const updatedFavorites = favorites.filter(f => f.projectId !== projectId);
    setFavorites(updatedFavorites);

    try {
      await supabase
        .from('kv_store_a62f57c7')
        .upsert({
          key: `user_favorites_${user.id}`,
          value: JSON.stringify(updatedFavorites),
        });

      toast.success('Removed from wishlist');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      setFavorites(favorites); // Revert on error
      toast.error('Failed to remove favorite');
      return false;
    }
  };

  const isFavorite = (projectId: string) => {
    return favorites.some(f => f.projectId === projectId);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}