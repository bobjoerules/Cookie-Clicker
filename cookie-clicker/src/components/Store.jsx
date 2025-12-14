import React, { useState } from 'react';
import { BUILDINGS } from '../data/buildings';
import { UPGRADES } from '../data/upgrades';
import { getSkinAsset } from '../utils/assetLoader';
import './Store.css';

const Store = ({ cookies, buildingsOwned, upgradesOwned, onPurchase, onSell, onUpgradePurchase, skin }) => {
    const [hoveredUpgrade, setHoveredUpgrade] = useState(null);
    const [isSellMode, setIsSellMode] = useState(false);
    const [bulkAmount, setBulkAmount] = useState(1);

    const getCost = (baseCost, startCount, amount) => {
        let totalCost = 0;
        for (let i = 0; i < amount; i++) {
            totalCost += Math.floor(baseCost * Math.pow(1.15, startCount + i));
        }
        return totalCost;
    };

    const getSellPrice = (baseCost, startCount, amount) => {
        let totalRefund = 0;
        const availableToSell = Math.min(startCount, amount);
        if (availableToSell <= 0) return 0;

        for (let i = 0; i < availableToSell; i++) {
            const currentBuildingIndex = startCount - 1 - i;
            const costOfLast = Math.floor(baseCost * Math.pow(1.15, currentBuildingIndex));
            totalRefund += Math.floor(costOfLast * 0.5);
        }
        return totalRefund;
    };

    const getClickMultiplier = () => {
        let multiplier = 1;
        upgradesOwned.forEach((upgradeId) => {
            const upgrade = UPGRADES.find(u => u.id === upgradeId);
            if (upgrade && (!upgrade.buildingId || upgrade.buildingId === 'cursor')) {
                multiplier *= upgrade.multiplier;
            }
        });
        return multiplier;
    };

    const getUpgradeEffect = (upgrade) => {
        if (upgrade.multiplier === 1) {
            return upgrade.description;
        }

        if (!upgrade.buildingId || upgrade.buildingId === 'cursor') {
            const currentMultiplier = getClickMultiplier();
            const newMultiplier = currentMultiplier * upgrade.multiplier;
            return `Clicking power: ${currentMultiplier.toFixed(1)}x → ${newMultiplier.toFixed(1)}x`;
        }

        return upgrade.description;
    };

    const availableMultipliers = [1, 5, 10, 25, 50, 100, 1000];

    const formatNumber = (num) => {
        if (num >= 1000000) {
            const suffixes = [
                "", " Million", " Billion", " Trillion",
                " Quadrillion", " Quintillion", " Sextillion", " Septillion",
                " Octillion", " Nonillion", " Decillion"];
            const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
            if (tier >= suffixes.length) return num.toExponential(2);

            const appSuffixes = ["", " Thousand", " Million", " Billion", " Trillion",
                " Quadrillion", " Quintillion", " Sextillion", " Septillion",
                " Octillion", " Nonillion", " Decillion"];
            const appTier = Math.floor(Math.log10(Math.abs(num)) / 3);
            if (appTier >= appSuffixes.length) return num.toExponential(2);
            const suffix = appSuffixes[appTier];
            const scale = Math.pow(10, appTier * 3);
            const scaled = num / scale;
            return scaled.toFixed(3) + suffix;
        }
        return num.toLocaleString();
    };

    return (
        <div className="store-container">
            { }
            <div className="upgrades-section">
                <h3>Upgrades</h3>
                <div className="upgrades-list">
                    {[...UPGRADES].sort((a, b) => {
                        const aOwned = upgradesOwned.includes(a.id);
                        const bOwned = upgradesOwned.includes(b.id);
                        if (aOwned === bOwned) return a.cost - b.cost;
                        return aOwned ? 1 : -1;
                    }).map((upgrade) => {
                        const isPurchased = upgradesOwned.includes(upgrade.id);
                        const canAfford = cookies >= upgrade.cost;
                        const isHovered = hoveredUpgrade === upgrade.id;
                        return (
                            <div
                                key={upgrade.id}
                                className={`upgrade-item glass-panel ${isPurchased ? 'purchased' : canAfford ? 'affordable' : 'locked'}`}
                                onClick={() => !isPurchased && canAfford && onUpgradePurchase(upgrade.id, upgrade.cost)}
                                onMouseEnter={() => setHoveredUpgrade(upgrade.id)}
                                onMouseLeave={() => setHoveredUpgrade(null)}
                            >
                                <div className="upgrade-icon">{upgrade.icon}</div>
                                <div className="upgrade-info">
                                    <div className="upgrade-name-text">{upgrade.name}</div>
                                    <div className="upgrade-cost">
                                        {isPurchased ? (
                                            <span className="purchased-badge">✓ Owned</span>
                                        ) : isHovered ? (
                                            <span className="upgrade-effect-inline">{getUpgradeEffect(upgrade)}</span>
                                        ) : (
                                            <>
                                                {getSkinAsset(skin, 'cookie.png') ? (
                                                    <img
                                                        src={getSkinAsset(skin, 'cookie.png')}
                                                        alt="cookie" style={{ width: '1.2em', height: '1.2em', verticalAlign: 'middle', objectFit: 'contain', marginRight: '4px' }}
                                                    />
                                                ) : '🍪 '}
                                                {formatNumber(upgrade.cost)}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            { }
            <div className="store-controls-container">
                <h3>Production</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="bulk-controls">
                        {availableMultipliers.map(amt => (
                            <button
                                key={amt}
                                className={`bulk-btn ${bulkAmount === amt ? 'active' : ''}`}
                                onClick={() => setBulkAmount(amt)}
                            >
                                {`${amt}`}
                            </button>
                        ))}
                    </div>
                    <button
                        className={`mode-toggle ${isSellMode ? 'sell-mode' : 'buy-mode'}`}
                        onClick={() => setIsSellMode(!isSellMode)}
                        style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--glass-border)',
                            background: isSellMode ? 'rgba(255, 50, 50, 0.2)' : 'rgba(50, 255, 50, 0.2)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {isSellMode ? 'SELL' : 'BUY'}
                    </button>
                </div>
            </div>
            <div className="store-list">
                {BUILDINGS.map((building) => {
                    const count = buildingsOwned[building.id] || 0;
                    const cost = getCost(building.baseCost, count, bulkAmount);
                    const sellPrice = getSellPrice(building.baseCost, count, bulkAmount);
                    const canAfford = cookies >= cost;
                    const canSell = count > 0;

                    const skinIcon = getSkinAsset(skin, `${building.id}.png`);
                    const isAffordable = isSellMode ? canSell : canAfford;
                    const priceDisplay = isSellMode ? sellPrice : cost;

                    const effectiveSellAmount = Math.min(count, bulkAmount);
                    const sellLabel = effectiveSellAmount < bulkAmount && isSellMode ? `Sell ${effectiveSellAmount} for` : isSellMode ? 'Sell for' : 'Cost';

                    return (
                        <div
                            key={building.id}
                            className={`store-item glass-panel ${isAffordable ? 'affordable' : 'locked'} ${isSellMode ? 'sell-item' : ''}`}
                            onClick={() => {
                                if (isSellMode) {
                                    if (canSell) onSell(building.id, bulkAmount);
                                } else {
                                    if (canAfford) onPurchase(building.id, cost, bulkAmount);
                                }
                            }}
                            style={{
                                borderColor: isSellMode ? 'rgba(255, 100, 100, 0.5)' : undefined,
                                opacity: (!isSellMode && !canAfford) || (isSellMode && !canSell) ? 0.7 : 1
                            }}
                        >
                            <div className="store-icon">
                                {skinIcon ? (
                                    <img src={skinIcon} alt={building.name} className="building-icon-img" />
                                ) : (
                                    building.icon
                                )}
                            </div>
                            <div className="store-info">
                                <div className="store-name">{building.name}</div>
                                <div className="store-cost" style={{ color: isSellMode ? '#ff8888' : undefined, display: 'flex', alignItems: 'center' }}>
                                    {isSellMode ? '💰 ' : (
                                        getSkinAsset(skin, 'cookie.png') ? (
                                            <img
                                                src={getSkinAsset(skin, 'cookie.png')}
                                                alt="cookie" style={{ width: '1.2em', height: '1.2em', verticalAlign: 'middle', objectFit: 'contain', marginRight: '4px' }}
                                            />
                                        ) : '🍪 ')}
                                    {formatNumber(priceDisplay)}
                                </div>
                                <div className="store-cps">+{building.cps * bulkAmount} cps</div>
                            </div>
                            <div className="store-count">{count}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Store;
