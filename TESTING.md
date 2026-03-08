# Testing Standards and Coverage

This project uses Node's built-in test runner (`node:test`) for backend unit tests.

## Standards
- Deterministic tests: no reliance on external network/filesystem state
- AAA structure: Arrange, Act, Assert
- Edge-case first design for input validation
- Error-path coverage for I/O and database guards
- Unicode safety coverage (non-Latin scripts)

## Test Suite

### `backend/tests/validation.test.js`
Covers validation and normalization rules, including edge cases often missed by generic test generation:
- Chinese and Arabic text in user fields
- Very long string boundaries (name, pace target, notes)
- Decimal numbers
- `NaN`, `Infinity`, `-Infinity`
- Date format validation
- Trim and type coercion behavior in normalization

### `backend/tests/resilience.test.js`
Covers guard utilities for failure mapping:
- File read/write failure modes:
  - invalid path
  - missing file
  - permission denied
  - corrupted content
  - out of disk space
  - unknown errors
- Internet/API failures:
  - HTTP non-2xx status
  - connection failure
- Database opening failures:
  - invalid path
  - permissions
  - corruption
  - out of disk space
  - unknown errors

### `backend/tests/workoutRepository.test.js`
Covers SQLite repository behavior with in-memory DB:
- CRUD workflow correctness
- History logging on create/update/delete
- Unicode and long text persistence
- Missing row handling (update/delete)
- History limit behavior and payload deserialization

## Running Tests

```bash
npm run test -w backend
```

The backend test script uses:

```bash
node --test --test-isolation=none
```

This avoids process-spawn isolation issues in restricted environments while preserving unit-test determinism.
