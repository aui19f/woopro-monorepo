// src/components/common/Select/Select.stories.tsx
import { Meta, StoryObj } from "@storybook/react-vite";
import Select from "./Select";

const meta: Meta<typeof Select> = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    sizing: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const mockOptions = [
  { id: "1", label: "제과 (Bakery)" },
  { id: "2", label: "제빵 (Pastry)" },
  { id: "3", label: "디저트 (Dessert)" },
];

export const Default: Story = {
  args: {
    options: mockOptions,
    sizing: "md",
  },
};

export const ErrorState: Story = {
  args: {
    options: mockOptions,
    isError: true,
  },
};
