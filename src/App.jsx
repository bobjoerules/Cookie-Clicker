import { useState, useEffect, useCallback } from 'react';
import BigCookie from './components/BigCookie';
import Store from './components/Store';
import FloatingText from './components/FloatingText';
import FallingCookies from './components/FallingCookies';
import Achievements from './components/Achievements';
import AchievementNotification from './components/AchievementNotification';
import Settings from './components/Settings';
import GoldenCookie from './components/GoldenCookie';
import { BUILDINGS } from './data/buildings';
import { UPGRADES } from './data/upgrades';
import { ACHIEVEMENTS } from './data/achievements';
import './App.css';
import './skins.css';
import { getSkinAsset, getThemeMusic } from './utils/assetLoader';
import defaultCookie from './assets/cookie.png';
import WelcomeBackModal from './components/WelcomeBackModal';

const calculateGameCPS = (buildingsOwned, upgradesOwned) => {
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
  return newCps;
};

const AMONG_US_VARIANTS = [
  { id: 1, file: 'cookie.png', color: '#c51111', lightColor: '#c51111', gradient: 'linear-gradient(135deg, #c51111 0%, #7a0a0a 100%)' }, // Red
  { id: 2, file: 'cookie2.png', color: '#ef7d0d', lightColor: '#ef7d0d', gradient: 'linear-gradient(135deg, #ef7d0d 0%, #995008 100%)' }, // Orange
  { id: 3, file: 'cookie3.png', color: '#f5f557', lightColor: '#b1b100', gradient: 'linear-gradient(135deg, #f5f557 0%, #9d9d37 100%)' }, // Yellow
  { id: 4, file: 'cookie4.png', color: '#50ef39', lightColor: '#2d841f', gradient: 'linear-gradient(135deg, #50ef39 0%, #329624 100%)' }, // Light Green
  { id: 5, file: 'cookie5.png', color: '#117f2d', lightColor: '#117f2d', gradient: 'linear-gradient(135deg, #117f2d 0%, #0b511d 100%)' }, // Green
  { id: 6, file: 'cookie6.png', color: '#38fedc', lightColor: '#00a38b', gradient: 'linear-gradient(135deg, #38fedc 0%, #239f8a 100%)' }, // Cyan
  { id: 7, file: 'cookie7.png', color: '#132ed1', lightColor: '#132ed1', gradient: 'linear-gradient(135deg, #132ed1 0%, #0b1d83 100%)' }, // Blue
  { id: 8, file: 'cookie8.png', color: '#6b2fbb', lightColor: '#6b2fbb', gradient: 'linear-gradient(135deg, #6b2fbb 0%, #441d76 100%)' }, // Purple
  { id: 9, file: 'cookie9.png', color: '#ed54ba', lightColor: '#ed54ba', gradient: 'linear-gradient(135deg, #ed54ba 0%, #9e387c 100%)' }, // Pink
  { id: 10, file: 'cookie10.png', color: '#71491e', lightColor: '#71491e', gradient: 'linear-gradient(135deg, #71491e 0%, #472e13 100%)' }, // Brown
  { id: 11, file: 'cookie11.png', color: '#d6e0f0', lightColor: '#333333', gradient: 'linear-gradient(135deg, #d6e0f0 0%, #8ca1bd 100%)' }, // White
  { id: 12, file: 'cookie12.png', color: '#3f474e', lightColor: '#3f474e', gradient: 'linear-gradient(135deg, #3f474e 0%, #1a1e21 100%)' }, // Black
];

const GENSHIN_VARIANTS = [
  { id: 1, file: 'cookie.png', name: 'Mora', color: '#ffbf00', lightColor: '#b8860b', gradient: 'linear-gradient(135deg, #4a78c2 0%, #ffbf00 100%)', lightGradient: 'linear-gradient(135deg, #1976d2 0%, #b8860b 100%)' },
  { id: 2, file: 'cookie2.png', name: 'Primogems', color: '#e16c87', lightColor: '#c2185b', gradient: 'linear-gradient(135deg, #4a78c2 0%, #e16c87 100%)', lightGradient: 'linear-gradient(135deg, #1976d2 0%, #c2185b 100%)' },
  { id: 3, file: 'cookie3.png', name: 'Acquaint Fates', color: '#4a78c2', lightColor: '#1976d2', gradient: 'linear-gradient(135deg, #4a78c2 0%, #8eb3ed 100%)', lightGradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' },
  { id: 4, file: 'cookie4.png', name: 'Intertwined Fates', color: '#b483c6', lightColor: '#7b1fa2', gradient: 'linear-gradient(135deg, #b483c6 0%, #4a78c2 100%)', lightGradient: 'linear-gradient(135deg, #7b1fa2 0%, #1976d2 100%)' },
];

const MINECRAFT_VARIANTS = [
  { id: 1, file: 'cookie.png', name: 'Cookies', color: '#FFD700', lightColor: '#b18a00', gradient: 'linear-gradient(135deg, #8B4513 0%, #FFD700 100%)' },
  { id: 2, file: 'cookie2.png', name: 'Diamonds', color: '#00d9ff', lightColor: '#0097b2', gradient: 'linear-gradient(135deg, #00d9ff 0%, #004d66 100%)' },
  { id: 3, file: 'cookie3.png', name: 'Gold', color: '#ffd700', lightColor: '#b18a00', gradient: 'linear-gradient(135deg, #ffd700 0%, #8a6d00 100%)' },
  { id: 4, file: 'cookie4.png', name: 'Emeralds', color: '#00cc00', lightColor: '#007a00', gradient: 'linear-gradient(135deg, #00cc00 0%, #004d00 100%)' },
  { id: 5, file: 'cookie5.png', name: 'Netherite', color: '#444444', lightColor: '#333333', gradient: 'linear-gradient(135deg, #444444 0%, #1a1a1a 100%)' },
];

const DUOLINGO_VARIANTS = [
  { id: 1, file: 'cookie.png', name: 'Duo', color: '#58CC02', lightColor: '#3d8e01', gradient: 'linear-gradient(135deg, #58CC02 0%, #235401 100%)', lightGradient: 'linear-gradient(135deg, #3d8e01 0%, #1e4501 100%)' },
  { id: 2, file: 'cookie2.png', name: 'Bea', color: '#FF9600', lightColor: '#e65100', gradient: 'linear-gradient(135deg, #FF9600 0%, #cc7800 100%)', lightGradient: 'linear-gradient(135deg, #e65100 0%, #b33f00 100%)' },
  { id: 3, file: 'cookie3.png', name: 'Oscar', color: '#CE82FF', lightColor: '#8e24aa', gradient: 'linear-gradient(135deg, #CE82FF 0%, #a468cc 100%)', lightGradient: 'linear-gradient(135deg, #8e24aa 0%, #6a1b7a 100%)' },
  { id: 4, file: 'cookie4.png', name: 'Lily', color: '#8e44ad', lightColor: '#4a148c', gradient: 'linear-gradient(135deg, #8e44ad 0%, #4a148c 100%)', lightGradient: 'linear-gradient(135deg, #4a148c 0%, #310d5e 100%)' },
  { id: 5, file: 'cookie5.png', name: 'Zari', color: '#FF86D0', lightColor: '#c2185b', gradient: 'linear-gradient(135deg, #FF86D0 0%, #cc6ba6 100%)', lightGradient: 'linear-gradient(135deg, #c2185b 0%, #880e4f 100%)' },
  { id: 6, file: 'cookie6.png', name: 'Falstaff', color: '#1CB0F6', lightColor: '#0288d1', gradient: 'linear-gradient(135deg, #1CB0F6 0%, #168dc5 100%)', lightGradient: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)' },
  { id: 7, file: 'cookie7.png', name: 'Vikram', color: '#2B70C9', lightColor: '#1565c0', gradient: 'linear-gradient(135deg, #2B70C9 0%, #2259a0 100%)', lightGradient: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)' },
  { id: 8, file: 'cookie8.png', name: 'lucy', color: '#FF4B4B', lightColor: '#c62828', gradient: 'linear-gradient(135deg, #FF4B4B 0%, #cc3c3c 100%)', lightGradient: 'linear-gradient(135deg, #c62828 0%, #8e1b1b 100%)' },
  { id: 9, file: 'cookie9.png', name: 'Eddy', color: '#e74c3c', lightColor: '#c0392b', gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', lightGradient: 'linear-gradient(135deg, #c0392b 0%, #962d22 100%)' },
  { id: 10, file: 'cookie10.png', name: 'Lin', color: '#A54752', lightColor: '#880e4f', gradient: 'linear-gradient(135deg, #A54752 0%, #843942 100%)', lightGradient: 'linear-gradient(135deg, #880e4f 0%, #560933 100%)' },
  { id: 11, file: 'cookie11.png', name: 'Junior', color: '#54d1ff', lightColor: '#0091ea', gradient: 'linear-gradient(135deg, #54d1ff 0%, #0091ea 100%)', lightGradient: 'linear-gradient(135deg, #0091ea 0%, #01579b 100%)' },
];

const CHRISTMAS_VARIANTS = [
  {
    id: 1,
    file: 'cookie.png',
    name: 'Presents',
    color: '#FFD700',
    lightColor: '#b71c1c',
    gradient: 'linear-gradient(135deg, #d42426 0%, #FFD700 100%)',
    lightGradient: 'linear-gradient(135deg, #d42426 0%, #b71c1c 100%)',
    bg: 'radial-gradient(circle at center, #2f0a0a 0%, #0a0505 100%)',
    lightBg: 'linear-gradient(135deg, #fff0f0 0%, #fffaf0 100%)',
    glass: 'rgba(212, 36, 38, 0.15)',
    lightGlass: 'rgba(212, 36, 38, 0.05)',
    border: 'rgba(255, 215, 0, 0.5)',
    lightBorder: 'rgba(183, 28, 28, 0.3)'
  },
  {
    id: 2,
    file: 'snow.png',
    name: 'Snowflakes',
    color: '#00FFFF',
    lightColor: '#006994',
    gradient: 'linear-gradient(135deg, #0099ff 0%, #00FFFF 100%)',
    lightGradient: 'linear-gradient(135deg, #0099ff 0%, #006994 100%)',
    bg: 'radial-gradient(circle at center, #0a1a2f 0%, #050a10 100%)',
    lightBg: 'linear-gradient(135deg, #e0f7ff 0%, #f0fbff 100%)',
    glass: 'rgba(0, 153, 255, 0.15)',
    lightGlass: 'rgba(0, 153, 255, 0.05)',
    border: 'rgba(0, 255, 255, 0.5)',
    lightBorder: 'rgba(0, 105, 148, 0.3)'
  },
  {
    id: 3,
    file: 'tree.png',
    name: 'Trees',
    color: '#4CAF50',
    lightColor: '#2e7d32',
    gradient: 'linear-gradient(135deg, #2f5a28 0%, #4CAF50 100%)',
    lightGradient: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
    bg: 'radial-gradient(circle at center, #0a2f1a 0%, #05100a 100%)',
    lightBg: 'linear-gradient(135deg, #f0fff0 0%, #fafffa 100%)',
    glass: 'rgba(47, 90, 40, 0.15)',
    lightGlass: 'rgba(47, 90, 40, 0.05)',
    border: 'rgba(76, 175, 80, 0.5)',
    lightBorder: 'rgba(47, 90, 40, 0.3)'
  },
  {
    id: 4,
    file: 'snowman.png',
    name: 'Snowmen',
    color: '#ffffff',
    lightColor: '#2c3e50',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #a5f2f3 100%)',
    lightGradient: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
    bg: 'radial-gradient(circle at center, #1a2a3a 0%, #0a0f15 100%)',
    lightBg: 'linear-gradient(135deg, #edfaff 0%, #ffffff 100%)',
    glass: 'rgba(255, 255, 255, 0.15)',
    lightGlass: 'rgba(165, 242, 243, 0.05)',
    border: 'rgba(255, 255, 255, 0.6)',
    lightBorder: 'rgba(165, 242, 243, 0.3)'
  },
];
const HALLOWEEN_VARIANTS = [
  {
    id: 1,
    file: 'cookie.png',
    name: 'Pumpkins',
    color: '#ff9a00',
    lightColor: '#e65100',
    gradient: 'linear-gradient(135deg, #ff9a00 0%, #ff4500 100%)',
    lightGradient: 'linear-gradient(135deg, #e65100 0%, #bf360c 100%)',
    bg: 'radial-gradient(circle at center, #1a0a00 0%, #000000 100%)',
    lightBg: 'linear-gradient(135deg, #fff8f0 0%, #fff0e0 100%)',
    glass: 'rgba(255, 154, 0, 0.15)',
    lightGlass: 'rgba(255, 154, 0, 0.05)',
    border: 'rgba(255, 154, 0, 0.5)',
    lightBorder: 'rgba(255, 154, 0, 0.3)'
  },
  {
    id: 2,
    file: 'ghost.png',
    name: 'Ghosts',
    color: '#e0e0e0',
    lightColor: '#6600cc',
    gradient: 'linear-gradient(135deg, #6600cc 0%, #e0e0e0 100%)',
    lightGradient: 'linear-gradient(135deg, #6600cc 0%, #9d00ff 100%)',
    bg: 'radial-gradient(circle at center, #100520 0%, #000000 100%)',
    lightBg: 'linear-gradient(135deg, #f5f0ff 0%, #fafaff 100%)',
    glass: 'rgba(102, 0, 204, 0.15)',
    lightGlass: 'rgba(102, 0, 204, 0.05)',
    border: 'rgba(224, 224, 224, 0.5)',
    lightBorder: 'rgba(102, 0, 204, 0.3)'
  },
  {
    id: 3,
    file: 'bat.png',
    name: 'Bats',
    color: '#bf5fff',
    lightColor: '#7b1fa2',
    gradient: 'linear-gradient(135deg, #9d00ff 0%, #ffffff 100%)',
    lightGradient: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
    bg: 'radial-gradient(circle at center, #050010 0%, #000000 100%)',
    lightBg: 'linear-gradient(135deg, #f8f0ff 0%, #fefaff 100%)',
    glass: 'rgba(157, 0, 255, 0.1)',
    lightGlass: 'rgba(157, 0, 255, 0.05)',
    border: 'rgba(191, 95, 255, 0.6)',
    lightBorder: 'rgba(157, 0, 255, 0.2)'
  },
];

const THANKSGIVING_VARIANTS = [
  {
    id: 1,
    file: 'cookie.png',
    name: 'Pies',
    color: '#ff8c00',
    lightColor: '#e65100',
    gradient: 'linear-gradient(135deg, #d2691e 0%, #ff8c00 100%)',
    lightGradient: 'linear-gradient(135deg, #e65100 0%, #bf360c 100%)',
    bg: 'radial-gradient(circle at center, #2b1505 0%, #100500 100%)',
    lightBg: 'linear-gradient(135deg, #fff6e6 0%, #fffdf0 100%)',
    glass: 'rgba(210, 105, 30, 0.15)',
    lightGlass: 'rgba(210, 105, 30, 0.05)',
    border: 'rgba(255, 140, 0, 0.5)',
    lightBorder: 'rgba(210, 105, 30, 0.3)'
  },
  {
    id: 2,
    file: 'turkey.png',
    name: 'Turkeys',
    color: '#8b4513',
    lightColor: '#5d4037',
    gradient: 'linear-gradient(135deg, #5d2e0a 0%, #8b4513 100%)',
    lightGradient: 'linear-gradient(135deg, #5d4037 0%, #3e2723 100%)',
    bg: 'radial-gradient(circle at center, #1a0d04 0%, #000000 100%)',
    lightBg: 'linear-gradient(135deg, #fdf5e6 0%, #fffaf0 100%)',
    glass: 'rgba(139, 69, 19, 0.2)',
    lightGlass: 'rgba(139, 69, 19, 0.05)',
    border: 'rgba(139, 69, 19, 0.6)',
    lightBorder: 'rgba(139, 69, 19, 0.3)'
  },
  {
    id: 3,
    file: 'leaf.png',
    name: 'Leaves',
    color: '#ffcc00',
    lightColor: '#ff6f00',
    gradient: 'linear-gradient(135deg, #ff4500 0%, #ffcc00 100%)',
    lightGradient: 'linear-gradient(135deg, #ff6f00 0%, #e65100 100%)',
    bg: 'radial-gradient(circle at center, #200a00 0%, #0a0500 100%)',
    lightBg: 'linear-gradient(135deg, #fffdeb 0%, #fff7d1 100%)',
    glass: 'rgba(255, 69, 0, 0.15)',
    lightGlass: 'rgba(255, 69, 0, 0.05)',
    border: 'rgba(255, 204, 0, 0.5)',
    lightBorder: 'rgba(255, 69, 0, 0.3)'
  },
];

const VALENTINES_VARIANTS = [
  {
    id: 1,
    file: 'cookie.png',
    name: 'Chocolates',
    color: '#ff69b4',
    lightColor: '#c2185b',
    gradient: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
    lightGradient: 'linear-gradient(135deg, #c2185b 0%, #880e4f 100%)',
    bg: 'radial-gradient(circle at center, #240510 0%, #100005 100%)',
    lightBg: 'linear-gradient(135deg, #fff0f5 0%, #ffe0f0 100%)',
    glass: 'rgba(255, 105, 180, 0.15)',
    lightGlass: 'rgba(255, 105, 180, 0.05)',
    border: 'rgba(255, 20, 147, 0.5)',
    lightBorder: 'rgba(255, 20, 147, 0.3)'
  },
  {
    id: 2,
    file: 'heart.png',
    name: 'Hearts',
    color: '#ff0000',
    lightColor: '#d32f2f',
    gradient: 'linear-gradient(135deg, #b00000 0%, #ff0000 100%)',
    lightGradient: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
    bg: 'radial-gradient(circle at center, #300000 0%, #100000 100%)',
    lightBg: 'linear-gradient(135deg, #fff0f0 0%, #ffe5e5 100%)',
    glass: 'rgba(255, 0, 0, 0.1)',
    lightGlass: 'rgba(255, 0, 0, 0.03)',
    border: 'rgba(255, 0, 0, 0.5)',
    lightBorder: 'rgba(176, 0, 0, 0.3)'
  },
  {
    id: 3,
    file: 'rose.png',
    name: 'Roses',
    color: '#ff1493',
    lightColor: '#ad1457',
    gradient: 'linear-gradient(135deg, #228b22 0%, #ff1493 100%)',
    lightGradient: 'linear-gradient(135deg, #ad1457 0%, #880e4f 100%)',
    bg: 'radial-gradient(circle at center, #102005 0%, #051000 100%)',
    lightBg: 'linear-gradient(135deg, #f0fff0 0%, #f5fff5 100%)',
    glass: 'rgba(34, 139, 34, 0.15)',
    lightGlass: 'rgba(34, 139, 34, 0.05)',
    border: 'rgba(255, 20, 147, 0.5)',
    lightBorder: 'rgba(34, 139, 34, 0.3)'
  },
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
  const [selectedMilk, setSelectedMilk] = useState('plain');
  const [showMilk, setShowMilk] = useState(localStorage.getItem('showMilk') !== 'false');
  const [skin, setSkin] = useState(localStorage.getItem('gameSkin') || 'default');
  const [amongUsCookieIndex, setAmongUsCookieIndex] = useState(1);
  const [genshinCookieIndex, setGenshinCookieIndex] = useState(1);
  const [minecraftCookieIndex, setMinecraftCookieIndex] = useState(1);
  const [duolingoCookieIndex, setDuolingoCookieIndex] = useState(1);
  const [christmasCookieIndex, setChristmasCookieIndex] = useState(1);
  const [halloweenCookieIndex, setHalloweenCookieIndex] = useState(1);
  const [thanksgivingCookieIndex, setThanksgivingCookieIndex] = useState(1);
  const [valentinesCookieIndex, setValentinesCookieIndex] = useState(1);
  const [goldenCookieVisible, setGoldenCookieVisible] = useState(false);
  const [goldenCookieKey, setGoldenCookieKey] = useState(0);
  const [offlineEarnings, setOfflineEarnings] = useState(0);
  const [offlineTimeSeconds, setOfflineTimeSeconds] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
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

  useEffect(() => {
    document.documentElement.setAttribute('data-skin', skin);
  }, [skin]);
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };


  useEffect(() => {
    const path = window.location.pathname.slice(1).toLowerCase();
    const validSkins = ['default', 'fortnite', 'genshin', 'minecraft', 'amongus', 'pokemon', 'cyberpunk', 'zelda', 'youtube', 'instagram', 'tiktok', 'twitch', 'netflix', 'reddit', 'spotify', 'snapchat', 'xbox', 'playstation', 'steam', 'duolingo', 'google', 'x', 'christmas', 'halloween', 'thanksgiving', 'valentines'];

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
      let iconFile = 'cookie.png';
      if (skin === 'amongus') {
        iconFile = (AMONG_US_VARIANTS.find(v => v.id === amongUsCookieIndex) || AMONG_US_VARIANTS[0]).file;
      } else if (skin === 'genshin') {
        iconFile = (GENSHIN_VARIANTS.find(v => v.id === genshinCookieIndex) || GENSHIN_VARIANTS[0]).file;
      } else if (skin === 'minecraft') {
        iconFile = (MINECRAFT_VARIANTS.find(v => v.id === minecraftCookieIndex) || MINECRAFT_VARIANTS[0]).file;
      } else if (skin === 'apple' && theme === 'light') {
        iconFile = 'cookie2.png';
      } else if (skin === 'x' && theme === 'light') {
        iconFile = 'cookie2.png';
      } else if (skin === 'playstation' && theme === 'light') {
        iconFile = 'cookie2.png';
      } else if (skin === 'duolingo') {
        iconFile = (DUOLINGO_VARIANTS.find(v => v.id === duolingoCookieIndex) || DUOLINGO_VARIANTS[0]).file;
      } else if (skin === 'christmas') {
        iconFile = (CHRISTMAS_VARIANTS.find(v => v.id === christmasCookieIndex) || CHRISTMAS_VARIANTS[0]).file;
      } else if (skin === 'halloween') {
        iconFile = (HALLOWEEN_VARIANTS.find(v => v.id === halloweenCookieIndex) || HALLOWEEN_VARIANTS[0]).file;
      } else if (skin === 'thanksgiving') {
        iconFile = (THANKSGIVING_VARIANTS.find(v => v.id === thanksgivingCookieIndex) || THANKSGIVING_VARIANTS[0]).file;
      } else if (skin === 'valentines') {
        iconFile = (VALENTINES_VARIANTS.find(v => v.id === valentinesCookieIndex) || VALENTINES_VARIANTS[0]).file;
      }
      const skinIcon = getSkinAsset(skin, iconFile);
      link.href = skinIcon || defaultCookie;
    }

    const skinTitles = {
      linux: 'Linux',
      windows: 'Windows',
      android: 'Android',
      apple: 'Apple',
      discord: 'Discord',
      youtube: 'YouTube',
      instagram: 'Instagram',
      tiktok: 'TikTok',
      twitch: 'Twitch',
      netflix: 'Netflix',
      reddit: 'Reddit',
      spotify: 'Spotify',
      snapchat: 'Snapchat',
      xbox: 'Xbox',
      playstation: 'PlayStation',
      steam: 'Steam',
      duolingo: 'Duolingo',
      google: 'Google',
      x: '',
      pokemon: 'Pokémon',
      cyberpunk: 'Cyberpunk',
      zelda: 'Zelda',
      amongus: 'Among Us',
      genshin: 'Genshin',
      christmas: 'Christmas',
      halloween: 'Halloween',
      thanksgiving: 'Thanksgiving',
      valentines: 'Valentines'
    };

    let titleCurrency;
    if (skinTitles[skin]) {
      titleCurrency = skinTitles[skin];
    } else {
      const currentCurrency = getCurrencyName(skin);
      titleCurrency = currentCurrency;
      if (titleCurrency.endsWith('s')) {
        titleCurrency = titleCurrency.slice(0, -1);
      }
    }

    if (skin === 'x') {
      document.title = 'Clicker';
    } else {
      document.title = `${titleCurrency} Clicker`;
    }

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
      twitch: 'Earn Bits and build your streaming empire! Cookie Clicker for streamers.',
      netflix: 'Watch shows and chill! Cookie Clicker with a Netflix theme.',
      reddit: 'Earn Upvotes and hit the front page! Cookie Clicker for Redditors.',
      spotify: 'Get streams and top the charts! Cookie Clicker for music lovers.',
      snapchat: 'Send Snaps and keep your streak! Cookie Clicker with a Snapchat theme.',
      xbox: 'Earn Gamerscore and unlock achievements! Cookie Clicker for Xbox fans.',
      playstation: 'Collect Trophies and reach Platinum! Cookie Clicker for PlayStation fans.',
      steam: 'Earn Steam Points and craft badges! Cookie Clicker for PC gamers.',
      duolingo: 'Learn languages and keep your streak! Cookie Clicker with a Duolingo theme.',
      google: 'Search the web and find answers! Cookie Clicker with a Google theme.',
      x: 'Post thoughts and join the conversation! Cookie Clicker with an X theme.',
      miku: 'Create songs and become a virtual idol! Cookie Clicker with a Hatsune Miku theme.',
      discord: 'Send messages and build your server! Cookie Clicker for Discord mods.',
      apple: 'Earn revenue and build your ecosystem! Cookie Clicker with an Apple aesthetic.',
      android: 'Install apps and customize your system! Cookie Clicker with an Android theme.',
      windows: 'Update your system and avoid blue screens! Cookie Clicker with a Windows theme.',
      linux: 'Compile kernels and customize your distro! Cookie Clicker for Linux users.',
      christmas: 'Merry Christmas! Cookie Clicker with a festive theme.',
      halloween: 'Trick or Treat! Cookie Clicker with a spooky theme.',
      thanksgiving: 'Give thanks and eat pie! Cookie Clicker with a Thanksgiving theme.',
      valentines: 'Love is in the air! Cookie Clicker with a romantic theme.'
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
  }, [
    skin,
    genshinCookieIndex,
    minecraftCookieIndex,
    amongUsCookieIndex,
    duolingoCookieIndex,
    christmasCookieIndex,
    halloweenCookieIndex,
    thanksgivingCookieIndex,
    valentinesCookieIndex,
    theme
  ]);

  useEffect(() => {
    const actualTheme = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;

    let variant = null;
    if (skin === 'amongus') variant = AMONG_US_VARIANTS.find(v => v.id === amongUsCookieIndex) || AMONG_US_VARIANTS[0];
    else if (skin === 'duolingo') variant = DUOLINGO_VARIANTS.find(v => v.id === duolingoCookieIndex) || DUOLINGO_VARIANTS[0];
    else if (skin === 'genshin') variant = GENSHIN_VARIANTS.find(v => v.id === genshinCookieIndex) || GENSHIN_VARIANTS[0];
    else if (skin === 'minecraft') variant = MINECRAFT_VARIANTS.find(v => v.id === minecraftCookieIndex) || MINECRAFT_VARIANTS[0];
    else if (skin === 'christmas') variant = CHRISTMAS_VARIANTS.find(v => v.id === christmasCookieIndex) || CHRISTMAS_VARIANTS[0];
    else if (skin === 'halloween') variant = HALLOWEEN_VARIANTS.find(v => v.id === halloweenCookieIndex) || HALLOWEEN_VARIANTS[0];
    else if (skin === 'thanksgiving') variant = THANKSGIVING_VARIANTS.find(v => v.id === thanksgivingCookieIndex) || THANKSGIVING_VARIANTS[0];
    else if (skin === 'valentines') variant = VALENTINES_VARIANTS.find(v => v.id === valentinesCookieIndex) || VALENTINES_VARIANTS[0];

    if (variant) {
      document.documentElement.style.setProperty('--accent-color', actualTheme === 'light' ? (variant.lightColor || variant.color) : variant.color);

      const targetGradient = actualTheme === 'light' ? (variant.lightGradient || variant.gradient) : variant.gradient;
      if (targetGradient) {
        document.documentElement.style.setProperty('--primary-gradient', targetGradient);
      } else {
        document.documentElement.style.removeProperty('--primary-gradient');
      }

      if (variant.bg) document.documentElement.style.setProperty('--holiday-bg', variant.bg);
      else document.documentElement.style.removeProperty('--holiday-bg');

      if (variant.lightBg) document.documentElement.style.setProperty('--holiday-bg-light', variant.lightBg);
      else document.documentElement.style.removeProperty('--holiday-bg-light');

      if (variant.glass) document.documentElement.style.setProperty('--bg-panel', variant.glass);
      else document.documentElement.style.removeProperty('--bg-panel');

      if (variant.lightGlass) document.documentElement.style.setProperty('--bg-panel-light', variant.lightGlass);
      else document.documentElement.style.removeProperty('--bg-panel-light');

      const targetBorder = actualTheme === 'light' ? (variant.lightBorder || variant.border) : variant.border;
      if (targetBorder) {
        document.documentElement.style.setProperty('--glass-border', targetBorder);
      } else {
        document.documentElement.style.removeProperty('--glass-border');
      }
    } else {
      document.documentElement.style.removeProperty('--accent-color');
      document.documentElement.style.removeProperty('--primary-gradient');
      document.documentElement.style.removeProperty('--holiday-bg');
      document.documentElement.style.removeProperty('--holiday-bg-light');
      document.documentElement.style.removeProperty('--bg-panel');
      document.documentElement.style.removeProperty('--bg-panel-light');
      document.documentElement.style.removeProperty('--glass-border');
    }
  }, [
    skin,
    genshinCookieIndex,
    minecraftCookieIndex,
    amongUsCookieIndex,
    duolingoCookieIndex,
    christmasCookieIndex,
    halloweenCookieIndex,
    thanksgivingCookieIndex,
    valentinesCookieIndex,
    theme
  ]);
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
        setGenshinCookieIndex(state.genshinCookieIndex || 1);
        setMinecraftCookieIndex(state.minecraftCookieIndex || 1);
        setDuolingoCookieIndex(state.duolingoCookieIndex || 1);
        setChristmasCookieIndex(state.christmasCookieIndex || 1);
        setHalloweenCookieIndex(state.halloweenCookieIndex || 1);
        setThanksgivingCookieIndex(state.thanksgivingCookieIndex || 1);
        setValentinesCookieIndex(state.valentinesCookieIndex || 1);

        // Offline earnings calculation
        if (state.lastSaveTime) {
          const now = Date.now();
          const timeDiff = (now - state.lastSaveTime) / 1000;
          if (timeDiff > 60) { // Only if gone for more than 1 minute
            const savedBuildings = state.buildingsOwned || {};
            const savedUpgrades = state.upgradesOwned || [];
            const offlineCps = calculateGameCPS(savedBuildings, savedUpgrades);
            if (offlineCps > 0) {
              const earned = offlineCps * timeDiff * 0.5; // 50% efficiency
              setOfflineEarnings(earned);
              setOfflineTimeSeconds(timeDiff);
              setShowWelcomeModal(true);
              setCookies(prev => prev + earned);
              setCookiesEarned(prev => prev + earned);
            }
          }
        }
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
      amongUsCookieIndex,
      genshinCookieIndex,
      minecraftCookieIndex,
      duolingoCookieIndex,
      christmasCookieIndex,
      halloweenCookieIndex,
      thanksgivingCookieIndex,
      valentinesCookieIndex,
      lastSaveTime: Date.now()
    };

    localStorage.setItem('cookieClickerSave', JSON.stringify(saveState));
    localStorage.setItem('showMilk', showMilk);
  }, [cookies, cookiesEarned, clicks, buildingsOwned, upgradesOwned, achievementsUnlocked, timePlayed, selectedMilk, showMilk, amongUsCookieIndex, genshinCookieIndex, minecraftCookieIndex, duolingoCookieIndex, christmasCookieIndex, halloweenCookieIndex, thanksgivingCookieIndex, valentinesCookieIndex, isLoaded]);
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

  useEffect(() => {
    if (!upgradesOwned.includes('goldenCookie')) return;

    const spawnGoldenCookie = () => {
      setGoldenCookieVisible(true);
      setGoldenCookieKey(prev => prev + 1);
    };

    const randomDelay = () => Math.random() * 150000 + 30000;

    let timeoutId;
    const scheduleNext = () => {
      const delay = randomDelay();
      timeoutId = setTimeout(() => {
        spawnGoldenCookie();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [upgradesOwned]);

  const handleGoldenCookieCollect = () => {
    const bonus = Math.max(cookies * 0.1, cps * 60);
    setCookies(prev => prev + bonus);
    setCookiesEarned(prev => prev + bonus);
    setGoldenCookieVisible(false);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const newText = {
      id: `golden-${Date.now()}`,
      timestamp: Date.now(),
      value: `+${Math.floor(bonus).toLocaleString()} 🪙`,
      x: centerX,
      y: centerY,
      dx: 0
    };
    setFloatingTexts(prev => [...prev, newText]);
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

  const [lastClickTime, setLastClickTime] = useState(0);

  const handleCookieClick = (e) => {
    const now = Date.now();
    const timeDiff = now - lastClickTime;
    setLastClickTime(now);

    if (timeDiff < 20 && timeDiff > 0 && !achievementsUnlocked.includes('autoClicker')) {
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
      genshin: (GENSHIN_VARIANTS.find(v => v.id === genshinCookieIndex) || GENSHIN_VARIANTS[0]).name,
      minecraft: (MINECRAFT_VARIANTS.find(v => v.id === minecraftCookieIndex) || MINECRAFT_VARIANTS[0]).name,
      amongus: 'Crewmates',
      pokemon: 'Poké Balls',
      cyberpunk: 'Eurodollars',
      zelda: 'Rupees',
      youtube: 'Subscribers',
      instagram: 'Likes',
      tiktok: 'Likes',
      twitch: 'Bits',
      netflix: 'Shows',
      reddit: 'Upvotes',
      spotify: 'Streams',
      snapchat: 'Snaps',
      xbox: 'Gamerscore',
      playstation: 'Trophies',
      steam: 'Steam Points',
      duolingo: 'Gems',
      google: 'Searches',
      x: 'Posts',
      miku: 'Leeks',
      discord: 'Messages',
      apple: 'Devices',
      android: 'Robots',
      windows: 'Windows',
      linux: 'Penguins',
      christmas: (CHRISTMAS_VARIANTS.find(v => v.id === christmasCookieIndex) || CHRISTMAS_VARIANTS[0]).name,
      halloween: (HALLOWEEN_VARIANTS.find(v => v.id === halloweenCookieIndex) || HALLOWEEN_VARIANTS[0]).name,
      thanksgiving: (THANKSGIVING_VARIANTS.find(v => v.id === thanksgivingCookieIndex) || THANKSGIVING_VARIANTS[0]).name,
      valentines: (VALENTINES_VARIANTS.find(v => v.id === valentinesCookieIndex) || VALENTINES_VARIANTS[0]).name
    };
    return names[skin] || 'Cookies';
  };

  const currencyName = getCurrencyName(skin);
  const isCentered = !showStats && !showStore;
  const customBackground = getSkinAsset(skin, 'background.png');
  const chocolateImage = getSkinAsset(skin, 'chocolate.png');
  const milkImage = getSkinAsset(skin, 'milk.png');
  const [mobileTab, setMobileTab] = useState('game');

  const getCustomImage = () => {
    if (skin === 'amongus') {
      return getSkinAsset('amongus', (AMONG_US_VARIANTS.find(v => v.id === amongUsCookieIndex) || AMONG_US_VARIANTS[0]).file);
    } else if (skin === 'genshin') {
      return getSkinAsset('genshin', (GENSHIN_VARIANTS.find(v => v.id === genshinCookieIndex) || GENSHIN_VARIANTS[0]).file);
    } else if (skin === 'minecraft') {
      return getSkinAsset('minecraft', (MINECRAFT_VARIANTS.find(v => v.id === minecraftCookieIndex) || MINECRAFT_VARIANTS[0]).file);
    } else if (skin === 'apple' && theme === 'light') {
      return getSkinAsset('apple', 'cookie2.png');
    } else if (skin === 'x' && theme === 'light') {
      return getSkinAsset('x', 'cookie2.png');
    } else if (skin === 'playstation' && theme === 'light') {
      return getSkinAsset('playstation', 'cookie2.png');
    } else if (skin === 'duolingo') {
      return getSkinAsset('duolingo', (DUOLINGO_VARIANTS.find(v => v.id === duolingoCookieIndex) || DUOLINGO_VARIANTS[0]).file);
    } else if (skin === 'christmas') {
      return getSkinAsset('christmas', (CHRISTMAS_VARIANTS.find(v => v.id === christmasCookieIndex) || CHRISTMAS_VARIANTS[0]).file);
    } else if (skin === 'halloween') {
      return getSkinAsset('halloween', (HALLOWEEN_VARIANTS.find(v => v.id === halloweenCookieIndex) || HALLOWEEN_VARIANTS[0]).file);
    } else if (skin === 'thanksgiving') {
      return getSkinAsset('thanksgiving', (THANKSGIVING_VARIANTS.find(v => v.id === thanksgivingCookieIndex) || THANKSGIVING_VARIANTS[0]).file);
    } else if (skin === 'valentines') {
      return getSkinAsset('valentines', (VALENTINES_VARIANTS.find(v => v.id === valentinesCookieIndex) || VALENTINES_VARIANTS[0]).file);
    }
    return null;
  };
  const currentCustomImage = getCustomImage();

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
      <FallingCookies
        cps={cps}
        skin={skin}
        customImage={currentCustomImage}
        theme={theme}
        mode={
          skin === 'christmas' ? christmasCookieIndex :
            skin === 'halloween' ? halloweenCookieIndex :
              skin === 'thanksgiving' ? thanksgivingCookieIndex :
                skin === 'valentines' ? valentinesCookieIndex :
                  skin === 'duolingo' ? duolingoCookieIndex :
                    skin === 'genshin' ? genshinCookieIndex :
                      skin === 'minecraft' ? minecraftCookieIndex :
                        skin === 'amongus' ? amongUsCookieIndex : 1
        }
      /><FloatingText texts={floatingTexts} />
      <AchievementNotification achievement={currentAchievement} skin={skin} currencyName={currencyName} customImage={currentCustomImage} />
      {goldenCookieVisible && (
        <GoldenCookie
          key={goldenCookieKey}
          onCollect={handleGoldenCookieCollect}
          skin={skin}
          mode={
            skin === 'christmas' ? christmasCookieIndex :
              skin === 'halloween' ? halloweenCookieIndex :
                skin === 'thanksgiving' ? thanksgivingCookieIndex :
                  skin === 'valentines' ? valentinesCookieIndex :
                    skin === 'duolingo' ? duolingoCookieIndex :
                      skin === 'genshin' ? genshinCookieIndex :
                        skin === 'minecraft' ? minecraftCookieIndex :
                          skin === 'amongus' ? amongUsCookieIndex : 1
          }
        />
      )}
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
        variantIndices={{
          amongus: amongUsCookieIndex,
          genshin: genshinCookieIndex,
          minecraft: minecraftCookieIndex,
          duolingo: duolingoCookieIndex,
          christmas: christmasCookieIndex,
          halloween: halloweenCookieIndex,
          thanksgiving: thanksgivingCookieIndex,
          valentines: valentinesCookieIndex
        }}
      />
      <WelcomeBackModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        cookiesEarned={offlineEarnings}
        timeOffline={offlineTimeSeconds}
        currencyName={currencyName}
      />
      <div className={`section-toggles ${mobileTab !== 'game' ? 'mobile-hide' : ''}`} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="toggle-btn" onClick={() => setSettingsOpen(true)} title="Settings">
            ⚙️
          </button>
          <button
            className={`toggle-btn desktop-only ${showStats ? 'active' : ''}`}
            onClick={() => setShowStats(!showStats)}
            title="Toggle Stats"
          >
            📊
          </button>
          <button
            className={`toggle-btn desktop-only ${showStore ? 'active' : ''}`}
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

          {skin === 'genshin' && (
            <button
              className="toggle-btn"
              onClick={() => setGenshinCookieIndex(prev => prev >= 4 ? 1 : prev + 1)}
              title="Change Item"
            >
              <img
                src={getSkinAsset('genshin', (GENSHIN_VARIANTS.find(v => v.id === genshinCookieIndex) || GENSHIN_VARIANTS[0]).file)}
                alt="Genshin Item"
                style={{ width: '24px', height: '24px', objectFit: 'contain', verticalAlign: 'middle' }}
              />
            </button>
          )}

          {skin === 'minecraft' && (
            <button
              className="toggle-btn"
              onClick={() => setMinecraftCookieIndex(prev => prev >= 5 ? 1 : prev + 1)}
              title="Change Material"
            >
              <img
                src={getSkinAsset('minecraft', (MINECRAFT_VARIANTS.find(v => v.id === minecraftCookieIndex) || MINECRAFT_VARIANTS[0]).file)}
                alt="Item"
                style={{ width: '24px', height: '24px', objectFit: 'contain', verticalAlign: 'middle' }}
              />
            </button>
          )}

          {skin === 'duolingo' && (
            <button
              className="toggle-btn"
              onClick={() => setDuolingoCookieIndex(prev => prev >= 11 ? 1 : prev + 1)}
              title="Change Character"
            >
              <img
                src={getSkinAsset('duolingo', (DUOLINGO_VARIANTS.find(v => v.id === duolingoCookieIndex) || DUOLINGO_VARIANTS[0]).file)}
                alt="Character"
                style={{ width: '24px', height: '24px', objectFit: 'contain', verticalAlign: 'middle' }}
              />
            </button>
          )}

          {skin === 'christmas' && (
            <button
              className="toggle-btn"
              onClick={() => setChristmasCookieIndex(prev => prev >= 4 ? 1 : prev + 1)}
              title="Change Item"
            >
              <img
                src={getSkinAsset('christmas', (CHRISTMAS_VARIANTS.find(v => v.id === christmasCookieIndex) || CHRISTMAS_VARIANTS[0]).file)}
                alt="Christmas Item"
                style={{ width: '24px', height: '24px', objectFit: 'contain', verticalAlign: 'middle' }}
              />
            </button>
          )}

          {skin === 'halloween' && (
            <button
              className="toggle-btn"
              onClick={() => setHalloweenCookieIndex(prev => prev >= 3 ? 1 : prev + 1)}
              title="Change Item"
            >
              <img
                src={getSkinAsset('halloween', (HALLOWEEN_VARIANTS.find(v => v.id === halloweenCookieIndex) || HALLOWEEN_VARIANTS[0]).file)}
                alt="Halloween Item"
                style={{ width: '24px', height: '24px', objectFit: 'contain', verticalAlign: 'middle' }}
              />
            </button>
          )}

          {skin === 'thanksgiving' && (
            <button
              className="toggle-btn"
              onClick={() => setThanksgivingCookieIndex(prev => prev >= 3 ? 1 : prev + 1)}
              title="Change Item"
            >
              <img
                src={getSkinAsset('thanksgiving', (THANKSGIVING_VARIANTS.find(v => v.id === thanksgivingCookieIndex) || THANKSGIVING_VARIANTS[0]).file)}
                alt="Thanksgiving Item"
                style={{ width: '24px', height: '24px', objectFit: 'contain', verticalAlign: 'middle' }}
              />
            </button>
          )}

          {skin === 'valentines' && (
            <button
              className="toggle-btn"
              onClick={() => setValentinesCookieIndex(prev => prev >= 3 ? 1 : prev + 1)}
              title="Change Item"
            >
              <img
                src={getSkinAsset('valentines', (VALENTINES_VARIANTS.find(v => v.id === valentinesCookieIndex) || VALENTINES_VARIANTS[0]).file)}
                alt="Valentines Item"
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
              {milkImage ? (
                <img
                  src={milkImage}
                  alt="Milk"
                  style={{ width: '24px', height: '24px', objectFit: 'contain', verticalAlign: 'middle' }}
                />
              ) : (
                '🥛'
              )}
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
                {chocolateImage ? (
                  <img
                    src={chocolateImage}
                    alt="Chocolate"
                    style={{ width: '24px', height: '24px', objectFit: 'contain', verticalAlign: 'middle' }}
                  />
                ) : (
                  '🍫'
                )}
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
            {upgradesOwned.includes('coffeeMilk') && (
              <button
                className={`toggle-btn ${showMilk && selectedMilk === 'coffee' ? 'active' : ''}`}
                onClick={() => {
                  if (showMilk && selectedMilk === 'coffee') {
                    setShowMilk(false);
                  } else {
                    setSelectedMilk('coffee');
                    setShowMilk(true);
                  }
                }}
                title="Coffee"
              >
                ☕
              </button>
            )}
          </div>
        )}
      </div>
      <section className={`cookie-section ${mobileTab !== 'game' ? 'mobile-hide' : ''}`}>
        <h1>{formatNumber(cookies)} {currencyName}</h1>
        <p>{formatCPS(cps)} per second</p>
        <div className="cookie-container">
          <BigCookie
            onCookieClick={handleCookieClick}
            skin={skin}
            customImage={currentCustomImage}
          />
        </div>
      </section>
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
                        selectedMilk === 'coffee' ? '#6f4e37' :
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
                        selectedMilk === 'coffee' ? '#6f4e37' :
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
      {
        !isCentered && (
          <div className={`right-column ${mobileTab === 'game' ? 'mobile-hide' : ''}`}>
            { }
            {(showStats || mobileTab === 'stats') && (
              <section className={`stats-section glass-panel ${!showStore ? 'full-height' : ''} ${mobileTab !== 'stats' ? 'mobile-hide' : ''}`}>
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
                  customImage={currentCustomImage}
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
            {(showStore || mobileTab === 'shop') && (
              <section className={`store-section glass-panel ${!showStats ? 'full-height' : ''} ${mobileTab !== 'shop' ? 'mobile-hide' : ''}`}>
                <Store
                  cookies={cookies}
                  buildingsOwned={buildingsOwned}
                  upgradesOwned={upgradesOwned}
                  onPurchase={handlePurchase}
                  onSell={handleSell}
                  onUpgradePurchase={handleUpgradePurchase}
                  skin={skin}
                  customImage={currentCustomImage}
                />
              </section>
            )}
          </div>
        )
      }
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
      <div className="mobile-nav">
        <button
          className={`mobile-nav-btn ${mobileTab === 'game' ? 'active' : ''}`}
          onClick={() => setMobileTab('game')}
        >
          🍪 Game
        </button>
        <button
          className={`mobile-nav-btn ${mobileTab === 'stats' ? 'active' : ''}`}
          onClick={() => setMobileTab('stats')}
        >
          📊 Stats
        </button>
        <button
          className={`mobile-nav-btn ${mobileTab === 'shop' ? 'active' : ''}`}
          onClick={() => setMobileTab('shop')}
        >
          🏪 Shop
        </button>
      </div>
    </div >
  );
}
export default App;
