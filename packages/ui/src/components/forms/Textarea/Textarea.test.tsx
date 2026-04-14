import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import Textarea from "./Textarea";
import { formGeometries } from "@/types/forms";

describe("Textarea 컴포넌트 테스트", () => {
  it("name과 placeholder가 정상적으로 적용되어야 한다", () => {
    render(<Textarea name="description" placeholder="설명을 입력하세요" />);

    const textarea = screen.getByPlaceholderText("설명을 입력하세요");
    expect(textarea).toHaveAttribute("name", "description");
  });

  it("입력 시 onChange 핸들러가 호출되어야 한다", () => {
    const handleChange = vi.fn();
    render(<Textarea name="test" onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "안녕하세요" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("isError가 true일 때 border-error 클래스가 포함되어야 한다", () => {
    render(<Textarea name="test" isError={true} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-error");
  });

  it("sizing prop에 따라 디자인 시스템의 높이/패딩 클래스가 적용되어야 한다", () => {
    const size = "lg";
    render(<Textarea name="test" sizing={size} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain(formGeometries[size]);
  });

  it("autoResize가 true일 때 resize-none 클래스가 적용되어야 한다", () => {
    render(<Textarea name="test" autoResize={true} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("resize-none");
    expect(textarea.className).toContain("overflow-hidden");
  });

  it("autoResize 활성 시 가상 DOM의 scrollHeight에 따라 높이가 조절되어야 한다", () => {
    // JSDOM 환경에서는 실제 레이아웃이 계산되지 않으므로 scrollHeight를 모킹합니다.
    const { rerender } = render(
      <Textarea
        name="test"
        autoResize={true}
        value="짧은 텍스트"
        onChange={() => {}}
      />
    );

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    // scrollHeight 프로퍼티 모킹 (jsdom은 기본적으로 0)
    Object.defineProperty(textarea, "scrollHeight", {
      configurable: true,
      value: 150,
    });

    // value를 변경하여 useEffect 유도
    rerender(
      <Textarea
        name="test"
        autoResize={true}
        value="길어진 텍스트"
        onChange={() => {}}
      />
    );

    // scrollHeight 값인 150px이 스타일에 반영되었는지 확인
    expect(textarea.style.height).toBe("150px");
  });

  it("useImperativeHandle을 통해 외부 ref가 내부 엘리먼트에 연결되어야 한다", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea name="test" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current?.name).toBe("test");
  });
});
