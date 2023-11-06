import { RegisterAbility } from "./app/ability.ts";
import { RegisterMaterials } from "./app/material.ts";
const registers = [RegisterAbility, RegisterMaterials];

async function main() {
  for (const register of registers) {
    const instance = new register();
    await instance.run();
  }
}

main();
