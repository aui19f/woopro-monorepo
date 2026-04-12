import { Meta, StoryObj } from "@storybook/react-vite";
import Input from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    sizing: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { name: "test", placeholder: "텍스트를 입력하세요", sizing: "lg" },
};

export const WithIcon: Story = {
  args: { name: "test", placeholder: "검색어 입력", icon: <span>🔍</span> },
};

export const Error: Story = {
  args: { name: "test", isError: true, defaultValue: "에러 발생" },
};
