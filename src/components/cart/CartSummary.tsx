import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CartSummaryProps {
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  onCheckout, 
  showCheckoutButton = true 
}) => {
  const { subtotal, total, cartCount, deliveryType, deliveryFee } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold text-melt-charcoal mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({cartCount} items)</span>
          <span>Rs. {subtotal}</span>
        </div>

        {deliveryType === 'delivery' && (
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}</span>
          </div>
        )}
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-melt-red">Rs. {total}</span>
          </div>
        </div>
      </div>

      {showCheckoutButton && cartCount > 0 && (
        <button
          onClick={handleCheckout}
          className="w-full btn-primary py-3 text-lg font-semibold"
        >
          {user ? 'Proceed to Checkout' : 'Login to Checkout'}
        </button>
      )}

      {cartCount === 0 && (
        <button
          onClick={() => navigate('/menu')}
          className="w-full btn-secondary py-3 text-lg font-semibold"
        >
          Browse Menu
        </button>
      )}
    </div>
  );
};

export default CartSummary;
