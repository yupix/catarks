import { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

import {faker} from "@faker-js/faker/locale/ja";

export default {
    title: "Components/Card",
    component: Card
} as Meta;

type Story = StoryObj<typeof Card>;

export const Plain: Story = {
    args: {
        headerChildren: faker.commerce.productName(),
        children: faker.commerce.productDescription()
    }
}


