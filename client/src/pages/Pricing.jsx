import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PricingCard from '../components/PricingCard';
import { createOrder, processPayment } from '../services/payment';
import { toast } from 'react-hot-toast';
import { Sparkles, ArrowLeft, CheckCircle, X, Lock } from 'lucide-react';

const Pricing = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const plans = [
    {
      name: 'basic',
      price: 49,
      features: [
        'Access to basic internships',
        'Weekly opportunity updates',
        'Community access',
        'Email notifications'
      ]
    },
    {
      name: 'standard',
      price: 99,
      popular: true,
      features: [
        'All Basic features',
        'Premium internships access',
        'Hackathon updates',
        'Priority support',
        'Referral earnings: ₹20/referral'
      ]
    },
    {
      name: 'premium',
      price: 199,
      features: [
        'All Standard features',
        'Exclusive opportunities',
        'Direct company referrals',
        '1-on-1 mentorship sessions',
        'Referral earnings: ₹40/referral',
        'Lifetime access'
      ]
    }
  ];

  const handlePlanSelect = async (plan) => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (user.isPremium) {
      toast('You already have a premium subscription!');
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder(plan);
      setSelectedPlan(plan);
      setOrderData(order);
      setShowPaymentModal(true);
      toast.success('Payment form ready. Enter dummy card details to proceed.');
    } catch (error) {
      toast.error('Failed to create order. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setFormData({ ...formData, expiryDate: value });
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setFormData({ ...formData, cvv: value });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Card number must be 16 digits');
      return;
    }

    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return;
    }

    if (formData.cvv.length !== 3) {
      toast.error('CVV must be 3 digits');
      return;
    }

    if (!formData.cardholderName) {
      toast.error('Please enter cardholder name');
      return;
    }

    setLoading(true);
    try {
      const response = await processPayment({
        orderId: orderData.orderId,
        plan: selectedPlan,
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName
      });

      if (response.success) {
        toast.success('🎉 Payment successful! Welcome to premium!');
        updateUser({ isPremium: true, premiumPlan: selectedPlan });
        setShowPaymentModal(false);
        setFormData({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        toast.error(response.message || 'Payment failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment processing failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Back link */}
        <Link 
          to={user ? '/dashboard' : '/'}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {user ? 'Back to Dashboard' : 'Back to Home'}
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-slate-300">Simple, transparent pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Invest in your career. Get access to exclusive opportunities and start earning through referrals.
          </p>
        </div>

        {/* Already premium */}
        {user?.isPremium && (
          <div className="max-w-md mx-auto mb-12">
            <div className="glass rounded-2xl p-6 text-center gradient-border">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">You're Premium!</h3>
              <p className="text-slate-400 mb-4">
                You already have access to the <span className="text-primary-400 capitalize">{user.premiumPlan}</span> plan.
              </p>
              <Link 
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        {!user?.isPremium && (
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                plan={plan.name}
                price={plan.price}
                features={plan.features}
                popular={plan.popular}
                onSelect={handlePlanSelect}
                loading={loading}
              />
            ))}
          </div>
        )}

        {/* FAQ or additional info */}
        <div className="mt-16 text-center">
          <p className="text-slate-400">
            Questions? Contact us at{' '}
            <a href="mailto:support@internconnect.com" className="text-primary-400 hover:text-primary-300">
              support@internconnect.com
            </a>
          </p>
        </div>

        {/* Test Card Info */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-6 border border-amber-500/30 bg-amber-500/5">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              Dummy Payment for Testing
            </h3>
            <p className="text-slate-400 mb-4">
              This is a dummy payment system for development/testing purposes. Use any of these test card details:
            </p>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-white/5 rounded-lg font-mono">
                <p className="text-slate-300">Card Number: <span className="text-green-400">4111 1111 1111 1111</span></p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg font-mono">
                <p className="text-slate-300">Expiry: <span className="text-green-400">12/25</span> (Any future date)</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg font-mono">
                <p className="text-slate-300">CVV: <span className="text-green-400">123</span> (Any 3 digits)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && orderData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Dummy Payment</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Plan:</span>
                <span className="text-white font-semibold capitalize">{selectedPlan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="text-green-400 font-bold text-lg">₹{orderData.amount}</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.cardholderName}
                  onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-primary-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-primary-500 transition-colors font-mono"
                  placeholder="4111 1111 1111 1111"
                  maxLength="19"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.expiryDate}
                    onChange={handleExpiryChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-primary-500 transition-colors font-mono"
                    placeholder="12/25"
                    maxLength="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cvv}
                    onChange={handleCVVChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-primary-500 transition-colors font-mono"
                    placeholder="123"
                    maxLength="3"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${orderData.amount}`
                )}
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                This is a demo payment. No real charges will be made.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;

