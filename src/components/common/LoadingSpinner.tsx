const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-melt-cream">
      <div className="text-center">
        <div className="relative">
          {/* Pizza spinner */}
          <div className="w-24 h-24 border-4 border-melt-gold border-t-melt-red rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">🍕</span>
          </div>
        </div>
        <p className="mt-4 text-melt-charcoal font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;