/**
 * Additive information database
 * Contains details about food additives, their health effects, and concerns
 */

export interface AdditiveInfo {
  code: string;
  name: string;
  category: string;
  concern: 'low' | 'moderate' | 'high' | 'very_high';
  description: string;
  healthEffects: string[];
  whyAvoid: string[];
  benefits?: string[];
  alternatives?: string;
}

export const ADDITIVES_DATABASE: Record<string, AdditiveInfo> = {
  'E322': {
    code: 'E322',
    name: 'Lecithins',
    category: 'Emulsifier',
    concern: 'low',
    description: 'Natural emulsifier derived from soybeans, sunflowers, or eggs. Generally considered safe.',
    healthEffects: [
      'May help with cholesterol levels',
      'Generally well-tolerated',
      'Rare allergic reactions in sensitive individuals'
    ],
    whyAvoid: [
      'May contain traces of allergens (soy, eggs)',
      'Often derived from genetically modified soy'
    ],
    alternatives: 'Look for products without emulsifiers or use natural alternatives'
  },
  'E322I': {
    code: 'E322I',
    name: 'Lecithins (Soy)',
    category: 'Emulsifier',
    concern: 'moderate',
    description: 'Soy-derived lecithin used as an emulsifier. May contain GMO soy and allergens.',
    healthEffects: [
      'Possible allergic reactions in soy-sensitive individuals',
      'May contain traces of pesticides if not organic',
      'Often from genetically modified sources'
    ],
    whyAvoid: [
      'Soy allergy risk',
      'GMO concerns',
      'May contain pesticide residues',
      'Highly processed ingredient'
    ],
    alternatives: 'Choose products with organic lecithin or no emulsifiers'
  },
  'E621': {
    code: 'E621',
    name: 'Monosodium Glutamate (MSG)',
    category: 'Flavor Enhancer',
    concern: 'moderate',
    description: 'Common flavor enhancer that can cause reactions in sensitive individuals.',
    healthEffects: [
      'May cause headaches in sensitive people',
      'Can trigger migraines',
      'May cause nausea or dizziness',
      'Linked to increased appetite'
    ],
    whyAvoid: [
      'Can cause adverse reactions',
      'May increase food cravings',
      'Often used to mask low-quality ingredients',
      'May contribute to overeating'
    ],
    alternatives: 'Use natural flavor enhancers like herbs, spices, or umami-rich foods'
  },
  'E951': {
    code: 'E951',
    name: 'Aspartame',
    category: 'Artificial Sweetener',
    concern: 'very_high',
    description: 'Artificial sweetener that has been controversial due to potential health risks.',
    healthEffects: [
      'May cause headaches and migraines',
      'Linked to mood changes',
      'Potential neurological effects',
      'May affect gut bacteria'
    ],
    whyAvoid: [
      'Controversial safety profile',
      'May cause adverse reactions',
      'Linked to increased cravings for sweet foods',
      'May disrupt natural appetite regulation',
      'Potential long-term health concerns'
    ],
    alternatives: 'Use natural sweeteners like stevia, honey, or maple syrup in moderation'
  },
  'E952': {
    code: 'E952',
    name: 'Cyclamate',
    category: 'Artificial Sweetener',
    concern: 'high',
    description: 'Artificial sweetener banned in some countries due to safety concerns.',
    healthEffects: [
      'Banned in US due to cancer concerns',
      'May cause digestive issues',
      'Potential long-term health risks'
    ],
    whyAvoid: [
      'Banned in multiple countries',
      'Safety concerns',
      'May cause digestive problems',
      'Limited long-term safety data'
    ],
    alternatives: 'Choose products with natural sweeteners or no added sweeteners'
  },
  'E954': {
    code: 'E954',
    name: 'Saccharin',
    category: 'Artificial Sweetener',
    concern: 'moderate',
    description: 'One of the oldest artificial sweeteners, with some safety concerns.',
    healthEffects: [
      'May have bitter aftertaste',
      'Potential bladder concerns in high doses',
      'May affect taste perception'
    ],
    whyAvoid: [
      'Safety concerns in high doses',
      'May increase cravings for sweet foods',
      'Artificial taste',
      'May disrupt natural appetite'
    ],
    alternatives: 'Use natural sweeteners or reduce overall sweetness'
  },
  'E102': {
    code: 'E102',
    name: 'Tartrazine (Yellow 5)',
    category: 'Artificial Color',
    concern: 'high',
    description: 'Yellow artificial food coloring linked to hyperactivity and allergic reactions.',
    healthEffects: [
      'Linked to hyperactivity in children',
      'May cause allergic reactions',
      'Can trigger asthma attacks',
      'May cause skin rashes'
    ],
    whyAvoid: [
      'Hyperactivity in children',
      'Allergic reactions',
      'Asthma triggers',
      'No nutritional value',
      'Purely cosmetic ingredient'
    ],
    alternatives: 'Choose products with natural colors from fruits and vegetables'
  },
  'E104': {
    code: 'E104',
    name: 'Quinoline Yellow',
    category: 'Artificial Color',
    concern: 'high',
    description: 'Yellow food coloring that may cause allergic reactions and hyperactivity.',
    healthEffects: [
      'May cause allergic reactions',
      'Linked to hyperactivity',
      'Potential skin sensitivity',
      'Asthma triggers'
    ],
    whyAvoid: [
      'Hyperactivity concerns',
      'Allergic reactions',
      'No health benefits',
      'Purely for appearance'
    ],
    alternatives: 'Look for naturally colored products'
  },
  'E110': {
    code: 'E110',
    name: 'Sunset Yellow (Yellow 6)',
    category: 'Artificial Color',
    concern: 'high',
    description: 'Orange-yellow food coloring associated with hyperactivity and allergic reactions.',
    healthEffects: [
      'Hyperactivity in children',
      'Allergic reactions',
      'May cause skin rashes',
      'Asthma triggers'
    ],
    whyAvoid: [
      'Behavioral effects in children',
      'Allergic reactions',
      'No nutritional value',
      'Artificial coloring'
    ],
    alternatives: 'Choose naturally colored foods'
  },
  'E122': {
    code: 'E122',
    name: 'Azorubine (Carmoisine)',
    category: 'Artificial Color',
    concern: 'high',
    description: 'Red food coloring that may cause allergic reactions and hyperactivity.',
    healthEffects: [
      'Hyperactivity in children',
      'Allergic reactions',
      'May cause skin irritation',
      'Asthma concerns'
    ],
    whyAvoid: [
      'Behavioral effects',
      'Allergic reactions',
      'Purely cosmetic',
      'No health benefits'
    ],
    alternatives: 'Use natural red colors from beets or berries'
  },
  'E124': {
    code: 'E124',
    name: 'Ponceau 4R (Red 7)',
    category: 'Artificial Color',
    concern: 'high',
    description: 'Red food coloring linked to hyperactivity and allergic reactions.',
    healthEffects: [
      'Hyperactivity in children',
      'Allergic reactions',
      'Skin sensitivity',
      'Asthma triggers'
    ],
    whyAvoid: [
      'Behavioral effects',
      'Allergic reactions',
      'Artificial coloring',
      'No nutritional value'
    ],
    alternatives: 'Choose products with natural red colors'
  },
  'E129': {
    code: 'E129',
    name: 'Allura Red (Red 40)',
    category: 'Artificial Color',
    concern: 'high',
    description: 'Red food coloring that may cause hyperactivity and allergic reactions.',
    healthEffects: [
      'Hyperactivity in children',
      'Allergic reactions',
      'May cause skin rashes',
      'Potential behavioral effects'
    ],
    whyAvoid: [
      'Hyperactivity concerns',
      'Allergic reactions',
      'No health benefits',
      'Purely for appearance'
    ],
    alternatives: 'Use natural red colors from fruits and vegetables'
  },
  'E211': {
    code: 'E211',
    name: 'Sodium Benzoate',
    category: 'Preservative',
    concern: 'moderate',
    description: 'Common preservative that may form benzene when combined with vitamin C.',
    healthEffects: [
      'May form benzene (carcinogen) with vitamin C',
      'Potential hyperactivity in children',
      'May cause allergic reactions',
      'Can trigger asthma'
    ],
    whyAvoid: [
      'Benzene formation risk',
      'Hyperactivity concerns',
      'Allergic reactions',
      'Asthma triggers'
    ],
    alternatives: 'Choose products with natural preservatives or no preservatives'
  },
  'E220': {
    code: 'E220',
    name: 'Sulfur Dioxide',
    category: 'Preservative',
    concern: 'high',
    description: 'Preservative that can cause severe reactions in sensitive individuals, especially asthmatics.',
    healthEffects: [
      'Severe asthma attacks',
      'Breathing difficulties',
      'Headaches and nausea',
      'Allergic reactions'
    ],
    whyAvoid: [
      'Dangerous for asthmatics',
      'Severe allergic reactions',
      'Breathing problems',
      'Headaches and nausea'
    ],
    alternatives: 'Avoid if you have asthma or sulfite sensitivity'
  },
  'E249': {
    code: 'E249',
    name: 'Potassium Nitrite',
    category: 'Preservative',
    concern: 'very_high',
    description: 'Preservative used in processed meats, linked to cancer risk when consumed in high amounts.',
    healthEffects: [
      'Linked to increased cancer risk',
      'May form nitrosamines (carcinogens)',
      'Can cause headaches',
      'Potential cardiovascular effects'
    ],
    whyAvoid: [
      'Cancer risk',
      'Forms carcinogenic compounds',
      'No safe level established',
      'Better to avoid processed meats'
    ],
    alternatives: 'Choose fresh, unprocessed meats without nitrites'
  },
  'E250': {
    code: 'E250',
    name: 'Sodium Nitrite',
    category: 'Preservative',
    concern: 'very_high',
    description: 'Common in processed meats, can form cancer-causing nitrosamines.',
    healthEffects: [
      'Increased cancer risk',
      'Forms nitrosamines (carcinogens)',
      'May cause headaches',
      'Potential long-term health risks'
    ],
    whyAvoid: [
      'Cancer risk',
      'Carcinogenic compound formation',
      'No safe consumption level',
      'Avoid processed meats'
    ],
    alternatives: 'Choose nitrate/nitrite-free processed meats or fresh alternatives'
  },
  'E251': {
    code: 'E251',
    name: 'Sodium Nitrate',
    category: 'Preservative',
    concern: 'very_high',
    description: 'Preservative in processed meats that can convert to nitrites and form carcinogens.',
    healthEffects: [
      'Converts to nitrites in body',
      'Forms cancer-causing compounds',
      'Increased cancer risk',
      'Long-term health concerns'
    ],
    whyAvoid: [
      'Cancer risk',
      'Forms carcinogenic nitrosamines',
      'Better to avoid',
      'No safe level'
    ],
    alternatives: 'Choose fresh meats or nitrate-free processed options'
  },
  'E252': {
    code: 'E252',
    name: 'Potassium Nitrate',
    category: 'Preservative',
    concern: 'very_high',
    description: 'Preservative that can form cancer-causing compounds in processed meats.',
    healthEffects: [
      'Forms nitrosamines (carcinogens)',
      'Increased cancer risk',
      'Long-term health concerns',
      'No established safe level'
    ],
    whyAvoid: [
      'Cancer risk',
      'Carcinogenic compound formation',
      'Avoid processed meats',
      'Better alternatives available'
    ],
    alternatives: 'Choose fresh, unprocessed meats'
  },
  'E150D': {
    code: 'E150D',
    name: 'Caramel Color IV (Ammonia Sulfite Process)',
    category: 'Artificial Color',
    concern: 'moderate',
    description: 'Caramel coloring made using ammonia and sulfites. May contain compounds of concern.',
    healthEffects: [
      'May contain 4-methylimidazole (4-MEI)',
      'Potential carcinogenic compounds',
      'May cause allergic reactions in sulfite-sensitive individuals',
      'Linked to hyperactivity in some studies'
    ],
    whyAvoid: [
      'Contains potentially harmful compounds',
      'Sulfite sensitivity risk',
      'No nutritional value',
      'Purely for appearance',
      'Better alternatives available'
    ],
    alternatives: 'Choose products with natural coloring or caramel made without ammonia'
  },
  'E170': {
    code: 'E170',
    name: 'Calcium Carbonate',
    category: 'Acidity Regulator / Color',
    concern: 'low',
    description: 'Natural mineral compound used as an acidity regulator and white colorant. Generally safe.',
    healthEffects: [
      'Generally recognized as safe',
      'Source of calcium',
      'May help with bone health',
      'Rare digestive issues in high amounts'
    ],
    whyAvoid: [
      'No significant concerns for most people',
      'May cause constipation in excessive amounts',
      'Can interfere with iron absorption if taken with meals'
    ],
    benefits: [
      'Provides calcium',
      'Natural mineral',
      'Generally safe'
    ],
    alternatives: 'No need to avoid - generally safe additive'
  },
  'E412': {
    code: 'E412',
    name: 'Guar Gum',
    category: 'Thickener / Stabilizer',
    concern: 'low',
    description: 'Natural thickener derived from guar beans. Generally safe and may have health benefits.',
    healthEffects: [
      'May help lower cholesterol',
      'Can aid digestion',
      'May help with blood sugar control',
      'Generally well-tolerated',
      'Rare digestive issues in high amounts'
    ],
    whyAvoid: [
      'May cause bloating in sensitive individuals',
      'Can interfere with nutrient absorption in very high doses',
      'May cause digestive discomfort if consumed in excess'
    ],
    benefits: [
      'Natural plant-based thickener',
      'May have health benefits',
      'Generally safe'
    ],
    alternatives: 'No need to avoid - natural and generally safe'
  },
  'E451': {
    code: 'E451',
    name: 'Triphosphates',
    category: 'Emulsifier / Stabilizer',
    concern: 'moderate',
    description: 'Phosphate compounds used as emulsifiers and stabilizers. High phosphate intake may be concerning.',
    healthEffects: [
      'High phosphate intake may affect bone health',
      'May contribute to cardiovascular issues',
      'Can interfere with mineral absorption',
      'May affect kidney function in sensitive individuals'
    ],
    whyAvoid: [
      'High phosphate intake concerns',
      'May affect bone density',
      'Can interfere with calcium absorption',
      'Better to limit processed foods with phosphates'
    ],
    alternatives: 'Choose products with natural emulsifiers or limit processed foods'
  },
  'E500': {
    code: 'E500',
    name: 'Sodium Carbonate',
    category: 'Acidity Regulator / Raising Agent',
    concern: 'low',
    description: 'Common baking soda compound used as an acidity regulator. Generally safe in normal amounts.',
    healthEffects: [
      'Generally recognized as safe',
      'Common in baking',
      'May help with acid reflux in small amounts',
      'High amounts may cause digestive issues'
    ],
    whyAvoid: [
      'No significant concerns in normal amounts',
      'High sodium content',
      'May cause digestive issues in excessive amounts'
    ],
    benefits: [
      'Natural compound',
      'Common in baking',
      'Generally safe'
    ],
    alternatives: 'No need to avoid - commonly used and generally safe'
  },
  'E501': {
    code: 'E501',
    name: 'Potassium Carbonate',
    category: 'Acidity Regulator / Raising Agent',
    concern: 'low',
    description: 'Potassium salt used as an acidity regulator. Generally safe and provides potassium.',
    healthEffects: [
      'Generally recognized as safe',
      'Source of potassium',
      'May help with blood pressure',
      'Rare digestive issues in high amounts'
    ],
    whyAvoid: [
      'No significant concerns',
      'May cause digestive issues in excessive amounts',
      'Should be avoided by those with kidney problems'
    ],
    benefits: [
      'Provides potassium',
      'Natural compound',
      'Generally safe'
    ],
    alternatives: 'No need to avoid - generally safe additive'
  },
  'E635': {
    code: 'E635',
    name: 'Disodium 5\'-Ribonucleotides',
    category: 'Flavor Enhancer',
    concern: 'moderate',
    description: 'Flavor enhancer that works synergistically with MSG. May cause reactions in sensitive individuals.',
    healthEffects: [
      'May enhance MSG effects',
      'Can cause headaches in sensitive people',
      'May trigger migraines',
      'Potential digestive issues',
      'May increase appetite'
    ],
    whyAvoid: [
      'May cause adverse reactions',
      'Often used with MSG (double effect)',
      'May increase food cravings',
      'Used to mask low-quality ingredients',
      'No nutritional value'
    ],
    alternatives: 'Choose products with natural flavors or avoid processed foods with flavor enhancers'
  },
  // Additional common additives
  'E100': {
    code: 'E100',
    name: 'Curcumin',
    category: 'Natural Color',
    concern: 'low',
    description: 'Natural yellow color from turmeric. Generally safe and may have health benefits.',
    healthEffects: [
      'Natural antioxidant',
      'May have anti-inflammatory properties',
      'Generally well-tolerated',
      'Rare allergic reactions'
    ],
    whyAvoid: [],
    benefits: [
      'Natural colorant',
      'May have health benefits',
      'From turmeric'
    ],
    alternatives: 'No need to avoid - natural and beneficial'
  },
  'E101': {
    code: 'E101',
    name: 'Riboflavin (Vitamin B2)',
    category: 'Natural Color / Vitamin',
    concern: 'low',
    description: 'Natural yellow color and essential vitamin. Generally safe and beneficial.',
    healthEffects: [
      'Essential vitamin (B2)',
      'Important for energy metabolism',
      'Natural colorant',
      'Generally safe'
    ],
    whyAvoid: [],
    benefits: [
      'Provides vitamin B2',
      'Natural colorant',
      'Essential nutrient'
    ],
    alternatives: 'No need to avoid - beneficial vitamin'
  },
  'E200': {
    code: 'E200',
    name: 'Sorbic Acid',
    category: 'Preservative',
    concern: 'low',
    description: 'Natural preservative derived from berries. Generally safe and effective.',
    healthEffects: [
      'Generally recognized as safe',
      'Natural preservative',
      'Rare allergic reactions',
      'Well-tolerated'
    ],
    whyAvoid: [
      'No significant concerns',
      'Rare skin sensitivity'
    ],
    benefits: [
      'Natural preservative',
      'Effective and safe',
      'From natural sources'
    ],
    alternatives: 'No need to avoid - natural and safe preservative'
  },
  'E202': {
    code: 'E202',
    name: 'Potassium Sorbate',
    category: 'Preservative',
    concern: 'low',
    description: 'Potassium salt of sorbic acid. Natural preservative generally considered safe.',
    healthEffects: [
      'Generally recognized as safe',
      'Natural preservative',
      'Rare allergic reactions',
      'Well-tolerated'
    ],
    whyAvoid: [
      'No significant concerns',
      'Rare skin sensitivity'
    ],
    benefits: [
      'Natural preservative',
      'Effective and safe'
    ],
    alternatives: 'No need to avoid - natural and safe'
  },
  'E300': {
    code: 'E300',
    name: 'Ascorbic Acid (Vitamin C)',
    category: 'Antioxidant / Vitamin',
    concern: 'low',
    description: 'Natural antioxidant and essential vitamin. Beneficial and safe.',
    healthEffects: [
      'Essential vitamin (C)',
      'Powerful antioxidant',
      'Supports immune system',
      'Generally safe'
    ],
    whyAvoid: [],
    benefits: [
      'Provides vitamin C',
      'Natural antioxidant',
      'Essential nutrient',
      'Health benefits'
    ],
    alternatives: 'No need to avoid - beneficial vitamin'
  },
  'E330': {
    code: 'E330',
    name: 'Citric Acid',
    category: 'Acidity Regulator / Preservative',
    concern: 'low',
    description: 'Natural acid from citrus fruits. Common and generally safe.',
    healthEffects: [
      'Natural compound',
      'Generally recognized as safe',
      'Common in foods',
      'Rare digestive issues in high amounts'
    ],
    whyAvoid: [
      'No significant concerns',
      'May cause tooth enamel erosion in excessive amounts'
    ],
    benefits: [
      'Natural acid',
      'From citrus fruits',
      'Common and safe'
    ],
    alternatives: 'No need to avoid - natural and safe'
  },
  'E407': {
    code: 'E407',
    name: 'Carrageenan',
    category: 'Thickener / Stabilizer',
    concern: 'moderate',
    description: 'Natural thickener from seaweed. Some concerns about degraded carrageenan.',
    healthEffects: [
      'May cause digestive issues in sensitive individuals',
      'Degraded carrageenan may be concerning',
      'Potential inflammation concerns',
      'Generally well-tolerated in food-grade form'
    ],
    whyAvoid: [
      'May cause digestive issues',
      'Some health concerns',
      'Better alternatives available'
    ],
    alternatives: 'Choose products with natural thickeners like agar or pectin'
  },
  'E415': {
    code: 'E415',
    name: 'Xanthan Gum',
    category: 'Thickener / Stabilizer',
    concern: 'low',
    description: 'Natural thickener from fermentation. Generally safe and effective.',
    healthEffects: [
      'Generally recognized as safe',
      'May help with blood sugar',
      'Well-tolerated',
      'Rare digestive issues'
    ],
    whyAvoid: [
      'No significant concerns',
      'May cause bloating in sensitive individuals'
    ],
    benefits: [
      'Natural thickener',
      'Effective and safe',
      'May have health benefits'
    ],
    alternatives: 'No need to avoid - generally safe'
  },
  'E471': {
    code: 'E471',
    name: 'Mono- and Diglycerides of Fatty Acids',
    category: 'Emulsifier',
    concern: 'moderate',
    description: 'Emulsifiers that may affect gut health. Often from palm oil.',
    healthEffects: [
      'May disrupt gut microbiome',
      'Can affect intestinal barrier',
      'May increase inflammation',
      'Often from palm oil (environmental concerns)'
    ],
    whyAvoid: [
      'May affect gut health',
      'Palm oil concerns',
      'Better to limit processed foods',
      'May increase inflammation'
    ],
    alternatives: 'Choose products with natural emulsifiers or limit processed foods'
  },
  'E950': {
    code: 'E950',
    name: 'Acesulfame Potassium',
    category: 'Artificial Sweetener',
    concern: 'moderate',
    description: 'Artificial sweetener that may affect taste and appetite.',
    healthEffects: [
      'May affect taste perception',
      'May increase cravings for sweet foods',
      'Potential digestive issues',
      'May affect gut bacteria'
    ],
    whyAvoid: [
      'May increase sweet cravings',
      'Artificial sweetener',
      'May affect gut health',
      'Better alternatives available'
    ],
    alternatives: 'Use natural sweeteners or reduce overall sweetness'
  },
  'E955': {
    code: 'E955',
    name: 'Sucralose',
    category: 'Artificial Sweetener',
    concern: 'moderate',
    description: 'Artificial sweetener made from sugar. May affect gut bacteria and metabolism.',
    healthEffects: [
      'May affect gut bacteria',
      'May affect blood sugar regulation',
      'Potential digestive issues',
      'May increase cravings'
    ],
    whyAvoid: [
      'May affect gut microbiome',
      'May disrupt metabolism',
      'Artificial sweetener',
      'Better alternatives available'
    ],
    alternatives: 'Use natural sweeteners like stevia or reduce overall sweetness'
  },
};

/**
 * Get additive information by code
 */
export function getAdditiveInfo(code: string): AdditiveInfo | null {
  // Normalize code (remove spaces, convert to uppercase)
  const normalizedCode = code.trim().toUpperCase();
  return ADDITIVES_DATABASE[normalizedCode] || null;
}

/**
 * Get concern level color
 */
export function getConcernColor(concern: AdditiveInfo['concern']): string {
  switch (concern) {
    case 'very_high':
      return 'bg-red-600 text-white';
    case 'high':
      return 'bg-orange-500 text-white';
    case 'moderate':
      return 'bg-yellow-500 text-white';
    case 'low':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

/**
 * Get concern level text
 */
export function getConcernText(concern: AdditiveInfo['concern']): string {
  switch (concern) {
    case 'very_high':
      return 'Very High Concern';
    case 'high':
      return 'High Concern';
    case 'moderate':
      return 'Moderate Concern';
    case 'low':
      return 'Low Concern';
    default:
      return 'Unknown';
  }
}

