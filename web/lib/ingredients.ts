/**
 * Ingredient information database
 * Contains details about common food ingredients, their health effects, and concerns
 */

export interface IngredientInfo {
  name: string;
  aliases: string[]; // Alternative names/spellings
  category: string;
  concern: 'low' | 'moderate' | 'high' | 'very_high';
  description: string;
  healthEffects: string[];
  whyConsider: string[]; // Why to be cautious
  benefits?: string[];
  dietaryInfo: {
    vegan: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    allergen?: string[];
  };
}

export const INGREDIENTS_DATABASE: Record<string, IngredientInfo> = {
  'sucre': {
    name: 'Sugar',
    aliases: ['sucre', 'sugar', 'sucrose', 'saccharose'],
    category: 'Sweetener',
    concern: 'high',
    description: 'Refined white sugar. High consumption is linked to various health issues.',
    healthEffects: [
      'Can cause blood sugar spikes',
      'May contribute to weight gain',
      'Linked to increased risk of diabetes',
      'Can cause tooth decay',
      'May increase inflammation'
    ],
    whyConsider: [
      'High sugar content increases calorie density',
      'Provides empty calories with no nutrients',
      'Can lead to sugar addiction',
      'May contribute to metabolic syndrome',
      'Often hidden in processed foods'
    ],
    benefits: [],
    dietaryInfo: {
      vegan: true,
      vegetarian: true,
      glutenFree: true
    }
  },
  'huile de palme': {
    name: 'Palm Oil',
    aliases: ['huile de palme', 'palm oil', 'huile palmiste', 'palm kernel oil'],
    category: 'Fat',
    concern: 'very_high',
    description: 'Palm oil is high in saturated fat and its production causes environmental destruction.',
    healthEffects: [
      'High in saturated fat (50%)',
      'May raise LDL cholesterol',
      'Linked to cardiovascular disease risk',
      'Often highly processed',
      'May contain contaminants'
    ],
    whyConsider: [
      'Deforestation and habitat destruction',
      'High saturated fat content',
      'Environmental impact',
      'Often from unsustainable sources',
      'May contain processing contaminants'
    ],
    benefits: [],
    dietaryInfo: {
      vegan: true,
      vegetarian: true,
      glutenFree: true
    }
  },
  'noisettes': {
    name: 'Hazelnuts',
    aliases: ['noisettes', 'hazelnuts', 'filberts', 'cobnuts'],
    category: 'Nuts',
    concern: 'low',
    description: 'Hazelnuts are nutrient-dense nuts rich in healthy fats, vitamins, and minerals.',
    healthEffects: [
      'Rich in healthy monounsaturated fats',
      'Good source of vitamin E',
      'Contains antioxidants',
      'May help heart health',
      'High in fiber'
    ],
    whyConsider: [
      'Tree nut allergen - avoid if allergic',
      'High in calories (moderate portions)',
      'May contain aflatoxins if not stored properly'
    ],
    benefits: [
      'Heart-healthy fats',
      'Rich in antioxidants',
      'Good source of protein',
      'May improve brain function'
    ],
    dietaryInfo: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      allergen: ['nuts', 'tree nuts']
    }
  },
  'cacao maigre': {
    name: 'Low-Fat Cocoa',
    aliases: ['cacao maigre', 'cocoa powder', 'low-fat cocoa', 'cacao'],
    category: 'Flavoring',
    concern: 'low',
    description: 'Cocoa powder with reduced fat content. Rich in antioxidants and flavonoids.',
    healthEffects: [
      'Rich in antioxidants (flavonoids)',
      'May improve heart health',
      'Can boost mood',
      'May improve cognitive function',
      'Low in calories'
    ],
    whyConsider: [
      'May be processed with alkali (dutching) which reduces antioxidants',
      'Some brands may contain added sugars',
      'Check for processing method'
    ],
    benefits: [
      'High in antioxidants',
      'May lower blood pressure',
      'Can improve mood',
      'Rich in minerals (magnesium, iron)'
    ],
    dietaryInfo: {
      vegan: true,
      vegetarian: true,
      glutenFree: true
    }
  },
  'lait écrémé en poudre': {
    name: 'Skimmed Milk Powder',
    aliases: ['lait écrémé en poudre', 'skimmed milk powder', 'dried skim milk', 'non-fat dry milk'],
    category: 'Dairy',
    concern: 'moderate',
    description: 'Dehydrated skimmed milk. Contains lactose and milk proteins.',
    healthEffects: [
      'Contains lactose (problematic for lactose intolerant)',
      'High in protein',
      'Contains calcium',
      'May cause digestive issues',
      'Processed ingredient'
    ],
    whyConsider: [
      'Not suitable for lactose intolerant individuals',
      'Dairy allergen',
      'Highly processed',
      'May contain added ingredients'
    ],
    benefits: [
      'Good source of protein',
      'High in calcium',
      'Contains B vitamins'
    ],
    dietaryInfo: {
      vegan: false,
      vegetarian: true,
      glutenFree: true,
      allergen: ['milk', 'dairy', 'lactose']
    }
  },
  'lactoserum en poudre': {
    name: 'Whey Powder',
    aliases: ['lactoserum en poudre', 'whey powder', 'whey protein', 'lactose serum'],
    category: 'Dairy Protein',
    concern: 'moderate',
    description: 'Powdered whey protein from milk. High in protein but contains lactose.',
    healthEffects: [
      'High in protein',
      'Contains lactose',
      'May cause digestive issues',
      'Can trigger dairy allergies',
      'Often processed with additives'
    ],
    whyConsider: [
      'Dairy allergen',
      'Lactose intolerance risk',
      'Highly processed',
      'May contain additives',
      'Often from industrial sources'
    ],
    benefits: [
      'Excellent protein source',
      'Complete amino acid profile',
      'May support muscle recovery'
    ],
    dietaryInfo: {
      vegan: false,
      vegetarian: true,
      glutenFree: true,
      allergen: ['milk', 'dairy', 'whey', 'lactose']
    }
  },
  'émulsifiants': {
    name: 'Emulsifiers',
    aliases: ['émulsifiants', 'emulsifiers', 'emulsifying agents'],
    category: 'Additive',
    concern: 'moderate',
    description: 'Substances that help mix oil and water. May affect gut bacteria.',
    healthEffects: [
      'May disrupt gut microbiome',
      'Can affect intestinal barrier',
      'May increase inflammation',
      'Linked to digestive issues',
      'Often synthetic'
    ],
    whyConsider: [
      'May affect gut health',
      'Often synthetic chemicals',
      'May increase inflammation',
      'Better to avoid when possible',
      'No nutritional value'
    ],
    benefits: [],
    dietaryInfo: {
      vegan: true, // Depends on specific emulsifier
      vegetarian: true,
      glutenFree: true
    }
  },
  'vanilline': {
    name: 'Vanillin',
    aliases: ['vanilline', 'vanillin', 'artificial vanilla', 'synthetic vanilla'],
    category: 'Flavoring',
    concern: 'low',
    description: 'Synthetic vanilla flavoring. Generally safe but artificial.',
    healthEffects: [
      'Generally recognized as safe',
      'May cause allergic reactions in rare cases',
      'Artificial flavoring',
      'No nutritional value'
    ],
    whyConsider: [
      'Artificial flavoring (not natural vanilla)',
      'No health benefits',
      'May cause sensitivity in some',
      'Natural vanilla is preferable'
    ],
    benefits: [],
    dietaryInfo: {
      vegan: true,
      vegetarian: true,
      glutenFree: true
    }
  },
  'lecithin': {
    name: 'Lecithin',
    aliases: ['lecithin', 'lecithine', 'soy lecithin', 'sunflower lecithin'],
    category: 'Emulsifier',
    concern: 'low',
    description: 'Natural emulsifier. Usually from soy or sunflower. Generally safe.',
    healthEffects: [
      'Generally safe',
      'May help with cholesterol',
      'Rare allergic reactions',
      'May contain GMO if from soy'
    ],
    whyConsider: [
      'Soy allergy risk (if from soy)',
      'May be GMO (if from soy)',
      'Highly processed',
      'Often from industrial sources'
    ],
    benefits: [
      'May support brain health',
      'Can help with cholesterol',
      'Natural emulsifier'
    ],
    dietaryInfo: {
      vegan: true,
      vegetarian: true,
      glutenFree: true,
      allergen: ['soy'] // If from soy
    }
  }
};

/**
 * Get ingredient information by name (case-insensitive, handles variations)
 */
export function getIngredientInfo(name: string): IngredientInfo | null {
  const normalized = name.toLowerCase().trim();
  
  // Direct match
  if (INGREDIENTS_DATABASE[normalized]) {
    return INGREDIENTS_DATABASE[normalized];
  }
  
  // Check aliases
  for (const [key, info] of Object.entries(INGREDIENTS_DATABASE)) {
    if (info.aliases.some(alias => alias.toLowerCase() === normalized)) {
      return info;
    }
    // Partial match
    if (normalized.includes(key) || key.includes(normalized)) {
      return info;
    }
  }
  
  return null;
}

/**
 * Get concern level color
 */
export function getIngredientConcernColor(concern: IngredientInfo['concern']): string {
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
export function getIngredientConcernText(concern: IngredientInfo['concern']): string {
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

