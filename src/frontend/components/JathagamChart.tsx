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

  const rasiNames: Record<number, string> = {
    0: '12. மீனம்',
    1: '1. மேஷம்',
    2: '2. ரிஷபம்',
    3: '3. மிதுனம்',
    4: '4. கடகம்',
    5: '5. சிம்மம்',
    6: '6. கன்னி',
    7: '7. துலாம்',
    8: '8. விருச்சிகம்',
    9: '9. தனுசு',
    10: '10. மகரம்',
    11: '11. கும்பம்'
  };

  const containerClasses = pdfMode 
    ? "overflow-hidden" 
    : "w-full max-w-[340px] aspect-square grid grid-cols-4 grid-rows-4 overflow-hidden shadow-md mx-auto text-[10px] sm:text-xs";

  // Thick maroon border for the whole container, cream background
  const containerStyle: React.CSSProperties = pdfMode 
    ? { position: 'relative' as any, width: '100%', height: '100%', backgroundColor: 'transparent', overflow: 'hidden', border: '2px solid #5a0001', boxSizing: 'border-box' } 
    : { backgroundColor: 'transparent', border: '3px solid #5a0001', boxSizing: 'border-box' };

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
            <div key="center" className="col-span-2 row-span-2 flex flex-col items-center justify-center border-[#5a0001]" style={(pdfMode ? { position: 'absolute', ...posMap['CENTER'], backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #5a0001', boxSizing: 'border-box' } : { border: '1.5px solid #5a0001', backgroundColor: 'transparent' }) as React.CSSProperties}>
              {centerElement || (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-[#5a0001] text-xs md:text-sm">✤</span>
                    <span className="font-bold text-[#5a0001] tracking-wide text-lg md:text-2xl" style={{ textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)' }}>
                      ஜாதகம்
                    </span>
                    <span className="text-[#5a0001] text-xs md:text-sm">✤</span>
                  </div>
                  <span className="text-[10px] md:text-xs text-[#5a0001] font-bold tracking-widest mt-1 opacity-90 border-t border-[#5a0001] pt-1 px-4">{title}</span>
                </div>
              )}
            </div>
          );
        } else {
          const houseIndex = item as number;
          const planets = getPlanetsForHouse(houseIndex);
          const rasiName = rasiNames[houseIndex];
          
          const cellClasses = pdfMode
            ? "flex flex-col items-center justify-start leading-tight"
            : "relative p-1 flex flex-col items-center justify-start content-start overflow-hidden";
          
          const cellStyle = (pdfMode 
            ? { position: 'absolute' as any, ...posMap[houseIndex], backgroundColor: 'transparent', border: '1px solid #5a0001', display: 'flex', flexDirection: 'column' as any, alignItems: 'center', justifyContent: 'flex-start', padding: '2px', lineHeight: '1.2', boxSizing: 'border-box' } 
            : { border: '1px solid #5a0001', backgroundColor: 'transparent', boxSizing: 'border-box' }) as React.CSSProperties;
            
          return (
            <div key={houseIndex} className={cellClasses} style={cellStyle}>


              {/* Planets */}
              <div className="flex flex-wrap gap-0.5 sm:gap-1 items-center justify-center w-full" style={pdfMode ? { display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center', width: '100%' } : {}}>
                {planets.map((planet, pIdx) => (
                  <span 
                    key={pIdx} 
                    className={pdfMode ? "font-bold text-[7.5px] leading-[1]" : "text-[#1f2937] font-bold text-[9px] sm:text-[10px] leading-tight break-words text-center"}
                    style={pdfMode ? { fontSize: '7.5px', color: '#1f2937', fontWeight: 'bold', textAlign: 'center', letterSpacing: '-0.02em', wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: '1' } : { whiteSpace: 'normal', wordBreak: 'break-word' }}
                  >
                    {planet}
                  </span>
                ))}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default JathagamChart;
