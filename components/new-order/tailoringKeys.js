export const tailoringKeys = [
  'trousers',
  'jeans',
  'shirts',
  'blazers_suit_jackets',
  'dresses_skirts',
  'coats',
  'sports_outdoor_clothing',
  'other_tailoring_services'
];

export const tailoringServicesKeys = {
  trousers: [
    'trouser_leg_shortening',
    'trouser_leg_narrowing',
    'waist_narrowing_back_seam',
    'waist_widening_back_seam',
    'waist_narrowing_side_seams',
    'zipper_replacement',
    'patching_repair_seam'
    // 'trousers_narrowing_exceeding_4cm'
  ],
  jeans: [
    'leg_shortening',
    'leg_narrowing',
    'waist_narrowing_back_seam',
    'waist_narrowing_side_seams',
    'zipper_replacement',
    'patching_repair_seam'
    // 'jeans_narrowing_exceeding_4cm'
  ],
  shirts: [
    'shirts_sleeve_shortening',
    'waist_narrowing',
    'shirts_hem_shortening',
    'cardigan_knit_sleeve_shortening',
    'cardigan_knit_waist_narrowing',
    'top_strap_shortening',
    'patching_repair_seam'
  ],
  blazers_suit_jackets: [
    'sleeve_shortening',
    'sleeve_lengthening',
    'blazers_sleeve_narrowing',
    'waist_narrowing_side_seams',
    'blazers_hem_shortening',
    'shoulder_narrowing',
    'blazers_lining_replacement',
    'patching_repair_seam'
  ],
  dresses_skirts: [
    'dresses_hem_shortening',
    'skirt_narrowing_back_seam',
    'skirt_narrowing_side_seams',
    'dress_narrowing_back_seam',
    'dress_narrowing_side_seams',
    'skirt_zipper_replacement',
    'dress_zipper_replacement',
    'shortening_dress_straps',
    'patching_repair_seam'
    // 'dresses_narrowing_exceeding_4cm'
  ],
  coats: [
    'sleeve_shortening',
    'sleeve_shortening_relocation_welt',
    'sleeve_shortening_relocation_zipper',
    'coats_sleeve_narrowing',
    'waist_narrowing',
    'coats_hem_shortening',
    'coat_with_zipper',
    'shoulder_narrowing',
    'coat_zipper_replacement',
    'winter_jacket_zipper_replacement',
    'coats_lining_replacement',
    'patching_repair_seam'
  ],
  sports_outdoor_clothing: [
    'sports_shirt_sleeve_shortening',
    'sports_top_straps_shortening',
    'sports_shirt_zipper_replacement',
    'sports_pants_leg_shortening',
    'sports_pants_waist_narrowing',
    'sports_pants_zipper_replacement',
    'patching_repair_seam'
  ],
  other_tailoring_services: ['button_sewing', 'extra_buttons']
};

export const tailoringSubOptionsKeys = {
  trouser_leg_shortening: ['hidden_stitch', 'cuffs', 'binding_tape'],
  shirts_sleeve_shortening: ['slit_sleeves'],
  sleeve_shortening: ['with_lining', 'slit_sleeves'],
  shirts_hem_shortening: ['slit_hem'],
  blazers_hem_shortening: ['with_lining'],
  dresses_hem_shortening: ['with_lining', 'slit_hem', 'hidden_stitch'],
  coats_hem_shortening: ['with_lining', 'slit_hem'],
  coats_sleeve_narrowing: ['with_lining'],
  blazers_sleeve_narrowing: ['with_lining'],
  coats_lining_replacement: ['length_over_knee']
  // trousers_narrowing_exceeding_4cm: [],
  // dresses_narrowing_exceeding_4cm: [],
  // jeans_narrowing_exceeding_4cm: []
};
