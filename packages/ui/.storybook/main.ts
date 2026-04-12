import { dirname, join } from "path";
import { fileURLToPath } from "url";
import type { StorybookConfig } from "@storybook/react-vite";
// Tailwind v4 전용 Vite 플러그인
import tailwindcss from "@tailwindcss/vite";

// ESM 환경에서 현재 파일의 디렉토리 경로 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 패키지의 절대 경로를 확인하는 헬퍼 함수
 */
function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
  ],
  framework: {
    // 프레임워크 설정을 객체로 확장하여 유연성 확보
    name: getAbsolutePath("@storybook/react-vite") as "@storybook/react-vite",
    options: {},
  },
  // Vite 빌드 설정을 커스터마이징합니다.
  viteFinal: async (config) => {
    // 1. Tailwind CSS v4 엔진 주입
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());

    // 2. 브라우저 환경에서 process.env 에러 방지
    config.define = {
      ...config.define,
      "process.env": {},
    };

    // 3. next/image 호출 시 우리가 만든 Mock 파일로 가로채기
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        // 어제 만든 mock 파일의 경로가 올바른지 확인해주세요!
        "next/image": join(__dirname, "next-image-mock.tsx"),
      },
    };

    return config;
  },
};

export default config;
