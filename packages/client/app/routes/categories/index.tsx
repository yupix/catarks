import { Link } from "@remix-run/react";
import { Card } from "flowbite-react";

const mockdata = [
  {
    title: "特殊能力",
    value: "ability",
    icon: "https://s3.akarinext.org/assets/*/pso2/op/op_10.webp",
  },
  {
    title: "武器",
    value: "weapon",

    icon: "https://s3.akarinext.org/assets/*/pso2/items/weapons/ネオス・アストリオンセイバー.webp",
  },
  {
    title: "防具",
    value: "armmor",
    icon: "https://s3.akarinext.org/assets/*/pso2/items/armors/エイジャクスアーマ.webp",
  },
  {
    title: "素材",
    value: "material",
    icon: "https://s3.akarinext.org/assets/*/pso2/items/material/ストラグメントA.webp",
  },
];

export default function FeaturesCards() {
  const features = mockdata.map((feature) => (
    <Link key={feature.value} to={`/categories/${feature.value}`}>
      <Card>
        <div className="flex flex-wrap flex-row items-center">
          <img
            src={feature.icon}
            height={50}
            width={50}
            alt={feature.title}
            style={{ borderRadius: "10%", marginRight: "1em" }}
          />
          <p>{feature.title}</p>
        </div>
      </Card>
    </Link>
  ));
  return (
    <div className="container p-10">
      <h1 className="font-bold">Categories</h1>

      <p className="text-slate-400">
        同じ種類の金策可能なアイテムを見つけ、直ぐに金策を始めましょう
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{features}</div>
    </div>
  );
}
