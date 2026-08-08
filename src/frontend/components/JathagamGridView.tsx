import React from 'react';

export interface CellData {
  planets: string[]; // e.g., ["சனி", "கேது", "லக்"]
}

export interface JathagamGridViewProps {
  rasi: { [position: number]: CellData };
  navamsam: { [position: number]: CellData };
}

const ChartGrid = ({ data, title }: { data: { [position: number]: CellData }, title: string }) => {
  // Mapping the sequence to house indices for a 4x4 grid.
  // 0-11 numbering proceeds clockwise starting from top-left.
  // Row 1: 0, 1, 2, 3
  // Row 2: 11, [CENTER], [CENTER], 4
  // Row 3: 10, [CENTER], [CENTER], 5
  // Row 4: 9, 8, 7, 6
  const sequence = [0, 1, 2, 3, 11, 'CENTER', 4, 10, 5, 9, 8, 7, 6];

  // Detect Lagna (Ascendant) by checking if any planet abbreviation matches "லக்"
  const hasLagna = (planets: string[]) => 
    planets.some(p => p.includes('லக்') || p.includes('Lagnam') || p.includes('Asc'));

  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px] grid grid-cols-4 gap-[1px] bg-gray-400 border border-gray-400 rounded-sm overflow-hidden shadow-sm mx-auto">
      {sequence.map((item, idx) => {
        if (item === 'CENTER') {
          return (
            <div key="center" className="col-span-2 row-span-2 bg-white flex items-center justify-center font-bold text-gray-700 text-sm md:text-base">
              {title}
            </div>
          );
        } else {
          const houseIndex = item as number;
          const cellData = data[houseIndex];
          const planets = cellData?.planets || [];
          const isLagna = hasLagna(planets);
          
          return (
            <div key={houseIndex} className="relative bg-white aspect-square p-1 flex flex-wrap content-start gap-1 text-[10px] sm:text-xs text-gray-800 leading-none">
              {/* Lagna indicator slash in the top-left corner */}
              {isLagna && (
                <svg className="absolute top-0 left-0 w-3.5 h-3.5 text-gray-500" viewBox="0 0 10 10">
                  <line x1="0" y1="10" x2="10" y2="0" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              )}
              {planets.map((planet, pIdx) => (
                <span 
                  key={pIdx} 
                  className={`inline-block ${isLagna && pIdx === 0 ? 'ml-3' : ''}`}
                >
                  {planet}
                </span>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
};

export const JathagamGridView: React.FC<JathagamGridViewProps> = ({ rasi, navamsam }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center items-center md:items-start w-full">
      <div className="w-full flex-1 flex justify-center">
        <ChartGrid data={rasi || {}} title="ராசி" />
      </div>
      <div className="w-full flex-1 flex justify-center">
        <ChartGrid data={navamsam || {}} title="நவாம்சம்" />
      </div>
    </div>
  );
};

export default JathagamGridView;
