import React, { useEffect, useState } from 'react';
import { getSkinAsset } from '../utils/assetLoader';
import './AchievementNotification.css';
const AchievementNotification = ({ achievement, skin, currencyName }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 10);
        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
    }, [achievement]);

    if (!achievement) return null;

    const description = currencyName
        ? achievement.description.replace(/cookies/gi, currencyName.toLowerCase()).replace(/cookie/gi, currencyName.toLowerCase())
        : achievement.description;

    const isAutoClicker = achievement.id === 'autoClicker';

    return (
        <div
            className={`achievement-notification ${visible ? 'visible' : ''}`}
            style={isAutoClicker ? { background: 'linear-gradient(135deg, #ff0000 0%, #8b0000 100%)', borderColor: '#ffcccc' } : {}}
        >
            <div className="achievement-notification-icon">
                {achievement.icon === '🍪' && getSkinAsset(skin, 'cookie.png') ? (
                    <img
                        src={getSkinAsset(skin, 'cookie.png')}
                        alt="cookie" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                ) : (
                    achievement.icon || '🏆')}
            </div>
            <div className="achievement-notification-content">
                <div className="achievement-notification-title">Achievement Unlocked!</div>
                <div className="achievement-notification-name">{achievement.name}</div>
                <div className="achievement-notification-desc">{description}</div>
            </div>
        </div>
    );
};
export default AchievementNotification;