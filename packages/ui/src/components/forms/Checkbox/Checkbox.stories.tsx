import { Meta, StoryObj } from "@storybook/react-vite";
import Checkbox from "./Checkbox";
import { useState } from "react";

const meta: Meta<typeof Checkbox> = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    sizing: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

const mockOptions = [
  { id: "a", label: "AAA" },
  { id: "b", label: "BBB" },
  { id: "c", label: "CCC" },
];

export const Default: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState<string[]>([]);

    const handleToggle = (id: string) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    };

    return <Checkbox {...args} selected={selected} onChange={handleToggle} />;
  },
  args: {
    options: mockOptions,
    sizing: "md",
  },
};
