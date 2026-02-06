import { motion } from 'motion/react';
import { User, MapPin, Phone, Globe, Save, CreditCard, Building2, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import { supabase } from '@/utils/supabase/client';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ProfileData {
  fullName: string;
  phone: string;
  company: string;
  website: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  vatNumber: string;
}

export function ProfileSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: user?.user_metadata?.name || '',
    phone: '',
    company: '',
    website: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Belgium',
    },
    vatNumber: '',
  });

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('kv_store_a62f57c7')
        .select('value')
        .eq('key', `profile:${user?.id}`)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.value) {
        const saved = JSON.parse(data.value as string);
        setProfileData({
          ...profileData,
          ...saved,
          fullName: user?.user_metadata?.name || saved.fullName || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('kv_store_a62f57c7')
        .upsert({
          key: `profile:${user.id}`,
          value: JSON.stringify(profileData),
        });

      if (error) throw error;

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updateAddressField = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#00d9ff]/10 rounded-xl">
            <User className="w-6 h-6 text-[#00d9ff]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Personal Information</h3>
            <p className="text-sm text-[var(--text-muted)]">Update your personal details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] rounded-xl text-[var(--text-muted)] cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-1 rounded">
                Verified
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
              placeholder="+32 123 456 789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Company (Optional)
            </label>
            <input
              type="text"
              value={profileData.company}
              onChange={(e) => updateField('company', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
              placeholder="Company Name"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Website (Optional)
            </label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => updateField('website', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </motion.div>

      {/* Billing Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <MapPin className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Billing Address</h3>
            <p className="text-sm text-[var(--text-muted)]">Add your billing information for invoices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Street Address
            </label>
            <input
              type="text"
              value={profileData.billingAddress.street}
              onChange={(e) => updateAddressField('street', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              City
            </label>
            <input
              type="text"
              value={profileData.billingAddress.city}
              onChange={(e) => updateAddressField('city', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
              placeholder="Brussels"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              State/Province
            </label>
            <input
              type="text"
              value={profileData.billingAddress.state}
              onChange={(e) => updateAddressField('state', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
              placeholder="Brussels-Capital"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              ZIP/Postal Code
            </label>
            <input
              type="text"
              value={profileData.billingAddress.zipCode}
              onChange={(e) => updateAddressField('zipCode', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Country
            </label>
            <select
              value={profileData.billingAddress.country}
              onChange={(e) => updateAddressField('country', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
            >
              <option value="Belgium">Belgium</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Tax Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-500/10 rounded-xl">
            <CreditCard className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Tax Information</h3>
            <p className="text-sm text-[var(--text-muted)]">EU VAT number for business clients</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            VAT Number (Optional)
          </label>
          <input
            type="text"
            value={profileData.vatNumber}
            onChange={(e) => updateField('vatNumber', e.target.value)}
            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-[#00d9ff] focus:outline-none transition-colors"
            placeholder="BE 0123.456.789"
          />
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            For EU businesses: Enter your VAT number to receive invoices without Belgian VAT
          </p>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={handleSave}
          disabled={loading}
          size="lg"
          className="w-full bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-bold py-4 shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.6)] transition-all duration-300 group"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Save Changes
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
