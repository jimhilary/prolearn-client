//src/app/pages/cart.tsx

  import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { api } from '@/services/api';
import { UserContext } from '@/App';

interface CartItem {
  title: string;
  price: string;
  image_url: string;
  author: {
    first_name: string;
    last_name: string;
  };
}

interface CartResponse {
  cart_detail: CartItem[];
  cart_total: string;
}

export default function Cart() {
  const navigate = useNavigate();
  const { username } = useContext(UserContext); // Add this line to get username from context
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartDetails();
  }, []);

  const loadCartDetails = async () => {
    try {
      // Get cart items from localStorage or state management
      const cartItems = JSON.parse(localStorage.getItem(`cart_${username}`) || '[]');
      if (cartItems.length === 0) {
        setCartData({ cart_detail: [], cart_total: "0.00" });
        setLoading(false);
        return;
      }

      const data = await api.getCartDetails(cartItems);
      setCartData(data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary">ProLearn</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {username}</span>
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
              {cartData?.cart_detail.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <Button onClick={() => navigate('/dashboard')}>
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartData?.cart_detail.map((item, idx) => (
                    <div key={idx} className="flex space-x-4 border-b pb-6">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-48 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-2">
                          by {item.author.first_name} {item.author.last_name}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-primary font-medium">${item.price}</span>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              // Remove item from cart
                              const cartItems = JSON.parse(localStorage.getItem(`cart_${username}`) || '[]');
                              const updatedCart = cartItems.filter((_: string, i: number) => i !== idx);
                              localStorage.setItem(`cart_${username}`, JSON.stringify(updatedCart));
                              loadCartDetails();
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cartData?.cart_total}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary">${cartData?.cart_total}</span>
                </div>
              </div>
              <Button
                className="w-full"
                disabled={!cartData?.cart_detail.length}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}