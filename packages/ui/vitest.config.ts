import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
          // 스토리 파일들만 대상으로 설정
          include: ["src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
        },
      },
      // 2. 단위 테스트 프로젝트 (새로 추가 ⭐)
      {
        test: {
          name: "unit", // 프로젝트 이름
          environment: "jsdom", // 브라우저 대신 가상 DOM 사용 (속도 향상)
          include: ["src/**/*.test.@(js|jsx|mjs|ts|tsx)"], // .test.tsx 파일들 대상
          globals: true, // describe, it 등을 전역으로 사용
        },
      },
    ],
  },
});
