import { MenuCategory } from '../../types/menu.types';

type CategoryTabValue = MenuCategory | 'Deals';

interface CategoryTabsProps {
  categories: CategoryTabValue[];
  activeCategory: CategoryTabValue | 'All';
  onCategoryChange: (category: CategoryTabValue | 'All') => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="sticky top-20 z-40 bg-white shadow-md">
      <div className="container-custom">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 py-4 min-w-max">
            <button
              onClick={() => onCategoryChange('All')}
              className={`px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                activeCategory === 'All'
                  ? 'bg-melt-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Items
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  activeCategory === category
                    ? 'bg-melt-red text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
