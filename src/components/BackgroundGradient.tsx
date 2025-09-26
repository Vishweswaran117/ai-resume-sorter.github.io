export function BackgroundGradient() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background - updated to Indian tricolor */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-white to-green-700" />
      
      {/* Animated gradient orbs - tuned to tricolor + chakra blue */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-sky-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-orange-400/30 to-amber-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-400/30 to-green-500/30 rounded-full blur-3xl animate-pulse delay-2000" />
      
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}