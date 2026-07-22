import { describe, it, expect, vi } from "vitest";

describe("logger", () => {
  it("exporta as funções esperadas", async () => {
    const { logger } = await import("../lib/logger");
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
  });

  it("chama console.warn no nível warn", async () => {
    const { logger } = await import("../lib/logger");
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("test", "aviso");
    expect(spy).toHaveBeenCalledWith("[TEST]", "aviso");
    spy.mockRestore();
  });

  it("chama console.error no nível error", async () => {
    const { logger } = await import("../lib/logger");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("test", "erro");
    expect(spy).toHaveBeenCalledWith("[TEST]", "erro");
    spy.mockRestore();
  });

  it("passa dados extras para o console", async () => {
    const { logger } = await import("../lib/logger");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("test", "erro", { code: 500 });
    expect(spy).toHaveBeenCalledWith("[TEST]", "erro", { code: 500 });
    spy.mockRestore();
  });
});
