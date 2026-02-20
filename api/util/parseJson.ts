export default function parseJson<T extends object>(
  json : string,
  requiredKeys : (keyof T)[]
) : T {
  const obj = JSON.parse(json);

  if (typeof obj !== "object" || obj === null) {
    throw new Error("Invalid JSON");
  }

  for (const key of requiredKeys) {
    // deno-lint-ignore no-explicit-any
    if ((obj as any)[key] == null) {
      throw new Error(`Missing field: ${String(key)}`);
    }
  }

  return obj as T;
}