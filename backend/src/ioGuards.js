import fs from "node:fs/promises";

export async function safeLoadJson(filePath, fsModule = fs) {
  try {
    const content = await fsModule.readFile(filePath, "utf8");
    return { ok: true, data: JSON.parse(content) };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { ok: false, error: "FILE_NOT_FOUND" };
    }
    if (error.code === "EACCES" || error.code === "EPERM") {
      return { ok: false, error: "NO_PERMISSION" };
    }
    if (error instanceof SyntaxError) {
      return { ok: false, error: "CORRUPTED_CONTENT" };
    }
    return { ok: false, error: "UNKNOWN_READ_ERROR" };
  }
}

export async function safeSaveJson(filePath, data, fsModule = fs) {
  try {
    await fsModule.writeFile(filePath, JSON.stringify(data), "utf8");
    return { ok: true };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { ok: false, error: "INVALID_PATH" };
    }
    if (error.code === "EACCES" || error.code === "EPERM") {
      return { ok: false, error: "NO_PERMISSION" };
    }
    if (error.code === "ENOSPC") {
      return { ok: false, error: "OUT_OF_DISK_SPACE" };
    }
    return { ok: false, error: "UNKNOWN_WRITE_ERROR" };
  }
}

export async function safeFetch(url, fetchFn = fetch) {
  try {
    const response = await fetchFn(url);
    if (!response.ok) {
      return { ok: false, error: "HTTP_ERROR", status: response.status };
    }
    return { ok: true, data: await response.json() };
  } catch {
    return { ok: false, error: "NETWORK_ERROR" };
  }
}
