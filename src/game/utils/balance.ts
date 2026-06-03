export function requiredExpForLevel(level: number): number {
  return Math.floor(10 * Math.pow(1.08, level) + level * 3);
}

export function calculateDamageWithCrit(
  baseDamage: number,
  critChance: number,
  critDamage: number
): { damage: number; isCrit: boolean } {
  const guaranteedCrit = critChance >= 1;
  const isCrit = guaranteedCrit || Math.random() < critChance;

  if (!isCrit) {
    return { damage: baseDamage, isCrit: false };
  }

  let finalCritDamage = critDamage;
  if (critChance > 1) {
    finalCritDamage += critChance - 1;
  }

  return {
    damage: baseDamage * finalCritDamage,
    isCrit: true
  };
}
