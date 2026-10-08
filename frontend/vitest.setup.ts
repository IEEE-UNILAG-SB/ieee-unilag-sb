import * as React from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src?: string; alt?: string }) =>
    React.createElement("img", {
      src: props.src ?? "",
      alt: props.alt ?? "",
    }),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => React.createElement("a", { href }, children),
}));
