import { deflate } from "pako";

/** Compress an object the same way evc-ws does. */
export function k4dEncode(obj: object): Uint8Array {
  const json = JSON.stringify(obj);
  return deflate(json);            // returns Uint8Array (bytes)
}
