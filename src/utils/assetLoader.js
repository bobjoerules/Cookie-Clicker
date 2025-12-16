const skinAssets = import.meta.glob('../assets/skins/**/*.{png,jpg,jpeg,svg,webp,mp3}', { eager: true });
const defaultAssets = import.meta.glob('../assets/*.{png,jpg,jpeg,svg,webp,mp3}', { eager: true });

export const getSkinAsset = (skin, assetName) => {
    if (!skin || skin === 'default') {
        const path = `../assets/${assetName}`;
        const assetModule = defaultAssets[path];
        if (assetModule) {
            return assetModule.default;
        }
        return null;
    }
    const path = `../assets/skins/${skin}/${assetName}`;
    const assetModule = skinAssets[path];
    if (assetModule) {
        return assetModule.default;
    }
    return null;
};

export const getThemeMusic = (skin) => {
    if (!skin || skin === 'default') {
        const path = Object.keys(defaultAssets).find(p => p.endsWith('.mp3'));
        return path ? defaultAssets[path].default : null;
    }
    const prefix = `../assets/skins/${skin}/`;
    const path = Object.keys(skinAssets).find(p => p.startsWith(prefix) && p.endsWith('.mp3'));
    return path ? skinAssets[path].default : null;
};
