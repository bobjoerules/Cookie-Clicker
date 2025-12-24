import React from 'react';
import './WelcomeBackModal.css';

const WelcomeBackModal = ({ isOpen, onClose, cookiesEarned, timeOffline, currencyName = 'Cookies' }) => {
    if (!isOpen) return null;

    const formatTime = (seconds) => {
        if (seconds < 60) return `${Math.floor(seconds)} seconds`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            const suffixes = ["", " Million", " Billion", " Trillion"];
            const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
            if (tier >= suffixes.length) return num.toExponential(2);
            const suffix = suffixes[tier - 1]; // -1 because 10^3 is handled by thousand separator usually, but here we start million at 10^6
            // actually re-using logic from App.jsx is better but duplication for now is safer
            // Wait, standard short scale:
            // 10^6 = Million (tier 2)
            // 10^9 = Billion (tier 3)
            // The tier logic: 
            // log10(1000000) = 6. 6/3 = 2.

            const suffixMap = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
            // Just use simple formatting here:
            return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
        }
        return Math.floor(num).toLocaleString();
    };

    return (
        <div className="welcome-modal-overlay" onClick={onClose}>
            <div className="welcome-modal" onClick={e => e.stopPropagation()}>
                <h2>Welcome Back!</h2>
                <p>You were gone for {formatTime(timeOffline)}.</p>
                <p>While you were away, your bakery continued to work at 50% efficiency.</p>
                <div className="cookies-earned">
                    +{formatNumber(cookiesEarned)} {currencyName}
                </div>
                <button className="welcome-btn" onClick={onClose}>
                    Collect
                </button>
            </div>
        </div>
    );
};

export default WelcomeBackModal;
