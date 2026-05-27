import { Meta, StoryObj } from "@storybook/react-vite";

import Switch from "./Switch";
import { useArgs } from "storybook/internal/preview-api";

const meta: Meta<typeof Switch> = {
  title: "Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    sizing: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    checked: false,
    label: "알림 설정",
    sizing: "md",
  },
  render: function Rnder(args) {
    const [{ checked }, updateArgs] = useArgs();
    return (
      <Switch
        {...args}
        checked={checked}
        onChange={(val) => updateArgs({ checked: val })}
      />
    );
  },
};
