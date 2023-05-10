import { RegisterAbility } from "./app/ability";
import { RegisterMaterials } from "./app/material";
const registers = [RegisterAbility, RegisterMaterials];

async function main() {
  for (const register of registers) {
    const instance = new register();
    await instance.run();
  }
}

main();
