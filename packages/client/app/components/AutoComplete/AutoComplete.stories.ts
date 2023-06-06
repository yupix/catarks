import { Meta, StoryObj } from "@storybook/react";
import AutoComplete from "./AutoComplete";

export default {
    title: "Components/AutoComplete",
    component: AutoComplete
} as Meta;

type Story = StoryObj<typeof AutoComplete>;

export const Plain: Story = {
    args: {
        name: "search",
        label: "Search",
        options: [{label: "Option 1", value: "1"}, {label: "Option 2", value: "2"}],
    }
}


