import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import sum from "../src/mod.ts"

Deno.test("sum test", () => {
  assertEquals(sum(1,2), 3);
});
