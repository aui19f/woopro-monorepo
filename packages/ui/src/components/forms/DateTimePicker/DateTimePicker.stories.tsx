import { Meta, StoryObj } from "@storybook/react-vite";
import DateTimePicker from "./DateTimePicker";
import { useState } from "react";

const meta: Meta<typeof DateTimePicker> = {
  title: "Forms/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
};

export default meta;

export const AllCases: StoryObj<typeof DateTimePicker> = {
  render: function Render() {
    const [d1, setD1] = useState("");
    const [d2, setD2] = useState({ start: "", end: "" });
    const [t1, setT1] = useState("");
    const [dt2, setDt2] = useState({ start: "", end: "" });

    return (
      <div className="flex flex-col gap-8 max-w-md">
        <div>
          <label className="block text-xs font-bold mb-1 text-slate-500">
            1. 단일 날짜 선택
          </label>
          <DateTimePicker mode="date" value={d1} onChange={setD1} />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1 text-slate-500">
            2. 날짜 범위 선택
          </label>
          <DateTimePicker mode="date" isRange value={d2} onChange={setD2} />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1 text-slate-500">
            4. 시간 범위 선택
          </label>
          <DateTimePicker mode="time" isRange value={t1} onChange={setT1} />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1 text-slate-500">
            6. 날짜&시간 범위 선택
          </label>
          <DateTimePicker
            mode="datetime"
            isRange
            value={dt2}
            onChange={setDt2}
          />
        </div>
      </div>
    );
  },
};
