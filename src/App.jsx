import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, Filter, TrendingUp } from 'lucide-react';
import gamesData from './games.json';

const CATEGORIES = ['All', 'Action', 'Puzzle', 'Idle', 'Arcade', 'IO', 'Sports'];

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFullscreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => { setSelectedGame(null); setActiveCategory('All'); setSearchQuery(''); }}
          >
            <div className="bg-emerald-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter">NOVA<span className="text-emerald-500">GAMES</span></h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800/50 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
            />
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span>Back to Games</span>
                </button>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleFullscreen}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a 
                    href={selectedGame.iframeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                <iframe
                  id="game-iframe"
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  allow="fullscreen; autoplay; encrypted-media"
                  title={selectedGame.title}
                />
              </div>

              <div className="glass rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">{selectedGame.title}</h2>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {selectedGame.category}
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                  {selectedGame.description}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="relative rounded-3xl overflow-hidden h-64 md:h-80 flex items-center px-8 md:px-12">
                <img 
                  src="https://picsum.photos/seed/gaming/1200/400?blur=2" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                  alt="Hero background"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
                <div className="relative z-10 space-y-4 max-w-xl">
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm uppercase tracking-widest">
                    <TrendingUp className="w-4 h-4" />
                    <span>Trending Now</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Level Up Your Break Time.</h2>
                  <p className="text-zinc-400 text-lg">Discover the best unblocked games, curated for speed and fun. No downloads, no blocks, just play.</p>
                </div>
              </div>

              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                <Filter className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
                      activeCategory === cat 
                        ? 'bg-emerald-500 text-black' 
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.length > 0 ? (
                  filteredGames.map((game) => (
                    <motion.div
                      layout
                      key={game.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -5 }}
                      className="group cursor-pointer"
                      onClick={() => handleGameSelect(game)}
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-zinc-900">
                        <img 
                          src={game.thumbnail} 
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <button className="w-full bg-emerald-500 text-black font-bold py-2 rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            Play Now
                          </button>
                        </div>
                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                          {game.category}
                        </div>
                      </div>
                      <div className="mt-4 space-y-1">
                        <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{game.title}</h3>
                        <p className="text-zinc-500 text-sm line-clamp-1">{game.description}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <div className="bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8 text-zinc-700" />
                    </div>
                    <p className="text-zinc-500 text-lg">No games found matching your search.</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                      className="text-emerald-500 hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 mt-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 p-1.5 rounded-lg">
                <Gamepad2 className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-lg font-bold tracking-tighter">NOVA<span className="text-emerald-500">GAMES</span></h2>
            </div>
            <p className="text-zinc-500 text-sm max-w-xs">
              The ultimate destination for unblocked web games. Fast, secure, and always free.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-zinc-400">Quick Links</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><button onClick={() => setSelectedGame(null)} className="hover:text-emerald-500 transition-colors">Home</button></li>
              <li><button onClick={() => setActiveCategory('Action')} className="hover:text-emerald-500 transition-colors">Action Games</button></li>
              <li><button onClick={() => setActiveCategory('Puzzle')} className="hover:text-emerald-500 transition-colors">Puzzle Games</button></li>
              <li><button onClick={() => setActiveCategory('Sports')} className="hover:text-emerald-500 transition-colors">Sports Games</button></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-zinc-400">About</h3>
            <p className="text-zinc-500 text-sm">
              Nova Games is built for students and gamers who want quick access to high-quality web games without the hassle of blocks or downloads.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-zinc-600 text-xs">
          © {new Date().getFullYear()} Nova Games. All rights reserved. All games are property of their respective owners.
        </div>
      </footer>
    </div>
  );
}
