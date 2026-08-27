import { useState, useEffect } from 'react';
import { Deal, initialDeals } from '../../types/deal.types';
import { 
  getAllDeals, 
  addDeal, 
  updateDeal, 
  deleteDeal,
  toggleDealAvailability,
  uploadDealImage,
  validateDealItems
} from '../../services/dealService';
import { getMenuItems } from '../../services/menuService';
import { MenuItem } from '../../types/menu.types';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  PhotoIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DealManagement = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState<Partial<Deal>>({
    name: '',
    description: '',
    items: [],
    price: 0,
    available: true,
    applicableCategories: ['Standard Pizza']
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dealsData, menuData] = await Promise.all([
        getAllDeals(),
        getMenuItems()
      ]);
      
      // If no deals exist, initialize with the 8 deals
      if (dealsData.length === 0) {
        for (const deal of initialDeals) {
          await addDeal(deal);
        }
        // Reload deals
        const newDeals = await getAllDeals();
        setDeals(newDeals);
      } else {
        setDeals(dealsData);
      }
      
      setMenuItems(menuData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate deal items
      const validation = await validateDealItems(formData as Deal);
      if (!validation.valid) {
        toast.error(validation.message || 'Invalid deal items');
        return;
      }

      let imageUrl = editingDeal?.imageUrl || '';
      let imagePath = editingDeal?.imagePath || '';

      // Upload image if selected
      if (imageFile) {
        const uploadResult = await uploadDealImage(imageFile, formData.name || 'deal');
        imageUrl = uploadResult.url;
        imagePath = uploadResult.path;
      }

      const dealData = {
        ...formData,
        imageUrl,
        imagePath,
      };

      if (editingDeal) {
        await updateDeal(editingDeal.id, dealData);
        toast.success('Deal updated successfully');
      } else {
        await addDeal(dealData as any);
        toast.success('Deal added successfully');
      }

      loadData();
      closeModal();
    } catch (error) {
      console.error('Error saving deal:', error);
      toast.error('Failed to save deal');
    }
  };

  const handleDelete = async (id: string, imagePath?: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await deleteDeal(id, imagePath);
        toast.success('Deal deleted successfully');
        loadData();
      } catch (error) {
        console.error('Error deleting deal:', error);
        toast.error('Failed to delete deal');
      }
    }
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    try {
      await toggleDealAvailability(id, !current);
      toast.success(`Deal ${!current ? 'activated' : 'deactivated'}`);
      loadData();
    } catch (error) {
      console.error('Error toggling deal availability:', error);
      toast.error('Failed to update deal status');
    }
  };

  const openModal = (deal?: Deal) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData(deal);
      setImagePreview(deal.imageUrl || '');
    } else {
      setEditingDeal(null);
      setFormData({
        name: '',
        description: '',
        items: [],
        price: 0,
        available: true,
        applicableCategories: ['Standard Pizza']
      });
      setImagePreview('');
      setImageFile(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDeal(null);
    setImageFile(null);
    setImagePreview('');
  };

  const addDealItem = () => {
    const items = formData.items || [];
    items.push({
      menuItemId: '',
      name: '',
      quantity: 1,
      size: undefined,
      isPizza: false
    });
    setFormData({ ...formData, items });
  };

  const updateDealItem = (index: number, field: string, value: any) => {
    const items = [...(formData.items || [])];
    items[index] = { ...items[index], [field]: value };
    
    // If it's a pizza item, mark it
    if (field === 'name') {
      const menuItem = menuItems.find(m => m.name === value);
      if (menuItem) {
        items[index].menuItemId = menuItem.id;
        items[index].isPizza = menuItem.category === 'Pizza';
      }
    }
    
    setFormData({ ...formData, items });
  };

  const removeDealItem = (index: number) => {
    const items = formData.items?.filter((_, i) => i !== index);
    setFormData({ ...formData, items });
  };

  const pizzaMenuItems = menuItems.filter(item => 
    item.category === 'Pizza' && !item.isPremium && !item.isXtreme
  );

  const otherMenuItems = menuItems.filter(item => 
    item.category !== 'Pizza'
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-melt-charcoal">Deal Management</h1>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Deal</span>
        </button>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {deal.imageUrl ? (
                      <img 
                        src={deal.imageUrl} 
                        alt={deal.name}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gradient-to-br from-melt-gold to-melt-red rounded-full mr-3 flex items-center justify-center text-white">
                        🏷️
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{deal.name}</div>
                      <div className="text-sm text-gray-500">{deal.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {deal.items.map((item, idx) => (
                      <div key={idx} className="mb-1">
                        {item.quantity}x {item.name}
                        {item.size && <span className="text-gray-500 ml-1">({item.size})</span>}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-melt-red">Rs. {deal.price}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleAvailability(deal.id, deal.available)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      deal.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {deal.available ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openModal(deal)}
                    className="text-melt-gold hover:text-melt-red mr-3"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(deal.id, deal.imagePath)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editingDeal ? 'Edit Deal' : 'Add New Deal'}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deal Image
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="w-32 h-32 border-2 border-dashed rounded-lg overflow-hidden">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <PhotoIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-melt-gold file:text-melt-charcoal hover:file:bg-opacity-90"
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      placeholder="e.g., Deal 01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2 border rounded-lg"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., 1 Small Pizza, 1 Pc. Crispy Chicken with Fries"
                  />
                </div>

                {/* Deal Items */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Deal Items
                    </label>
                    <button
                      type="button"
                      onClick={addDealItem}
                      className="text-sm text-melt-red hover:text-melt-gold"
                    >
                      + Add Item
                    </button>
                  </div>
                  
                  {formData.items?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2 bg-gray-50 p-3 rounded">
                      <select
                        value={item.name}
                        onChange={(e) => updateDealItem(index, 'name', e.target.value)}
                        className="p-2 border rounded-lg flex-grow"
                        required
                      >
                        <option value="">Select Item</option>
                        <optgroup label="Standard Pizzas">
                          {pizzaMenuItems.map(menuItem => (
                            <option key={menuItem.id} value={menuItem.name}>
                              {menuItem.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Other Items">
                          {otherMenuItems.map(menuItem => (
                            <option key={menuItem.id} value={menuItem.name}>
                              {menuItem.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateDealItem(index, 'quantity', Number(e.target.value))}
                        className="p-2 border rounded-lg w-20"
                        min="1"
                        required
                      />
                      
                      {item.isPizza && (
                        <select
                          value={item.size || ''}
                          onChange={(e) => updateDealItem(index, 'size', e.target.value)}
                          className="p-2 border rounded-lg w-24"
                        >
                          <option value="">Size</option>
                          <option value="Small">Small</option>
                          <option value="Regular">Regular</option>
                          <option value="Large">Large</option>
                          <option value="Jumbo">Jumbo</option>
                        </select>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => removeDealItem(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {(!formData.items || formData.items.length === 0) && (
                    <div className="text-center py-4 border-2 border-dashed rounded-lg">
                      <p className="text-gray-500">No items added yet</p>
                      <p className="text-sm text-gray-400">Click "Add Item" to add items to this deal</p>
                    </div>
                  )}
                </div>

                {/* Availability */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.available || false}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="rounded text-melt-gold"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2"
                >
                  {editingDeal ? 'Update' : 'Create'} Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealManagement;