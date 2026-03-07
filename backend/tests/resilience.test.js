import test from "node:test";
import assert from "node:assert/strict";
import { safeLoadJson, safeSaveJson, safeFetch } from "../src/ioGuards.js";
import { safeOpenDatabase } from "../src/dbGuards.js";

test("safeLoadJson handles missing file", async () => {
  const fsMock = {
    readFile: async () => {
      const error = new Error("missing");
      error.code = "ENOENT";
      throw error;
    }
  };

  const result = await safeLoadJson("bad/path.json", fsMock);
  assert.deepEqual(result, { ok: false, error: "FILE_NOT_FOUND" });
});

test("safeLoadJson handles corrupted content", async () => {
  const fsMock = { readFile: async () => "{broken json" };
  const result = await safeLoadJson("any.json", fsMock);
  assert.deepEqual(result, { ok: false, error: "CORRUPTED_CONTENT" });
});

test("safeSaveJson handles invalid path, no permission and out of disk", async () => {
  const invalidPathFs = {
    writeFile: async () => {
      const error = new Error("invalid path");
      error.code = "ENOENT";
      throw error;
    }
  };

  const noPermissionFs = {
    writeFile: async () => {
      const error = new Error("permission denied");
      error.code = "EACCES";
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

  assert.deepEqual(await safeSaveJson("x", {}, invalidPathFs), { ok: false, error: "INVALID_PATH" });
  assert.deepEqual(await safeSaveJson("x", {}, noPermissionFs), { ok: false, error: "NO_PERMISSION" });
  assert.deepEqual(await safeSaveJson("x", {}, noSpaceFs), { ok: false, error: "OUT_OF_DISK_SPACE" });
});

test("safeFetch handles internet connection failures", async () => {
  const fetchMock = async () => {
    throw new Error("getaddrinfo ENOTFOUND api.example.test");
  };

  const result = await safeFetch("https://api.example.test", fetchMock);
  assert.deepEqual(result, { ok: false, error: "NETWORK_ERROR" });
});

test("safeOpenDatabase maps database failure reasons", () => {
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

  assert.deepEqual(invalidPath, { ok: false, error: "INVALID_PATH" });
  assert.deepEqual(noPermission, { ok: false, error: "NO_PERMISSION" });
  assert.deepEqual(corrupted, { ok: false, error: "CORRUPTED_CONTENT" });
  assert.deepEqual(outOfSpace, { ok: false, error: "OUT_OF_DISK_SPACE" });
});
