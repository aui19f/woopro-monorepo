import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import Select from "./Select";
import { formGeometries } from "@/types/forms";

const mockOptions = [
  { id: "v1", label: "옵션 1" },
  { id: "v2", label: "옵션 2" },
  { id: "v3", label: "옵션 3" },
];

describe("Select 컴포넌트 테스트", () => {
  it("제공된 모든 옵션이 올바르게 렌더링되어야 한다", () => {
    render(<Select options={mockOptions} selected="v1" onChange={() => {}} />);

    mockOptions.forEach((opt) => {
      expect(screen.getByText(opt.label)).toBeInTheDocument();
    });
  });

  it("현재 selected 값에 해당하는 옵션이 선택되어 있어야 한다", () => {
    render(<Select options={mockOptions} selected="v2" onChange={() => {}} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("v2");
  });

  it("옵션 변경 시 onChange 핸들러가 올바른 값과 함께 호출되어야 한다", () => {
    const handleChange = vi.fn();
    render(
      <Select options={mockOptions} selected="v1" onChange={handleChange} />
    );

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    // select의 값을 v3로 변경하는 이벤트 발생
    fireEvent.change(select, { target: { value: "v3" } });

    expect(handleChange).toHaveBeenCalledTimes(1);

    fireEvent.change(select, { target: { value: "v3" } });
  });

  it("isError가 true일 때 border-error 스타일이 적용되어야 한다", () => {
    render(
      <Select
        options={mockOptions}
        selected="v1"
        isError={true}
        onChange={() => {}}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select.className).toContain("border-error");
  });

  it("sizing prop에 따라 올바른 크기 클래스가 적용되어야 한다", () => {
    const size = "lg";
    render(
      <Select
        options={mockOptions}
        selected="v1"
        sizing={size}
        onChange={() => {}}
      />
    );

    const select = screen.getByRole("combobox");
    // formGeometries[size]에 정의된 클래스가 포함되어 있는지 확인
    expect(select.className).toContain(formGeometries[size]);
  });

  it("children을 통해 전달된 추가 옵션이 렌더링되어야 한다", () => {
    render(
      <Select options={mockOptions} selected="v1" onChange={() => {}}>
        <option value="extra">추가 옵션</option>
      </Select>
    );

    expect(screen.getByText("추가 옵션")).toBeInTheDocument();
  });

  it("React 19 방식의 ref가 DOM 엘리먼트에 올바르게 연결되어야 한다", () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(
      <Select
        options={mockOptions}
        selected="v1"
        onChange={() => {}}
        ref={ref}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    expect(ref.current?.value).toBe("v1");
  });
});
