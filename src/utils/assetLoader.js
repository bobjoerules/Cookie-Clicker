const skinAssets = import.meta.glob('../assets/skins/**/*.{png,jpg,jpeg,svg,webp}', { eager: true });
export const getSkinAsset = (skin, assetName) => {
    if (!skin || skin === 'default') return null;
    const path = `../assets/skins/${skin}/${assetName}`;
    const assetModule = skinAssets[path];
    if (assetModule) {
        return assetModule.default;
    }
    return null;
};
