// Species catalog — source of truth for the pet roster, asset URLs, gacha odds, evolution, and combat.
const flameFoxUrl = new URL("../assets/pets/flame-fox.png", import.meta.url).href;
const aquaSlimeUrl = new URL("../assets/pets/aqua-slime.png", import.meta.url).href;
const leafDrakeUrl = new URL("../assets/pets/leaf-drake.png", import.meta.url).href;
const snowKittenUrl = new URL("../assets/pets/snow-kitten.png", import.meta.url).href;
const voltBunUrl = new URL("../assets/pets/volt-bun.png", import.meta.url).href;
const starSproutUrl = new URL("../assets/pets/star-sprout.png", import.meta.url).href;
const crystalBunUrl = new URL("../assets/pets/crystal-bun.png", import.meta.url).href;
const shadowPupUrl = new URL("../assets/pets/shadow-pup.png", import.meta.url).href;
const frostOwlUrl = new URL("../assets/pets/frost-owl.png", import.meta.url).href;
const lavaSalUrl = new URL("../assets/pets/lava-sal.png", import.meta.url).href;
const moonCatUrl = new URL("../assets/pets/moon-cat.png", import.meta.url).href;
const ironDrakeUrl = new URL("../assets/pets/iron-drake.png", import.meta.url).href;
const cyberPantherUrl = new URL("../assets/pets/cyber-panther.png", import.meta.url).href;
const phoenixUrl = new URL("../assets/pets/phoenix.png", import.meta.url).href;
const divineLionUrl = new URL("../assets/pets/divine-lion.png", import.meta.url).href;
const eclipseSerpentUrl = new URL("../assets/pets/eclipse-serpent.png", import.meta.url).href;
const starDragonUrl = new URL("../assets/pets/star-dragon.png", import.meta.url).href;
const originTamUrl = new URL("../assets/pets/origin-tam.png", import.meta.url).href;
const voidEmperorUrl = new URL("../assets/pets/void-emperor.png", import.meta.url).href;
const legacyPurpleUrl = new URL("../assets/pet-purple.png", import.meta.url).href;
export const DEFAULT_PET_ASSET = "/assets/fallback/default-pet.png";

export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Mythic";
export type Element = "Fire" | "Water" | "Nature" | "Light" | "Shadow";
export type StatusKind = "burn" | "freeze" | "shock" | "sleep" | "rage" | "regen";

export interface Skill {
  id: string;
  name: string;
  kind: "basic" | "skill" | "ultimate";
  power: number;
  energyCost: number;
  status?: StatusKind;
  unlockStage: 1 | 2 | 3 | 4 | 5;
  description: string;
}

export interface Species {
  id: string;
  name: string;
  rarity: Rarity;
  element: Element;
  sprite: string;
  portrait: string;
  idleFrames: readonly string[];
  battleFrames: readonly string[];
  evolutionForms: string[];
  specialMove: string;
  rarityFrame: string;
  lore: string;
  base: { str: number; agi: number; int: number; hp: number };
  signature: Skill;
}

export const SPRITES = {
  flameFox: flameFoxUrl,
  aquaSlime: aquaSlimeUrl,
  leafDrake: leafDrakeUrl,
  snowKitten: snowKittenUrl,
  voltBun: voltBunUrl,
  starSprout: starSproutUrl,
  crystalBun: crystalBunUrl,
  shadowPup: shadowPupUrl,
  frostOwl: frostOwlUrl,
  lavaSal: lavaSalUrl,
  moonCat: moonCatUrl,
  ironDrake: ironDrakeUrl,
  cyberPanther: cyberPantherUrl,
  phoenix: phoenixUrl,
  divineLion: divineLionUrl,
  eclipseSerpent: eclipseSerpentUrl,
  starDragon: starDragonUrl,
  originTam: originTamUrl,
  voidEmperor: voidEmperorUrl,
  legacyPurple: legacyPurpleUrl,
} as const;
export const PORTRAITS = {
  flameFox: flameFoxUrl,
  aquaSlime: aquaSlimeUrl,
  leafDrake: leafDrakeUrl,
  snowKitten: snowKittenUrl,
  voltBun: voltBunUrl,
  starSprout: starSproutUrl,
  crystalBun: crystalBunUrl,
  shadowPup: shadowPupUrl,
  frostOwl: frostOwlUrl,
  lavaSal: lavaSalUrl,
  moonCat: moonCatUrl,
  ironDrake: ironDrakeUrl,
  cyberPanther: cyberPantherUrl,
  phoenix: phoenixUrl,
  divineLion: divineLionUrl,
  eclipseSerpent: eclipseSerpentUrl,
  starDragon: starDragonUrl,
  originTam: originTamUrl,
  voidEmperor: voidEmperorUrl,
  legacyPurple: legacyPurpleUrl,
} as const;
export const ANIMATION_FRAMES = {
  flameFox: { idle: [flameFoxUrl], battle: [flameFoxUrl] },
  aquaSlime: { idle: [aquaSlimeUrl], battle: [aquaSlimeUrl] },
  leafDrake: { idle: [leafDrakeUrl], battle: [leafDrakeUrl] },
  snowKitten: { idle: [snowKittenUrl], battle: [snowKittenUrl] },
  voltBun: { idle: [voltBunUrl], battle: [voltBunUrl] },
  starSprout: { idle: [starSproutUrl], battle: [starSproutUrl] },
  crystalBun: { idle: [crystalBunUrl], battle: [crystalBunUrl] },
  shadowPup: { idle: [shadowPupUrl], battle: [shadowPupUrl] },
  frostOwl: { idle: [frostOwlUrl], battle: [frostOwlUrl] },
  lavaSal: { idle: [lavaSalUrl], battle: [lavaSalUrl] },
  moonCat: { idle: [moonCatUrl], battle: [moonCatUrl] },
  ironDrake: { idle: [ironDrakeUrl], battle: [ironDrakeUrl] },
  cyberPanther: { idle: [cyberPantherUrl], battle: [cyberPantherUrl] },
  phoenix: { idle: [phoenixUrl], battle: [phoenixUrl] },
  divineLion: { idle: [divineLionUrl], battle: [divineLionUrl] },
  eclipseSerpent: { idle: [eclipseSerpentUrl], battle: [eclipseSerpentUrl] },
  starDragon: { idle: [starDragonUrl], battle: [starDragonUrl] },
  originTam: { idle: [originTamUrl], battle: [originTamUrl] },
  voidEmperor: { idle: [voidEmperorUrl], battle: [voidEmperorUrl] },
  legacyPurple: { idle: [legacyPurpleUrl], battle: [legacyPurpleUrl] },
} as const;
export const RARITY_FRAMES: Record<Rarity, string> = { Common: "frame-common", Uncommon: "frame-uncommon", Rare: "frame-rare", Epic: "frame-epic", Legendary: "frame-legendary", Mythic: "frame-mythic" };
export const ELEMENT_ICONS: Record<Element, string> = { Fire: "🔥", Water: "💧", Nature: "🌿", Light: "✨", Shadow: "🌙" };
export const BATTLE_VFX: Record<StatusKind | "impact" | "ko", string> = { burn: "vfx-burn", freeze: "vfx-freeze", shock: "vfx-shock", sleep: "vfx-sleep", rage: "vfx-rage", regen: "vfx-regen", impact: "vfx-impact", ko: "vfx-ko" };

export function elementAdvantage(att: Element, def: Element): number {
  if (att === "Fire" && def === "Nature") return 1.5;
  if (att === "Nature" && def === "Water") return 1.5;
  if (att === "Water" && def === "Fire") return 1.5;
  if ((att === "Light" && def === "Shadow") || (att === "Shadow" && def === "Light")) return 1.5;
  if (att === "Nature" && def === "Fire") return 0.7;
  if (att === "Water" && def === "Nature") return 0.7;
  if (att === "Fire" && def === "Water") return 0.7;
  return 1;
}

export const ELEMENT_GLYPH = ELEMENT_ICONS;

export const ELEMENT_TONE: Record<Element, string> = {
  Fire: "bg-warning text-ink",
  Water: "bg-arcade text-background",
  Nature: "bg-success text-ink",
  Light: "bg-secondary text-ink",
  Shadow: "bg-ink text-background",
};

export const RARITY_TONE: Record<Rarity, string> = {
  Common: "bg-muted text-ink",
  Uncommon: "bg-success/30 text-ink",
  Rare: "bg-arcade text-background",
  Epic: "bg-primary text-primary-foreground",
  Legendary: "bg-warning text-ink",
  Mythic: "bg-ink text-background",
};

export type EggTier = "common" | "rare" | "epic" | "legendary" | "mythic";

export const EGG_ODDS: Record<EggTier, { rarity: Rarity; pct: number }[]> = {
  common: [{ rarity: "Common", pct: 70 }, { rarity: "Uncommon", pct: 22 }, { rarity: "Rare", pct: 7 }, { rarity: "Epic", pct: 1 }],
  rare: [{ rarity: "Common", pct: 35 }, { rarity: "Uncommon", pct: 35 }, { rarity: "Rare", pct: 22 }, { rarity: "Epic", pct: 7 }, { rarity: "Legendary", pct: 1 }],
  epic: [{ rarity: "Uncommon", pct: 30 }, { rarity: "Rare", pct: 40 }, { rarity: "Epic", pct: 22 }, { rarity: "Legendary", pct: 7 }, { rarity: "Mythic", pct: 1 }],
  legendary: [{ rarity: "Rare", pct: 25 }, { rarity: "Epic", pct: 45 }, { rarity: "Legendary", pct: 25 }, { rarity: "Mythic", pct: 5 }],
  mythic: [{ rarity: "Epic", pct: 30 }, { rarity: "Legendary", pct: 55 }, { rarity: "Mythic", pct: 15 }],
};

export interface EggDef {
  tier: EggTier;
  label: string;
  priceMatic: number;
  bg: string;
  ring: string;
  glow: string;
  description: string;
}

export const EGGS: EggDef[] = [
  { tier: "common", label: "Common Egg", priceMatic: 0.02, bg: "bg-success", ring: "ring-success", glow: "shadow-[0_0_30px_oklch(0.7_0.17_162_/_0.6)]", description: "Standard hatch. Friendly starter pets." },
  { tier: "rare", label: "Rare Egg", priceMatic: 0.08, bg: "bg-arcade", ring: "ring-arcade", glow: "shadow-[0_0_40px_oklch(0.62_0.2_256_/_0.7)]", description: "Elemental specialists with charged auras." },
  { tier: "epic", label: "Epic Egg", priceMatic: 0.25, bg: "bg-primary", ring: "ring-primary", glow: "shadow-[0_0_50px_oklch(0.66_0.22_293_/_0.7)]", description: "Armored beasts. High signature damage." },
  { tier: "legendary", label: "Legendary Egg", priceMatic: 0.9, bg: "bg-warning", ring: "ring-warning", glow: "shadow-[0_0_60px_oklch(0.78_0.16_75_/_0.85)]", description: "Apex guardians. Cinematic ultimates." },
  { tier: "mythic", label: "Mythic Egg", priceMatic: 4.2, bg: "bg-ink", ring: "ring-ink", glow: "shadow-[0_0_80px_oklch(0.66_0.22_293_/_0.9)]", description: "Cosmic anomaly. 2/100 worldwide drop." },
];

export const ROSTER: Species[] = [

  {
    id: "leaflet", name: "Leaflet", rarity: "Common", element: "Fire",
    sprite: SPRITES.flameFox, portrait: PORTRAITS.flameFox, idleFrames: ANIMATION_FRAMES.flameFox.idle, battleFrames: ANIMATION_FRAMES.flameFox.battle,
    evolutionForms: ["Leaflet", "Leaflet Prime", "Leaflet Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Leaflet keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 10, agi: 12, int: 11, hp: 95 },
    signature: { id: "leaflet-sig", name: "Leaflet Burst", kind: "basic", power: 12, energyCost: 0, unlockStage: 1, description: "Fire signature strike that scales with bond tempo.", status: "burn" },
  },
  {
    id: "bubbi", name: "Bubbi", rarity: "Common", element: "Water",
    sprite: SPRITES.aquaSlime, portrait: PORTRAITS.aquaSlime, idleFrames: ANIMATION_FRAMES.aquaSlime.idle, battleFrames: ANIMATION_FRAMES.aquaSlime.battle,
    evolutionForms: ["Bubbi", "Bubbi Prime", "Bubbi Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Bubbi stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 11, agi: 14, int: 14, hp: 102 },
    signature: { id: "bubbi-sig", name: "Bubbi Burst", kind: "basic", power: 13, energyCost: 0, unlockStage: 1, description: "Water signature strike that scales with bond tempo." },
  },
  {
    id: "foxlet", name: "Foxlet", rarity: "Common", element: "Nature",
    sprite: SPRITES.leafDrake, portrait: PORTRAITS.leafDrake, idleFrames: ANIMATION_FRAMES.leafDrake.idle, battleFrames: ANIMATION_FRAMES.leafDrake.battle,
    evolutionForms: ["Foxlet", "Foxlet Prime", "Foxlet Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Foxlet grew from a seed hidden in an old arcade cabinet. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 12, agi: 16, int: 12, hp: 109 },
    signature: { id: "foxlet-sig", name: "Foxlet Burst", kind: "basic", power: 14, energyCost: 0, unlockStage: 1, description: "Nature signature strike that scales with bond tempo." },
  },
  {
    id: "puffin", name: "Puffin", rarity: "Common", element: "Light",
    sprite: SPRITES.snowKitten, portrait: PORTRAITS.snowKitten, idleFrames: ANIMATION_FRAMES.snowKitten.idle, battleFrames: ANIMATION_FRAMES.snowKitten.battle,
    evolutionForms: ["Puffin", "Puffin Prime", "Puffin Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Puffin blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 13, agi: 13, int: 15, hp: 98 },
    signature: { id: "puffin-sig", name: "Puffin Burst", kind: "basic", power: 15, energyCost: 0, unlockStage: 1, description: "Light signature strike that scales with bond tempo.", status: "shock" },
  },
  {
    id: "pebblit", name: "Pebblit", rarity: "Common", element: "Shadow",
    sprite: SPRITES.voltBun, portrait: PORTRAITS.voltBun, idleFrames: ANIMATION_FRAMES.voltBun.idle, battleFrames: ANIMATION_FRAMES.voltBun.battle,
    evolutionForms: ["Pebblit", "Pebblit Prime", "Pebblit Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Pebblit slips through grid lines and returns with impossible souvenirs. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 10, agi: 15, int: 13, hp: 105 },
    signature: { id: "pebblit-sig", name: "Pebblit Burst", kind: "basic", power: 16, energyCost: 0, unlockStage: 1, description: "Shadow signature strike that scales with bond tempo." },
  },
  {
    id: "glowtail", name: "Glowtail", rarity: "Common", element: "Fire",
    sprite: SPRITES.starSprout, portrait: PORTRAITS.starSprout, idleFrames: ANIMATION_FRAMES.starSprout.idle, battleFrames: ANIMATION_FRAMES.starSprout.battle,
    evolutionForms: ["Glowtail", "Glowtail Prime", "Glowtail Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Glowtail keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 11, agi: 12, int: 11, hp: 112 },
    signature: { id: "glowtail-sig", name: "Glowtail Burst", kind: "basic", power: 12, energyCost: 0, unlockStage: 1, description: "Fire signature strike that scales with bond tempo." },
  },
  {
    id: "mosslet", name: "Mosslet", rarity: "Common", element: "Water",
    sprite: SPRITES.crystalBun, portrait: PORTRAITS.crystalBun, idleFrames: ANIMATION_FRAMES.crystalBun.idle, battleFrames: ANIMATION_FRAMES.crystalBun.battle,
    evolutionForms: ["Mosslet", "Mosslet Prime", "Mosslet Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Mosslet stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 12, agi: 14, int: 14, hp: 101 },
    signature: { id: "mosslet-sig", name: "Mosslet Burst", kind: "basic", power: 13, energyCost: 0, unlockStage: 1, description: "Water signature strike that scales with bond tempo.", status: "freeze" },
  },
  {
    id: "cinder-pip", name: "Cinder Pip", rarity: "Common", element: "Nature",
    sprite: SPRITES.shadowPup, portrait: PORTRAITS.shadowPup, idleFrames: ANIMATION_FRAMES.shadowPup.idle, battleFrames: ANIMATION_FRAMES.shadowPup.battle,
    evolutionForms: ["Cinder Pip", "Cinder Pip Prime", "Cinder Pip Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Cinder Pip grew from a seed hidden in an old arcade cabinet. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 13, agi: 16, int: 12, hp: 108 },
    signature: { id: "cinder-pip-sig", name: "Cinder Pip Burst", kind: "basic", power: 14, energyCost: 0, unlockStage: 1, description: "Nature signature strike that scales with bond tempo." },
  },
  {
    id: "spriggle", name: "Spriggle", rarity: "Common", element: "Light",
    sprite: SPRITES.frostOwl, portrait: PORTRAITS.frostOwl, idleFrames: ANIMATION_FRAMES.frostOwl.idle, battleFrames: ANIMATION_FRAMES.frostOwl.battle,
    evolutionForms: ["Spriggle", "Spriggle Prime", "Spriggle Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Spriggle blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 10, agi: 13, int: 15, hp: 97 },
    signature: { id: "spriggle-sig", name: "Spriggle Burst", kind: "basic", power: 15, energyCost: 0, unlockStage: 1, description: "Light signature strike that scales with bond tempo." },
  },
  {
    id: "shelli", name: "Shelli", rarity: "Common", element: "Shadow",
    sprite: SPRITES.lavaSal, portrait: PORTRAITS.lavaSal, idleFrames: ANIMATION_FRAMES.lavaSal.idle, battleFrames: ANIMATION_FRAMES.lavaSal.battle,
    evolutionForms: ["Shelli", "Shelli Prime", "Shelli Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Shelli slips through grid lines and returns with impossible souvenirs. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 11, agi: 15, int: 13, hp: 104 },
    signature: { id: "shelli-sig", name: "Shelli Burst", kind: "basic", power: 16, energyCost: 0, unlockStage: 1, description: "Shadow signature strike that scales with bond tempo.", status: "sleep" },
  },
  {
    id: "dewdrop", name: "Dewdrop", rarity: "Common", element: "Fire",
    sprite: SPRITES.moonCat, portrait: PORTRAITS.moonCat, idleFrames: ANIMATION_FRAMES.moonCat.idle, battleFrames: ANIMATION_FRAMES.moonCat.battle,
    evolutionForms: ["Dewdrop", "Dewdrop Prime", "Dewdrop Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Dewdrop keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 12, agi: 12, int: 11, hp: 111 },
    signature: { id: "dewdrop-sig", name: "Dewdrop Burst", kind: "basic", power: 12, energyCost: 0, unlockStage: 1, description: "Fire signature strike that scales with bond tempo." },
  },
  {
    id: "niblet", name: "Niblet", rarity: "Common", element: "Water",
    sprite: SPRITES.ironDrake, portrait: PORTRAITS.ironDrake, idleFrames: ANIMATION_FRAMES.ironDrake.idle, battleFrames: ANIMATION_FRAMES.ironDrake.battle,
    evolutionForms: ["Niblet", "Niblet Prime", "Niblet Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Niblet stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 13, agi: 14, int: 14, hp: 100 },
    signature: { id: "niblet-sig", name: "Niblet Burst", kind: "basic", power: 13, energyCost: 0, unlockStage: 1, description: "Water signature strike that scales with bond tempo." },
  },
  {
    id: "comet-mite", name: "Comet Mite", rarity: "Common", element: "Nature",
    sprite: SPRITES.cyberPanther, portrait: PORTRAITS.cyberPanther, idleFrames: ANIMATION_FRAMES.cyberPanther.idle, battleFrames: ANIMATION_FRAMES.cyberPanther.battle,
    evolutionForms: ["Comet Mite", "Comet Mite Prime", "Comet Mite Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Comet Mite grew from a seed hidden in an old arcade cabinet. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 10, agi: 16, int: 12, hp: 107 },
    signature: { id: "comet-mite-sig", name: "Comet Mite Burst", kind: "basic", power: 14, energyCost: 0, unlockStage: 1, description: "Nature signature strike that scales with bond tempo.", status: "regen" },
  },
  {
    id: "fernbun", name: "Fernbun", rarity: "Common", element: "Light",
    sprite: SPRITES.phoenix, portrait: PORTRAITS.phoenix, idleFrames: ANIMATION_FRAMES.phoenix.idle, battleFrames: ANIMATION_FRAMES.phoenix.battle,
    evolutionForms: ["Fernbun", "Fernbun Prime", "Fernbun Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Fernbun blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 11, agi: 13, int: 15, hp: 96 },
    signature: { id: "fernbun-sig", name: "Fernbun Burst", kind: "basic", power: 15, energyCost: 0, unlockStage: 1, description: "Light signature strike that scales with bond tempo." },
  },
  {
    id: "mistling", name: "Mistling", rarity: "Common", element: "Shadow",
    sprite: SPRITES.divineLion, portrait: PORTRAITS.divineLion, idleFrames: ANIMATION_FRAMES.divineLion.idle, battleFrames: ANIMATION_FRAMES.divineLion.battle,
    evolutionForms: ["Mistling", "Mistling Prime", "Mistling Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Mistling slips through grid lines and returns with impossible souvenirs. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 12, agi: 15, int: 13, hp: 103 },
    signature: { id: "mistling-sig", name: "Mistling Burst", kind: "basic", power: 16, energyCost: 0, unlockStage: 1, description: "Shadow signature strike that scales with bond tempo." },
  },
  {
    id: "amber-cub", name: "Amber Cub", rarity: "Common", element: "Fire",
    sprite: SPRITES.eclipseSerpent, portrait: PORTRAITS.eclipseSerpent, idleFrames: ANIMATION_FRAMES.eclipseSerpent.idle, battleFrames: ANIMATION_FRAMES.eclipseSerpent.battle,
    evolutionForms: ["Amber Cub", "Amber Cub Prime", "Amber Cub Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Amber Cub keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 13, agi: 12, int: 11, hp: 110 },
    signature: { id: "amber-cub-sig", name: "Amber Cub Burst", kind: "basic", power: 12, energyCost: 0, unlockStage: 1, description: "Fire signature strike that scales with bond tempo.", status: "burn" },
  },
  {
    id: "tadpolex", name: "Tadpolex", rarity: "Common", element: "Water",
    sprite: SPRITES.starDragon, portrait: PORTRAITS.starDragon, idleFrames: ANIMATION_FRAMES.starDragon.idle, battleFrames: ANIMATION_FRAMES.starDragon.battle,
    evolutionForms: ["Tadpolex", "Tadpolex Prime", "Tadpolex Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Tadpolex stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 10, agi: 14, int: 14, hp: 99 },
    signature: { id: "tadpolex-sig", name: "Tadpolex Burst", kind: "basic", power: 13, energyCost: 0, unlockStage: 1, description: "Water signature strike that scales with bond tempo." },
  },
  {
    id: "cotton-imp", name: "Cotton Imp", rarity: "Common", element: "Nature",
    sprite: SPRITES.originTam, portrait: PORTRAITS.originTam, idleFrames: ANIMATION_FRAMES.originTam.idle, battleFrames: ANIMATION_FRAMES.originTam.battle,
    evolutionForms: ["Cotton Imp", "Cotton Imp Prime", "Cotton Imp Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Cotton Imp grew from a seed hidden in an old arcade cabinet. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 11, agi: 16, int: 12, hp: 106 },
    signature: { id: "cotton-imp-sig", name: "Cotton Imp Burst", kind: "basic", power: 14, energyCost: 0, unlockStage: 1, description: "Nature signature strike that scales with bond tempo." },
  },
  {
    id: "sparkit", name: "Sparkit", rarity: "Common", element: "Light",
    sprite: SPRITES.voidEmperor, portrait: PORTRAITS.voidEmperor, idleFrames: ANIMATION_FRAMES.voidEmperor.idle, battleFrames: ANIMATION_FRAMES.voidEmperor.battle,
    evolutionForms: ["Sparkit", "Sparkit Prime", "Sparkit Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Sparkit blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 12, agi: 13, int: 15, hp: 95 },
    signature: { id: "sparkit-sig", name: "Sparkit Burst", kind: "basic", power: 15, energyCost: 0, unlockStage: 1, description: "Light signature strike that scales with bond tempo.", status: "shock" },
  },
  {
    id: "pebble-pup", name: "Pebble Pup", rarity: "Common", element: "Shadow",
    sprite: SPRITES.flameFox, portrait: PORTRAITS.flameFox, idleFrames: ANIMATION_FRAMES.flameFox.idle, battleFrames: ANIMATION_FRAMES.flameFox.battle,
    evolutionForms: ["Pebble Pup", "Pebble Pup Prime", "Pebble Pup Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Pebble Pup slips through grid lines and returns with impossible souvenirs. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 13, agi: 15, int: 13, hp: 102 },
    signature: { id: "pebble-pup-sig", name: "Pebble Pup Burst", kind: "basic", power: 16, energyCost: 0, unlockStage: 1, description: "Shadow signature strike that scales with bond tempo." },
  },
  {
    id: "lilac-wisp", name: "Lilac Wisp", rarity: "Common", element: "Fire",
    sprite: SPRITES.aquaSlime, portrait: PORTRAITS.aquaSlime, idleFrames: ANIMATION_FRAMES.aquaSlime.idle, battleFrames: ANIMATION_FRAMES.aquaSlime.battle,
    evolutionForms: ["Lilac Wisp", "Lilac Wisp Prime", "Lilac Wisp Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Lilac Wisp keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 10, agi: 12, int: 11, hp: 109 },
    signature: { id: "lilac-wisp-sig", name: "Lilac Wisp Burst", kind: "basic", power: 12, energyCost: 0, unlockStage: 1, description: "Fire signature strike that scales with bond tempo." },
  },
  {
    id: "coral-nib", name: "Coral Nib", rarity: "Common", element: "Water",
    sprite: SPRITES.leafDrake, portrait: PORTRAITS.leafDrake, idleFrames: ANIMATION_FRAMES.leafDrake.idle, battleFrames: ANIMATION_FRAMES.leafDrake.battle,
    evolutionForms: ["Coral Nib", "Coral Nib Prime", "Coral Nib Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Coral Nib stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 11, agi: 14, int: 14, hp: 98 },
    signature: { id: "coral-nib-sig", name: "Coral Nib Burst", kind: "basic", power: 13, energyCost: 0, unlockStage: 1, description: "Water signature strike that scales with bond tempo.", status: "freeze" },
  },
  {
    id: "acorn-drake", name: "Acorn Drake", rarity: "Common", element: "Nature",
    sprite: SPRITES.snowKitten, portrait: PORTRAITS.snowKitten, idleFrames: ANIMATION_FRAMES.snowKitten.idle, battleFrames: ANIMATION_FRAMES.snowKitten.battle,
    evolutionForms: ["Acorn Drake", "Acorn Drake Prime", "Acorn Drake Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Acorn Drake grew from a seed hidden in an old arcade cabinet. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 12, agi: 16, int: 12, hp: 105 },
    signature: { id: "acorn-drake-sig", name: "Acorn Drake Burst", kind: "basic", power: 14, energyCost: 0, unlockStage: 1, description: "Nature signature strike that scales with bond tempo." },
  },
  {
    id: "snowbutton", name: "Snowbutton", rarity: "Common", element: "Light",
    sprite: SPRITES.voltBun, portrait: PORTRAITS.voltBun, idleFrames: ANIMATION_FRAMES.voltBun.idle, battleFrames: ANIMATION_FRAMES.voltBun.battle,
    evolutionForms: ["Snowbutton", "Snowbutton Prime", "Snowbutton Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Snowbutton blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 13, agi: 13, int: 15, hp: 112 },
    signature: { id: "snowbutton-sig", name: "Snowbutton Burst", kind: "basic", power: 15, energyCost: 0, unlockStage: 1, description: "Light signature strike that scales with bond tempo." },
  },
  {
    id: "kindle-kit", name: "Kindle Kit", rarity: "Common", element: "Shadow",
    sprite: SPRITES.starSprout, portrait: PORTRAITS.starSprout, idleFrames: ANIMATION_FRAMES.starSprout.idle, battleFrames: ANIMATION_FRAMES.starSprout.battle,
    evolutionForms: ["Kindle Kit", "Kindle Kit Prime", "Kindle Kit Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Kindle Kit slips through grid lines and returns with impossible souvenirs. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 10, agi: 15, int: 13, hp: 101 },
    signature: { id: "kindle-kit-sig", name: "Kindle Kit Burst", kind: "basic", power: 16, energyCost: 0, unlockStage: 1, description: "Shadow signature strike that scales with bond tempo.", status: "sleep" },
  },
  {
    id: "ripple-roo", name: "Ripple Roo", rarity: "Common", element: "Fire",
    sprite: SPRITES.crystalBun, portrait: PORTRAITS.crystalBun, idleFrames: ANIMATION_FRAMES.crystalBun.idle, battleFrames: ANIMATION_FRAMES.crystalBun.battle,
    evolutionForms: ["Ripple Roo", "Ripple Roo Prime", "Ripple Roo Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Ripple Roo keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 11, agi: 12, int: 11, hp: 108 },
    signature: { id: "ripple-roo-sig", name: "Ripple Roo Burst", kind: "basic", power: 12, energyCost: 0, unlockStage: 1, description: "Fire signature strike that scales with bond tempo." },
  },
  {
    id: "moonbean", name: "Moonbean", rarity: "Common", element: "Water",
    sprite: SPRITES.shadowPup, portrait: PORTRAITS.shadowPup, idleFrames: ANIMATION_FRAMES.shadowPup.idle, battleFrames: ANIMATION_FRAMES.shadowPup.battle,
    evolutionForms: ["Moonbean", "Moonbean Prime", "Moonbean Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Moonbean stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 12, agi: 14, int: 14, hp: 97 },
    signature: { id: "moonbean-sig", name: "Moonbean Burst", kind: "basic", power: 13, energyCost: 0, unlockStage: 1, description: "Water signature strike that scales with bond tempo." },
  },
  {
    id: "thistle-tot", name: "Thistle Tot", rarity: "Common", element: "Nature",
    sprite: SPRITES.frostOwl, portrait: PORTRAITS.frostOwl, idleFrames: ANIMATION_FRAMES.frostOwl.idle, battleFrames: ANIMATION_FRAMES.frostOwl.battle,
    evolutionForms: ["Thistle Tot", "Thistle Tot Prime", "Thistle Tot Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Thistle Tot grew from a seed hidden in an old arcade cabinet. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 13, agi: 16, int: 12, hp: 104 },
    signature: { id: "thistle-tot-sig", name: "Thistle Tot Burst", kind: "basic", power: 14, energyCost: 0, unlockStage: 1, description: "Nature signature strike that scales with bond tempo.", status: "regen" },
  },
  {
    id: "sunny-slime", name: "Sunny Slime", rarity: "Common", element: "Light",
    sprite: SPRITES.lavaSal, portrait: PORTRAITS.lavaSal, idleFrames: ANIMATION_FRAMES.lavaSal.idle, battleFrames: ANIMATION_FRAMES.lavaSal.battle,
    evolutionForms: ["Sunny Slime", "Sunny Slime Prime", "Sunny Slime Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Sunny Slime blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 10, agi: 13, int: 15, hp: 111 },
    signature: { id: "sunny-slime-sig", name: "Sunny Slime Burst", kind: "basic", power: 15, energyCost: 0, unlockStage: 1, description: "Light signature strike that scales with bond tempo." },
  },
  {
    id: "brisk-mew", name: "Brisk Mew", rarity: "Common", element: "Shadow",
    sprite: SPRITES.moonCat, portrait: PORTRAITS.moonCat, idleFrames: ANIMATION_FRAMES.moonCat.idle, battleFrames: ANIMATION_FRAMES.moonCat.battle,
    evolutionForms: ["Brisk Mew", "Brisk Mew Prime", "Brisk Mew Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Common,
    lore: "Brisk Mew slips through grid lines and returns with impossible souvenirs. Collectors classify it as Common because its bond signature stays stable under battle pressure.",
    base: { str: 11, agi: 15, int: 13, hp: 100 },
    signature: { id: "brisk-mew-sig", name: "Brisk Mew Burst", kind: "basic", power: 16, energyCost: 0, unlockStage: 1, description: "Shadow signature strike that scales with bond tempo." },
  },
  {
    id: "voltix", name: "Voltix", rarity: "Rare", element: "Fire",
    sprite: SPRITES.ironDrake, portrait: PORTRAITS.ironDrake, idleFrames: ANIMATION_FRAMES.ironDrake.idle, battleFrames: ANIMATION_FRAMES.ironDrake.battle,
    evolutionForms: ["Voltix", "Voltix Prime", "Voltix Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Voltix keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 18, agi: 18, int: 17, hp: 137 },
    signature: { id: "voltix-sig", name: "Voltix Burst", kind: "skill", power: 25, energyCost: 3, unlockStage: 2, description: "Fire signature strike that scales with bond tempo.", status: "burn" },
  },
  {
    id: "cryon", name: "Cryon", rarity: "Rare", element: "Water",
    sprite: SPRITES.cyberPanther, portrait: PORTRAITS.cyberPanther, idleFrames: ANIMATION_FRAMES.cyberPanther.idle, battleFrames: ANIMATION_FRAMES.cyberPanther.battle,
    evolutionForms: ["Cryon", "Cryon Prime", "Cryon Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Cryon stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 19, agi: 20, int: 20, hp: 126 },
    signature: { id: "cryon-sig", name: "Cryon Burst", kind: "skill", power: 26, energyCost: 3, unlockStage: 2, description: "Water signature strike that scales with bond tempo.", status: "freeze" },
  },
  {
    id: "embercub", name: "Embercub", rarity: "Rare", element: "Nature",
    sprite: SPRITES.phoenix, portrait: PORTRAITS.phoenix, idleFrames: ANIMATION_FRAMES.phoenix.idle, battleFrames: ANIMATION_FRAMES.phoenix.battle,
    evolutionForms: ["Embercub", "Embercub Prime", "Embercub Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Embercub grew from a seed hidden in an old arcade cabinet. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 16, agi: 22, int: 18, hp: 133 },
    signature: { id: "embercub-sig", name: "Embercub Burst", kind: "skill", power: 27, energyCost: 3, unlockStage: 2, description: "Nature signature strike that scales with bond tempo.", status: "regen" },
  },
  {
    id: "moonlit", name: "Moonlit", rarity: "Rare", element: "Light",
    sprite: SPRITES.divineLion, portrait: PORTRAITS.divineLion, idleFrames: ANIMATION_FRAMES.divineLion.idle, battleFrames: ANIMATION_FRAMES.divineLion.battle,
    evolutionForms: ["Moonlit", "Moonlit Prime", "Moonlit Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Moonlit blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 17, agi: 19, int: 21, hp: 140 },
    signature: { id: "moonlit-sig", name: "Moonlit Burst", kind: "skill", power: 28, energyCost: 3, unlockStage: 2, description: "Light signature strike that scales with bond tempo.", status: "shock" },
  },
  {
    id: "shadepaw", name: "Shadepaw", rarity: "Rare", element: "Shadow",
    sprite: SPRITES.eclipseSerpent, portrait: PORTRAITS.eclipseSerpent, idleFrames: ANIMATION_FRAMES.eclipseSerpent.idle, battleFrames: ANIMATION_FRAMES.eclipseSerpent.battle,
    evolutionForms: ["Shadepaw", "Shadepaw Prime", "Shadepaw Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Shadepaw slips through grid lines and returns with impossible souvenirs. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 18, agi: 21, int: 19, hp: 129 },
    signature: { id: "shadepaw-sig", name: "Shadepaw Burst", kind: "skill", power: 29, energyCost: 3, unlockStage: 2, description: "Shadow signature strike that scales with bond tempo.", status: "sleep" },
  },
  {
    id: "crystal-bun", name: "Crystal Bun", rarity: "Rare", element: "Fire",
    sprite: SPRITES.starDragon, portrait: PORTRAITS.starDragon, idleFrames: ANIMATION_FRAMES.starDragon.idle, battleFrames: ANIMATION_FRAMES.starDragon.battle,
    evolutionForms: ["Crystal Bun", "Crystal Bun Prime", "Crystal Bun Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Crystal Bun keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 19, agi: 18, int: 17, hp: 136 },
    signature: { id: "crystal-bun-sig", name: "Crystal Bun Burst", kind: "skill", power: 25, energyCost: 3, unlockStage: 2, description: "Fire signature strike that scales with bond tempo.", status: "burn" },
  },
  {
    id: "shadow-pup", name: "Shadow Pup", rarity: "Rare", element: "Water",
    sprite: SPRITES.originTam, portrait: PORTRAITS.originTam, idleFrames: ANIMATION_FRAMES.originTam.idle, battleFrames: ANIMATION_FRAMES.originTam.battle,
    evolutionForms: ["Shadow Pup", "Shadow Pup Prime", "Shadow Pup Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Shadow Pup stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 16, agi: 20, int: 20, hp: 125 },
    signature: { id: "shadow-pup-sig", name: "Shadow Pup Burst", kind: "skill", power: 26, energyCost: 3, unlockStage: 2, description: "Water signature strike that scales with bond tempo.", status: "freeze" },
  },
  {
    id: "frost-owl", name: "Frost Owl", rarity: "Rare", element: "Nature",
    sprite: SPRITES.voidEmperor, portrait: PORTRAITS.voidEmperor, idleFrames: ANIMATION_FRAMES.voidEmperor.idle, battleFrames: ANIMATION_FRAMES.voidEmperor.battle,
    evolutionForms: ["Frost Owl", "Frost Owl Prime", "Frost Owl Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Frost Owl grew from a seed hidden in an old arcade cabinet. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 17, agi: 22, int: 18, hp: 132 },
    signature: { id: "frost-owl-sig", name: "Frost Owl Burst", kind: "skill", power: 27, energyCost: 3, unlockStage: 2, description: "Nature signature strike that scales with bond tempo.", status: "regen" },
  },
  {
    id: "lava-newt", name: "Lava Newt", rarity: "Rare", element: "Light",
    sprite: SPRITES.flameFox, portrait: PORTRAITS.flameFox, idleFrames: ANIMATION_FRAMES.flameFox.idle, battleFrames: ANIMATION_FRAMES.flameFox.battle,
    evolutionForms: ["Lava Newt", "Lava Newt Prime", "Lava Newt Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Lava Newt blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 18, agi: 19, int: 21, hp: 139 },
    signature: { id: "lava-newt-sig", name: "Lava Newt Burst", kind: "skill", power: 28, energyCost: 3, unlockStage: 2, description: "Light signature strike that scales with bond tempo.", status: "shock" },
  },
  {
    id: "moon-cat", name: "Moon Cat", rarity: "Rare", element: "Shadow",
    sprite: SPRITES.aquaSlime, portrait: PORTRAITS.aquaSlime, idleFrames: ANIMATION_FRAMES.aquaSlime.idle, battleFrames: ANIMATION_FRAMES.aquaSlime.battle,
    evolutionForms: ["Moon Cat", "Moon Cat Prime", "Moon Cat Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Moon Cat slips through grid lines and returns with impossible souvenirs. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 19, agi: 21, int: 19, hp: 128 },
    signature: { id: "moon-cat-sig", name: "Moon Cat Burst", kind: "skill", power: 29, energyCost: 3, unlockStage: 2, description: "Shadow signature strike that scales with bond tempo.", status: "sleep" },
  },
  {
    id: "glacier-lynx", name: "Glacier Lynx", rarity: "Rare", element: "Fire",
    sprite: SPRITES.leafDrake, portrait: PORTRAITS.leafDrake, idleFrames: ANIMATION_FRAMES.leafDrake.idle, battleFrames: ANIMATION_FRAMES.leafDrake.battle,
    evolutionForms: ["Glacier Lynx", "Glacier Lynx Prime", "Glacier Lynx Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Glacier Lynx keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 16, agi: 18, int: 17, hp: 135 },
    signature: { id: "glacier-lynx-sig", name: "Glacier Lynx Burst", kind: "skill", power: 25, energyCost: 3, unlockStage: 2, description: "Fire signature strike that scales with bond tempo.", status: "burn" },
  },
  {
    id: "prism-ferret", name: "Prism Ferret", rarity: "Rare", element: "Water",
    sprite: SPRITES.snowKitten, portrait: PORTRAITS.snowKitten, idleFrames: ANIMATION_FRAMES.snowKitten.idle, battleFrames: ANIMATION_FRAMES.snowKitten.battle,
    evolutionForms: ["Prism Ferret", "Prism Ferret Prime", "Prism Ferret Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Prism Ferret stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 17, agi: 20, int: 20, hp: 142 },
    signature: { id: "prism-ferret-sig", name: "Prism Ferret Burst", kind: "skill", power: 26, energyCost: 3, unlockStage: 2, description: "Water signature strike that scales with bond tempo.", status: "freeze" },
  },
  {
    id: "storm-moth", name: "Storm Moth", rarity: "Rare", element: "Nature",
    sprite: SPRITES.voltBun, portrait: PORTRAITS.voltBun, idleFrames: ANIMATION_FRAMES.voltBun.idle, battleFrames: ANIMATION_FRAMES.voltBun.battle,
    evolutionForms: ["Storm Moth", "Storm Moth Prime", "Storm Moth Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Storm Moth grew from a seed hidden in an old arcade cabinet. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 18, agi: 22, int: 18, hp: 131 },
    signature: { id: "storm-moth-sig", name: "Storm Moth Burst", kind: "skill", power: 27, energyCost: 3, unlockStage: 2, description: "Nature signature strike that scales with bond tempo.", status: "regen" },
  },
  {
    id: "iron-finch", name: "Iron Finch", rarity: "Rare", element: "Light",
    sprite: SPRITES.starSprout, portrait: PORTRAITS.starSprout, idleFrames: ANIMATION_FRAMES.starSprout.idle, battleFrames: ANIMATION_FRAMES.starSprout.battle,
    evolutionForms: ["Iron Finch", "Iron Finch Prime", "Iron Finch Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Iron Finch blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 19, agi: 19, int: 21, hp: 138 },
    signature: { id: "iron-finch-sig", name: "Iron Finch Burst", kind: "skill", power: 28, energyCost: 3, unlockStage: 2, description: "Light signature strike that scales with bond tempo.", status: "shock" },
  },
  {
    id: "magma-gecko", name: "Magma Gecko", rarity: "Rare", element: "Shadow",
    sprite: SPRITES.crystalBun, portrait: PORTRAITS.crystalBun, idleFrames: ANIMATION_FRAMES.crystalBun.idle, battleFrames: ANIMATION_FRAMES.crystalBun.battle,
    evolutionForms: ["Magma Gecko", "Magma Gecko Prime", "Magma Gecko Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Magma Gecko slips through grid lines and returns with impossible souvenirs. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 16, agi: 21, int: 19, hp: 127 },
    signature: { id: "magma-gecko-sig", name: "Magma Gecko Burst", kind: "skill", power: 29, energyCost: 3, unlockStage: 2, description: "Shadow signature strike that scales with bond tempo.", status: "sleep" },
  },
  {
    id: "nova-pup", name: "Nova Pup", rarity: "Rare", element: "Fire",
    sprite: SPRITES.shadowPup, portrait: PORTRAITS.shadowPup, idleFrames: ANIMATION_FRAMES.shadowPup.idle, battleFrames: ANIMATION_FRAMES.shadowPup.battle,
    evolutionForms: ["Nova Pup", "Nova Pup Prime", "Nova Pup Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Nova Pup keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 17, agi: 18, int: 17, hp: 134 },
    signature: { id: "nova-pup-sig", name: "Nova Pup Burst", kind: "skill", power: 25, energyCost: 3, unlockStage: 2, description: "Fire signature strike that scales with bond tempo.", status: "burn" },
  },
  {
    id: "azure-kirin", name: "Azure Kirin", rarity: "Rare", element: "Water",
    sprite: SPRITES.frostOwl, portrait: PORTRAITS.frostOwl, idleFrames: ANIMATION_FRAMES.frostOwl.idle, battleFrames: ANIMATION_FRAMES.frostOwl.battle,
    evolutionForms: ["Azure Kirin", "Azure Kirin Prime", "Azure Kirin Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Azure Kirin stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 18, agi: 20, int: 20, hp: 141 },
    signature: { id: "azure-kirin-sig", name: "Azure Kirin Burst", kind: "skill", power: 26, energyCost: 3, unlockStage: 2, description: "Water signature strike that scales with bond tempo.", status: "freeze" },
  },
  {
    id: "venom-sprout", name: "Venom Sprout", rarity: "Rare", element: "Nature",
    sprite: SPRITES.lavaSal, portrait: PORTRAITS.lavaSal, idleFrames: ANIMATION_FRAMES.lavaSal.idle, battleFrames: ANIMATION_FRAMES.lavaSal.battle,
    evolutionForms: ["Venom Sprout", "Venom Sprout Prime", "Venom Sprout Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Venom Sprout grew from a seed hidden in an old arcade cabinet. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 19, agi: 22, int: 18, hp: 130 },
    signature: { id: "venom-sprout-sig", name: "Venom Sprout Burst", kind: "skill", power: 27, energyCost: 3, unlockStage: 2, description: "Nature signature strike that scales with bond tempo.", status: "regen" },
  },
  {
    id: "solar-hare", name: "Solar Hare", rarity: "Rare", element: "Light",
    sprite: SPRITES.moonCat, portrait: PORTRAITS.moonCat, idleFrames: ANIMATION_FRAMES.moonCat.idle, battleFrames: ANIMATION_FRAMES.moonCat.battle,
    evolutionForms: ["Solar Hare", "Solar Hare Prime", "Solar Hare Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Solar Hare blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 16, agi: 19, int: 21, hp: 137 },
    signature: { id: "solar-hare-sig", name: "Solar Hare Burst", kind: "skill", power: 28, energyCost: 3, unlockStage: 2, description: "Light signature strike that scales with bond tempo.", status: "shock" },
  },
  {
    id: "rune-otter", name: "Rune Otter", rarity: "Rare", element: "Shadow",
    sprite: SPRITES.ironDrake, portrait: PORTRAITS.ironDrake, idleFrames: ANIMATION_FRAMES.ironDrake.idle, battleFrames: ANIMATION_FRAMES.ironDrake.battle,
    evolutionForms: ["Rune Otter", "Rune Otter Prime", "Rune Otter Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Rare,
    lore: "Rune Otter slips through grid lines and returns with impossible souvenirs. Collectors classify it as Rare because its bond signature stays stable under battle pressure.",
    base: { str: 17, agi: 21, int: 19, hp: 126 },
    signature: { id: "rune-otter-sig", name: "Rune Otter Burst", kind: "skill", power: 29, energyCost: 3, unlockStage: 2, description: "Shadow signature strike that scales with bond tempo.", status: "sleep" },
  },
  {
    id: "cyber-rex", name: "Cyber Rex", rarity: "Epic", element: "Fire",
    sprite: SPRITES.cyberPanther, portrait: PORTRAITS.cyberPanther, idleFrames: ANIMATION_FRAMES.cyberPanther.idle, battleFrames: ANIMATION_FRAMES.cyberPanther.battle,
    evolutionForms: ["Cyber Rex", "Cyber Rex Prime", "Cyber Rex Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Epic,
    lore: "Cyber Rex keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Epic because its bond signature stays stable under battle pressure.",
    base: { str: 26, agi: 23, int: 22, hp: 183 },
    signature: { id: "cyber-rex-sig", name: "Cyber Rex Burst", kind: "skill", power: 38, energyCost: 3, unlockStage: 2, description: "Fire signature strike that scales with bond tempo.", status: "burn" },
  },
  {
    id: "voidling-prime", name: "Voidling Prime", rarity: "Epic", element: "Water",
    sprite: SPRITES.phoenix, portrait: PORTRAITS.phoenix, idleFrames: ANIMATION_FRAMES.phoenix.idle, battleFrames: ANIMATION_FRAMES.phoenix.battle,
    evolutionForms: ["Voidling Prime", "Voidling Prime Prime", "Voidling Prime Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Epic,
    lore: "Voidling Prime stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Epic because its bond signature stays stable under battle pressure.",
    base: { str: 27, agi: 25, int: 25, hp: 190 },
    signature: { id: "voidling-prime-sig", name: "Voidling Prime Burst", kind: "skill", power: 39, energyCost: 3, unlockStage: 2, description: "Water signature strike that scales with bond tempo.", status: "freeze" },
  },
  {
    id: "thunderhorn", name: "Thunderhorn", rarity: "Epic", element: "Nature",
    sprite: SPRITES.divineLion, portrait: PORTRAITS.divineLion, idleFrames: ANIMATION_FRAMES.divineLion.idle, battleFrames: ANIMATION_FRAMES.divineLion.battle,
    evolutionForms: ["Thunderhorn", "Thunderhorn Prime", "Thunderhorn Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Epic,
    lore: "Thunderhorn grew from a seed hidden in an old arcade cabinet. Collectors classify it as Epic because its bond signature stays stable under battle pressure.",
    base: { str: 24, agi: 27, int: 23, hp: 179 },
    signature: { id: "thunderhorn-sig", name: "Thunderhorn Burst", kind: "skill", power: 40, energyCost: 3, unlockStage: 2, description: "Nature signature strike that scales with bond tempo.", status: "regen" },
  },
  {
    id: "phoenix-cub", name: "Phoenix Cub", rarity: "Epic", element: "Light",
    sprite: SPRITES.eclipseSerpent, portrait: PORTRAITS.eclipseSerpent, idleFrames: ANIMATION_FRAMES.eclipseSerpent.idle, battleFrames: ANIMATION_FRAMES.eclipseSerpent.battle,
    evolutionForms: ["Phoenix Cub", "Phoenix Cub Prime", "Phoenix Cub Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Epic,
    lore: "Phoenix Cub blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Epic because its bond signature stays stable under battle pressure.",
    base: { str: 25, agi: 24, int: 26, hp: 186 },
    signature: { id: "phoenix-cub-sig", name: "Phoenix Cub Burst", kind: "skill", power: 41, energyCost: 3, unlockStage: 2, description: "Light signature strike that scales with bond tempo.", status: "shock" },
  },
  {
    id: "iron-drake", name: "Iron Drake", rarity: "Epic", element: "Shadow",
    sprite: SPRITES.starDragon, portrait: PORTRAITS.starDragon, idleFrames: ANIMATION_FRAMES.starDragon.idle, battleFrames: ANIMATION_FRAMES.starDragon.battle,
    evolutionForms: ["Iron Drake", "Iron Drake Prime", "Iron Drake Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Epic,
    lore: "Iron Drake slips through grid lines and returns with impossible souvenirs. Collectors classify it as Epic because its bond signature stays stable under battle pressure.",
    base: { str: 26, agi: 26, int: 24, hp: 175 },
    signature: { id: "iron-drake-sig", name: "Iron Drake Burst", kind: "skill", power: 42, energyCost: 3, unlockStage: 2, description: "Shadow signature strike that scales with bond tempo.", status: "sleep" },
  },
  {
    id: "cyber-panther", name: "Cyber Panther", rarity: "Epic", element: "Fire",
    sprite: SPRITES.originTam, portrait: PORTRAITS.originTam, idleFrames: ANIMATION_FRAMES.originTam.idle, battleFrames: ANIMATION_FRAMES.originTam.battle,
    evolutionForms: ["Cyber Panther", "Cyber Panther Prime", "Cyber Panther Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Epic,
    lore: "Cyber Panther keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Epic because its bond signature stays stable under battle pressure.",
    base: { str: 27, agi: 23, int: 22, hp: 182 },
    signature: { id: "cyber-panther-sig", name: "Cyber Panther Burst", kind: "skill", power: 38, energyCost: 3, unlockStage: 2, description: "Fire signature strike that scales with bond tempo.", status: "burn" },
  },
  {
    id: "sun-phoenix", name: "Sun Phoenix", rarity: "Epic", element: "Water",
    sprite: SPRITES.voidEmperor, portrait: PORTRAITS.voidEmperor, idleFrames: ANIMATION_FRAMES.voidEmperor.idle, battleFrames: ANIMATION_FRAMES.voidEmperor.battle,
    evolutionForms: ["Sun Phoenix", "Sun Phoenix Prime", "Sun Phoenix Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Epic,
    lore: "Sun Phoenix stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Epic because its bond signature stays stable under battle pressure.",
    base: { str: 24, agi: 25, int: 25, hp: 189 },
    signature: { id: "sun-phoenix-sig", name: "Sun Phoenix Burst", kind: "skill", power: 39, energyCost: 3, unlockStage: 2, description: "Water signature strike that scales with bond tempo.", status: "freeze" },
  },
  {
    id: "plasma-wolf", name: "Plasma Wolf", rarity: "Epic", element: "Nature",
    sprite: SPRITES.flameFox, portrait: PORTRAITS.flameFox, idleFrames: ANIMATION_FRAMES.flameFox.idle, battleFrames: ANIMATION_FRAMES.flameFox.battle,
    evolutionForms: ["Plasma Wolf", "Plasma Wolf Prime", "Plasma Wolf Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Epic,
    lore: "Plasma Wolf grew from a seed hidden in an old arcade cabinet. Collectors classify it as Epic because its bond signature stays stable under battle pressure.",
    base: { str: 25, agi: 27, int: 23, hp: 178 },
    signature: { id: "plasma-wolf-sig", name: "Plasma Wolf Burst", kind: "skill", power: 40, energyCost: 3, unlockStage: 2, description: "Nature signature strike that scales with bond tempo.", status: "regen" },
  },
  {
    id: "titan-bun", name: "Titan Bun", rarity: "Epic", element: "Light",
    sprite: SPRITES.aquaSlime, portrait: PORTRAITS.aquaSlime, idleFrames: ANIMATION_FRAMES.aquaSlime.idle, battleFrames: ANIMATION_FRAMES.aquaSlime.battle,
    evolutionForms: ["Titan Bun", "Titan Bun Prime", "Titan Bun Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Epic,
    lore: "Titan Bun blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Epic because its bond signature stays stable under battle pressure.",
    base: { str: 26, agi: 24, int: 26, hp: 185 },
    signature: { id: "titan-bun-sig", name: "Titan Bun Burst", kind: "skill", power: 41, energyCost: 3, unlockStage: 2, description: "Light signature strike that scales with bond tempo.", status: "shock" },
  },
  {
    id: "aether-mantis", name: "Aether Mantis", rarity: "Epic", element: "Shadow",
    sprite: SPRITES.leafDrake, portrait: PORTRAITS.leafDrake, idleFrames: ANIMATION_FRAMES.leafDrake.idle, battleFrames: ANIMATION_FRAMES.leafDrake.battle,
    evolutionForms: ["Aether Mantis", "Aether Mantis Prime", "Aether Mantis Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Epic,
    lore: "Aether Mantis slips through grid lines and returns with impossible souvenirs. Collectors classify it as Epic because its bond signature stays stable under battle pressure.",
    base: { str: 27, agi: 26, int: 24, hp: 192 },
    signature: { id: "aether-mantis-sig", name: "Aether Mantis Burst", kind: "skill", power: 42, energyCost: 3, unlockStage: 2, description: "Shadow signature strike that scales with bond tempo.", status: "sleep" },
  },
  {
    id: "star-drake", name: "Star Drake", rarity: "Legendary", element: "Fire",
    sprite: SPRITES.snowKitten, portrait: PORTRAITS.snowKitten, idleFrames: ANIMATION_FRAMES.snowKitten.idle, battleFrames: ANIMATION_FRAMES.snowKitten.battle,
    evolutionForms: ["Star Drake", "Star Drake Prime", "Star Drake Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Legendary,
    lore: "Star Drake keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Legendary because its bond signature stays stable under battle pressure.",
    base: { str: 32, agi: 29, int: 31, hp: 234 },
    signature: { id: "star-drake-sig", name: "Star Drake Burst", kind: "ultimate", power: 68, energyCost: 6, unlockStage: 3, description: "Fire signature strike that scales with bond tempo.", status: "burn" },
  },
  {
    id: "celestion", name: "Celestion", rarity: "Legendary", element: "Water",
    sprite: SPRITES.voltBun, portrait: PORTRAITS.voltBun, idleFrames: ANIMATION_FRAMES.voltBun.idle, battleFrames: ANIMATION_FRAMES.voltBun.battle,
    evolutionForms: ["Celestion", "Celestion Prime", "Celestion Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Legendary,
    lore: "Celestion stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Legendary because its bond signature stays stable under battle pressure.",
    base: { str: 33, agi: 31, int: 34, hp: 241 },
    signature: { id: "celestion-sig", name: "Celestion Burst", kind: "ultimate", power: 69, energyCost: 6, unlockStage: 3, description: "Water signature strike that scales with bond tempo.", status: "freeze" },
  },
  {
    id: "chronobeast", name: "Chronobeast", rarity: "Legendary", element: "Nature",
    sprite: SPRITES.starSprout, portrait: PORTRAITS.starSprout, idleFrames: ANIMATION_FRAMES.starSprout.idle, battleFrames: ANIMATION_FRAMES.starSprout.battle,
    evolutionForms: ["Chronobeast", "Chronobeast Prime", "Chronobeast Apex"], specialMove: "Nature signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Legendary,
    lore: "Chronobeast grew from a seed hidden in an old arcade cabinet. Collectors classify it as Legendary because its bond signature stays stable under battle pressure.",
    base: { str: 34, agi: 33, int: 32, hp: 230 },
    signature: { id: "chronobeast-sig", name: "Chronobeast Burst", kind: "ultimate", power: 70, energyCost: 6, unlockStage: 3, description: "Nature signature strike that scales with bond tempo.", status: "regen" },
  },
  {
    id: "divine-lion", name: "Divine Lion", rarity: "Legendary", element: "Light",
    sprite: SPRITES.crystalBun, portrait: PORTRAITS.crystalBun, idleFrames: ANIMATION_FRAMES.crystalBun.idle, battleFrames: ANIMATION_FRAMES.crystalBun.battle,
    evolutionForms: ["Divine Lion", "Divine Lion Prime", "Divine Lion Apex"], specialMove: "Light signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Legendary,
    lore: "Divine Lion blinks in sync with distant satellites and cheers before the crowd does. Collectors classify it as Legendary because its bond signature stays stable under battle pressure.",
    base: { str: 35, agi: 30, int: 35, hp: 237 },
    signature: { id: "divine-lion-sig", name: "Divine Lion Burst", kind: "ultimate", power: 71, energyCost: 6, unlockStage: 3, description: "Light signature strike that scales with bond tempo.", status: "shock" },
  },
  {
    id: "eclipse-serpent", name: "Eclipse Serpent", rarity: "Legendary", element: "Shadow",
    sprite: SPRITES.shadowPup, portrait: PORTRAITS.shadowPup, idleFrames: ANIMATION_FRAMES.shadowPup.idle, battleFrames: ANIMATION_FRAMES.shadowPup.battle,
    evolutionForms: ["Eclipse Serpent", "Eclipse Serpent Prime", "Eclipse Serpent Apex"], specialMove: "Shadow signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Legendary,
    lore: "Eclipse Serpent slips through grid lines and returns with impossible souvenirs. Collectors classify it as Legendary because its bond signature stays stable under battle pressure.",
    base: { str: 32, agi: 32, int: 33, hp: 244 },
    signature: { id: "eclipse-serpent-sig", name: "Eclipse Serpent Burst", kind: "ultimate", power: 72, energyCost: 6, unlockStage: 3, description: "Shadow signature strike that scales with bond tempo.", status: "sleep" },
  },
  {
    id: "origin-tam", name: "Origin Tam", rarity: "Mythic", element: "Fire",
    sprite: SPRITES.frostOwl, portrait: PORTRAITS.frostOwl, idleFrames: ANIMATION_FRAMES.frostOwl.idle, battleFrames: ANIMATION_FRAMES.frostOwl.battle,
    evolutionForms: ["Origin Tam", "Origin Tam Prime", "Origin Tam Apex"], specialMove: "Fire signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Mythic,
    lore: "Origin Tam keeps a warm ember under its collar and charges when arena lights flare. Collectors classify it as Mythic because its bond signature stays stable under battle pressure.",
    base: { str: 40, agi: 35, int: 39, hp: 291 },
    signature: { id: "origin-tam-sig", name: "Origin Tam Burst", kind: "ultimate", power: 92, energyCost: 6, unlockStage: 3, description: "Fire signature strike that scales with bond tempo.", status: "burn" },
  },
  {
    id: "void-emperor", name: "Void Emperor", rarity: "Mythic", element: "Water",
    sprite: SPRITES.lavaSal, portrait: PORTRAITS.lavaSal, idleFrames: ANIMATION_FRAMES.lavaSal.idle, battleFrames: ANIMATION_FRAMES.lavaSal.battle,
    evolutionForms: ["Void Emperor", "Void Emperor Prime", "Void Emperor Apex"], specialMove: "Water signature strike that scales with bond tempo.", rarityFrame: RARITY_FRAMES.Mythic,
    lore: "Void Emperor stores moonlit rain in its fur and bends it into tiny shields. Collectors classify it as Mythic because its bond signature stays stable under battle pressure.",
    base: { str: 41, agi: 37, int: 42, hp: 298 },
    signature: { id: "void-emperor-sig", name: "Void Emperor Burst", kind: "ultimate", power: 93, energyCost: 6, unlockStage: 3, description: "Water signature strike that scales with bond tempo.", status: "freeze" },
  },
];

export const RARITY_MULT: Record<Rarity, number> = {
  Common: 1,
  Uncommon: 1.12,
  Rare: 1.28,
  Epic: 1.5,
  Legendary: 1.8,
  Mythic: 2.2,
};

export function pickSpeciesByRarity(rarity: Rarity): Species {
  const pool = ROSTER.filter((s) => s.rarity === rarity);
  if (pool.length === 0) {
    const fallback = ROSTER.filter((s) => s.rarity === "Common");
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function rollRarityFromEgg(tier: EggTier, luckBoost = 0): Rarity {
  const odds = EGG_ODDS[tier];
  const r = Math.random() * 100 - luckBoost;
  let acc = 0;
  for (const o of odds) {
    acc += o.pct;
    if (r <= acc) return o.rarity;
  }
  return odds[odds.length - 1].rarity;
}

export function getSpecies(id: string): Species | undefined {
  return ROSTER.find((s) => s.id === id);
}
