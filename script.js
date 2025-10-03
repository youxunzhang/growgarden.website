const quickPlanForm = document.querySelector('#quickPlanForm');
const quickPlanResult = document.querySelector('#quickPlanResult');
const spacingForm = document.querySelector('#spacingForm');
const spacingOutput = document.querySelector('#spacingOutput');
const waterForm = document.querySelector('#waterForm');
const waterOutput = document.querySelector('#waterOutput');
const harvestForm = document.querySelector('#harvestForm');
const harvestOutput = document.querySelector('#harvestOutput');

const cropPresets = {
  tomato: { spacing: 0.45, fertilizer: 0.4, water: 3 },
  lettuce: { spacing: 0.25, fertilizer: 0.18, water: 4 },
  pepper: { spacing: 0.35, fertilizer: 0.28, water: 3 },
  cucumber: { spacing: 0.5, fertilizer: 0.32, water: 2 },
};

const cropHarvestDays = {
  tomato: 75,
  lettuce: 45,
  carrot: 70,
  beans: 60,
};

const soilWaterMultiplier = {
  sandy: 1.2,
  loamy: 1,
  clay: 0.8,
};

function formatNumber(num, fractionDigits = 0) {
  return Number.isFinite(num) ? num.toFixed(fractionDigits) : '—';
}

if (quickPlanForm) {
  quickPlanForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(quickPlanForm);
    const area = Number(formData.get('area'));
    const crop = formData.get('crop');

    if (!area || !cropPresets[crop]) {
      updateQuickPlanResult(['—', '—', '—']);
      return;
    }

    const { spacing, fertilizer, water } = cropPresets[crop];
    const plants = Math.max(Math.floor(area / (spacing * spacing)), 1);
    const watering = Math.max(Math.round(water), 1);
    const fertilizerNeed = area * fertilizer;

    updateQuickPlanResult([
      `${plants} 株`,
      `${watering} 次`,
      `${formatNumber(fertilizerNeed, 1)} kg 有机肥`,
    ]);
  });
}

function updateQuickPlanResult(values) {
  quickPlanResult.querySelectorAll('dd').forEach((node, index) => {
    node.textContent = values[index] ?? '—';
  });
}

if (spacingForm) {
  spacingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(spacingForm);
    const length = Number(formData.get('length'));
    const width = Number(formData.get('width'));
    const rowSpacing = Number(formData.get('rowSpacing')) / 100;
    const plantSpacing = Number(formData.get('plantSpacing')) / 100;

    if ([length, width, rowSpacing, plantSpacing].some((value) => !value)) {
      spacingOutput.textContent = '请输入完整的菜床参数。';
      return;
    }

    const rows = Math.floor(width / rowSpacing);
    const plantsPerRow = Math.floor(length / plantSpacing);
    const totalPlants = rows * plantsPerRow;

    if (totalPlants <= 0) {
      spacingOutput.textContent = '菜床尺寸不足以布置当前株距，请调整参数。';
      return;
    }

    spacingOutput.textContent = `可安排 ${rows} 行，每行 ${plantsPerRow} 株，共 ${totalPlants} 株。`;
  });
}

if (waterForm) {
  waterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(waterForm);
    const soil = formData.get('soil');
    const temperature = Number(formData.get('temperature'));
    const rain = Number(formData.get('rain'));

    if (!soil || !Number.isFinite(temperature) || !Number.isFinite(rain)) {
      waterOutput.textContent = '请填写完整的环境条件。';
      return;
    }

    const multiplier = soilWaterMultiplier[soil] ?? 1;
    const baseFrequency = temperature > 30 ? 4 : temperature > 22 ? 3 : 2;
    const rainAdjustment = rain > 25 ? -2 : rain > 15 ? -1 : 0;
    const wateringTimes = Math.max(Math.round((baseFrequency + rainAdjustment) * multiplier), 1);

    waterOutput.textContent = `建议每周浇水 ${wateringTimes} 次，每次保持土壤湿润 15~20 厘米深。`;
  });
}

if (harvestForm) {
  harvestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(harvestForm);
    const crop = formData.get('crop');
    const sowDateRaw = formData.get('sowDate');

    if (!crop || !sowDateRaw) {
      harvestOutput.textContent = '请选择作物并设定播种日期。';
      return;
    }

    const daysToHarvest = cropHarvestDays[crop] ?? 60;
    const sowDate = new Date(sowDateRaw);
    const harvestDate = new Date(sowDate);
    harvestDate.setDate(harvestDate.getDate() + daysToHarvest);

    const options = { month: 'long', day: 'numeric' };
    const sowText = sowDate.toLocaleDateString('zh-CN', options);
    const harvestText = harvestDate.toLocaleDateString('zh-CN', options);

    harvestOutput.textContent = `从 ${sowText} 开始播种，预计 ${daysToHarvest} 天后，即 ${harvestText} 左右可以收获。`;
  });
}

if (quickPlanForm) {
  quickPlanForm.dispatchEvent(new Event('submit'));
}

if (spacingForm) {
  spacingForm.dispatchEvent(new Event('submit'));
}

if (waterForm) {
  waterForm.dispatchEvent(new Event('submit'));
}
