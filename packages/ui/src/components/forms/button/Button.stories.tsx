import Button from "@/components/forms/Button/Button";
import { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Button> = {
  title: "Forms/Button", // 스토리북 왼쪽 메뉴 구조
  component: Button,
  tags: ["autodocs"], // 자동으로 문서화 페이지 생성
  argTypes: {
    sizing: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: [
        "primary",
        "primary-line",
        "secondary",
        "secondary-line",
        "accent",
        "accent-line",
        "dark",
        "dark-line",
      ],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

// 기본 입력창
export const Default: Story = {
  args: {
    sizing: "md",
    variant: "dark",
    children: "버튼확인",
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    children: "수정할 수 없는 값",
  },
};
