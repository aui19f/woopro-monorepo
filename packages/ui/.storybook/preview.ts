// packages/ui/.storybook/preview.ts (또는 .tsx)
import type { Preview } from "@storybook/react-vite";
import "../src/globals.css"; // Tailwind 스타일 로드

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // 접근성 테스트 설정
    a11y: {
      test: "todo",
    },
    // Next.js 기능을 사용하는 컴포넌트를 위한 설정 (선택 사항)
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
