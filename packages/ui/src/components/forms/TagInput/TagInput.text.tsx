import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TagInput from "./TagInput";

describe("TagInput 컴포넌트", () => {
  const mockOnTagsChange = vi.fn();

  it("초기 태그들이 올바르게 렌더링되어야 한다", () => {
    const initialTags = ["React", "Next.js"];
    render(<TagInput tags={initialTags} onTagsChange={mockOnTagsChange} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("Enter를 누르면 새로운 태그가 추가되어야 한다", () => {
    render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);
    const input = screen.getByRole("textbox");

    // 'TypeScript' 입력 후 Enter
    fireEvent.change(input, { target: { value: "TypeScript" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockOnTagsChange).toHaveBeenCalledWith(["TypeScript"]);
  });

  it("중복된 태그는 추가되지 않아야 한다", () => {
    const existingTags = ["React"];
    render(<TagInput tags={existingTags} onTagsChange={mockOnTagsChange} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // onTagsChange가 호출되지 않아야 함 (중복 방지 로직)
    expect(mockOnTagsChange).not.toHaveBeenCalled();
  });

  it("태그 옆의 '×' 버튼을 클릭하면 해당 태그가 삭제되어야 한다", () => {
    const initialTags = ["React", "Vue"];
    render(<TagInput tags={initialTags} onTagsChange={mockOnTagsChange} />);

    // 첫 번째 태그(React)의 삭제 버튼 찾기
    const deleteButtons = screen.getAllByRole("button");
    fireEvent.click(deleteButtons[0]!);

    expect(mockOnTagsChange).toHaveBeenCalledWith(["Vue"]);
  });

  it("입력창이 비어있을 때 Backspace를 누르면 마지막 태그가 삭제되어야 한다", () => {
    const initialTags = ["React", "Next.js"];
    render(<TagInput tags={initialTags} onTagsChange={mockOnTagsChange} />);
    const input = screen.getByRole("textbox");

    // 입력값이 없는 상태에서 Backspace
    fireEvent.keyDown(input, { key: "Backspace", code: "Backspace" });

    expect(mockOnTagsChange).toHaveBeenCalledWith(["React"]);
  });

  it("전체 영역을 클릭하면 input에 포커스가 가야 한다", () => {
    render(<TagInput tags={[]} onTagsChange={mockOnTagsChange} />);
    const input = screen.getByRole("textbox");
    const container = input.parentElement!;

    fireEvent.click(container);

    expect(input).toHaveFocus();
  });
});
