import React, { useEffect, useState } from 'react';
import cookieImg from '../assets/cookie.png';
import { getSkinAsset } from '../utils/assetLoader';
import './FallingCookies.css';
const FallingCookies = ({ cps, skin, customImage, theme, mode }) => {
    const [cookies, setCookies] = useState([]);
    const lastSpawnTime = React.useRef(Date.now());
    const requestRef = React.useRef();
    useEffect(() => {
        if (cps === 0) return;

        const spawnCookie = () => {
            const now = Date.now();
            const newCookie = {
                id: `${now}-${Math.random()}`,
                left: Math.random() * 90 + 5,
                animationDuration: 3 + Math.random() * 2,
                spinDuration: 2 + Math.random() * 3,
                spinDelay: Math.random() * -5,
                size: 20 + Math.random() * 20,
                createdAt: now,
                variant: Math.floor(Math.random() * 12) + 1
            };

            setCookies(prev => {
                const activeCookies = prev.filter(c => now - c.createdAt < (c.animationDuration * 1000));
                return [...activeCookies, newCookie];
            });
        };

        const scheduleNext = () => {
            const numCookiesPerSecond = Math.max(1, Math.min(Math.floor(cps / 2), 10));
            const avgDelay = 1000 / numCookiesPerSecond;
            const randomDelay = avgDelay * (0.5 + Math.random());

            return setTimeout(() => {
                spawnCookie();
                timeoutId = scheduleNext();
            }, randomDelay);
        };

        let timeoutId = scheduleNext();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [cps]);
    if (cps === 0) return null;
    return (
        <div className="falling-cookies-container">
            {cookies.map(cookie => {
                let displayImg = null;
                let emoji = '🍪';

                if (skin === 'christmas') {
                    if (mode === 4) {
                        displayImg = getSkinAsset('christmas', 'snow.png');
                        if (!displayImg) emoji = '❄️';
                    } else if (customImage) {
                        displayImg = customImage;
                    } else {
                        if (mode === 1) emoji = '🎁';
                        else if (mode === 2) emoji = '❄️';
                        else if (mode === 3) emoji = '🎄';
                        else emoji = '❄️';
                    }
                } else if (skin === 'halloween') {
                    if (customImage) {
                        displayImg = customImage;
                    } else {
                        if (mode === 1) emoji = '🎃';
                        else if (mode === 2) emoji = '👻';
                        else if (mode === 3) emoji = '🦇';
                        else emoji = '🎃';
                    }
                } else if (skin === 'thanksgiving') {
                    if (customImage) {
                        displayImg = customImage;
                    } else {
                        if (mode === 1) emoji = '🥧';
                        else if (mode === 2) emoji = '🦃';
                        else if (mode === 3) emoji = '🍂';
                        else emoji = '🦃';
                    }
                } else if (skin === 'valentines') {
                    if (customImage) {
                        displayImg = customImage;
                    } else {
                        if (mode === 1) emoji = '🍫';
                        else if (mode === 2) emoji = '♥️';
                        else if (mode === 3) emoji = '🌹';
                        else emoji = '♥️️';
                    }
                } else if (skin === 'amongus') {
                    const variantName = `cookie${cookie.variant > 1 ? cookie.variant : ''}.png`;
                    displayImg = getSkinAsset(skin, variantName);
                } else if ((skin === 'genshin' || skin === 'minecraft' || skin === 'duolingo') && customImage) {
                    displayImg = customImage;
                } else if ((skin === 'apple' || skin === 'x') && theme === 'light') {
                    displayImg = getSkinAsset(skin, 'cookie2.png');
                }

                if (!displayImg && skin !== 'christmas' && skin !== 'valentines') {
                    displayImg = customImage || getSkinAsset(skin, 'cookie.png');
                }

                if (!displayImg && skin !== 'christmas' && skin !== 'valentines') {
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
                                <span style={{ fontSize: `${cookie.size}px` }}>{emoji}</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
export default FallingCookies;