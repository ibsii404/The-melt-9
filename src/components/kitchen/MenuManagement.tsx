import { useState, useEffect } from 'react';
import { MenuItem, MenuCategory, SizePrice, AddOn } from '../../types/menu.types';
import { 
  getMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  toggleAvailability,
  uploadItemImage 
} from '../../services/menuService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const categories: MenuCategory[] = [
    'Pizza', 'Premium Pizza', 'Xtreme Pizza', 'Calzone', 'Appetizer', 
    'Wings', 'Burger', 'Fried Chicken', 'Sandwich', 'Pasta', 'Salad', 
    'Platter', 'Dip', 'Dessert', 'Beverage'
  ];

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    category: 'Pizza',
    available: true,
    sizes: [],
    basePrice: undefined,
    pieces: [],
    addons: [],
    hasDiscount: false,
    isPremium: false,
    isXtreme: false
  });

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu:', error);
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
      let imageUrl = editingItem?.imageUrl || '';
      let imagePath = editingItem?.imagePath || '';

      // Upload image if selected
      if (imageFile) {
        const uploadResult = await uploadItemImage(imageFile, formData.name || 'item');
        imageUrl = uploadResult.url;
        imagePath = uploadResult.path;
      }

      const itemData = {
        ...formData,
        imageUrl,
        imagePath,
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, itemData);
      } else {
        await addMenuItem(itemData as any);
      }

      loadMenu();
      closeModal();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleDelete = async (id: string, imagePath?: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem(id, imagePath);
        loadMenu();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    try {
      await toggleAvailability(id, !current);
      loadMenu();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
      setImagePreview(item.imageUrl || '');
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        category: 'Pizza',
        available: true,
        sizes: [],
        basePrice: undefined,
        pieces: [],
        addons: [],
        hasDiscount: false,
        isPremium: false,
        isXtreme: false
      });
      setImagePreview('');
      setImageFile(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setImageFile(null);
    setImagePreview('');
  };

  const addSize = () => {
    const sizes = formData.sizes || [];
    sizes.push({ name: 'Regular', price: 0 });
    setFormData({ ...formData, sizes });
  };

  const updateSize = (index: number, field: keyof SizePrice, value: any) => {
    const sizes = [...(formData.sizes || [])];
    sizes[index] = { ...sizes[index], [field]: value };
    setFormData({ ...formData, sizes });
  };

  const removeSize = (index: number) => {
    const sizes = formData.sizes?.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-melt-charcoal">Menu Management</h1>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
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
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      🍕
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                    {item.category}
                  </span>
                  {item.isPremium && (
                    <span className="ml-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                      Premium
                    </span>
                  )}
                  {item.isXtreme && (
                    <span className="ml-1 px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                      Xtreme
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.sizes ? (
                    <span className="text-sm text-gray-900">
                      Rs. {Math.min(...item.sizes.map(s => s.price))} - {Math.max(...item.sizes.map(s => s.price))}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-900">
                      Rs. {item.basePrice || item.pieces?.[0]?.price}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleAvailability(item.id, item.available)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.available ? 'In Stock' : 'Out of Stock'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openModal(item)}
                    className="text-melt-gold hover:text-melt-red mr-3"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.imagePath)}
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
                  {editingItem ? 'Edit Item' : 'Add New Item'}
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
                    Item Image
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
                          Preview
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
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuCategory })}
                      className="w-full p-2 border rounded-lg"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                {/* Flags */}
                <div className="grid grid-cols-4 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.available || false}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="rounded text-melt-gold"
                    />
                    <span>Available</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.hasDiscount || false}
                      onChange={(e) => setFormData({ ...formData, hasDiscount: e.target.checked })}
                      className="rounded text-melt-gold"
                    />
                    <span>Has Discount</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isPremium || false}
                      onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                      className="rounded text-melt-gold"
                    />
                    <span>Premium</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isXtreme || false}
                      onChange={(e) => setFormData({ ...formData, isXtreme: e.target.checked })}
                      className="rounded text-melt-gold"
                    />
                    <span>Xtreme</span>
                  </label>
                </div>

                {/* Sizes */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Sizes & Prices
                    </label>
                    <button
                      type="button"
                      onClick={addSize}
                      className="text-sm text-melt-red hover:text-melt-gold"
                    >
                      + Add Size
                    </button>
                  </div>
                  {formData.sizes?.map((size, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <select
                        value={size.name}
                        onChange={(e) => updateSize(index, 'name', e.target.value)}
                        className="p-2 border rounded-lg w-32"
                      >
                        <option value="Small">Small</option>
                        <option value="Regular">Regular</option>
                        <option value="Large">Large</option>
                        <option value="Jumbo">Jumbo</option>
                        <option value="6 inch">6 inch</option>
                        <option value="9 inch">9 inch</option>
                        <option value="12 inch">12 inch</option>
                        <option value="14 inch">14 inch</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Price"
                        value={size.price}
                        onChange={(e) => updateSize(index, 'price', Number(e.target.value))}
                        className="p-2 border rounded-lg w-32"
                      />
                      <input
                        type="number"
                        placeholder="Discount Price"
                        value={size.discountPrice || ''}
                        onChange={(e) => updateSize(index, 'discountPrice', Number(e.target.value))}
                        className="p-2 border rounded-lg w-32"
                      />
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {(!formData.sizes || formData.sizes.length === 0) && (
                    <div className="text-center py-4 border-2 border-dashed rounded-lg">
                      <p className="text-gray-500">No sizes added yet</p>
                      <p className="text-sm text-gray-400">Click "Add Size" to add sizes</p>
                    </div>
                  )}
                </div>

                {/* Base Price (for non-size items) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price (if no sizes)
                  </label>
                  <input
                    type="number"
                    value={formData.basePrice || ''}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter base price"
                  />
                </div>
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
                  {editingItem ? 'Update' : 'Create'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;