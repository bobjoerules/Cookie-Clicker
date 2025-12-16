import React, { useState, useEffect } from 'react';
import { getSkinAsset } from '../utils/assetLoader';
import './Settings.css';
const Settings = ({ isOpen, onClose, onReset, gameData, timePlayed, currentTheme, onThemeChange, currentSkin, onSkinChange, showMilk, onToggleMilk }) => {
    const handleSkinChange = (newSkin) => {
        onSkinChange(newSkin);
    };
    if (!isOpen) return null;
    const handleExport = () => {
        const dataStr = JSON.stringify(gameData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cookie-clicker-save-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };
    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const importedData = JSON.parse(event.target.result);
                        localStorage.setItem('cookieClickerSave', JSON.stringify(importedData));
                        window.location.reload();
                    } catch (error) {
                        alert('Invalid save file!');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };
    const handleReset = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
            if (window.confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
                onReset();
                onClose();
            }
        }, 10);
    };
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours}h ${minutes}m ${secs}s`;
    };
    const renderSkinButton = (skinId, label, defaultEmoji) => {
        let cookieFile = 'cookie.png';

        // For Apple, X, and PlayStation themes, use the opposite version based on current theme
        if (skinId === 'apple' || skinId === 'x' || skinId === 'playstation') {
            // Determine actual theme (resolve 'system' to light or dark)
            let actualTheme = currentTheme;
            if (currentTheme === 'system') {
                actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            // Use dark logo (cookie2.png) in light mode, light logo (cookie.png) in dark mode
            cookieFile = actualTheme === 'light' ? 'cookie2.png' : 'cookie.png';
        }

        const symbol = getSkinAsset(skinId, cookieFile);
        return (
            <button
                className={`theme-button ${currentSkin === skinId ? 'active' : ''}`}
                onClick={() => handleSkinChange(skinId)}
            >
                {symbol ? (
                    <img
                        src={symbol}
                        alt={label}
                        style={{ width: '1.2em', height: '1.2em', marginRight: label ? '8px' : '0', objectFit: 'contain', verticalAlign: 'middle' }}
                    />
                ) : (
                    <span style={{ marginRight: label ? '8px' : '0' }}>{defaultEmoji}</span>
                )}
                {label}
            </button>
        );
    };
    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-modal glass-panel" onClick={(e) => e.stopPropagation()}>
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button className="close-button" onClick={onClose}>✕</button>
                </div>
                <div className="settings-content">
                    { }
                    { }
                    <div className="settings-section">
                        <h3>🌗 Light/Dark Mode</h3>
                        <div className="theme-options">
                            <button
                                className={`theme-button ${currentTheme === 'light' ? 'active' : ''}`}
                                onClick={() => onThemeChange('light')}
                            >
                                ☀️ Light
                            </button>
                            <button
                                className={`theme-button ${currentTheme === 'dark' ? 'active' : ''}`}
                                onClick={() => onThemeChange('dark')}
                            >
                                🌙 Dark
                            </button>
                            <button
                                className={`theme-button ${currentTheme === 'system' ? 'active' : ''}`}
                                onClick={() => onThemeChange('system')}
                            >
                                💻 System
                            </button>
                        </div>
                    </div>
                    {/* Skin selection */}
                    <div className="settings-section">
                        <h3>🎨 Theme</h3>
                        <div className="skin-options">
                            {renderSkinButton('default', 'Default', '🍪')}
                            {renderSkinButton('fortnite', 'Fortnite', '🎮')}
                            {renderSkinButton('genshin', 'Genshin', '⚔️')}
                            {renderSkinButton('minecraft', 'Minecraft', '🧱')}
                            {renderSkinButton('amongus', 'Among Us', 'ඞ')}
                            {renderSkinButton('pokemon', 'Pokemon', '🔴')}
                            {renderSkinButton('cyberpunk', 'Cyberpunk', '🤖')}
                            {renderSkinButton('zelda', 'Zelda', '🗡️')}
                            {renderSkinButton('youtube', 'YouTube', '▶️')}
                            {renderSkinButton('instagram', 'Instagram', '📷')}
                            {renderSkinButton('tiktok', 'TikTok', '🎵')}
                            {renderSkinButton('reddit', 'Reddit', '🟠')}
                            {renderSkinButton('twitch', 'Twitch', '👾')}
                            {renderSkinButton('netflix', 'Netflix', '🍿')}
                            {renderSkinButton('miku', 'Miku', '🎤')}
                            {renderSkinButton('spotify', 'Spotify', '🎧')}
                            {renderSkinButton('snapchat', 'Snapchat', '👻')}
                            {renderSkinButton('duolingo', 'Duolingo', '🦉')}
                            {renderSkinButton('steam', 'Steam', '🚂')}
                            {renderSkinButton('xbox', 'Xbox', '❎')}
                            {renderSkinButton('playstation', 'PlayStation', '🎮')}
                            {renderSkinButton('google', 'Google', '🔍')}
                            {renderSkinButton('x', '', '✖️')}
                            {renderSkinButton('discord', 'Discord', '💬')}
                            {renderSkinButton('apple', 'Apple', '🍎')}
                            {renderSkinButton('android', 'Android', '🤖')}
                            {renderSkinButton('windows', 'Windows', '🪟')}
                            {renderSkinButton('linux', 'Linux', '🐧')}
                        </div>
                    </div>
                    { }
                    { }
                    { }
                    <div className="settings-section">
                        <h3>💾 Data Management</h3>
                        <div className="data-buttons">
                            <button className="settings-action-button export-button" onClick={handleExport}>
                                📥 Export Save
                            </button>
                            <button className="settings-action-button import-button" onClick={handleImport}>
                                📤 Import Save
                            </button>
                        </div>
                    </div>

                    <div className="settings-section danger-zone">
                        <h3>⚠️ Danger Zone</h3>
                        <button className="settings-action-button reset-button" onClick={handleReset}>
                            🗑️ Reset All Progress
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};
export default Settings;
