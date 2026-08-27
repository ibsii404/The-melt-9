import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder, getUserActiveOrderCount } from '../services/orderService';
import DeliveryTypeSelector from '../components/checkout/DeliveryTypeSelector';
import AddressForm from '../components/checkout/AddressForm';
import DeliveryZoneValidator from '../components/checkout/DeliveryZoneValidator';
import CartSummary from '../components/cart/CartSummary';
import { CartAddress } from '../contexts/CartContext';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { isOrderingEnabled, getRestaurantStatus } from '../services/operationalService';

const Checkout = () => {
  const { 
    cartItems, 
    subtotal, 
    deliveryFee, 
    total, 
    deliveryType, 
    selectedAddress,
    setDeliveryFeeForZone,
    getItemTotal,
    clearCart 
  } = useCart();
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderIdForTracking, setOrderIdForTracking] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [deliveryValid, setDeliveryValid] = useState(false);
  const [orderingEnabled, setOrderingEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderPlaced]);

  useEffect(() => {
    checkOrderingEnabled();
  }, []);

  useEffect(() => {
    const rawPhone = userData?.phoneNumber || '';
    setContactPhone(rawPhone.replace(/\D/g, '').slice(0, 13));
  }, [userData?.phoneNumber]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [step]);

  const checkOrderingEnabled = async () => {
    try {
      const enabled = await isOrderingEnabled();
      setOrderingEnabled(enabled);
      if (!enabled) {
        const status = await getRestaurantStatus();
        setStatusMessage(status.message);
      }
    } catch (err) {
      console.error('Failed to check ordering status', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !userData) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (deliveryType === 'delivery' && !selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!/^\d{10,13}$/.test(contactPhone)) {
      toast.error('Please enter a valid phone number (10 to 13 digits).');
      return;
    }

    setLoading(true);
    
    try {
      const activeOrderCount = await getUserActiveOrderCount(user.uid);
      if (activeOrderCount >= 3) {
        toast.error('You already have 3 active orders. Please wait for delivery before placing a new one.');
        setLoading(false);
        return;
      }

      const createdOrder = await createOrder(
        user.uid,
        {
          name: userData.displayName,
          email: user.email || '',
          phone: contactPhone
        },
        cartItems,
        subtotal,
        deliveryFee,
        total,
        deliveryType,
        deliveryType === 'delivery' ? selectedAddress! : undefined,
        ''
      );

      setOrderNumber(createdOrder.orderNumber);
      setOrderIdForTracking(createdOrder.id);
      setOrderPlaced(true);
      clearCart();
      setStep(3);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-melt-cream py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-12 w-12 text-green-600" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-melt-charcoal mb-2">
                Order Confirmed!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Thank you for ordering from The Melt 9!
              </p>
              
              <div className="bg-melt-cream rounded-lg p-4 sm:p-6 mb-6">
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-melt-red tracking-wide break-all sm:break-normal">
                  {orderNumber}
                </p>
              </div>
              
              <div className="space-y-3 mb-8">
                <p className="text-gray-700">
                  {deliveryType === 'delivery' 
                    ? 'Your food will be delivered within 45 minutes.' 
                    : 'Your order will be ready for pickup in 30 minutes.'}
                </p>
                {deliveryType === 'pickup' && (
                  <p className="text-sm text-gray-500">
                    Please bring your order number when picking up.
                  </p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => navigate('/menu')}
                  className="btn-primary px-6 py-3 w-full sm:w-auto"
                >
                  Order More
                </button>
                <button
                  onClick={() => navigate(`/track-order/${orderIdForTracking}`)}
                  className="btn-secondary px-6 py-3 w-full sm:w-auto whitespace-nowrap"
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-melt-cream py-8">
      <div className="container-custom">
        {!orderingEnabled && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">⚠️ Orders Currently Disabled</p>
            <p className="text-sm">{statusMessage}</p>
          </div>
        )}
        {/* Checkout Steps */}
        <div className="max-w-4xl mx-auto mb-8 px-1 sm:px-0">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-initial">
                <div className={`
                  w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold
                  ${step >= s 
                    ? 'bg-melt-red text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`
                    flex-1 h-1 mx-2 min-w-[24px]
                    ${step > s ? 'bg-melt-red' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 mt-2 text-xs sm:text-sm text-center">
            <span className="text-melt-charcoal font-medium">Delivery</span>
            <span className="text-melt-charcoal font-medium">Address</span>
            <span className="text-melt-charcoal font-medium">Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Method */}
            {step === 1 && (
              <div className="space-y-6">
                <DeliveryTypeSelector />
                
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (deliveryType === 'delivery') {
                        setStep(2);
                      } else {
                        setStep(3);
                      }
                    }}
                    className="btn-primary px-8 py-3 w-full sm:w-auto"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Address (for delivery) */}
            {step === 2 && deliveryType === 'delivery' && (
              <div className="space-y-6">
                <DeliveryZoneValidator 
                  onValidationResult={(result) => {
                    setDeliveryValid(result.isValid);
                    setDeliveryFeeForZone(result.isValid ? result.deliveryFee : null);
                  }}
                />
                
                {deliveryValid && (
                  <AddressForm 
                    onAddressSelect={() => {}}
                    onValidationComplete={() => setStep(3)}
                  />
                )}
                
                <div className="flex justify-between gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="text-melt-red hover:text-melt-gold"
                  >
                    ← Back
                  </button>
                  {deliveryValid && (
                    <button
                      onClick={() => selectedAddress && setStep(3)}
                      disabled={!selectedAddress}
                      className="btn-primary px-8 py-3 disabled:opacity-50 w-full sm:w-auto"
                    >
                      Continue to Review
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-melt-charcoal mb-4">
                  Review Your Order
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, '').slice(0, 13))}
                    placeholder="03XXXXXXXXX"
                    inputMode="numeric"
                    maxLength={13}
                    className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
                  />
                  <p className="text-xs text-gray-500 mt-1">Only digits, 10 to 13 numbers.</p>
                </div>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="flex justify-between items-start border-b pb-4 gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold leading-snug break-words">
                          {item.quantity}x {item.name}
                        </p>
                        {item.selectedSize && (
                          <p className="text-sm text-gray-600 mt-1">Size: {item.selectedSize}</p>
                        )}
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Add-ons: {item.selectedAddons.map(a => a.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-melt-red text-right shrink-0 min-w-[88px]">
                        Rs. {getItemTotal(item)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Delivery/Pickup Info */}
                <div className="bg-melt-cream rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-2">
                    {deliveryType === 'delivery' ? 'Delivery Details' : 'Pickup Details'}
                  </h3>
                  {deliveryType === 'delivery' && selectedAddress && (
                    <div className="text-sm text-gray-600">
                      <p>{selectedAddress.label}</p>
                      <p>{selectedAddress.street}, {selectedAddress.area}</p>
                      <p>{selectedAddress.city}</p>
                      {selectedAddress.instructions && (
                        <p className="italic mt-1">Note: {selectedAddress.instructions}</p>
                      )}
                    </div>
                  )}
                  {deliveryType === 'pickup' && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">The Melt 9 Restaurant</p>
                      <p>Main Boulevard, Multan</p>
                      <p>Pickup in 30 minutes</p>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="border-t pt-4 mb-6">
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <div className="bg-melt-cream p-3 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💵</span>
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <span className="text-sm text-gray-500 sm:text-right">Pay when you receive</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-melt-red">Rs. {total}</span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between gap-3">
                  <button
                    onClick={() => setStep(deliveryType === 'delivery' ? 2 : 1)}
                    className="text-melt-red hover:text-melt-gold"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || !orderingEnabled}
                    className="btn-primary px-6 sm:px-8 py-3 disabled:opacity-50 w-full sm:w-auto whitespace-nowrap text-base sm:text-lg"
                  >
                    {loading ? 'Placing Order...' : `Place Order • Rs. ${total}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <CartSummary showCheckoutButton={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
