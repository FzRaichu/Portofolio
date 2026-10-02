import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import * as crypto from "node:crypto";
import { fileURLToPath } from "node:url";
const { createHmac } = crypto;
const testDirectory = path.dirname(fileURLToPath(import.meta.url));

// Run server modules with isolated, in-memory adapters; never send real email
// or modify the owner's Redis data during regression tests.
function loadModule(file, mocks = {}, env = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(testDirectory, "..", file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, Buffer, Date, URL, process: { env }, console: { error() {}, warn() {} },
    require(id) {
      if (id === "server-only") return {};
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (id === "crypto") return crypto;
      throw new Error(`Unexpected dependency: ${id}`);
    },
  }, { filename: file });
  return exports;
}

function contactAction({ store = async () => null, send = async () => ({ data: { id: "email" }, error: null }), apiKey = "test-key" } = {}) {
  return loadModule("src/app/actions/contact.ts", {
    "@/lib/messages": { addMessage: store },
    "@/lib/kv": { getSiteContent: async () => ({ email: "owner@example.com" }) },
    resend: { Resend: class { emails = { send }; } },
  }, { RESEND_API_KEY: apiKey }).sendContactMessage;
}

function form(email = "visitor@example.com", message = "Hello") {
  const data = new FormData();
  data.set("name", "Visitor"); data.set("email", email); data.set("message", message);
  return data;
}
const idle = { status: "idle", message: "" };

test("contact reports an API rejection as failure, even when send resolves", async () => {
  const action = contactAction({ send: async () => ({ data: null, error: { message: "Rejected" } }) });
  assert.equal((await action(idle, form())).status, "error");
});

test("email still delivers when Redis storage throws and uses the edited recipient", async () => {
  let recipient;
  const action = contactAction({ store: async () => { throw new Error("offline"); }, send: async (input) => {
    recipient = input.to; return { data: { id: "ok" }, error: null };
  } });
  assert.equal((await action(idle, form())).status, "success");
  assert.equal(recipient, "owner@example.com");
});

test("a stored message succeeds even when email delivery fails", async () => {
  const action = contactAction({ store: async () => ({ id: "saved" }), send: async () => { throw new Error("offline"); } });
  assert.equal((await action(idle, form())).status, "success");
});

test("invalid and oversized input never reaches storage or email", async () => {
  const action = contactAction({ store: async () => assert.fail("storage called"), send: async () => assert.fail("email called") });
  assert.equal((await action(idle, form("invalid"))).status, "error");
  assert.equal((await action(idle, form("visitor@example.com", "x".repeat(5001)))).status, "error");
});

test("contact with no configured delivery channel returns an actionable error", async () => {
  const result = await contactAction({ apiKey: "" })(idle, form());
  assert.equal(result.status, "error");
  assert.match(result.message, /owner@example.com/);
});

test("sessions reject tampering, trailing data, expiry and a missing secret", () => {
  const env = { SESSION_SECRET: "test-secret" };
  const session = loadModule("src/lib/session.ts", {}, env);
  const token = session.createSessionToken();
  assert.equal(session.verifySessionToken(token), true);
  assert.equal(session.verifySessionToken(`${token}.extra`), false);
  assert.equal(session.verifySessionToken(`x${token}`), false);
  const payload = Buffer.from(JSON.stringify({ sub: "ferciano", exp: Date.now() - 1 })).toString("base64url");
  const expired = `${payload}.${createHmac("sha256", env.SESSION_SECRET).update(payload).digest("hex")}`;
  assert.equal(session.verifySessionToken(expired), false);
  const unconfigured = loadModule("src/lib/session.ts");
  assert.equal(unconfigured.verifySessionToken(token), false);
});

test("profile validation rejects executable links and allows clearing optional fields", () => {
  const { validateContentField } = loadModule("src/lib/site-content.ts", {
    "@/lib/data": { profile: { bio: [], socials: {} } },
  });
  assert.ok(validateContentField("githubUrl", "javascript:alert(1)"));
  assert.ok(validateContentField("resumeUrl", "//untrusted.example/resume"));
  assert.ok(validateContentField("email", "invalid"));
  assert.equal(validateContentField("resumeUrl", "/resume.pdf"), null);
  assert.equal(validateContentField("githubUrl", "https://github.com/example"), null);
  assert.equal(validateContentField("githubUrl", ""), null);
  assert.ok(validateContentField("name", ""));
});
