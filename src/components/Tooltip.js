import { useRef, useEffect, useState } from "react";
function Tooltip({ text, position }) {
    const tooltipRef = useRef(null);
    const [adjustedPosition, setAdjustedPosition] = useState({ top: position.y, left: position.x });
  
    useEffect(() => {
        if (tooltipRef.current) {
            const { innerWidth, innerHeight } = window;
            const { offsetWidth, offsetHeight } = tooltipRef.current;
            const newPos = { ...position };
    
            // Adjust based on viewport to prevent overflow
            if (position.x + offsetWidth > innerWidth) {
            newPos.x -= offsetWidth + 20; // Additional space from cursor
            } else {
            newPos.x += 5; // Default offset
            }
            
            if (position.y + offsetHeight > innerHeight) {
            newPos.y -= offsetHeight + 20;
            } else {
            newPos.y -= 30;
            }
    
            setAdjustedPosition(newPos);
        }
    }, [position, tooltipRef]);
  
    const style = {
        position: 'fixed',
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
        backgroundColor: 'black',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '14px',
        zIndex: 1000,
        visibility: text ? 'visible' : 'hidden',
        opacity: text ? 1 : 0,
        transition: 'opacity 0.2s, visibility 0.2s',
    };
  
    return (
        <div ref={tooltipRef} style={style}>{text}</div>
    );
}
  
export default Tooltip;