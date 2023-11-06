import { prisma } from "#app/utils/db.server.ts";
import migrateDatas from "./assets/migrate.json"

async function main() {
    for (const migrateData of migrateDatas) {
        const item = await prisma.item.findFirst({where: {
            name: migrateData.itemName
        }})

        if (!item) {
            console.log(`Item not found: ${migrateData.itemName}`)
            continue
        }

        console.log()

        await prisma.itemPrice.create({
            data: {
                itemId: item.id,
                price: migrateData.price,
                ship: migrateData.ship,
                createdAt: new Date(migrateData.createdAt),
                reporterId: "oxJUDymCwca2riHck8rY29WP7dG8C"
            }
        })
        console.info(`Migrate ${migrateData.itemName} success`)
    }
}

main()