import { Meta, StoryObj } from "@storybook/react-vite";

import Rating from "./Rating";
import { useArgs } from "storybook/internal/preview-api";

const meta: Meta<typeof Rating> = {
  title: "Forms/Rating",
  component: Rating,
  tags: ["autodocs"],
  argTypes: {
    sizing: { control: "select", options: ["sm", "md", "lg"] },
    max: { control: { type: "number", min: 1, max: 10 } },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    value: 3,
    max: 5,
    sizing: "md",
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs();
    return (
      <Rating
        {...args}
        value={value}
        onChange={(val) => updateArgs({ value: val })}
      />
    );
  },
};
