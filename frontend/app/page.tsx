import SearchBox from '../components/SearchBox';
import HeatmapIcon from '../components/HeatmapIcon';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header Banner */}
      <div className="bg-trapdar-dark text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Trapdar</h1>
        <p className="text-lg">Escape the tourist traps—experience travel like a local!</p>
      </div>
      
      {/* Search Section */}
      <div className="max-w-4xl mx-auto p-8">
        <SearchBox />
      </div>
      
      {/* Heatmap Icon */}
      <HeatmapIcon />
    </main>
  );
} 