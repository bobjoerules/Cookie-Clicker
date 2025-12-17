import { useState, useEffect } from 'react';
import { getSkinAsset } from '../utils/assetLoader';
import './GoldenCookie.css';

const GoldenCookie = ({ onCollect, skin }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const randomX = Math.random() * (window.innerWidth - 100);
        const randomY = Math.random() * (window.innerHeight - 100);
        setPosition({ x: randomX, y: randomY });
        setIsVisible(true);

        const fadeTimer = setTimeout(() => {
            setIsFading(true);
        }, 8000);

        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 10000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    const handleClick = () => {
        onCollect();
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const goldenImage = getSkinAsset(skin, 'golden.png') || getSkinAsset(skin, 'cookie.png');

    return (
        <div
            className={`golden-cookie ${isFading ? 'fading' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
            onClick={handleClick}
        >
            <img src={goldenImage} alt="Golden Cookie" />
        </div>
    );
};

export default GoldenCookie;