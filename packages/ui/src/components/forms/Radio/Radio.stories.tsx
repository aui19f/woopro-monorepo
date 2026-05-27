import { Meta, StoryObj } from "@storybook/react-vite";
import Radio from "./Radio";
import { useState } from "react";

const meta: Meta<typeof Radio> = {
  title: "Forms/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    sizing: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "라디오 버튼 및 텍스트의 크기를 조절합니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

const mockOptions = [
  { id: "delivery", label: "배달 서비스 (Delivery)" },
  { id: "pickup", label: "매장 픽업 (Pick-up)" },
  { id: "dine-in", label: "매장 식사 (Dine-in)" },
];

// 기본 사용 예시 (상태 제어 포함)
export const Default: Story = {
  // render: (args) => {
  render: function Render(args) {
    const [selected, setSelected] = useState("");

    const handleToggle = (id: string) => {
      setSelected((prev) => (prev === id ? "" : id));
    };

    return (
      <div className="p-4">
        <Radio {...args} selected={selected} onChange={handleToggle} />
        <p className="mt-4 text-sm text-slate-500"></p>
      </div>
    );
  },
  args: {
    options: mockOptions,
    sizing: "md",
  },
};

// 사이즈별 비교
export const Sizes: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState("md-val");
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h4 className="mb-2 text-xs text-slate-400 font-bold uppercase">
            Small Size
          </h4>
          <Radio
            {...args}
            options={[{ id: "sm-val", label: "Small Radio" }]}
            selected={selected}
            onChange={setSelected}
            sizing="sm"
          />
        </div>
        <div>
          <h4 className="mb-2 text-xs text-slate-400 font-bold uppercase">
            Medium Size (Default)
          </h4>
          <Radio
            options={[{ id: "md-val", label: "Medium Radio" }]}
            selected={selected}
            onChange={setSelected}
            sizing="md"
          />
        </div>
        <div>
          <h4 className="mb-2 text-xs text-slate-400 font-bold uppercase">
            Large Size
          </h4>
          <Radio
            options={[{ id: "lg-val", label: "Large Radio" }]}
            selected={selected}
            onChange={setSelected}
            sizing="lg"
          />
        </div>
      </div>
    );
  },
};

// 확장형 (Children 포함)
export const WithChildren: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState("etc");
    return (
      <Radio {...args} selected={selected} onChange={setSelected}>
        <input
          type="text"
          placeholder="기타 사유를 입력해주세요"
          className="w-full p-2 border rounded border-slate-300 text-sm focus:border-point outline-none"
        />
      </Radio>
    );
  },
  args: {
    options: [
      { id: "reason1", label: "단순 변심" },
      { id: "etc", label: "기타 사유" },
    ],
    sizing: "md",
  },
};
