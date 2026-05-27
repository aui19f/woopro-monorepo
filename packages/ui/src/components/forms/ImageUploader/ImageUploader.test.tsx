import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ImageUploader from "./ImageUploader";

describe("ImageUploader Component", () => {
  const mockPreviews = [
    "https://test.com/img1.jpg",
    "https://test.com/img2.jpg",
  ];
  const mockOnImageChange = vi.fn();
  const mockOnRemove = vi.fn();

  it("현재 전달된 previews의 개수만큼 이미지가 렌더링되어야 한다.", () => {
    render(
      <ImageUploader
        previews={mockPreviews}
        onImageChange={mockOnImageChange}
        onRemove={mockOnRemove}
      />
    );

    // Image 태그의 alt 텍스트로 확인
    expect(screen.getByAltText("미리보기 1")).toBeDefined();
    expect(screen.getByAltText("미리보기 2")).toBeDefined();

    // 카운트 텍스트 확인 (2/5)
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("/5")).toBeDefined();
  });

  it("파일을 선택하면 onImageChange 함수가 호출되어야 한다.", () => {
    render(
      <ImageUploader
        previews={[]}
        onImageChange={mockOnImageChange}
        onRemove={mockOnRemove}
      />
    );

    // 1. selector 없이 aria-label 값으로 input을 정확히 찾습니다.
    const input = screen.getByLabelText("이미지 업로드") as HTMLInputElement;
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    // 2. 파일 선택 시뮬레이션
    fireEvent.change(input, {
      target: { files: [file] }, // 이 [file]은 테스트 환경에서 FileList로 동작합니다.
    });

    // 3. 함수 호출 여부 먼저 확인
    expect(mockOnImageChange).toHaveBeenCalled();

    // 4. FileList 검증 로직 교정 (핵심 수정 사항)
    // FileList는 배열이 아니므로 arrayContaining 대신 인덱스로 직접 접근합니다.
    const calledArgs = mockOnImageChange.mock.calls[0]!;
    const fileList = calledArgs[0] as FileList;

    // 첫 번째 인자가 FileList 형식이거나 유사 배열인지 확인하고,
    // 그 안의 첫 번째 파일이 우리가 넣은 파일인지 검증합니다.
    expect(fileList[0]).toBe(file);
    expect(fileList.length).toBe(1);
  });

  it("삭제 버튼 클릭 시 onRemove 함수가 해당 인덱스와 함께 호출되어야 한다.", () => {
    render(
      <ImageUploader
        previews={mockPreviews}
        onImageChange={mockOnImageChange}
        onRemove={mockOnRemove}
      />
    );

    const removeButtons = screen.getAllByLabelText("이미지 삭제");
    fireEvent.click(removeButtons[0]!); // 첫 번째 이미지 삭제 버튼

    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });

  it("maxCount에 도달하면 업로드 버튼(label)이 렌더링되지 않아야 한다.", () => {
    const fullPreviews = Array(3).fill("https://test.com/img.jpg");

    render(
      <ImageUploader
        previews={fullPreviews}
        onImageChange={mockOnImageChange}
        onRemove={mockOnRemove}
        maxCount={3} // 최대 개수를 3으로 설정
      />
    );

    // input 요소를 찾을 수 없어야 함 (버튼이 사라짐)
    const input = screen.queryByLabelText("", { selector: "input" });
    expect(input).toBeNull();
  });
});
