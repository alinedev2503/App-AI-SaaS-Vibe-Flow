import { describe, it, expect } from "vitest";
import { cn } from "../lib/utils";

describe("cn", () => {
  it("combina class names simples", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("remove valores falsy", () => {
    expect(cn("foo", false, null, undefined, 0, "bar")).toBe("foo bar");
  });

  it("mescla classes do Tailwind corretamente", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });

  it("aceita objetos condicionais", () => {
    expect(cn({ foo: true, bar: false })).toBe("foo");
  });

  it("retorna string vazia sem argumentos", () => {
    expect(cn()).toBe("");
  });
});
