import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Rating from "./Rating";

describe("Rating Component", () => {
  it("설정된 max 값만큼 별이 렌더링되어야 한다.", () => {
    render(<Rating value={0} onChange={() => {}} max={5} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
  });

  it("별 클릭 시 onChange 핸들러가 올바른 인자와 함께 호출되어야 한다.", () => {
    const handleChange = vi.fn();
    render(<Rating value={2} onChange={handleChange} max={5} />);

    const fourthStar = screen.getAllByRole("button")[3]!; // 4번째 별
    fireEvent.click(fourthStar!);

    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("value 값에 따라 활성화된 별의 색상이 변경되어야 한다.", () => {
    render(<Rating value={3} onChange={() => {}} max={5} />);
    const buttons = screen.getAllByRole("button");

    // 3번째 별까지는 text-secondary 클래스를 포함해야 함 (색상 로직 검증)
    expect(buttons[2]).toHaveClass("text-secondary");
    expect(buttons[3]).not.toHaveClass("text-secondary");
  });
});
