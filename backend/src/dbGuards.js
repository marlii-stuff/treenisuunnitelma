export function safeOpenDatabase(openDbFn) {
  try {
    return { ok: true, db: openDbFn() };
  } catch (error) {
    const code = error?.code;
    const message = String(error?.message || "").toLowerCase();

    if (code === "SQLITE_CANTOPEN" || message.includes("unable to open database")) {
      return { ok: false, error: "INVALID_PATH" };
    }
    if (code === "EACCES" || code === "EPERM") {
      return { ok: false, error: "NO_PERMISSION" };
    }
    if (code === "SQLITE_CORRUPT" || message.includes("malformed") || message.includes("corrupt")) {
      return { ok: false, error: "CORRUPTED_CONTENT" };
    }
    if (code === "ENOSPC") {
      return { ok: false, error: "OUT_OF_DISK_SPACE" };
    }

    return { ok: false, error: "UNKNOWN_DB_ERROR" };
  }
}
