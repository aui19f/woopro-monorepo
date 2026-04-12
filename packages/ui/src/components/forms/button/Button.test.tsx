import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import Button from "./Button";
import { formPalettes, formGeometries } from "@/types/forms";

describe("Button 컴포넌트 테스트", () => {
  it("자식 요소(children)가 정상적으로 렌더링되어야 한다", () => {
    render(<Button>클릭하세요</Button>);
    expect(screen.getByText("클릭하세요")).toBeInTheDocument();
    screen.debug(); // 👈 여기에 무엇이 출력되나요?
  });

  it("variant prop에 따라 올바른 스타일 클래스가 적용되어야 한다", () => {
    const variant = "primary";
    render(<Button variant={variant}>Primary 버튼</Button>);

    const button = screen.getByRole("button");
    // 디자인 시스템에서 정의한 클래스가 포함되어 있는지 확인
    expect(button.className).toContain(formPalettes[variant]);
  });

  it("sizing prop에 따라 올바른 크기 클래스가 적용되어야 한다", () => {
    const size = "lg";
    render(<Button sizing={size}>큰 버튼</Button>);

    const button = screen.getByRole("button");
    expect(button.className).toContain(formGeometries[size]);
  });

  it("클릭 시 onClick 이벤트 핸들러가 호출되어야 한다", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>클릭</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태일 때 클릭이 되지 않아야 하며 스타일이 적용되어야 한다", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        비활성
      </Button>
    );

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button.className).toContain("disabled:opacity-50");

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("React 19 방식의 ref가 DOM 엘리먼트에 올바르게 연결되어야 한다", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref 테스트</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe("Ref 테스트");
  });

  it("사용자 정의 className이 기존 스타일과 병합되어야 한다", () => {
    const customClass = "custom-margin-top";
    render(<Button className={customClass}>커스텀 버튼</Button>);

    const button = screen.getByRole("button");
    expect(button.className).toContain(customClass);
    expect(button.className).toContain("flex items-center"); // 기본 클래스 유지 확인
  });
});
