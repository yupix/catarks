import { Meta, StoryObj } from "@storybook/react";
import { CatArksLink } from "./Link";

export default {
    title: "Components/Link",
    component: CatArksLink
} as Meta;

type Story = StoryObj<typeof CatArksLink>;

export const Plain: Story = {
    args: {
        children: "Cat Arks",
        options: {disabled: false, to: "#"}
    }
}

export const Disabled: Story = {
    args: {
        children: "Cat Arks",
        options: {disabled: true, to: "#"}
    }
}
