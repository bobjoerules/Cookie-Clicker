export const ACHIEVEMENTS = [
    {
        id: 'wakeAndBake',
        name: 'Wake and Bake',
        description: 'Bake 1 cookie.',
        condition: (state) => state.cookiesEarned >= 1,
        icon: '🍪'
    },
    {
        id: 'justStarted',
        name: 'Just Started',
        description: 'Play for 1 minute.',
        condition: (state) => state.timePlayed >= 60,
        icon: '🐦'
    },
    {
        id: 'makingDough',
        name: 'Making Dough',
        description: 'Bake 100 cookies.',
        condition: (state) => state.cookiesEarned >= 100,
        icon: '🍞'
    },
    {
        id: 'builder',
        name: 'Builder',
        description: 'Own 10 items.',
        condition: (state) => Object.values(state.buildingsOwned).reduce((a, b) => a + b, 0) >= 10,
        icon: '🏗️'
    },
    {
        id: 'soBaked',
        name: 'So Baked',
        description: 'Bake 1,000 cookies.',
        condition: (state) => state.cookiesEarned >= 1000,
        icon: '🥴'
    },
    {
        id: 'clicktastic',
        name: 'Clicktastic',
        description: 'Click the cookie 1,000 times.',
        condition: (state) => state.clicks >= 1000,
        icon: '👆'
    },
    {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Play for 10 minutes.',
        condition: (state) => state.timePlayed >= 600,
        icon: '⏱️'
    },
    {
        id: 'fledglingBakery',
        name: 'Fledgling Bakery',
        description: 'Bake 10,000 cookies.',
        condition: (state) => state.cookiesEarned >= 10000,
        icon: '🏠'
    },
    {
        id: 'superClicker',
        name: 'Super Clicker',
        description: 'Click the cookie 5,000 times.',
        condition: (state) => state.clicks >= 5000,
        icon: '⚡'
    },
    {
        id: 'affluentBakery',
        name: 'Affluent Bakery',
        description: 'Bake 100,000 cookies.',
        condition: (state) => state.cookiesEarned >= 100000,
        icon: '🏰'
    },
    {
        id: 'committed',
        name: 'Committed',
        description: 'Play for 1 hour.',
        condition: (state) => state.timePlayed >= 3600,
        icon: '⏰'
    },
    {
        id: 'speedClicker',
        name: 'Speed Clicker',
        description: 'Click the cookie 10,000 times.',
        condition: (state) => state.clicks >= 10000,
        icon: '🚀'
    },
    {
        id: 'worldFamousBakery',
        name: 'World-Famous Bakery',
        description: 'Bake 1,000,000 cookies.',
        condition: (state) => state.cookiesEarned >= 1000000,
        icon: '🌍'
    },
    {
        id: 'cookieCollector',
        name: 'Cookie Collector',
        description: 'Bake 5,000,000 cookies.',
        condition: (state) => state.cookiesEarned >= 5000000,
        icon: '🍯'
    },
    {
        id: 'millionaire',
        name: 'Millionaire',
        description: 'Bake 10,000,000 cookies.',
        condition: (state) => state.cookiesEarned >= 10000000,
        icon: '💰'
    },
    {
        id: 'cookieStorm',
        name: 'Cookie Storm',
        description: 'Reach 10,000 cookies per second.',
        condition: (state) => state.cps >= 10000,
        icon: '🌪️'
    },
    {
        id: 'grandmasterBaker',
        name: 'Grandmaster Baker',
        description: 'Bake 100,000,000 cookies.',
        condition: (state) => state.cookiesEarned >= 100000000,
        icon: '👑'
    },
    {
        id: 'marathonBaker',
        name: 'Marathon Baker',
        description: 'Play for 24 hours.',
        condition: (state) => state.timePlayed >= 86400,
        icon: '🏃'
    },
    {
        id: 'grandmasCookies',
        name: 'Grandma\'s Cookies',
        description: 'Own 50 Grandmas.',
        condition: (state) => (state.buildingsOwned['grandma'] || 0) >= 50,
        icon: '👵'
    },
    {
        id: 'farmLife',
        name: 'Farm Life',
        description: 'Own 50 Farms.',
        condition: (state) => (state.buildingsOwned['farm'] || 0) >= 50,
        icon: '🚜'
    },
    {
        id: 'goldRush',
        name: 'Gold Rush',
        description: 'Own 50 Alchemy Labs.',
        condition: (state) => (state.buildingsOwned['alchemyLab'] || 0) >= 50,
        icon: '⚗️'
    },
    {
        id: 'autoClicker',
        name: 'Auto Clicker',
        description: 'Click faster than humanly possible.',
        condition: (state) => false,
        icon: '🤖',
        hidden: true
    }
];