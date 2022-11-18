import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { config } from "@vent/shared";
import { DropAries } from "./entities/droparies.entity";
import { ItemTags } from "./entities/item-tags.entity";
import { Items } from "./entities/items.entity";
import { OPEffects, OPS } from "./entities/op.entity";
import { Users } from "./entities/user.entity";

const options: Options<PostgreSqlDriver> = {
	driver: PostgreSqlDriver,
	metadataProvider: TsMorphMetadataProvider,
	entities: [DropAries, ItemTags, Items, OPEffects, OPS, Users],
	entitiesTs: ["./packages/db/src/entities/*.entity.ts"],
	clientUrl: `postgresql://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.db}`,
};

export default options;
