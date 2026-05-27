import { Meta, StoryObj } from "@storybook/react-vite";
import Textarea from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    sizing: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    name: "content",
    placeholder: "내용을 입력해주세요.",
    autoResize: false,
  },
};

export const AutoResizing: Story = {
  args: {
    name: "recipe-description",
    placeholder: "입력하는 대로 높이가 늘어납니다.",
    autoResize: true,
  },
};

export const ErrorState: Story = {
  args: {
    name: "error-example",
    isError: true,
  },
};
