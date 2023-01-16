const SITES = { 通常: 1.0, 弱点: 1.5, 弱点属性: 1.2 };

export function get_site(site: "通常" | "弱点" | "弱点属性"): number {
  return SITES[site];
}

export function percent_to_float(value: number): number {
  return value / 100;
}

class DamageCalculator {
  weapon_damage: number;
  weapon_max_compensation: number;
  weapon_min_compensation: number;
  lower_damage: number;
  main_class_damage: number;
  enemy_defence_power: number;
  is_mainclass_weapon: boolean;
  is_attribute_weapon: boolean;
  site_attack: number;
  constructor(
    weapon_damage: number,
    weapon_max_compensation: number,
    weapon_min_compensation: number,
    lower_damage: number,
    main_class_damage: number,
    enemy_defence_power: number,
    is_mainclass_weapon: boolean,
    is_attribute_weapon: boolean,
    site_attack: "通常" | "弱点" | "弱点属性"
  ) {
    this.weapon_damage = weapon_damage;
    this.weapon_max_compensation = percent_to_float(weapon_max_compensation);
    this.weapon_min_compensation = percent_to_float(weapon_min_compensation);
    this.lower_damage =
      this.weapon_min_compensation * (percent_to_float(lower_damage) + 1);
    this.main_class_damage = main_class_damage;
    this.enemy_defence_power = enemy_defence_power;
    this.is_mainclass_weapon = is_mainclass_weapon;
    this.is_attribute_weapon = is_attribute_weapon;
    this.site_attack = get_site(site_attack);
  }

  get_base_damage(lower_damage: number | null = null) {
    lower_damage = lower_damage || this.lower_damage;
    return (
      this.weapon_damage * lower_damage +
      this.main_class_damage -
      this.enemy_defence_power
    );
  }

  other(lower_damage: number | null = null) {
    return (
      this.get_base_damage(lower_damage) *
      this.site_attack *
      (this.is_mainclass_weapon ? 1.1 : 1.0) *
      (this.is_attribute_weapon ? 1.15 : 1.1)
    );
  }

  get_critical_damage() {
    return Number(((this.other(1) * 1.2) / 5).toFixed(3));
  }

  get_min_damage() {
    return Number((this.other() / 5).toFixed(3));
  }

  get_max_damage() {
    return Number((this.other(1) / 5).toFixed(3));
  }

  get_expected_damage(critical_chance: number) {
    const _critical_chance = percent_to_float(critical_chance);
    return Number(
      (
        ((1 - _critical_chance) *
          (this.get_min_damage() + this.get_max_damage())) /
          2 +
        _critical_chance * this.get_critical_damage()
      ).toFixed(3)
    );
  }
}
