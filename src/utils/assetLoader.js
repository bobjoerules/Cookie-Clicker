const skinAssets = import.meta.glob('../assets/skins/**/*.{png,jpg,jpeg,svg,webp,mp3}', { eager: true });
const defaultAssets = import.meta.glob('../assets/*.mp3', { eager: true });

export const getSkinAsset = (skin, assetName) => {
    if (!skin || skin === 'default') return null;
    const path = `../assets/skins/${skin}/${assetName}`;
    const assetModule = skinAssets[path];
    if (assetModule) {
        return assetModule.default;
    }
    return null;
};

export const getThemeMusic = (skin) => {
    if (!skin || skin === 'default') {
        // Find any mp3 in the default assets folder
        const path = Object.keys(defaultAssets).find(p => p.endsWith('.mp3'));
        return path ? defaultAssets[path].default : null;
    }

    // Find any mp3 in the specific skin folder
    const prefix = `../assets/skins/${skin}/`;
    const path = Object.keys(skinAssets).find(p => p.startsWith(prefix) && p.endsWith('.mp3'));
    return path ? skinAssets[path].default : null;
};
