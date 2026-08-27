import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-melt-charcoal text-white mt-auto">
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-extrabold text-melt-gold mb-3">THE MELT 9</h3>
            <p className="text-sm text-gray-300">Fresh pizza, sizzling steaks, and fast delivery.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p><Link to="/" className="hover:text-melt-gold">Home</Link></p>
              <p><Link to="/menu" className="hover:text-melt-gold">Menu</Link></p>
              <p><Link to="/menu?category=Deals" className="hover:text-melt-gold">Deals (in Menu)</Link></p>
              <p><Link to="/blog" className="hover:text-melt-gold">Blog</Link></p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm text-gray-300">Multan, Pakistan</p>
            <p className="text-sm text-gray-300">+92 300 0000000</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <div className="container-custom py-4 text-sm text-gray-400">&copy; {year} The Melt 9. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
