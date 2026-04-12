import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import "@testing-library/jest-dom";
import Input from "./Input";

describe("Input Component", () => {
  it("기본 렌더링 확인", () => {
    render(<Input name="test" placeholder="test-input" />);
    expect(screen.getByPlaceholderText("test-input")).toBeInTheDocument();
  });

  it("에러 상태 스타일 적용 확인", () => {
    render(<Input name="test" isError />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-red-500");
  });
});
