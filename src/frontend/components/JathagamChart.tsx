import React from 'react';

export interface HouseData {
  houseIndex: number; // 0 to 11 (Meena to Mesha clockwise layout)
  planets: string[];  // e.g. ["சனி", "கேது", "லக்", "மாந்"]
}

export interface JathagamChartProps {
  title: "ராசி" | "அம்சம்" | "நவாம்சம்";
  houses: HouseData[];
}

export const JathagamChart: React.FC<JathagamChartProps> = ({ title, houses }) => {
  // Mapping the sequence to house indices for a 4x4 grid.
  // 0-11 numbering proceeds clockwise starting from top-left.
  // Row 1: 0, 1, 2, 3
  // Row 2: 11, [CENTER], [CENTER], 4
  // Row 3: 10, [CENTER], [CENTER], 5
  // Row 4: 9, 8, 7, 6
  const sequence = [0, 1, 2, 3, 11, 'CENTER', 4, 10, 5, 9, 8, 7, 6];

  const getPlanetsForHouse = (index: number) => {
    return houses.find(h => h.houseIndex === index)?.planets || [];
  };

  return (
    <div className="w-full max-w-[320px] xs:max-w-xs sm:max-w-[400px] grid grid-cols-4 grid-rows-4 gap-px bg-rose-200/60 border border-rose-200/60 rounded-xl overflow-hidden shadow-md mx-auto">
      {sequence.map((item, idx) => {
        if (item === 'CENTER') {
          return (
            <div key="center" className="col-span-2 row-span-2 bg-gradient-to-br from-rose-50 to-orange-50 flex flex-col items-center justify-center">
              <span className="font-bold text-rose-900 tracking-wide text-lg md:text-xl">{title}</span>
              <span className="text-[10px] text-rose-400 font-bold tracking-widest uppercase mt-1 opacity-80">Chart</span>
            </div>
          );
        } else {
          const houseIndex = item as number;
          const planets = getPlanetsForHouse(houseIndex);
          
          return (
            <div key={houseIndex} className="relative bg-white aspect-square sm:aspect-[5/4] p-1.5 flex flex-col items-center justify-center gap-0.5 leading-tight hover:bg-rose-50/50 transition-colors duration-300">
              {planets.map((planet, pIdx) => (
                <span 
                  key={pIdx} 
                  className="block text-[9px] xs:text-[10px] sm:text-[13px] px-1 py-0.5 text-gray-800 font-bold text-center tracking-tight truncate w-full"
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

export default JathagamChart;
