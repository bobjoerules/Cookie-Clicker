import React, { useEffect, useState } from 'react';
import cookieImg from '../assets/cookie.png';
import { getSkinAsset } from '../utils/assetLoader';
import './FallingCookies.css';
const FallingCookies = ({ cps, skin }) => {
    const [cookies, setCookies] = useState([]);
    const lastSpawnTime = React.useRef(Date.now());
    const requestRef = React.useRef();
    useEffect(() => {
        if (cps === 0) return;
        const spawnRate = 1000;
        const animate = (time) => {
            const now = Date.now();
            const delta = now - lastSpawnTime.current;
            if (delta > spawnRate) {
                const numCookiesToSpawn = Math.max(1, Math.min(Math.floor(cps / 2), 10));
                const newCookies = [];
                for (let i = 0; i < numCookiesToSpawn; i++) {
                    newCookies.push({
                        id: `${now}-${Math.random()}-${i}`,
                        left: Math.random() * 90 + 5,
                        animationDuration: 3 + Math.random() * 2,
                        spinDuration: 2 + Math.random() * 3,
                        spinDelay: Math.random() * -5,
                        size: 20 + Math.random() * 20,
                        createdAt: now,
                        variant: Math.floor(Math.random() * 12) + 1
                    });
                }
                setCookies(prev => {
                    const activeCookies = prev.filter(c => now - c.createdAt < (c.animationDuration * 1000));
                    return [...activeCookies, ...newCookies];
                });
                lastSpawnTime.current = now;
            }
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [cps]);
    if (cps === 0) return null;
    return (
        <div className="falling-cookies-container">
            {cookies.map(cookie => {
                let displayImg = null;
                if (skin === 'amongus') {
                    const variantName = `cookie${cookie.variant > 1 ? cookie.variant : ''}.png`;
                    displayImg = getSkinAsset(skin, variantName);
                }
                if (!displayImg) {
                    displayImg = getSkinAsset(skin, 'cookie.png');
                }
                if (!displayImg) {
                    displayImg = cookieImg;
                }
                return (
                    <div
                        key={cookie.id}
                        className="falling-cookie"
                        style={{
                            left: `${cookie.left}%`,
                            animationDuration: `${cookie.animationDuration}s`,
                            width: `${cookie.size}px`,
                            height: `${cookie.size}px`
                        }}
                    >
                        <div
                            className="falling-cookie-inner"
                            style={{
                                animationDuration: `${cookie.spinDuration}s`,
                                animationDelay: `${cookie.spinDelay}s`
                            }}
                        >
                            {displayImg ? (
                                <img
                                    src={displayImg}
                                    alt="cookie"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <span style={{ fontSize: `${cookie.size}px` }}>🍪</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
export default FallingCookies;
