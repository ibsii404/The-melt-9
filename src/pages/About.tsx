const About = () => {
  return (
    <div className="min-h-screen bg-melt-cream py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-extrabold text-melt-charcoal mb-4">About The Melt 9</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          The Melt 9 is your neighborhood pizza and comfort-food kitchen built on fresh ingredients, bold flavor, and reliable service.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-melt-charcoal mb-2">What We Serve</h2>
            <p className="text-gray-600 leading-relaxed">
              From classic and loaded pizzas to burgers, wings, pasta, platters, and desserts, every item is prepared to deliver strong taste and consistent quality.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-melt-charcoal mb-2">Our Promise</h2>
            <p className="text-gray-600 leading-relaxed">
              Fresh preparation, clean kitchen standards, and quick order turnaround for delivery and pickup so every meal reaches you hot and satisfying.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h2 className="text-xl font-bold text-melt-charcoal mb-3">Why Customers Choose Us</h2>
          <ul className="text-gray-600 space-y-2 list-disc pl-5">
            <li>Wide menu with standard, premium, and xtreme options</li>
            <li>Value-driven deals for families and group orders</li>
            <li>Consistent quality and flavor across every order</li>
            <li>Easy online ordering and fast service</li>
          </ul>
        </div>

        <p className="text-gray-700 leading-relaxed">
          Follow our blog for kitchen updates, new launches, and special offers.
        </p>
      </div>
    </div>
  );
};

export default About;
