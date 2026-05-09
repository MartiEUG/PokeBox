export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">Unlock Epic Rewards</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Open mystery cases, battle other players, and collect rare items. Experience the thrill of unboxing with provably fair odds.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-[var(--neon-yellow)] to-[var(--neon-blue)] text-black font-bold rounded-lg hover:opacity-90">
              Open Cases Now
            </button>
            <button className="px-8 py-3 border-2 border-[var(--neon-blue)] text-[var(--neon-blue)] font-bold rounded-lg hover:bg-[var(--neon-blue)] hover:text-black">
              Join Battle
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[var(--dark-card)] bg-opacity-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-3xl font-bold text-[var(--neon-yellow)]">1M+</h3>
              <p className="text-gray-400">Cases Opened</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[var(--neon-blue)]">50k+</h3>
              <p className="text-gray-400">Active Players</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[var(--electric-purple)]">$2M+</h3>
              <p className="text-gray-400">Items Won</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cases */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Cases</h2>
          <p className="text-center text-gray-400 mb-12">Explore our most popular mystery cases</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Fire Legend', price: '499 Credits', rarity: 'Mythic', emoji: '🔥' },
              { name: 'Water Champion', price: '999 Credits', rarity: 'Legendary', emoji: '💧' },
              { name: 'Plant Master', price: '699 Credits', rarity: 'Epic', emoji: '🌿' },
            ].map((caseItem, i) => (
              <div key={i} className="bg-[var(--dark-card)] rounded-lg p-6 border border-gray-800 hover:border-[var(--neon-blue)] transition-all">
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl">{caseItem.emoji}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{caseItem.name}</h3>
                <p className="text-gray-400 mb-4">{caseItem.price}</p>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  caseItem.rarity === 'Common' ? 'bg-gray-700' :
                  caseItem.rarity === 'Mythic' ? 'bg-orange-900' :
                  caseItem.rarity === 'Epic' ? 'bg-blue-900' :
                  'bg-purple-900'
                }`}>
                  {caseItem.rarity}
                </span>
                <button className="w-full mt-4 py-2 bg-[var(--neon-blue)] text-black font-bold rounded hover:opacity-90">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[var(--dark-card)] bg-opacity-30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose PokeBox?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Provably Fair', desc: 'All odds are transparent and verifiable' },
              { title: 'Instant Payouts', desc: 'Get your rewards immediately after winning' },
              { title: 'Secure Trading', desc: 'Trade items safely with other players' },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
