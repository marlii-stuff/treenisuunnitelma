import test from "node:test";
import assert from "node:assert/strict";
import { safeLoadJson, safeSaveJson, safeFetch } from "../src/ioGuards.js";
import { safeOpenDatabase } from "../src/dbGuards.js";

test("safeLoadJson handles success, missing file, permission and corrupted content", async () => {
  const successFs = { readFile: async () => '{"ok":true,"text":"中文 العربية"}' };
  const missingFs = {
    readFile: async () => {
      const error = new Error("missing");
      error.code = "ENOENT";
      throw error;
    }
  };
  const deniedFs = {
    readFile: async () => {
      const error = new Error("permission denied");
      error.code = "EACCES";
      throw error;
    }
  };
  const corruptedFs = { readFile: async () => "{broken json" };

  assert.deepEqual(await safeLoadJson("ok.json", successFs), { ok: true, data: { ok: true, text: "中文 العربية" } });
  assert.deepEqual(await safeLoadJson("missing.json", missingFs), { ok: false, error: "FILE_NOT_FOUND" });
  assert.deepEqual(await safeLoadJson("denied.json", deniedFs), { ok: false, error: "NO_PERMISSION" });
  assert.deepEqual(await safeLoadJson("bad.json", corruptedFs), { ok: false, error: "CORRUPTED_CONTENT" });
});

test("safeSaveJson handles invalid path, no permission, out of disk and unknown errors", async () => {
  const invalidPathFs = {
    writeFile: async () => {
      const error = new Error("invalid path");
      error.code = "ENOENT";
      throw error;
    }
  };
  const deniedFs = {
    writeFile: async () => {
      const error = new Error("permission denied");
      error.code = "EPERM";
      throw error;
    }
  };
  const noSpaceFs = {
    writeFile: async () => {
      const error = new Error("no space");
      error.code = "ENOSPC";
      throw error;
    }
  };
  const unknownFs = {
    writeFile: async () => {
      throw new Error("other write error");
    }
  };

  assert.deepEqual(await safeSaveJson("x", {}, invalidPathFs), { ok: false, error: "INVALID_PATH" });
  assert.deepEqual(await safeSaveJson("x", {}, deniedFs), { ok: false, error: "NO_PERMISSION" });
  assert.deepEqual(await safeSaveJson("x", {}, noSpaceFs), { ok: false, error: "OUT_OF_DISK_SPACE" });
  assert.deepEqual(await safeSaveJson("x", {}, unknownFs), { ok: false, error: "UNKNOWN_WRITE_ERROR" });
});

test("safeFetch handles success, http error and internet connection failures", async () => {
  const successFetch = async () => ({ ok: true, json: async () => ({ value: 42.5 }) });
  const httpErrorFetch = async () => ({ ok: false, status: 503, json: async () => ({}) });
  const networkFailFetch = async () => {
    throw new Error("getaddrinfo ENOTFOUND api.example.test");
  };

  assert.deepEqual(await safeFetch("https://api.example.test", successFetch), { ok: true, data: { value: 42.5 } });
  assert.deepEqual(await safeFetch("https://api.example.test", httpErrorFetch), {
    ok: false,
    error: "HTTP_ERROR",
    status: 503
  });
  assert.deepEqual(await safeFetch("https://api.example.test", networkFailFetch), {
    ok: false,
    error: "NETWORK_ERROR"
  });
});

test("safeOpenDatabase maps database failure reasons and unknown errors", () => {
  const invalidPath = safeOpenDatabase(() => {
    const error = new Error("unable to open database file");
    error.code = "SQLITE_CANTOPEN";
    throw error;
  });
  const noPermission = safeOpenDatabase(() => {
    const error = new Error("permission denied");
    error.code = "EPERM";
    throw error;
  });
  const corrupted = safeOpenDatabase(() => {
    const error = new Error("database disk image is malformed");
    error.code = "SQLITE_CORRUPT";
    throw error;
  });
  const outOfSpace = safeOpenDatabase(() => {
    const error = new Error("no space left on device");
    error.code = "ENOSPC";
    throw error;
  });
  const unknown = safeOpenDatabase(() => {
    throw new Error("unexpected db failure");
  });

  assert.deepEqual(invalidPath, { ok: false, error: "INVALID_PATH" });
  assert.deepEqual(noPermission, { ok: false, error: "NO_PERMISSION" });
  assert.deepEqual(corrupted, { ok: false, error: "CORRUPTED_CONTENT" });
  assert.deepEqual(outOfSpace, { ok: false, error: "OUT_OF_DISK_SPACE" });
  assert.deepEqual(unknown, { ok: false, error: "UNKNOWN_DB_ERROR" });
});
