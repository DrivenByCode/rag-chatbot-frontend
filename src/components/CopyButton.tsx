import React, { useState, useRef } from "react";
import TooltipPortal from "@/components/TooltipPortal";

interface Props {
    text: string;
}

const CopyButton: React.FC<Props> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({ top: rect.top + 35, left: rect.left});
        }
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <>
            <button
                ref={buttonRef}
                onClick={handleCopy}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 text-sm rounded-lg shadow hover:scale-105 transition"
            >
                복사
            </button>

            {copied && (
                <TooltipPortal>
                    <div
                        style={{
                            position: "fixed",
                            top: coords.top,
                            left: coords.left,
                            transform: "translate(-50%, 0)",
                            zIndex: 50
                        }}
                        className="bg-black text-white px-2 py-1 text-xs rounded shadow-md animate-fade"
                    >
                        복사됨!
                    </div>
                </TooltipPortal>
            )}
        </>
    );
};

export default CopyButton;
