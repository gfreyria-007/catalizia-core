
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MathLabModalProps {
    onClose: () => void;
}

const MathLabModal: React.FC<MathLabModalProps> = ({ onClose }) => {
    const [mode, setMode] = useState<'angles' | 'rect' | 'tri' | 'circle'>('angles');
    
    // Angles state
    const [anglePoint, setAnglePoint] = useState({ x: 250, y: 100 });
    const center = { x: 250, y: 250 };
    const fixedPoint = { x: 400, y: 250 };

    // Rect state
    const [rectSize, setRectSize] = useState({ w: 200, h: 150 });

    // Tri state
    const [v1, setV1] = useState({ x: 250, y: 100 });
    const [v2, setV2] = useState({ x: 150, y: 350 });
    const [v3, setV3] = useState({ x: 350, y: 350 });

    // Circle state
    const [radius, setRadius] = useState(100);

    const calculateAngle = () => {
        const dy = anglePoint.y - center.y;
        const dx = anglePoint.x - center.x;
        let theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs
        if (theta < 0) theta = 360 + theta; // range [0, 360)
        // Adjust for fixed point at 0 degrees
        return Math.abs(Math.round(theta));
    };

    const calculateAreaTri = () => {
        return Math.abs((v1.x * (v2.y - v3.y) + v2.x * (v3.y - v1.y) + v3.x * (v1.y - v2.y)) / 2).toFixed(1);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-blue-900/40 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-4xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border-4 border-white"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🧪</span>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter">Mini Lab de Geometría</h2>
                            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">¡Toca y descubre cómo funcionan las formas!</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-2xl flex items-center justify-center transition-all"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Sidebar / Tools */}
                    <div className="w-full md:w-48 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-4 flex md:flex-col gap-2 overflow-x-auto shrink-0">
                        <button 
                            onClick={() => setMode('angles')}
                            className={`flex-1 md:flex-none p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${mode === 'angles' ? 'bg-blue-600 border-blue-700 text-white shadow-lg scale-105' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}
                        >
                            <span className="text-2xl">📐</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Ángulos</span>
                        </button>
                        <button 
                            onClick={() => setMode('rect')}
                            className={`flex-1 md:flex-none p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${mode === 'rect' ? 'bg-blue-600 border-blue-700 text-white shadow-lg scale-105' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}
                        >
                            <span className="text-2xl">🟦</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Áreas</span>
                        </button>
                        <button 
                            onClick={() => setMode('tri')}
                            className={`flex-1 md:flex-none p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${mode === 'tri' ? 'bg-blue-600 border-blue-700 text-white shadow-lg scale-105' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}
                        >
                            <span className="text-2xl">🔺</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Triángulos</span>
                        </button>
                        <button 
                            onClick={() => setMode('circle')}
                            className={`flex-1 md:flex-none p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${mode === 'circle' ? 'bg-blue-600 border-blue-700 text-white shadow-lg scale-105' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}
                        >
                            <span className="text-2xl">⚪</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Círculos</span>
                        </button>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 bg-pattern relative p-4 sm:p-12 overflow-hidden flex items-center justify-center">
                        <svg viewBox="0 0 500 500" className="w-full h-full max-w-2xl max-h-full drop-shadow-2xl overflow-visible">
                            <defs>
                                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                                </pattern>
                                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                    <rect width="50" height="50" fill="url(#smallGrid)"/>
                                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#d1d5db" strokeWidth="1"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />

                            {mode === 'angles' && (
                                <g>
                                    <line x1={center.x} y1={center.y} x2={fixedPoint.x} y2={fixedPoint.y} stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />
                                    <line x1={center.x} y1={center.y} x2={anglePoint.x} y2={anglePoint.y} stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
                                    
                                    {/* Angle arc */}
                                    <path 
                                        d={`M ${fixedPoint.x - 50} ${center.y} A 50 50 0 ${calculateAngle() > 180 ? 1 : 0} 1 ${center.x + 50 * Math.cos(Math.atan2(anglePoint.y - center.y, anglePoint.x - center.x))} ${center.y + 50 * Math.sin(Math.atan2(anglePoint.y - center.y, anglePoint.x - center.x))}`}
                                        fill="transparent"
                                        stroke="#fbbf24"
                                        strokeWidth="4"
                                        strokeDasharray="5,5"
                                    />

                                    <circle cx={center.x} cy={center.y} r="10" fill="#1e3a8a" />
                                    
                                    <motion.circle 
                                        drag
                                        dragMomentum={false}
                                        onDrag={(_, info) => {
                                            const svg = document.querySelector('svg');
                                            if (!svg) return;
                                            const CTM = svg.getScreenCTM();
                                            if (!CTM) return;
                                            const point = svg.createSVGPoint();
                                            point.x = info.point.x;
                                            point.y = info.point.y;
                                            const transformed = point.matrixTransform(CTM.inverse());
                                            setAnglePoint({ x: transformed.x, y: transformed.y });
                                        }}
                                        cx={anglePoint.x} cy={anglePoint.y} r="25" fill="#2563eb" className="cursor-grab active:cursor-grabbing shadow-xl"
                                        whileHover={{ scale: 1.2 }}
                                        whileDrag={{ scale: 1.4 }}
                                    />
                                    <text x={center.x} y={center.y + 40} textAnchor="middle" className="text-3xl font-black fill-[#1e3a8a]">{calculateAngle()}°</text>
                                </g>
                            )}

                            {mode === 'rect' && (
                                <g>
                                    <motion.rect 
                                        x={center.x - rectSize.w / 2} 
                                        y={center.y - rectSize.h / 2} 
                                        width={rectSize.w} 
                                        height={rectSize.h} 
                                        fill="#dcfce7" 
                                        stroke="#16a34a" 
                                        strokeWidth="4" 
                                        rx="8"
                                    />
                                    <text x={center.x} y={center.y} textAnchor="middle" dominantBaseline="middle" className="text-2xl font-black fill-[#16a34a]">
                                        Área: {(rectSize.w * rectSize.h / 100).toFixed(0)} u²
                                    </text>
                                    <text x={center.x} y={center.y - rectSize.h / 2 - 10} textAnchor="middle" className="text-xs font-bold fill-gray-400">Base: {(rectSize.w / 10).toFixed(0)}</text>
                                    <text x={center.x + rectSize.w / 2 + 30} y={center.y} textAnchor="middle" rotate="-90" className="text-xs font-bold fill-gray-400">Altura: {(rectSize.h / 10).toFixed(0)}</text>

                                    {/* Resize handle */}
                                    <motion.circle 
                                        drag
                                        dragMomentum={false}
                                        onDrag={(_, info) => {
                                            const svg = document.querySelector('svg');
                                            if (!svg) return;
                                            const CTM = svg.getScreenCTM();
                                            if (!CTM) return;
                                            const point = svg.createSVGPoint();
                                            point.x = info.point.x;
                                            point.y = info.point.y;
                                            const transformed = point.matrixTransform(CTM.inverse());
                                            setRectSize({
                                                w: Math.max(40, (transformed.x - center.x) * 2),
                                                h: Math.max(40, (transformed.y - center.y) * 2)
                                            });
                                        }}
                                        cx={center.x + rectSize.w / 2} 
                                        cy={center.y + rectSize.h / 2} 
                                        r="20" 
                                        fill="#16a34a" 
                                        className="cursor-nwse-resize shadow-lg"
                                    />
                                </g>
                            )}

                            {mode === 'tri' && (
                                <g>
                                    <motion.path 
                                        d={`M ${v1.x} ${v1.y} L ${v2.x} ${v2.y} L ${v3.x} ${v3.y} Z`}
                                        fill="#fef9c3"
                                        stroke="#ca8a04"
                                        strokeWidth="4"
                                        strokeLinejoin="round"
                                    />
                                    <text x={250} y={450} textAnchor="middle" className="text-2xl font-black fill-[#ca8a04]">
                                        Área: {(calculateAreaTri() as any / 100).toFixed(1)} u²
                                    </text>

                                    {[setV1, setV2, setV3].map((setter, i) => {
                                        const pos = [v1, v2, v3][i];
                                        return (
                                            <motion.circle 
                                                key={i}
                                                drag
                                                dragMomentum={false}
                                                onDrag={(_, info) => {
                                                    const svg = document.querySelector('svg');
                                                    if (!svg) return;
                                                    const CTM = svg.getScreenCTM();
                                                    if (!CTM) return;
                                                    const point = svg.createSVGPoint();
                                                    point.x = info.point.x;
                                                    point.y = info.point.y;
                                                    const transformed = point.matrixTransform(CTM.inverse());
                                                    setter({ x: transformed.x, y: transformed.y });
                                                }}
                                                cx={pos.x} cy={pos.y} r="20" fill="#eab308" className="cursor-grab active:cursor-grabbing shadow-lg"
                                            />
                                        );
                                    })}
                                </g>
                            )}

                            {mode === 'circle' && (
                                <g>
                                    <circle cx={center.x} cy={center.y} r={radius} fill="#dbeafe" stroke="#2563eb" strokeWidth="4" />
                                    <line x1={center.x} y1={center.y} x2={center.x + radius} y2={center.y} stroke="#2563eb" strokeWidth="2" strokeDasharray="4,4" />
                                    
                                    <text x={center.x} y={center.y - 10} textAnchor="middle" className="text-xl font-black fill-[#1e3a8a]">
                                        r = {(radius / 10).toFixed(1)}
                                    </text>
                                    
                                    <text x={center.x} y={center.y + 150} textAnchor="middle" className="text-lg font-black fill-blue-900">
                                        Perímetro: {(2 * Math.PI * radius / 10).toFixed(1)} u
                                    </text>
                                    <text x={center.x} y={center.y + 180} textAnchor="middle" className="text-lg font-black fill-blue-900">
                                        Área: {(Math.PI * Math.pow(radius / 10, 2)).toFixed(1)} u²
                                    </text>

                                    <motion.circle 
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 200 }}
                                        onDrag={(_, info) => {
                                            const svg = document.querySelector('svg');
                                            if (!svg) return;
                                            const CTM = svg.getScreenCTM();
                                            if (!CTM) return;
                                            const point = svg.createSVGPoint();
                                            point.x = info.point.x;
                                            point.y = info.point.y;
                                            const transformed = point.matrixTransform(CTM.inverse());
                                            setRadius(Math.max(20, transformed.x - center.x));
                                        }}
                                        cx={center.x + radius} cy={center.y} r="20" fill="#2563eb" className="cursor-ew-resize shadow-lg"
                                    />
                                </g>
                            )}
                        </svg>
                    </div>

                    {/* Instructions / Summary */}
                    <div className="w-full md:w-64 bg-white border-t md:border-t-0 md:border-l border-gray-100 p-6 flex flex-col gap-4 overflow-y-auto shrink-0">
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                            <h3 className="font-black text-[#1e3a8a] text-[10px] uppercase tracking-widest mb-2">¿Cómo se juega?</h3>
                            <p className="text-xs text-blue-900/70 leading-relaxed font-medium">
                                {mode === 'angles' && "Arrastra el punto azul para cambiar la abertura del ángulo. ¡Mira cómo cambian los grados!"}
                                {mode === 'rect' && "Tira de la esquina verde para agrandar o achicar el rectángulo. Observa cómo crece su superficie (área)."}
                                {mode === 'tri' && "Mueve cualquiera de los 3 vértices para transformar el triángulo. ¡Calcula su área automáticamente!"}
                                {mode === 'circle' && "Ajusta el radio del círculo moviendo el punto azul. ¡Mira cómo cambia su tamaño y contorno!"}
                            </p>
                        </div>

                        <div className="space-y-3 mt-auto">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Fórmulas Mágicas</p>
                            <div className="bg-gray-50 p-4 rounded-xl text-center">
                                {mode === 'rect' && <span className="text-sm font-black text-indigo-900">Base × Altura</span>}
                                {mode === 'tri' && <span className="text-sm font-black text-indigo-900">(Base × Altura) / 2</span>}
                                {mode === 'circle' && <span className="text-sm font-black text-indigo-900">π × r²</span>}
                                {mode === 'angles' && <span className="text-sm font-black text-indigo-900">Vértice Común</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MathLabModal;
