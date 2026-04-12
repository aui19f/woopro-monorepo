# 🚀 Woopro Monorepo
> **Next.js 15+** | **Turborepo** | **Tailwind v4** 기반

![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=Turborepo&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=Tailwind-CSS&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)

---

## 🏗️ Project Structure
연관성 없는 독립적인 앱들을 하나의 워크스페이스에서 효율적으로 관리합니다.

| 분류 | 경로 | 설명 |
| :--- | :--- | :--- |
| **Apps** | `apps/*` | 독립적인 서비스 앱 (예정) |
| **Packages** | `packages/ui` | 공용 디자인 시스템 (Tailwind v4 기반) |

## 🛠️ Quick Start
```bash
# 의존성 설치
pnpm install

# 전체 개발 서버 실행
pnpm dev

# 특정 패키지만 테스트 실행 (예: UI 패키지)
pnpm test --filter=@repo/ui
