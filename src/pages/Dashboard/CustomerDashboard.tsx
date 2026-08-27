import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserOrders, Order } from '../../services/orderService';
import OrderCard from '../../orders/OrderCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  UserIcon, 
  MapPinIcon, 
  ClockIcon,
  PencilIcon,
  PlusIcon,
  HomeIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'orders' | 'profile' | 'addresses';

const CustomerDashboard = () => {
  const { user, userData, updateUserData, addAddress } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    displayName: userData?.displayName || '',
    phoneNumber: userData?.phoneNumber || ''
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    area: '',
    city: 'Multan',
    instructions: '',
    isDefault: false
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userOrders = await getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order: Order) => {
    // Add each item from the order to cart
    order.items.forEach(item => {
      addToCart(
        item, 
        item.selectedSize, 
        item.selectedAddons
      );
    });
    
    toast.success('Items added to cart!');
    navigate('/cart');
  };

  const handleProfileUpdate = async () => {
    const success = await updateUserData(profileForm);
    if (success) {
      setEditingProfile(false);
    }
  };

  const handleAddAddress = async () => {
    const success = await addAddress(newAddress);
    if (success) {
      setShowAddressForm(false);
      setNewAddress({
        label: 'Home',
        street: '',
        area: '',
        city: 'Multan',
        instructions: '',
        isDefault: false
      });
    }
  };

  const activeOrder = orders.find(o => 
    !['delivered', 'cancelled'].includes(o.status)
  );

  const pastOrders = orders.filter(o => 
    ['delivered', 'cancelled'].includes(o.status)
  );

  if (!userData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-melt-cream">
      {/* Dashboard Header */}
      <div className="bg-white shadow">
        <div className="container-custom py-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-melt-gold rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-melt-charcoal">
                {userData.displayName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-melt-charcoal">
                Welcome back, {userData.displayName}!
              </h1>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="bg-white border-b">
        <div className="container-custom">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-melt-red text-melt-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-melt-red text-melt-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-melt-red text-melt-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'addresses'
                  ? 'border-melt-red text-melt-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Addresses
            </button>
          </nav>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container-custom py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Active Order */}
            {activeOrder && (
              <div>
                <h2 className="text-xl font-bold text-melt-charcoal mb-4 flex items-center">
                  <ClockIcon className="h-6 w-6 text-melt-red mr-2" />
                  Current Order
                </h2>
                <OrderCard 
                  order={activeOrder} 
                  onReorder={() => handleReorder(activeOrder)}
                  showActions={true}
                />
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-melt-charcoal">{orders.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">Favorite Item</p>
                <p className="text-lg font-semibold text-melt-charcoal">
                  {orders.length > 0 
                    ? orders[0].items[0]?.name 
                    : 'No orders yet'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-sm">Member Since</p>
                <p className="text-lg font-semibold text-melt-charcoal">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Recent Orders */}
            {pastOrders.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-melt-charcoal mb-4">
                  Recent Orders
                </h2>
                <div className="space-y-4">
                  {pastOrders.slice(0, 3).map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onReorder={() => handleReorder(order)}
                    />
                  ))}
                </div>
                {pastOrders.length > 3 && (
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="mt-4 text-melt-red hover:text-melt-gold font-medium"
                  >
                    View All Orders →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-bold text-melt-charcoal mb-6">My Orders</h2>
            {loading ? (
              <LoadingSpinner />
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onReorder={() => handleReorder(order)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
                <button
                  onClick={() => navigate('/menu')}
                  className="btn-primary px-6 py-3"
                >
                  Browse Menu
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-melt-charcoal">Profile Information</h2>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="text-melt-red hover:text-melt-gold flex items-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                )}
              </div>

              {editingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-melt-gold focus:border-melt-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      className="w-full p-2 border rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProfileUpdate}
                      className="btn-primary px-4 py-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{userData.displayName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{userData.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-melt-charcoal">Saved Addresses</h2>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-melt-red hover:text-melt-gold flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add New
                  </button>
                )}
              </div>

              {/* Address List */}
              {userData.addresses && userData.addresses.length > 0 && (
                <div className="space-y-4 mb-6">
                  {userData.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          {address.label === 'Home' ? (
                            <HomeIcon className="h-5 w-5 text-melt-red" />
                          ) : address.label === 'Work' ? (
                            <BriefcaseIcon className="h-5 w-5 text-melt-gold" />
                          ) : (
                            <MapPinIcon className="h-5 w-5 text-gray-400" />
                          )}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{address.label}</span>
                              {address.isDefault && (
                                <span className="text-xs bg-melt-gold px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.street}, {address.area}
                            </p>
                            <p className="text-sm text-gray-600">{address.city}</p>
                            {address.instructions && (
                              <p className="text-xs text-gray-500 mt-2 italic">
                                Note: {address.instructions}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Address Form */}
              {showAddressForm && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Add New Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Label
                      </label>
                      <select
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                        placeholder="House/Shop No., Street Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Area/Locality
                      </label>
                      <input
                        type="text"
                        value={newAddress.area}
                        onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g., Gulgasht, Shah Rukn-e-Alam"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Multan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        value={newAddress.instructions}
                        onChange={(e) => setNewAddress({ ...newAddress, instructions: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                        rows={2}
                        placeholder="e.g., Near landmark, gate color, etc."
                      />
                    </div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                        className="rounded text-melt-gold"
                      />
                      <span className="text-sm text-gray-700">Set as default address</span>
                    </label>
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 py-2 border rounded-lg hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddAddress}
                        className="flex-1 btn-primary py-2"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(!userData.addresses || userData.addresses.length === 0) && !showAddressForm && (
                <p className="text-center text-gray-500 py-8">
                  No saved addresses yet. Add your first address to make checkout faster!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
