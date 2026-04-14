import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { selectionGeometries } from "@/types/forms";
import Checkbox from "./Checkbox";

const mockOptions = [
  { id: "a", label: "AAA" },
  { id: "b", label: "BBB" },
  { id: "c", label: "CCC" },
];

describe("Checkbox 컴포넌트 테스트", () => {
  it("제공된 모든 옵션이 올바르게 렌더링되어야 한다", () => {
    render(
      <Checkbox options={mockOptions} selected={[]} onChange={() => {}} />
    );

    expect(screen.getByText("AAA")).toBeInTheDocument();
    expect(screen.getByText("BBB")).toBeInTheDocument();
    expect(screen.getByText("CCC")).toBeInTheDocument();
  });

  it("선택된(selected) 항목은 체크 상태로 표시되어야 한다", () => {
    render(
      <Checkbox options={mockOptions} selected={["a"]} onChange={() => {}} />
    );

    const checkbox1 = screen.getByLabelText("AAA") as HTMLInputElement;
    const checkbox2 = screen.getByLabelText("BBB") as HTMLInputElement;
    const checkbox3 = screen.getByLabelText("CCC") as HTMLInputElement;

    expect(checkbox1.checked).toBe(true);
    expect(checkbox2.checked).toBe(false);
    expect(checkbox3.checked).toBe(false);
  });

  it("체크박스 클릭 시 해당 id와 함께 onChange 함수가 호출되어야 한다", () => {
    const handleChange = vi.fn();
    render(
      <Checkbox options={mockOptions} selected={[]} onChange={handleChange} />
    );

    const label1 = screen.getByText("AAA");
    fireEvent.click(label1);

    expect(handleChange).toHaveBeenCalledWith("a");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("sizing prop에 따라 디자인 시스템에 정의된 스타일 세트가 적용되어야 한다", () => {
    const size = "lg";
    const styles = selectionGeometries[size];

    render(
      <Checkbox
        options={mockOptions}
        selected={[]}
        onChange={() => {}}
        sizing={size}
      />
    );

    // 텍스트에 적용된 사이즈 클래스 확인
    const labelText = screen.getByText("AAA");
    expect(labelText.className).toContain(styles.text);

    // 전체 컨테이너의 gap 스타일 확인
    const container = labelText.closest(".flex-col");
    expect(container?.className).toContain(styles.gap);
  });

  it("체크된 항목에 대해서만 children(추가 콘텐츠)이 렌더링되어야 한다", () => {
    const { rerender } = render(
      <Checkbox
        options={mockOptions}
        selected={[]}
        onChange={() => {}}
        sizing="md"
      >
        <span data-testid="extra-content">추가 정보</span>
      </Checkbox>
    );

    // 아무것도 선택 안 됐을 때 렌더링 안 됨
    expect(screen.queryByTestId("extra-content")).not.toBeInTheDocument();

    // 1번 선택 시 렌더링 됨
    rerender(
      <Checkbox
        options={mockOptions}
        selected={["a"]}
        onChange={() => {}}
        sizing="md"
      >
        <span data-testid="extra-content">추가 정보</span>
      </Checkbox>
    );
    expect(screen.getByTestId("extra-content")).toBeInTheDocument();
  });

  it("useId를 통해 input과 label이 올바르게 연결(accessibility)되어야 한다", () => {
    render(
      <Checkbox options={mockOptions} selected={[]} onChange={() => {}} />
    );

    const input = screen.getByLabelText("AAA");
    const label = screen.getByText("AAA").closest("label");

    expect(input.id).toBe(label?.getAttribute("for"));
  });
});
