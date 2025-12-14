import React from 'react';
import { ACHIEVEMENTS } from '../data/achievements';
import { getSkinAsset } from '../utils/assetLoader';
import './Achievements.css';
const Achievements = ({ unlocked, onHover, onMove, onLeave, skin, currencyName }) => {
    const validUnlocked = unlocked.filter(id => ACHIEVEMENTS.some(a => a.id === id));
    const displayedTotal = ACHIEVEMENTS.filter(a => !a.hidden || unlocked.includes(a.id)).length;

    return (
        <div className="achievements-container">
            <h3>Achievements ({validUnlocked.length}/{displayedTotal})</h3>
            <div className="achievements-list">
                {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = unlocked.includes(achievement.id);
                    if (achievement.hidden && !isUnlocked) return null;

                    return (
                        <div
                            key={achievement.id}
                            className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                            title={achievement.name}
                            onMouseEnter={(e) => onHover(achievement, e)}
                            onMouseLeave={onLeave}
                            onMouseMove={onMove}
                        >
                            <div className="achievement-icon">
                                {isUnlocked ? (
                                    achievement.icon === '🍪' && getSkinAsset(skin, 'cookie.png') ? (
                                        <img
                                            src={getSkinAsset(skin, 'cookie.png')}
                                            alt="cookie" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        achievement.icon
                                    )
                                ) : '🔒'}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default Achievements;
