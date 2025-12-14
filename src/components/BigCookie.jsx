import React, { useState } from 'react';
import cookieImg from '../assets/cookie.png';
import { getSkinAsset } from '../utils/assetLoader';
import './BigCookie.css';
const BigCookie = ({ onCookieClick, skin }) => {
    const [isClicking, setIsClicking] = useState(false);
    const handleClick = (e) => {
        setIsClicking(true);
        setTimeout(() => setIsClicking(false), 100);
        onCookieClick(e);
    };
    const skinCookieImg = getSkinAsset(skin, 'cookie.png');
    const displayImg = skinCookieImg || cookieImg;
    return (
        <div className="big-cookie-wrapper">
            <div className={`big-cookie ${isClicking ? 'clicking' : ''}`}>
                <img
                    src={displayImg}
                    alt="Big Cookie"                    draggable="false"                    onMouseDown={handleClick}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
};
export default BigCookie;
