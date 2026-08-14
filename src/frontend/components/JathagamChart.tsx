import React from 'react';

export interface HouseData {
  houseIndex: number; // 0 to 11 (Meena to Mesha clockwise layout)
  planets: string[];  // e.g. ["சனி", "கேது", "லக்", "மாந்"]
}

export interface JathagamChartProps {
  title: "ராசி" | "அம்சம்" | "நவாம்சம்";
  houses: HouseData[];
  centerElement?: React.ReactNode;
  pdfMode?: boolean;
}

export const JathagamChart: React.FC<JathagamChartProps> = ({ title, houses, centerElement, pdfMode = false }) => {
  const sequence = [0, 1, 2, 3, 11, 'CENTER', 4, 10, 5, 9, 8, 7, 6];

  const getPlanetsForHouse = (index: number) => {
    return houses.find(h => h.houseIndex === index)?.planets || [];
  };

  const containerClasses = pdfMode 
    ? "w-full h-full grid grid-cols-4 grid-rows-4 bg-white overflow-hidden" 
    : "w-full max-w-[320px] xs:max-w-xs sm:max-w-[400px] grid grid-cols-4 grid-rows-4 bg-white border border-rose-200/60 rounded-xl overflow-hidden shadow-md mx-auto";

  return (
    <div className={containerClasses}>
      {sequence.map((item, idx) => {
        if (item === 'CENTER') {
          return (
            <div key="center" className="col-span-2 row-span-2 bg-gradient-to-br from-rose-50 to-orange-50 flex flex-col items-center justify-center border-[0.5px] border-rose-200/60">
              {centerElement || (
                <>
                  <span className="font-bold text-rose-900 tracking-wide text-lg md:text-xl">{title}</span>
                  <span className="text-[10px] text-rose-400 font-bold tracking-widest uppercase mt-1 opacity-80">Chart</span>
                </>
              )}
            </div>
          );
        } else {
          const houseIndex = item as number;
          const planets = getPlanetsForHouse(houseIndex);
          
          const cellClasses = pdfMode
            ? "relative bg-white border-[0.5px] border-rose-200/60 flex flex-col items-center justify-center p-0.5 leading-tight"
            : "relative bg-white border-[0.5px] border-rose-200/60 aspect-square sm:aspect-[5/4] p-1.5 flex flex-col items-center justify-center gap-0.5 leading-tight hover:bg-rose-50/50 transition-colors duration-300";
            
          return (
            <div key={houseIndex} className={cellClasses}>
              {planets.map((planet, pIdx) => (
                <span 
                  key={pIdx} 
                  className={`block ${pdfMode ? 'text-[9px]' : 'text-[9px] xs:text-[10px] sm:text-[13px] px-1 py-0.5'} text-gray-800 font-bold text-center tracking-tight truncate w-full`}
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
