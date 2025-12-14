import React from 'react';
import './FloatingText.css';
const FloatingText = ({ texts }) => {
    return (
        <div className="floating-text-container">
            {texts.map((text) => (
                <div
                    key={text.id}
                    className="floating-text"                    style={{
                        left: `${text.x}px`,
                        top: `${text.y}px`,
                        '--dx': `${text.dx}px`                    }}
                >
                    {text.value}
                </div>
            ))}
        </div>
    );
};
export default FloatingText;
