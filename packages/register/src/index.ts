import { RegisterAbility } from "./app/ability/ability";

const registers = [
    RegisterAbility
]

async function main() {
    for (const register of registers) {
        const instance = new register()
        await instance.run()
    }
}

main()
