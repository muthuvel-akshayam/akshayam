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
    ? "bg-white overflow-hidden" 
    : "w-full max-w-[320px] xs:max-w-xs sm:max-w-[400px] grid grid-cols-4 grid-rows-4 bg-white border border-rose-200/60 rounded-xl overflow-hidden shadow-md mx-auto";

  const containerStyle = pdfMode ? { position: 'relative' as any, width: '100%', height: '100%', backgroundColor: '#ffffff', overflow: 'hidden' } : {};

  // Absolute positioning map for 4x4 South Indian Chart
  const posMap: Record<number | string, { top: string, left: string, width: string, height: string }> = {
    0: { top: '0%', left: '0%', width: '25%', height: '25%' },
    1: { top: '0%', left: '25%', width: '25%', height: '25%' },
    2: { top: '0%', left: '50%', width: '25%', height: '25%' },
    3: { top: '0%', left: '75%', width: '25%', height: '25%' },
    4: { top: '25%', left: '75%', width: '25%', height: '25%' },
    5: { top: '50%', left: '75%', width: '25%', height: '25%' },
    6: { top: '75%', left: '75%', width: '25%', height: '25%' },
    7: { top: '75%', left: '50%', width: '25%', height: '25%' },
    8: { top: '75%', left: '25%', width: '25%', height: '25%' },
    9: { top: '75%', left: '0%', width: '25%', height: '25%' },
    10: { top: '50%', left: '0%', width: '25%', height: '25%' },
    11: { top: '25%', left: '0%', width: '25%', height: '25%' },
    'CENTER': { top: '25%', left: '25%', width: '50%', height: '50%' }
  };

  return (
    <div className={containerClasses} style={containerStyle}>
      {sequence.map((item, idx) => {
        if (item === 'CENTER') {
          return (
            <div key="center" className="col-span-2 row-span-2 bg-gradient-to-br from-rose-50 to-orange-50 flex flex-col items-center justify-center border-[0.5px] border-rose-200/60" style={pdfMode ? { position: 'absolute', ...posMap['CENTER'], backgroundColor: '#fff7ed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '0.5px solid rgba(254, 205, 211, 0.6)', boxSizing: 'border-box' } : {}}>
              {centerElement || (
                <>
                  <span className="font-bold text-rose-900 tracking-wide text-lg md:text-xl">
                    {title}
                  </span>
                  <span className="text-[10px] text-rose-400 font-bold tracking-widest uppercase mt-1 opacity-80">Chart</span>
                </>
              )}
            </div>
          );
        } else {
          const houseIndex = item as number;
          const planets = getPlanetsForHouse(houseIndex);
          
          const cellClasses = pdfMode
            ? "bg-white border-[0.5px] border-emerald-800/40 flex flex-col items-center justify-center p-0.5 leading-tight"
            : "relative bg-white border-[0.5px] border-rose-200/60 aspect-square sm:aspect-[5/4] p-1.5 flex flex-col items-center justify-center gap-0.5 leading-tight hover:bg-rose-50/50 transition-colors duration-300";
          
          const cellStyle = pdfMode ? { position: 'absolute' as any, ...posMap[houseIndex], backgroundColor: '#ffffff', border: '0.5px solid rgba(6, 95, 70, 0.4)', display: 'flex', flexDirection: 'column' as any, alignItems: 'center', justifyItems: 'center', padding: '2px', lineHeight: '1.2', boxSizing: 'border-box' } : {};
            
          return (
            <div key={houseIndex} className={cellClasses} style={cellStyle}>
              {planets.map((planet, pIdx) => (
                <span 
                  key={pIdx} 
                  className={`block ${pdfMode ? 'text-[9px]' : 'text-[9px] xs:text-[10px] sm:text-[13px] px-1 py-0.5'} text-gray-800 font-bold text-center tracking-tight truncate w-full`}
                  style={pdfMode ? { display: 'block', fontSize: '9px', color: '#1f2937', fontWeight: 'bold', textAlign: 'center', letterSpacing: '-0.025em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' } : {}}
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
