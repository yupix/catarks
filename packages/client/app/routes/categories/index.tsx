import { Link } from "@remix-run/react";
import { Card } from "~/components/Card/Card";
import { CATEGORIES } from "~/const";

export default function FeaturesCards() {
  const categories = CATEGORIES.map((category) => (
    <Link key={category.value} to={`/categories/${category.value}`}>
      <Card>
        <div className="flex flex-wrap flex-row items-center">
          <img
            src={category.icon}
            height={50}
            width={50}
            alt={category.title}
            style={{ borderRadius: "10%", marginRight: "1em" }}
          />
          <p>{category.title}</p>
        </div>
      </Card>
    </Link>
  ));
  return (
    <section className="container p-10">
      <div className="mb-5">
      <h1 className="font-bold text-3xl">CATEGORIES</h1>

      <p className="text-slate-400">
        同じ種類の金策可能なアイテムを見つけ、直ぐに金策を始めましょう
      </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{categories}</div>
    </section>
  );
}
