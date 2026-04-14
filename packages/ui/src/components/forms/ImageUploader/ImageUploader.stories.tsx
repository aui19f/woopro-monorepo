import { Meta, StoryObj } from "@storybook/react-vite";
import ImageUploader from "./ImageUploader";
import { useState } from "react";

const meta: Meta<typeof ImageUploader> = {
  title: "Forms/ImageUploader",
  component: ImageUploader,
  tags: ["autodocs"],
  argTypes: {
    sizing: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};
export default meta;
export const Default: StoryObj<typeof ImageUploader> = {
  render: function Render(args) {
    const [previews, setPreviews] = useState<string[]>([]);

    const handleImageChange = (files: FileList) => {
      const newFiles = Array.from(files);
      // 브라우저 미리보기 URL 생성 (비용 $0 로직)
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setPreviews((prev) => [...prev, ...newPreviews].slice(0, args.maxCount));
    };

    const handleRemove = (index: number) => {
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    return (
      <ImageUploader
        {...args}
        previews={previews}
        onImageChange={handleImageChange}
        onRemove={handleRemove}
      />
    );
  },
  args: {
    maxCount: 5,
    sizing: "md",
  },
};
