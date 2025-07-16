// 植物数据库
const plantsDatabase = [
    {
        id: 1,
        name: "萝卜",
        category: "vegetables",
        emoji: "🥕",
        baseValue: 50,
        seedCost: 10,
        growthTime: 4,
        seasons: ["spring", "fall"],
        description: "基础蔬菜，生长快速，适合新手"
    },
    {
        id: 2,
        name: "土豆",
        category: "vegetables",
        emoji: "🥔",
        baseValue: 80,
        seedCost: 15,
        growthTime: 6,
        seasons: ["spring", "fall"],
        description: "高产蔬菜，适合大量种植"
    },
    {
        id: 3,
        name: "番茄",
        category: "vegetables",
        emoji: "🍅",
        baseValue: 120,
        seedCost: 25,
        growthTime: 11,
        seasons: ["spring", "summer"],
        description: "高价值蔬菜，需要较长生长时间"
    },
    {
        id: 4,
        name: "草莓",
        category: "fruits",
        emoji: "🍓",
        baseValue: 200,
        seedCost: 50,
        growthTime: 8,
        seasons: ["spring"],
        description: "高价值水果，春季种植最佳"
    },
    {
        id: 5,
        name: "蓝莓",
        category: "fruits",
        emoji: "🫐",
        baseValue: 250,
        seedCost: 80,
        growthTime: 13,
        seasons: ["summer"],
        description: "稀有水果，夏季专属"
    },
    {
        id: 6,
        name: "苹果",
        category: "fruits",
        emoji: "🍎",
        baseValue: 180,
        seedCost: 60,
        growthTime: 28,
        seasons: ["fall"],
        description: "秋季水果，需要较长时间成熟"
    },
    {
        id: 7,
        name: "向日葵",
        category: "flowers",
        emoji: "🌻",
        baseValue: 150,
        seedCost: 30,
        growthTime: 12,
        seasons: ["summer", "fall"],
        description: "美丽的花卉，夏季秋季都可种植"
    },
    {
        id: 8,
        name: "玫瑰",
        category: "flowers",
        emoji: "🌹",
        baseValue: 300,
        seedCost: 100,
        growthTime: 7,
        seasons: ["spring", "summer"],
        description: "高价值花卉，适合送礼"
    },
    {
        id: 9,
        name: "薰衣草",
        category: "herbs",
        emoji: "💜",
        baseValue: 120,
        seedCost: 40,
        growthTime: 7,
        seasons: ["spring", "summer"],
        description: "香草植物，可用于制作精油"
    },
    {
        id: 10,
        name: "薄荷",
        category: "herbs",
        emoji: "🌿",
        baseValue: 80,
        seedCost: 20,
        growthTime: 4,
        seasons: ["spring", "summer", "fall"],
        description: "快速生长的香草，多季节可种"
    },
    {
        id: 11,
        name: "玉米",
        category: "vegetables",
        emoji: "🌽",
        baseValue: 100,
        seedCost: 35,
        growthTime: 14,
        seasons: ["summer"],
        description: "夏季主要作物，产量高"
    },
    {
        id: 12,
        name: "南瓜",
        category: "vegetables",
        emoji: "🎃",
        baseValue: 350,
        seedCost: 120,
        growthTime: 13,
        seasons: ["fall"],
        description: "秋季特色作物，价值很高"
    },
    {
        id: 13,
        name: "葡萄",
        category: "fruits",
        emoji: "🍇",
        baseValue: 280,
        seedCost: 90,
        growthTime: 10,
        seasons: ["summer", "fall"],
        description: "酿酒原料，市场需求大"
    },
    {
        id: 14,
        name: "百合",
        category: "flowers",
        emoji: "🌸",
        baseValue: 200,
        seedCost: 70,
        growthTime: 6,
        seasons: ["spring"],
        description: "春季花卉，象征纯洁"
    },
    {
        id: 15,
        name: "迷迭香",
        category: "herbs",
        emoji: "🌱",
        baseValue: 150,
        seedCost: 50,
        growthTime: 7,
        seasons: ["spring", "summer"],
        description: "烹饪香料，药用价值高"
    },
    {
        id: 16,
        name: "胡萝卜",
        category: "vegetables",
        emoji: "🥕",
        baseValue: 60,
        seedCost: 12,
        growthTime: 5,
        seasons: ["spring", "fall"],
        description: "营养丰富的根茎类蔬菜"
    },
    {
        id: 17,
        name: "洋葱",
        category: "vegetables",
        emoji: "🧅",
        baseValue: 70,
        seedCost: 15,
        growthTime: 7,
        seasons: ["spring", "fall"],
        description: "基础调味蔬菜，需求稳定"
    },
    {
        id: 18,
        name: "大蒜",
        category: "vegetables",
        emoji: "🧄",
        baseValue: 90,
        seedCost: 20,
        growthTime: 8,
        seasons: ["spring", "fall"],
        description: "调味佳品，药用价值高"
    },
    {
        id: 19,
        name: "白菜",
        category: "vegetables",
        emoji: "🥬",
        baseValue: 85,
        seedCost: 18,
        growthTime: 6,
        seasons: ["spring", "fall"],
        description: "常见叶菜，生长快速"
    },
    {
        id: 20,
        name: "菠菜",
        category: "vegetables",
        emoji: "🥬",
        baseValue: 75,
        seedCost: 16,
        growthTime: 5,
        seasons: ["spring", "fall"],
        description: "营养丰富的绿叶蔬菜"
    },
    {
        id: 21,
        name: "生菜",
        category: "vegetables",
        emoji: "🥬",
        baseValue: 65,
        seedCost: 14,
        growthTime: 4,
        seasons: ["spring", "summer", "fall"],
        description: "快速生长的叶菜类"
    },
    {
        id: 22,
        name: "黄瓜",
        category: "vegetables",
        emoji: "🥒",
        baseValue: 110,
        seedCost: 25,
        growthTime: 9,
        seasons: ["spring", "summer"],
        description: "夏季清爽蔬菜"
    },
    {
        id: 23,
        name: "茄子",
        category: "vegetables",
        emoji: "🍆",
        baseValue: 130,
        seedCost: 30,
        growthTime: 10,
        seasons: ["summer"],
        description: "夏季特色蔬菜"
    },
    {
        id: 24,
        name: "辣椒",
        category: "vegetables",
        emoji: "🌶️",
        baseValue: 95,
        seedCost: 22,
        growthTime: 8,
        seasons: ["spring", "summer"],
        description: "调味蔬菜，辣度可调"
    },
    {
        id: 25,
        name: "甜椒",
        category: "vegetables",
        emoji: "🫑",
        baseValue: 105,
        seedCost: 24,
        growthTime: 9,
        seasons: ["spring", "summer"],
        description: "彩色蔬菜，营养丰富"
    },
    {
        id: 26,
        name: "西兰花",
        category: "vegetables",
        emoji: "🥦",
        baseValue: 140,
        seedCost: 32,
        growthTime: 11,
        seasons: ["spring", "fall"],
        description: "营养丰富的十字花科蔬菜"
    },
    {
        id: 27,
        name: "花椰菜",
        category: "vegetables",
        emoji: "🥦",
        baseValue: 135,
        seedCost: 31,
        growthTime: 10,
        seasons: ["spring", "fall"],
        description: "白色花椰菜，口感细腻"
    },
    {
        id: 28,
        name: "芹菜",
        category: "vegetables",
        emoji: "🥬",
        baseValue: 70,
        seedCost: 16,
        growthTime: 6,
        seasons: ["spring", "fall"],
        description: "低热量蔬菜，适合减肥"
    },
    {
        id: 29,
        name: "韭菜",
        category: "vegetables",
        emoji: "🥬",
        baseValue: 55,
        seedCost: 12,
        growthTime: 4,
        seasons: ["spring", "summer", "fall"],
        description: "快速生长的调味蔬菜"
    },
    {
        id: 30,
        name: "莴笋",
        category: "vegetables",
        emoji: "🥬",
        baseValue: 80,
        seedCost: 18,
        growthTime: 7,
        seasons: ["spring", "fall"],
        description: "清脆爽口的叶菜"
    },
    {
        id: 31,
        name: "橙子",
        category: "fruits",
        emoji: "🍊",
        baseValue: 160,
        seedCost: 55,
        growthTime: 25,
        seasons: ["winter"],
        description: "冬季柑橘类水果"
    },
    {
        id: 32,
        name: "柠檬",
        category: "fruits",
        emoji: "🍋",
        baseValue: 140,
        seedCost: 45,
        growthTime: 22,
        seasons: ["winter"],
        description: "酸性水果，调味佳品"
    },
    {
        id: 33,
        name: "香蕉",
        category: "fruits",
        emoji: "🍌",
        baseValue: 120,
        seedCost: 40,
        growthTime: 18,
        seasons: ["summer"],
        description: "热带水果，营养丰富"
    },
    {
        id: 34,
        name: "桃子",
        category: "fruits",
        emoji: "🍑",
        baseValue: 220,
        seedCost: 75,
        growthTime: 20,
        seasons: ["summer"],
        description: "夏季甜美水果"
    },
    {
        id: 35,
        name: "梨子",
        category: "fruits",
        emoji: "🍐",
        baseValue: 170,
        seedCost: 58,
        growthTime: 24,
        seasons: ["fall"],
        description: "秋季水果，口感细腻"
    },
    {
        id: 36,
        name: "樱桃",
        category: "fruits",
        emoji: "🍒",
        baseValue: 300,
        seedCost: 100,
        growthTime: 15,
        seasons: ["spring"],
        description: "春季珍贵水果"
    },
    {
        id: 37,
        name: "李子",
        category: "fruits",
        emoji: "🫐",
        baseValue: 190,
        seedCost: 65,
        growthTime: 19,
        seasons: ["summer"],
        description: "夏季酸甜水果"
    },
    {
        id: 38,
        name: "杏子",
        category: "fruits",
        emoji: "🍑",
        baseValue: 180,
        seedCost: 62,
        growthTime: 17,
        seasons: ["spring"],
        description: "春季早熟水果"
    },
    {
        id: 39,
        name: "石榴",
        category: "fruits",
        emoji: "🍎",
        baseValue: 260,
        seedCost: 85,
        growthTime: 26,
        seasons: ["fall"],
        description: "秋季特色水果"
    },
    {
        id: 40,
        name: "无花果",
        category: "fruits",
        emoji: "🍎",
        baseValue: 240,
        seedCost: 80,
        growthTime: 23,
        seasons: ["summer", "fall"],
        description: "古老水果，营养丰富"
    },
    {
        id: 41,
        name: "郁金香",
        category: "flowers",
        emoji: "🌷",
        baseValue: 180,
        seedCost: 60,
        growthTime: 8,
        seasons: ["spring"],
        description: "春季经典花卉"
    },
    {
        id: 42,
        name: "康乃馨",
        category: "flowers",
        emoji: "🌺",
        baseValue: 220,
        seedCost: 75,
        growthTime: 9,
        seasons: ["spring", "summer"],
        description: "母亲节首选花卉"
    },
    {
        id: 43,
        name: "菊花",
        category: "flowers",
        emoji: "🌼",
        baseValue: 160,
        seedCost: 55,
        growthTime: 10,
        seasons: ["fall"],
        description: "秋季传统花卉"
    },
    {
        id: 44,
        name: "牡丹",
        category: "flowers",
        emoji: "🌸",
        baseValue: 400,
        seedCost: 150,
        growthTime: 14,
        seasons: ["spring"],
        description: "花中之王，价值极高"
    },
    {
        id: 45,
        name: "兰花",
        category: "flowers",
        emoji: "🌺",
        baseValue: 500,
        seedCost: 200,
        growthTime: 16,
        seasons: ["spring", "summer"],
        description: "高雅花卉，稀有珍贵"
    },
    {
        id: 46,
        name: "茉莉花",
        category: "flowers",
        emoji: "🌼",
        baseValue: 280,
        seedCost: 95,
        growthTime: 11,
        seasons: ["spring", "summer"],
        description: "香型花卉，可制茶"
    },
    {
        id: 47,
        name: "栀子花",
        category: "flowers",
        emoji: "🌼",
        baseValue: 320,
        seedCost: 110,
        growthTime: 12,
        seasons: ["spring", "summer"],
        description: "白色香花，观赏价值高"
    },
    {
        id: 48,
        name: "月季",
        category: "flowers",
        emoji: "🌹",
        baseValue: 250,
        seedCost: 85,
        growthTime: 8,
        seasons: ["spring", "summer", "fall"],
        description: "四季常开的花卉"
    },
    {
        id: 49,
        name: "紫罗兰",
        category: "flowers",
        emoji: "💜",
        baseValue: 200,
        seedCost: 70,
        growthTime: 7,
        seasons: ["spring"],
        description: "紫色浪漫花卉"
    },
    {
        id: 50,
        name: "风信子",
        category: "flowers",
        emoji: "🌷",
        baseValue: 190,
        seedCost: 65,
        growthTime: 9,
        seasons: ["spring"],
        description: "球根花卉，香气浓郁"
    },
    {
        id: 51,
        name: "百里香",
        category: "herbs",
        emoji: "🌿",
        baseValue: 130,
        seedCost: 45,
        growthTime: 6,
        seasons: ["spring", "summer"],
        description: "烹饪香料，抗菌作用"
    },
    {
        id: 52,
        name: "罗勒",
        category: "herbs",
        emoji: "🌿",
        baseValue: 110,
        seedCost: 35,
        growthTime: 5,
        seasons: ["spring", "summer"],
        description: "意大利菜常用香料"
    },
    {
        id: 53,
        name: "牛至",
        category: "herbs",
        emoji: "🌿",
        baseValue: 140,
        seedCost: 48,
        growthTime: 7,
        seasons: ["spring", "summer"],
        description: "地中海香料，药用价值高"
    },
    {
        id: 54,
        name: "鼠尾草",
        category: "herbs",
        emoji: "🌿",
        baseValue: 160,
        seedCost: 55,
        growthTime: 8,
        seasons: ["spring", "summer"],
        description: "传统药用植物"
    },
    {
        id: 55,
        name: "马郁兰",
        category: "herbs",
        emoji: "🌿",
        baseValue: 120,
        seedCost: 42,
        growthTime: 6,
        seasons: ["spring", "summer"],
        description: "温和香料，适合烹饪"
    },
    {
        id: 56,
        name: "香茅",
        category: "herbs",
        emoji: "🌿",
        baseValue: 180,
        seedCost: 65,
        growthTime: 9,
        seasons: ["spring", "summer"],
        description: "热带香料，柠檬香气"
    },
    {
        id: 57,
        name: "柠檬草",
        category: "herbs",
        emoji: "🌿",
        baseValue: 170,
        seedCost: 60,
        growthTime: 8,
        seasons: ["spring", "summer"],
        description: "柠檬味香料，可制茶"
    },
    {
        id: 58,
        name: "茴香",
        category: "herbs",
        emoji: "🌿",
        baseValue: 150,
        seedCost: 52,
        growthTime: 7,
        seasons: ["spring", "summer"],
        description: "传统香料，助消化"
    },
    {
        id: 59,
        name: "香菜",
        category: "herbs",
        emoji: "🌿",
        baseValue: 90,
        seedCost: 25,
        growthTime: 4,
        seasons: ["spring", "summer", "fall"],
        description: "快速生长的调味香料"
    },
    {
        id: 60,
        name: "欧芹",
        category: "herbs",
        emoji: "🌿",
        baseValue: 100,
        seedCost: 30,
        growthTime: 5,
        seasons: ["spring", "summer", "fall"],
        description: "西式烹饪常用香料"
    },
    {
        id: 61,
        name: "甜菜根",
        category: "vegetables",
        emoji: "🥕",
        baseValue: 95,
        seedCost: 22,
        growthTime: 8,
        seasons: ["spring", "fall"],
        description: "红色根茎蔬菜，营养丰富"
    },
    {
        id: 62,
        name: "芜菁",
        category: "vegetables",
        emoji: "🥕",
        baseValue: 70,
        seedCost: 16,
        growthTime: 6,
        seasons: ["spring", "fall"],
        description: "传统根茎蔬菜"
    },
    {
        id: 63,
        name: "萝卜",
        category: "vegetables",
        emoji: "🥕",
        baseValue: 65,
        seedCost: 15,
        growthTime: 5,
        seasons: ["spring", "fall"],
        description: "白色萝卜，清脆爽口"
    },
    {
        id: 64,
        name: "红薯",
        category: "vegetables",
        emoji: "🍠",
        baseValue: 120,
        seedCost: 28,
        growthTime: 12,
        seasons: ["spring", "summer"],
        description: "营养丰富的根茎类"
    },
    {
        id: 65,
        name: "山药",
        category: "vegetables",
        emoji: "🍠",
        baseValue: 140,
        seedCost: 35,
        growthTime: 15,
        seasons: ["spring", "summer"],
        description: "传统滋补食材"
    },
    {
        id: 66,
        name: "芋头",
        category: "vegetables",
        emoji: "🍠",
        baseValue: 110,
        seedCost: 26,
        growthTime: 11,
        seasons: ["spring", "summer"],
        description: "淀粉类根茎蔬菜"
    },
    {
        id: 67,
        name: "莲藕",
        category: "vegetables",
        emoji: "🥕",
        baseValue: 160,
        seedCost: 40,
        growthTime: 18,
        seasons: ["summer", "fall"],
        description: "水生蔬菜，营养丰富"
    },
    {
        id: 68,
        name: "荸荠",
        category: "vegetables",
        emoji: "🥕",
        baseValue: 130,
        seedCost: 32,
        growthTime: 14,
        seasons: ["summer", "fall"],
        description: "水生蔬菜，清脆可口"
    },
    {
        id: 69,
        name: "竹笋",
        category: "vegetables",
        emoji: "🎋",
        baseValue: 200,
        seedCost: 50,
        growthTime: 20,
        seasons: ["spring"],
        description: "春季山珍，价值很高"
    },
    {
        id: 70,
        name: "芦笋",
        category: "vegetables",
        emoji: "🥬",
        baseValue: 180,
        seedCost: 45,
        growthTime: 16,
        seasons: ["spring"],
        description: "春季高档蔬菜"
    },
    {
        id: 71,
        name: "柿子",
        category: "fruits",
        emoji: "🍅",
        baseValue: 220,
        seedCost: 75,
        growthTime: 25,
        seasons: ["fall"],
        description: "秋季特色水果"
    },
    {
        id: 72,
        name: "柚子",
        category: "fruits",
        emoji: "🍊",
        baseValue: 180,
        seedCost: 60,
        growthTime: 22,
        seasons: ["winter"],
        description: "冬季柑橘类水果"
    },
    {
        id: 73,
        name: "金桔",
        category: "fruits",
        emoji: "🍊",
        baseValue: 160,
        seedCost: 55,
        growthTime: 20,
        seasons: ["winter"],
        description: "小型柑橘，适合盆栽"
    },
    {
        id: 74,
        name: "枇杷",
        category: "fruits",
        emoji: "🍊",
        baseValue: 240,
        seedCost: 80,
        growthTime: 24,
        seasons: ["spring"],
        description: "春季早熟水果"
    },
    {
        id: 75,
        name: "杨梅",
        category: "fruits",
        emoji: "🍓",
        baseValue: 280,
        seedCost: 95,
        growthTime: 18,
        seasons: ["summer"],
        description: "夏季珍贵水果"
    },
    {
        id: 76,
        name: "桑葚",
        category: "fruits",
        emoji: "🫐",
        baseValue: 200,
        seedCost: 70,
        growthTime: 16,
        seasons: ["summer"],
        description: "夏季浆果，营养丰富"
    },
    {
        id: 77,
        name: "山楂",
        category: "fruits",
        emoji: "🍎",
        baseValue: 150,
        seedCost: 50,
        growthTime: 21,
        seasons: ["fall"],
        description: "秋季酸味水果"
    },
    {
        id: 78,
        name: "枣子",
        category: "fruits",
        emoji: "🍎",
        baseValue: 190,
        seedCost: 65,
        growthTime: 23,
        seasons: ["fall"],
        description: "秋季滋补水果"
    },
    {
        id: 79,
        name: "栗子",
        category: "fruits",
        emoji: "🌰",
        baseValue: 170,
        seedCost: 58,
        growthTime: 26,
        seasons: ["fall"],
        description: "秋季坚果类水果"
    },
    {
        id: 80,
        name: "核桃",
        category: "fruits",
        emoji: "🌰",
        baseValue: 300,
        seedCost: 100,
        growthTime: 30,
        seasons: ["fall"],
        description: "秋季坚果，营养价值高"
    },
    {
        id: 81,
        name: "杏仁",
        category: "fruits",
        emoji: "🌰",
        baseValue: 320,
        seedCost: 110,
        growthTime: 28,
        seasons: ["fall"],
        description: "秋季坚果，健康食品"
    },
    {
        id: 82,
        name: "开心果",
        category: "fruits",
        emoji: "🌰",
        baseValue: 400,
        seedCost: 150,
        growthTime: 32,
        seasons: ["fall"],
        description: "秋季高档坚果"
    },
    {
        id: 83,
        name: "松子",
        category: "fruits",
        emoji: "🌰",
        baseValue: 350,
        seedCost: 120,
        growthTime: 35,
        seasons: ["fall"],
        description: "秋季珍贵坚果"
    },
    {
        id: 84,
        name: "榛子",
        category: "fruits",
        emoji: "🌰",
        baseValue: 280,
        seedCost: 95,
        growthTime: 29,
        seasons: ["fall"],
        description: "秋季传统坚果"
    },
    {
        id: 85,
        name: "夏威夷果",
        category: "fruits",
        emoji: "🌰",
        baseValue: 450,
        seedCost: 180,
        growthTime: 40,
        seasons: ["fall"],
        description: "秋季顶级坚果"
    },
    {
        id: 86,
        name: "腰果",
        category: "fruits",
        emoji: "🌰",
        baseValue: 380,
        seedCost: 140,
        growthTime: 36,
        seasons: ["fall"],
        description: "秋季进口坚果"
    },
    {
        id: 87,
        name: "巴西坚果",
        category: "fruits",
        emoji: "🌰",
        baseValue: 420,
        seedCost: 160,
        growthTime: 38,
        seasons: ["fall"],
        description: "秋季稀有坚果"
    },
    {
        id: 88,
        name: "山核桃",
        category: "fruits",
        emoji: "🌰",
        baseValue: 360,
        seedCost: 130,
        growthTime: 34,
        seasons: ["fall"],
        description: "秋季本土坚果"
    },
    {
        id: 89,
        name: "碧根果",
        category: "fruits",
        emoji: "🌰",
        baseValue: 390,
        seedCost: 145,
        growthTime: 37,
        seasons: ["fall"],
        description: "秋季优质坚果"
    },
    {
        id: 90,
        name: "银杏",
        category: "fruits",
        emoji: "🌰",
        baseValue: 500,
        seedCost: 200,
        growthTime: 50,
        seasons: ["fall"],
        description: "秋季珍贵果实，药用价值极高"
    },
    {
        id: 91,
        name: "人参",
        category: "herbs",
        emoji: "🌿",
        baseValue: 800,
        seedCost: 300,
        growthTime: 60,
        seasons: ["spring"],
        description: "珍贵药材，价值连城"
    },
    {
        id: 92,
        name: "灵芝",
        category: "herbs",
        emoji: "🍄",
        baseValue: 600,
        seedCost: 250,
        growthTime: 45,
        seasons: ["spring", "summer"],
        description: "珍贵菌类，药用价值高"
    },
    {
        id: 93,
        name: "冬虫夏草",
        category: "herbs",
        emoji: "🍄",
        baseValue: 1000,
        seedCost: 500,
        growthTime: 90,
        seasons: ["winter"],
        description: "顶级药材，价值极高"
    },
    {
        id: 94,
        name: "藏红花",
        category: "herbs",
        emoji: "🌺",
        baseValue: 700,
        seedCost: 280,
        growthTime: 55,
        seasons: ["spring"],
        description: "珍贵香料，药用价值高"
    },
    {
        id: 95,
        name: "天麻",
        category: "herbs",
        emoji: "🌿",
        baseValue: 650,
        seedCost: 260,
        growthTime: 50,
        seasons: ["spring"],
        description: "名贵药材，功效显著"
    },
    {
        id: 96,
        name: "何首乌",
        category: "herbs",
        emoji: "🌿",
        baseValue: 550,
        seedCost: 220,
        growthTime: 42,
        seasons: ["spring", "summer"],
        description: "传统药材，滋补养生"
    },
    {
        id: 97,
        name: "当归",
        category: "herbs",
        emoji: "🌿",
        baseValue: 480,
        seedCost: 190,
        growthTime: 38,
        seasons: ["spring"],
        description: "妇科良药，补血养气"
    },
    {
        id: 98,
        name: "黄芪",
        category: "herbs",
        emoji: "🌿",
        baseValue: 520,
        seedCost: 210,
        growthTime: 40,
        seasons: ["spring"],
        description: "补气良药，增强免疫"
    },
    {
        id: 99,
        name: "枸杞",
        category: "herbs",
        emoji: "🌿",
        baseValue: 450,
        seedCost: 180,
        growthTime: 35,
        seasons: ["spring", "summer"],
        description: "滋补佳品，明目养肝"
    },
    {
        id: 100,
        name: "金银花",
        category: "herbs",
        emoji: "🌼",
        baseValue: 380,
        seedCost: 150,
        growthTime: 30,
        seasons: ["spring", "summer"],
        description: "清热解毒，药用价值高"
    }
];

// 季节映射
const seasonMap = {
    "spring": "春季",
    "summer": "夏季", 
    "fall": "秋季",
    "winter": "冬季"
};

// 类别映射
const categoryMap = {
    "vegetables": "蔬菜",
    "fruits": "水果",
    "flowers": "花卉",
    "herbs": "草药"
};

// DOM 元素
const plantSelect = document.getElementById('plant-select');
const quantityInput = document.getElementById('quantity');
const qualitySelect = document.getElementById('quality');
const seasonSelect = document.getElementById('season');
const calculateBtn = document.getElementById('calculate-btn');

// 结果元素
const baseValueEl = document.getElementById('base-value');
const qualityBonusEl = document.getElementById('quality-bonus');
const seasonBonusEl = document.getElementById('season-bonus');
const totalValueEl = document.getElementById('total-value');
const seedCostEl = document.getElementById('seed-cost');
const netProfitEl = document.getElementById('net-profit');
const profitMarginEl = document.getElementById('profit-margin');

// 搜索和过滤元素
const plantSearch = document.getElementById('plant-search');
const categoryFilter = document.getElementById('category-filter');
const plantsGrid = document.getElementById('plants-grid');

// 导航元素
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    populatePlantSelect();
    populatePlantsGrid();
    setupEventListeners();
    setupNavigation();
}

// 填充植物选择下拉框
function populatePlantSelect() {
    plantsDatabase.forEach(plant => {
        const option = document.createElement('option');
        option.value = plant.id;
        option.textContent = `${plant.emoji} ${plant.name} (${plant.baseValue}金币)`;
        plantSelect.appendChild(option);
    });
}

// 填充植物图鉴网格
function populatePlantsGrid(filteredPlants = plantsDatabase) {
    plantsGrid.innerHTML = '';
    
    filteredPlants.forEach(plant => {
        const plantCard = createPlantCard(plant);
        plantsGrid.appendChild(plantCard);
    });
}

// 创建植物卡片
function createPlantCard(plant) {
    const card = document.createElement('div');
    card.className = 'plant-card';
    
    const seasons = plant.seasons.map(season => seasonMap[season]).join(', ');
    
    card.innerHTML = `
        <div class="plant-image">
            ${plant.emoji}
        </div>
        <div class="plant-info">
            <div class="plant-name">${plant.name}</div>
            <div class="plant-category">${categoryMap[plant.category]} • ${seasons}</div>
            <div class="plant-stats">
                <div class="plant-stat">
                    <div class="plant-stat-value">${plant.baseValue}</div>
                    <div class="plant-stat-label">基础价值</div>
                </div>
                <div class="plant-stat">
                    <div class="plant-stat-value">${plant.seedCost}</div>
                    <div class="plant-stat-label">种子成本</div>
                </div>
                <div class="plant-stat">
                    <div class="plant-stat-value">${plant.growthTime}</div>
                    <div class="plant-stat-label">生长天数</div>
                </div>
                <div class="plant-stat">
                    <div class="plant-stat-value">${Math.round((plant.baseValue - plant.seedCost) / plant.seedCost * 100)}%</div>
                    <div class="plant-stat-label">利润率</div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// 设置事件监听器
function setupEventListeners() {
    // 计算按钮
    calculateBtn.addEventListener('click', calculateValue);
    
    // 搜索功能
    plantSearch.addEventListener('input', filterPlants);
    categoryFilter.addEventListener('change', filterPlants);
    
    // 实时计算（当输入改变时）
    plantSelect.addEventListener('change', calculateValue);
    quantityInput.addEventListener('input', calculateValue);
    qualitySelect.addEventListener('change', calculateValue);
    seasonSelect.addEventListener('change', calculateValue);
}

// 设置导航功能
function setupNavigation() {
    // 汉堡菜单
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 移除所有活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            
            // 添加当前活动状态
            link.classList.add('active');
            
            // 关闭移动端菜单
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // 平滑滚动到目标区域
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // 滚动时更新导航状态
    window.addEventListener('scroll', updateNavigationOnScroll);
}

// 滚动时更新导航状态
function updateNavigationOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// 过滤植物
function filterPlants() {
    const searchTerm = plantSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    const filteredPlants = plantsDatabase.filter(plant => {
        const matchesSearch = plant.name.toLowerCase().includes(searchTerm) ||
                            plant.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || plant.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    populatePlantsGrid(filteredPlants);
}

// 计算价值
function calculateValue() {
    const selectedPlantId = parseInt(plantSelect.value);
    const quantity = parseInt(quantityInput.value) || 0;
    const qualityMultiplier = parseFloat(qualitySelect.value);
    const seasonMultiplier = parseFloat(seasonSelect.value);
    
    if (!selectedPlantId || quantity <= 0) {
        resetResults();
        return;
    }
    
    const plant = plantsDatabase.find(p => p.id === selectedPlantId);
    if (!plant) {
        resetResults();
        return;
    }
    
    // 计算各项价值
    const baseValue = plant.baseValue * quantity;
    const qualityBonus = baseValue * (qualityMultiplier - 1);
    const seasonBonus = baseValue * (seasonMultiplier - 1);
    const totalValue = baseValue + qualityBonus + seasonBonus;
    
    // 计算利润
    const totalSeedCost = plant.seedCost * quantity;
    const netProfit = totalValue - totalSeedCost;
    const profitMargin = totalSeedCost > 0 ? (netProfit / totalSeedCost) * 100 : 0;
    
    // 更新显示
    updateResults({
        baseValue,
        qualityBonus,
        seasonBonus,
        totalValue,
        totalSeedCost,
        netProfit,
        profitMargin
    });
}

// 更新结果显示
function updateResults(results) {
    baseValueEl.textContent = `${results.baseValue} 金币`;
    qualityBonusEl.textContent = `${Math.round(results.qualityBonus)} 金币`;
    seasonBonusEl.textContent = `${Math.round(results.seasonBonus)} 金币`;
    totalValueEl.textContent = `${Math.round(results.totalValue)} 金币`;
    seedCostEl.textContent = `${results.totalSeedCost} 金币`;
    netProfitEl.textContent = `${Math.round(results.netProfit)} 金币`;
    profitMarginEl.textContent = `${Math.round(results.profitMargin)}%`;
    
    // 根据利润设置颜色
    const profitColor = results.netProfit >= 0 ? '#4CAF50' : '#f44336';
    netProfitEl.style.color = profitColor;
    profitMarginEl.style.color = profitColor;
}

// 重置结果
function resetResults() {
    baseValueEl.textContent = '0 金币';
    qualityBonusEl.textContent = '0 金币';
    seasonBonusEl.textContent = '0 金币';
    totalValueEl.textContent = '0 金币';
    seedCostEl.textContent = '0 金币';
    netProfitEl.textContent = '0 金币';
    profitMarginEl.textContent = '0%';
    
    netProfitEl.style.color = '#4CAF50';
    profitMarginEl.style.color = '#4CAF50';
}

// 添加一些动画效果
function addAnimationEffects() {
    // 为植物卡片添加进入动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有植物卡片
    document.querySelectorAll('.plant-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// 页面加载完成后添加动画效果
window.addEventListener('load', addAnimationEffects);

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        plantSearch.focus();
    }
    
    // Enter 键在搜索框中时触发计算
    if (e.key === 'Enter' && document.activeElement === plantSearch) {
        calculateValue();
    }
});

// 添加工具提示
function addTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// 初始化工具提示
document.addEventListener('DOMContentLoaded', addTooltips);

// 添加本地存储功能
function saveCalculation(calculation) {
    const savedCalculations = JSON.parse(localStorage.getItem('gardenCalculations') || '[]');
    savedCalculations.unshift({
        ...calculation,
        timestamp: new Date().toISOString()
    });
    
    // 只保留最近10次计算
    if (savedCalculations.length > 10) {
        savedCalculations.splice(10);
    }
    
    localStorage.setItem('gardenCalculations', JSON.stringify(savedCalculations));
}

// 获取保存的计算记录
function getSavedCalculations() {
    return JSON.parse(localStorage.getItem('gardenCalculations') || '[]');
}

// 在计算时保存记录
const originalCalculateValue = calculateValue;
calculateValue = function() {
    const result = originalCalculateValue();
    
    // 保存计算记录
    const selectedPlantId = parseInt(plantSelect.value);
    if (selectedPlantId) {
        const plant = plantsDatabase.find(p => p.id === selectedPlantId);
        const quantity = parseInt(quantityInput.value) || 0;
        
        if (plant && quantity > 0) {
            saveCalculation({
                plantName: plant.name,
                quantity: quantity,
                quality: qualitySelect.value,
                season: seasonSelect.value,
                totalValue: parseFloat(totalValueEl.textContent)
            });
        }
    }
    
    return result;
}; 