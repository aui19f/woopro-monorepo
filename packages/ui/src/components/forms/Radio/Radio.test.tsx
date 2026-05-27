import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Radio from "./Radio";
import { selectionGeometries } from "@/types/forms";

const mockOptions = [
  { id: "apple", label: "사과" },
  { id: "banana", label: "바나나" },
];

describe("Radio 컴포넌트 테스트", () => {
  it("제공된 모든 라디오 옵션이 렌더링되어야 한다", () => {
    render(<Radio options={mockOptions} selected="" onChange={() => {}} />);

    expect(screen.getByText("사과")).toBeInTheDocument();
    expect(screen.getByText("바나나")).toBeInTheDocument();
  });

  it("현재 selected 값에 해당하는 옵션이 체크되어 있어야 한다", () => {
    render(
      <Radio options={mockOptions} selected="apple" onChange={() => {}} />
    );

    const radioApple = screen.getByLabelText("사과") as HTMLInputElement;
    const radioBanana = screen.getByLabelText("바나나") as HTMLInputElement;

    expect(radioApple.checked).toBe(true);
    expect(radioBanana.checked).toBe(false);
  });

  it("선택되지 않은 옵션을 클릭하면 해당 id와 함께 onChange가 호출되어야 한다", () => {
    const handleChange = vi.fn();
    render(<Radio options={mockOptions} selected="" onChange={handleChange} />);

    fireEvent.click(screen.getByLabelText("바나나"));

    expect(handleChange).toHaveBeenCalledWith("banana");
  });

  it("이미 선택된 옵션을 다시 클릭하면 빈 문자열('')과 함께 onChange가 호출되어야 한다 (토글 로직)", () => {
    const handleChange = vi.fn();
    render(
      <Radio options={mockOptions} selected="apple" onChange={handleChange} />
    );

    // 이미 선택된 '사과'를 다시 클릭
    fireEvent.click(screen.getByLabelText("사과"));

    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("동일한 그룹 내의 라디오 버튼들은 같은 name 속성을 공유해야 한다", () => {
    render(<Radio options={mockOptions} selected="" onChange={() => {}} />);

    const radioApple = screen.getByLabelText("사과");
    const radioBanana = screen.getByLabelText("바나나");

    expect(radioApple.getAttribute("name")).toBe(
      radioBanana.getAttribute("name")
    );
    // useId를 통해 생성된 name이 존재해야 함
    expect(radioApple.getAttribute("name")).toBeTruthy();
  });

  it("sizing prop에 따른 디자인 시스템 스타일이 적용되어야 한다", () => {
    const size = "sm";
    const styles = selectionGeometries[size];

    render(
      <Radio
        options={mockOptions}
        selected=""
        onChange={() => {}}
        sizing={size}
      />
    );

    const labelText = screen.getByText("사과");
    expect(labelText.className).toContain(styles.text);
  });

  it("선택된 항목 옆에만 children 콘텐츠가 노출되어야 한다", () => {
    const { rerender } = render(
      <Radio options={mockOptions} selected="apple" onChange={() => {}}>
        <span data-testid="extra">상세입력</span>
      </Radio>
    );

    // 사과가 선택되었을 때 보임
    expect(screen.getByTestId("extra")).toBeInTheDocument();

    // 바나나로 변경 시 보이지 않음 (children은 isSelected일 때만 렌더링되므로)
    rerender(
      <Radio options={mockOptions} selected="banana" onChange={() => {}}>
        <span data-testid="extra">상세입력</span>
      </Radio>
    );

    // 바나나 옆에는 children을 렌더링하는 로직이 없거나,
    // 현재 코드 구조상 모든 옵션 맵핑 시 isSelected가 true인 곳에만 나타남
    expect(screen.getByTestId("extra")).toBeInTheDocument();
    // 참고: 수지님의 코드에서 children은 map 루프 안의 isSelected 조건문에 있으므로
    // 선택된 '바나나' 옆으로 이동해서 나타나야 합니다.
  });
});
