import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Switch from "./Switch";

describe("Switch 컴포넌트", () => {
  const mockOnChange = vi.fn();

  it("라벨이 있을 경우 화면에 올바르게 표시되어야 한다", () => {
    render(
      <Switch checked={false} onChange={mockOnChange} label="알림 설정" />
    );

    expect(screen.getByText("알림 설정")).toBeInTheDocument();
  });

  it("클릭 시 onChange 함수가 반대 값으로 호출되어야 한다", () => {
    // 1. 현재 꺼져 있는(false) 상태로 렌더링
    render(<Switch checked={false} onChange={mockOnChange} />);

    // 2. 스위치 트랙(div)을 찾아 클릭
    const { container } = render(
      <Switch checked={false} onChange={mockOnChange} />
    );
    const switchTrack = container.querySelector(".relative");

    if (!switchTrack) throw new Error("Switch 트랙을 찾을 수 없습니다.");

    fireEvent.click(switchTrack);

    // 3. false의 반대인 true로 호출되었는지 확인
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it("체크 상태에 따라 배경색 클래스가 변경되어야 한다", () => {
    const { rerender, container } = render(
      <Switch checked={false} onChange={mockOnChange} />
    );

    const track = container.querySelector(".relative");

    // 꺼진 상태: bg-slate-300 포함 확인
    expect(track).toHaveClass("bg-slate-300");

    // 켜진 상태로 리렌더링
    rerender(<Switch checked={true} onChange={mockOnChange} />);

    // 켜진 상태: bg-point 포함 확인
    expect(track).toHaveClass("bg-point");
  });
});
