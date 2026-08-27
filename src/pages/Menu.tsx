import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MenuItem, MenuCategory } from '../types/menu.types';
import { Deal } from '../types/deal.types';
import { getMenuItems, groupMenuByCategory } from '../services/menuService';
import { getDeals } from '../services/dealService';
import CategoryTabs from '../components/menu/CategoryTabs';
import MenuSEO from '../components/seo/MenuSEO';
import MenuCard from '../components/menu/MenuCard';
import DealsGrid from '../components/deals/DealsGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

type MenuPageCategory = MenuCategory | 'Deals';

const MENU_CATEGORIES: MenuPageCategory[] = [
  'Pizza',
  'Premium Pizza',
  'Xtreme Pizza',
  'Calzone',
  'Appetizer',
  'Wings',
  'Burger',
  'Fried Chicken',
  'Sandwich',
  'Pasta',
  'Salad',
  'Platter',
  'Dip',
  'Dessert',
  'Beverage',
  'Deals',
];

const Menu = () => {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [activeCategory, setActiveCategory] = useState<MenuPageCategory | 'All'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (!category) return;
    if (category === 'Deals') {
      setActiveCategory('Deals');
      return;
    }
    if (MENU_CATEGORIES.includes(category as MenuPageCategory)) {
      setActiveCategory(category as MenuPageCategory);
    }
  }, [location.search]);

  useEffect(() => {
    filterItems();
  }, [activeCategory, menuItems, deals]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [items, dealsData] = await Promise.all([getMenuItems(), getDeals()]);
      setMenuItems(items);
      setDeals(dealsData.filter((deal) => deal.available !== false));
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filteredMenuItems = menuItems;
    let filteredDealItems = deals;

    if (activeCategory !== 'All' && activeCategory !== 'Deals') {
      filteredMenuItems = filteredMenuItems.filter((item) => item.category === activeCategory);
      filteredDealItems = [];
    }

    if (activeCategory === 'Deals') {
      filteredMenuItems = [];
    }

    setFilteredItems(filteredMenuItems);
    setFilteredDeals(filteredDealItems);
  };

  const groupedItems = groupMenuByCategory(filteredItems);
  const showMenuSections = activeCategory !== 'Deals';
  const showDealsSection = activeCategory === 'All' || activeCategory === 'Deals';
  const noResults =
    (showMenuSections ? filteredItems.length === 0 : true) &&
    (showDealsSection ? filteredDeals.length === 0 : true);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <MenuSEO />
      <div className="min-h-screen bg-melt-cream">
        <div className="relative py-14 sm:py-16 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2070&q=80")',
            }}
          />
          <div className="absolute inset-0 bg-melt-charcoal/65" />
          <div className="container-custom relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Our Menu</h1>
            <p className="text-xl opacity-90">Discover the taste of perfection at The Melt 9</p>
          </div>
        </div>

        <CategoryTabs
          categories={MENU_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="container-custom py-8">
          {showMenuSections &&
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-melt-charcoal mb-6 flex items-center">
                  <span className="bg-melt-gold w-1 h-8 mr-3"></span>
                  {category}
                  <span className="ml-3 text-sm text-gray-500 font-normal">({items.length} items)</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}

          {showDealsSection && (
            <div className="mb-12" id="menu-deals">
              <h2 className="text-2xl font-bold text-melt-charcoal mb-6 flex items-center">
                <span className="bg-melt-gold w-1 h-8 mr-3"></span>
                Deals
                <span className="ml-3 text-sm text-gray-500 font-normal">({filteredDeals.length} offers)</span>
              </h2>
              <DealsGrid deals={filteredDeals} />
            </div>
          )}

          {noResults && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No items found</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                }}
                className="mt-4 btn-secondary"
              >
                View All Items
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Menu;
