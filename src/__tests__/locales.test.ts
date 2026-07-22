import { describe, it, expect } from "vitest";
import { ptBR } from "../locales/pt-BR";
import { enUS } from "../locales/en-US";
import { esES } from "../locales/es-ES";

function flattenKeys(obj: Record<string, any>, prefix = ""): string[] {
  return Object.keys(obj).reduce((acc: string[], key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      acc.push(...flattenKeys(obj[key], path));
    } else {
      acc.push(path);
    }
    return acc;
  }, []);
}

describe("locales", () => {
  const ptKeys = flattenKeys(ptBR);
  const enKeys = flattenKeys(enUS);
  const esKeys = flattenKeys(esES);

  it("en-US tem todas as chaves de pt-BR", () => {
    const missing = ptKeys.filter((k) => !enKeys.includes(k));
    expect(missing, `Chaves faltando em en-US: ${missing.join(", ")}`).toEqual([]);
  });

  it("es-ES tem todas as chaves de pt-BR", () => {
    const missing = ptKeys.filter((k) => !esKeys.includes(k));
    expect(missing, `Chaves faltando em es-ES: ${missing.join(", ")}`).toEqual([]);
  });

  it("pt-BR tem todas as chaves de en-US", () => {
    const missing = enKeys.filter((k) => !ptKeys.includes(k));
    expect(missing, `Chaves faltando em pt-BR: ${missing.join(", ")}`).toEqual([]);
  });

  it("não contém valores vazios em nenhum locale", () => {
    const checkEmpty = (obj: Record<string, any>, lang: string) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "string") {
          expect(value.trim(), `${lang}.${key} está vazio`).not.toBe("");
        } else if (typeof value === "object" && value !== null) {
          checkEmpty(value, `${lang}.${key}`);
        }
      });
    };
    checkEmpty(ptBR, "pt-BR");
    checkEmpty(enUS, "en-US");
    checkEmpty(esES, "es-ES");
  });
});
