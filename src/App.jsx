import { useState, useEffect, useCallback } from 'react';
import BigCookie from './components/BigCookie';
import Store from './components/Store';
import FloatingText from './components/FloatingText';
import FallingCookies from './components/FallingCookies';
import Achievements from './components/Achievements';
import AchievementNotification from './components/AchievementNotification';
import Settings from './components/Settings';
import { BUILDINGS } from './data/buildings';
import { UPGRADES } from './data/upgrades';
import { ACHIEVEMENTS } from './data/achievements';
import './App.css';
import './skins.css';
import { getSkinAsset, getThemeMusic } from './utils/assetLoader';
import defaultCookie from './assets/cookie.png';

const AMONG_US_VARIANTS = [
  { id: 1, file: 'cookie.png', color: '#c51111' }, // Red
  { id: 2, file: 'cookie2.png', color: '#ef7d0d' }, // Orange
  { id: 3, file: 'cookie3.png', color: '#f5f557' }, // Yellow
  { id: 4, file: 'cookie4.png', color: '#50ef39' }, // Light Green
  { id: 5, file: 'cookie5.png', color: '#117f2d' }, // Green
  { id: 6, file: 'cookie6.png', color: '#38fedc' }, // Cyan
  { id: 7, file: 'cookie7.png', color: '#132ed1' }, // Blue
  { id: 8, file: 'cookie8.png', color: '#6b2fbb' }, // Purple
  { id: 9, file: 'cookie9.png', color: '#ed54ba' }, // Pink
  { id: 10, file: 'cookie10.png', color: '#71491e' }, // Brown
  { id: 11, file: 'cookie11.png', color: '#d6e0f0' }, // White
  { id: 12, file: 'cookie12.png', color: '#3f474e' }, // Black
];

function App() {
  const [cookies, setCookies] = useState(0);
  const [cookiesEarned, setCookiesEarned] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [buildingsOwned, setBuildingsOwned] = useState({});
  const [upgradesOwned, setUpgradesOwned] = useState([]);
  const [achievementsUnlocked, setAchievementsUnlocked] = useState([]);
  const [cps, setCps] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [timePlayed, setTimePlayed] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hoveredAchievement, setHoveredAchievement] = useState(null);
  const [achievementMousePos, setAchievementMousePos] = useState({ x: 0, y: 0 });
  const [showStats, setShowStats] = useState(true);
  const [showStore, setShowStore] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  useEffect(() => {
    const applyTheme = (selectedTheme) => {
      let themeToApply = selectedTheme;
      if (selectedTheme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeToApply = isDark ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', themeToApply);
    };
    applyTheme(theme);
    localStorage.setItem('theme', theme);
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        applyTheme('system');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };
  const [selectedMilk, setSelectedMilk] = useState('plain');
  const [showMilk, setShowMilk] = useState(localStorage.getItem('showMilk') !== 'false');
  const [skin, setSkin] = useState(localStorage.getItem('gameSkin') || 'default');
  const [amongUsCookieIndex, setAmongUsCookieIndex] = useState(1);

  useEffect(() => {
    const path = window.location.pathname.slice(1).toLowerCase();
    const validSkins = ['default', 'fortnite', 'genshin', 'minecraft', 'amongus', 'pokemon', 'cyberpunk', 'zelda', 'youtube', 'instagram', 'tiktok', 'twitch'];

    if (path && validSkins.includes(path)) {
      handleSkinChange(path);
    }
  }, []);

  const handleSkinChange = (newSkin) => {
    setSkin(newSkin);
    localStorage.setItem('gameSkin', newSkin);
    document.documentElement.setAttribute('data-skin', newSkin);
  };

  useEffect(() => {
    const musicUrl = getThemeMusic(skin);
    if (!musicUrl) return;

    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.5;

    let interactionListener = null;

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        interactionListener = () => {
          audio.play().catch(e => console.error("Audio play failed:", e));
          if (interactionListener) {
            document.removeEventListener('click', interactionListener);
            document.removeEventListener('keydown', interactionListener);
            interactionListener = null;
          }
        };
        document.addEventListener('click', interactionListener);
        document.addEventListener('keydown', interactionListener);
      }
    };

    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
      if (interactionListener) {
        document.removeEventListener('click', interactionListener);
        document.removeEventListener('keydown', interactionListener);
      }
    };
  }, [skin]);

  useEffect(() => {
    document.documentElement.setAttribute('data-skin', skin);
    const link = document.getElementById('favicon');
    if (link) {
      const skinIcon = getSkinAsset(skin, 'cookie.png');
      link.href = skinIcon || defaultCookie;
    }
    const currentCurrency = getCurrencyName(skin);
    let titleCurrency = currentCurrency;
    if (titleCurrency.endsWith('s')) {
      titleCurrency = titleCurrency.slice(0, -1);
    }
    document.title = `${titleCurrency} Clicker`;

    const descriptions = {
      default: 'Click cookies, build your empire! A modern recreation of the classic Cookie Clicker game.',
      fortnite: 'Earn V-Bucks and build your Battle Royale empire! Cookie Clicker with a Fortnite twist.',
      genshin: 'Collect Mora and explore Teyvat! Cookie Clicker meets Genshin Impact.',
      minecraft: 'Mine cookies and craft your world! Cookie Clicker in the Minecraft universe.',
      amongus: 'Collect Crewmates and complete tasks! Cookie Clicker with an Among Us theme.',
      pokemon: 'Catch Poké Balls and become the very best! Cookie Clicker meets Pokémon.',
      cyberpunk: 'Earn Eurodollars in Night City! Cookie Clicker with a Cyberpunk 2077 aesthetic.',
      zelda: 'Collect Rupees and save Hyrule! Cookie Clicker meets The Legend of Zelda.',
      youtube: 'Gain Subscribers and grow your channel! Cookie Clicker for content creators.',
      instagram: 'Collect Likes and build your following! Cookie Clicker meets Instagram.',
      tiktok: 'Get Likes and go viral! Cookie Clicker with a TikTok vibe.',
      twitch: 'Earn Bits and build your streaming empire! Cookie Clicker for streamers.'
    };

    const description = descriptions[skin] || descriptions.default;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = `${titleCurrency} Clicker`;

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = description;

    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.content = 'website';

    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.name = 'twitter:card';
      document.head.appendChild(twitterCard);
    }
    twitterCard.content = 'summary_large_image';

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.name = 'twitter:title';
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.content = `${titleCurrency} Clicker`;

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.name = 'twitter:description';
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.content = description;
  }, [skin]);

  useEffect(() => {
    if (skin === 'amongus') {
      const variant = AMONG_US_VARIANTS.find(v => v.id === amongUsCookieIndex) || AMONG_US_VARIANTS[0];
      document.documentElement.style.setProperty('--accent-color', variant.color);
    } else {
      document.documentElement.style.removeProperty('--accent-color');
    }
  }, [skin, amongUsCookieIndex]);
  useEffect(() => {
    const savedState = localStorage.getItem('cookieClickerSave');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setCookies(state.cookies || 0);
        setCookiesEarned(state.cookiesEarned || 0);
        setClicks(state.clicks || 0);
        setBuildingsOwned(state.buildingsOwned || {});
        setUpgradesOwned(state.upgradesOwned || []);
        setAchievementsUnlocked(state.achievementsUnlocked || []);
        setTimePlayed(state.timePlayed || 0);
        setSelectedMilk(state.selectedMilk || 'plain');
        if (state.showMilk !== undefined) setShowMilk(state.showMilk);
        setAmongUsCookieIndex(state.amongUsCookieIndex || 1);
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }
    const savedShowMilk = localStorage.getItem('showMilk');
    if (savedShowMilk !== null) {
      setShowMilk(savedShowMilk === 'true');
    }
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimePlayed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!isLoaded) return;
    const saveState = {
      cookies,
      cookiesEarned,
      clicks,
      buildingsOwned,
      upgradesOwned,
      achievementsUnlocked,
      timePlayed,
      selectedMilk,
      showMilk,
      amongUsCookieIndex
    };
    localStorage.setItem('cookieClickerSave', JSON.stringify(saveState));
    localStorage.setItem('showMilk', showMilk);
  }, [cookies, cookiesEarned, clicks, buildingsOwned, upgradesOwned, achievementsUnlocked, timePlayed, selectedMilk, showMilk, amongUsCookieIndex, isLoaded]);
  useEffect(() => {
    let newCps = 0;
    BUILDINGS.forEach((building) => {
      const count = buildingsOwned[building.id] || 0;
      if (count > 0) {
        let buildingCps = building.cps;
        upgradesOwned.forEach((upgradeId) => {
          const upgrade = UPGRADES.find(u => u.id === upgradeId);
          if (upgrade && upgrade.buildingId === building.id) {
            buildingCps *= upgrade.multiplier;
          }
        });
        newCps += buildingCps * count;
      }
    });
    setCps(newCps);
  }, [buildingsOwned, upgradesOwned]);
  useEffect(() => {
    if (cps === 0) return;
    let lastTime = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (dt > 0 && cps > 0) {
        const amount = cps * dt;
        setCookies(prev => prev + amount);
        setCookiesEarned(prev => prev + amount);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [cps]);
  useEffect(() => {
    const state = {
      cookiesEarned,
      clicks,
      buildingsOwned,
      cps,
      timePlayed
    };
    ACHIEVEMENTS.forEach((achievement) => {
      if (!achievementsUnlocked.includes(achievement.id) && achievement.condition(state)) {
        setAchievementsUnlocked((prev) => [...prev, achievement.id]);
        setCurrentAchievement(achievement);
        setTimeout(() => setCurrentAchievement(null), 5000);
      }
    });
  }, [cookiesEarned, clicks, buildingsOwned, cps, timePlayed, achievementsUnlocked]);
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingTexts((prev) => prev.filter(ft => Date.now() - ft.timestamp < 2000));
    }, 100);
    return () => clearInterval(interval);
  }, []);
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

  const [lastClickTime, setLastClickTime] = useState(0);

  const handleCookieClick = (e) => {
    const now = Date.now();
    const timeDiff = now - lastClickTime;
    setLastClickTime(now);

    if (timeDiff < 100 && timeDiff > 0 && !achievementsUnlocked.includes('autoClicker')) {
      const autoClickerAch = ACHIEVEMENTS.find(a => a.id === 'autoClicker');
      if (autoClickerAch) {
        setAchievementsUnlocked(prev => [...prev, 'autoClicker']);
        setCurrentAchievement(autoClickerAch);
        setTimeout(() => setCurrentAchievement(null), 5000);
      }
    }

    const amount = 1 * getClickMultiplier();
    setCookies((prev) => prev + amount);
    setCookiesEarned((prev) => prev + amount);
    setClicks((prev) => prev + 1);
    const newText = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      value: `+${amount.toLocaleString()}`,
      x: e.clientX,
      y: e.clientY,
      dx: (Math.random() - 0.5) * 100
    };
    setFloatingTexts((prev) => [...prev, newText]);
  };
  const handlePurchase = (buildingId, cost, amount = 1) => {
    if (cookies >= cost) {
      setCookies((prev) => prev - cost);
      setBuildingsOwned((prev) => ({
        ...prev,
        [buildingId]: (prev[buildingId] || 0) + amount
      }));
    }
  };
  const handleSell = (buildingId, amount = 1) => {
    const count = buildingsOwned[buildingId] || 0;
    const amountToSell = Math.min(count, amount);

    if (amountToSell > 0) {
      const building = BUILDINGS.find(b => b.id === buildingId);
      if (building) {
        let totalRefund = 0;
        for (let i = 0; i < amountToSell; i++) {
          const currentBuildingIndex = count - 1 - i;
          const costOfLast = Math.floor(building.baseCost * Math.pow(1.15, currentBuildingIndex));
          totalRefund += Math.floor(costOfLast * 0.5);
        }

        setCookies(prev => prev + totalRefund);
        setBuildingsOwned(prev => ({
          ...prev,
          [buildingId]: count - amountToSell
        }));
      }
    }
  };
  const handleUpgradePurchase = (upgradeId, cost) => {
    if (cookies >= cost && !upgradesOwned.includes(upgradeId)) {
      setCookies((prev) => prev - cost);
      setUpgradesOwned((prev) => [...prev, upgradeId]);
    }
  };
  const pluralizeBuildingName = (name, count) => {
    if (count === 1) return name;
    if (name === 'Factory') return 'Factories';
    if (name === 'Alchemy Lab') return 'Alchemy Labs';
    return name + 's';
  };
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleReset = () => {
    localStorage.removeItem('cookieClickerSave');
    setCookies(0);
    setCookiesEarned(0);
    setClicks(0);
    setBuildingsOwned({});
    setUpgradesOwned([]);
    setAchievementsUnlocked([]);
    setTimePlayed(0);
    setCps(0);
    setFloatingTexts([]);
    setCurrentAchievement(null);
    setHoveredAchievement(null);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  const getGameData = () => {
    return {
      cookies,
      cookiesEarned,
      clicks,
      buildingsOwned,
      upgradesOwned,
      achievementsUnlocked,
      timePlayed
    };
  };
  const formatNumber = (num) => {
    if (num >= 1000000) {
      const suffixes = [
        "", " Thousand", " Million", " Billion", " Trillion",
        " Quadrillion", " Quintillion", " Sextillion", " Septillion",
        " Octillion", " Nonillion", " Decillion"];
      const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
      if (tier >= suffixes.length) return num.toExponential(2);
      const suffix = suffixes[tier];
      const scale = Math.pow(10, tier * 3);
      const scaled = num / scale;
      return scaled.toFixed(3) + suffix;
    }
    return Math.floor(num).toLocaleString();
  };
  const formatCPS = (num) => {
    return num.toLocaleString(undefined, { minimumFractionDigits: num % 1 === 0 ? 0 : 1, maximumFractionDigits: 1 });
  };
  const getCurrencyName = (skin) => {
    const names = {
      default: 'Cookies',
      fortnite: 'V-Bucks',
      genshin: 'Mora',
      minecraft: 'Cookies',
      amongus: 'Crewmates',
      pokemon: 'Poké Balls',
      cyberpunk: 'Eurodollars',
      zelda: 'Rupees',
      youtube: 'Subscribers',
      instagram: 'Likes',
      tiktok: 'Likes',
      twitch: 'Bits'
    };
    return names[skin] || 'Cookies';
  };

  const currencyName = getCurrencyName(skin);
  const isCentered = !showStats && !showStore;
  const customBackground = getSkinAsset(skin, 'background.png');
  const [mobileTab, setMobileTab] = useState('game');

  return (
    <div
      className={`app-container ${isCentered ? 'centered-view' : ''}`}
      style={customBackground ? {
        backgroundImage: `url(${customBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      <FallingCookies cps={cps} skin={skin} />
      <FloatingText texts={floatingTexts} />
      <AchievementNotification achievement={currentAchievement} skin={skin} currencyName={currencyName} />
      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onReset={handleReset}
        gameData={getGameData()}
        timePlayed={timePlayed}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
        currentSkin={skin}
        onSkinChange={handleSkinChange}
        showMilk={showMilk}
        onToggleMilk={() => setShowMilk(!showMilk)}
      />
      { }
      <div className="section-toggles" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="toggle-btn" onClick={() => setSettingsOpen(true)} title="Settings">
            ⚙️
          </button>
          <button
            className={`toggle-btn ${showStats ? 'active' : ''}`}
            onClick={() => setShowStats(!showStats)}
            title="Toggle Stats"
          >
            📊
          </button>
          <button
            className={`toggle-btn ${showStore ? 'active' : ''}`}
            onClick={() => setShowStore(!showStore)}
            title="Toggle Store"
          >
            🏪
          </button>

          {skin === 'amongus' && (
            <button
              className="toggle-btn"
              onClick={() => setAmongUsCookieIndex(prev => prev >= 12 ? 1 : prev + 1)}
              title="Change Crewmate Color"
            >
              <img
                src={getSkinAsset('amongus', (AMONG_US_VARIANTS.find(v => v.id === amongUsCookieIndex) || AMONG_US_VARIANTS[0]).file)}
                alt="Crewmate"
                style={{ width: '24px', height: '24px', objectFit: 'contain', verticalAlign: 'middle' }}
              />
            </button>
          )}
        </div>
        {upgradesOwned.includes('milkSplash') && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              className={`toggle-btn ${showMilk && selectedMilk === 'plain' ? 'active' : ''}`}
              onClick={() => {
                if (showMilk && selectedMilk === 'plain') {
                  setShowMilk(false);
                } else {
                  setSelectedMilk('plain');
                  setShowMilk(true);
                }
              }}
              title="Plain Milk"
            >
              🥛
            </button>
            {upgradesOwned.includes('chocolateMilk') && (
              <button
                className={`toggle-btn ${showMilk && selectedMilk === 'chocolate' ? 'active' : ''}`}
                onClick={() => {
                  if (showMilk && selectedMilk === 'chocolate') {
                    setShowMilk(false);
                  } else {
                    setSelectedMilk('chocolate');
                    setShowMilk(true);
                  }
                }}
                title="Chocolate Milk"
              >
                🍫
              </button>
            )}
            {upgradesOwned.includes('strawberryMilk') && (
              <button
                className={`toggle-btn ${showMilk && selectedMilk === 'strawberry' ? 'active' : ''}`}
                onClick={() => {
                  if (showMilk && selectedMilk === 'strawberry') {
                    setShowMilk(false);
                  } else {
                    setSelectedMilk('strawberry');
                    setShowMilk(true);
                  }
                }}
                title={skin === 'fortnite' ? 'Slurp Juice' : skin === 'amongus' ? 'Blood' : 'Strawberry Milk'}
              >
                {skin === 'fortnite' ? '🧪' : skin === 'amongus' ? '🩸' : '🍓'}
              </button>
            )}
          </div>
        )}
      </div>
      { }
      <section className={`cookie-section ${mobileTab === 'menu' ? 'mobile-hide' : ''}`}>
        <h1>{formatNumber(cookies)} {currencyName}</h1>
        <p>{formatCPS(cps)} per second</p>
        { }
        <div className="cookie-container">
          <BigCookie
            onCookieClick={handleCookieClick}
            skin={skin}
            customImage={skin === 'amongus' ? getSkinAsset('amongus', (AMONG_US_VARIANTS.find(v => v.id === amongUsCookieIndex) || AMONG_US_VARIANTS[0]).file) : null}
          />
        </div>
      </section>
      { }
      { }
      {
        showMilk && upgradesOwned.includes('milkSplash') && (
          <>
            <div
              className="milk-liquid" style={{
                height: '20%',
                background: (skin === 'fortnite' && selectedMilk === 'strawberry') ? '#29ffc6' :
                  (skin === 'amongus' && selectedMilk === 'strawberry') ? '#C51111' :
                    selectedMilk === 'strawberry' ? '#ffb7b2' :
                      selectedMilk === 'chocolate' ? '#8b4513' :
                        'rgba(255, 255, 255, 0.8)',
                zIndex: 2
              }}
            />
            <div
              className="milk-liquid layer-2" style={{
                height: '22%',
                background: (skin === 'fortnite' && selectedMilk === 'strawberry') ? '#29ffc6' :
                  (skin === 'amongus' && selectedMilk === 'strawberry') ? '#C51111' :
                    selectedMilk === 'strawberry' ? '#ffb7b2' :
                      selectedMilk === 'chocolate' ? '#8b4513' :
                        'rgba(255, 255, 255, 0.8)',
                opacity: 0.5,
                zIndex: 1,
                animationDuration: '8s',
                animationDelay: '-2s'
              }}
            />
          </>
        )
      }
      { }
      {
        !isCentered && (
          <div className={`right-column ${mobileTab === 'game' ? 'mobile-hide' : ''}`}>
            { }
            {showStats && (
              <section className={`stats-section glass-panel ${!showStore ? 'full-height' : ''}`}>
                <h2>Stats</h2>
                <div className="stats-grid">
                  <p><strong>Time Played:</strong> {formatTime(timePlayed)}</p>
                  <p><strong>{currencyName} Earned:</strong> {formatNumber(cookiesEarned)}</p>
                  <p><strong>Total Clicks:</strong> {clicks.toLocaleString()}</p>
                  <p><strong>Click Multiplier:</strong> x{getClickMultiplier().toLocaleString()}</p>
                  {BUILDINGS.map((building) => {
                    const count = buildingsOwned[building.id] || 0;
                    if (count === 0) return null;
                    const perSec = building.cps * count;
                    return (
                      <p key={building.id}>
                        <strong>{building.icon} {pluralizeBuildingName(building.name, count)}:</strong> {count} ({perSec.toLocaleString()} cps)
                      </p>
                    );
                  })}
                </div>
                <Achievements
                  unlocked={achievementsUnlocked}
                  skin={skin}
                  currencyName={currencyName}
                  customImage={skin === 'amongus' ? getSkinAsset('amongus', (AMONG_US_VARIANTS.find(v => v.id === amongUsCookieIndex) || AMONG_US_VARIANTS[0]).file) : null}
                  onHover={(achievement, e) => {
                    setHoveredAchievement(achievement);
                    setAchievementMousePos({ x: e.clientX, y: e.clientY });
                  }}
                  onMove={(e) => {
                    if (hoveredAchievement) {
                      setAchievementMousePos({ x: e.clientX, y: e.clientY });
                    }
                  }}
                  onLeave={() => setHoveredAchievement(null)}
                />
              </section>
            )}
            { }
            {showStore && (
              <section className={`store-section glass-panel ${!showStats ? 'full-height' : ''}`}>
                <Store
                  cookies={cookies}
                  buildingsOwned={buildingsOwned}
                  upgradesOwned={upgradesOwned}
                  onPurchase={handlePurchase}
                  onSell={handleSell}
                  onUpgradePurchase={handleUpgradePurchase}
                  skin={skin}
                  customImage={skin === 'amongus' ? getSkinAsset('amongus', (AMONG_US_VARIANTS.find(v => v.id === amongUsCookieIndex) || AMONG_US_VARIANTS[0]).file) : null}
                />
              </section>
            )}
          </div>
        )
      }
      { }
      {
        hoveredAchievement && (
          <div
            className="achievement-tooltip" style={{
              left: achievementMousePos.x,
              top: achievementMousePos.y
            }}
          >
            <strong>{achievementsUnlocked.includes(hoveredAchievement.id) ? hoveredAchievement.name : '???'}</strong><br />
            {achievementsUnlocked.includes(hoveredAchievement.id) ?
              hoveredAchievement.description.replace(/cookies/gi, currencyName.toLowerCase()).replace(/cookie/gi, currencyName.toLowerCase())
              : 'Locked'}
          </div>
        )
      }

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <button
          className={`mobile-nav-btn ${mobileTab === 'game' ? 'active' : ''}`}
          onClick={() => setMobileTab('game')}
        >
          🍪 Game
        </button>
        <button
          className={`mobile-nav-btn ${mobileTab === 'menu' ? 'active' : ''}`}
          onClick={() => setMobileTab('menu')}
        >
          🏪 Shop & Stats
        </button>
      </div>
    </div >
  );
}
export default App;
