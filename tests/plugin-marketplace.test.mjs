import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const marketplace = JSON.parse(readFileSync(".agents/plugins/marketplace.json", "utf8"));
const plugin = JSON.parse(readFileSync("plugins/foreign-trade-ai/.codex-plugin/plugin.json", "utf8"));
const mcp = JSON.parse(readFileSync("plugins/foreign-trade-ai/.mcp.json", "utf8"));
const readme = readFileSync("README.md", "utf8");

test("remote MCP authentication is deferred until first use", () => {
  const entry = marketplace.plugins.find((candidate) => candidate.name === "foreign-trade-ai");

  assert.equal(entry?.policy.authentication, "ON_USE");
  assert.equal(mcp.mcpServers["foreign-trade-ai"].url, "https://hollydare.cloud/api/mcp");
});

test("repair instructions require the current release and policy", () => {
  assert.equal(plugin.version, "0.8.2+codex.2026100102");
  assert.ok(readme.includes(plugin.version));
  assert.match(readme, /codex plugin marketplace upgrade hollydare/);
  assert.match(readme, /codex plugin remove foreign-trade-ai@hollydare/);
  assert.match(readme, /authPolicy.*ON_USE/);
  assert.match(readme, /完全退出并重新打开 Codex/);
});

test("product development guidance includes controlled technical version publication", () => {
  const skill = readFileSync("plugins/foreign-trade-ai/skills/product-development-assistant/SKILL.md", "utf8");
  for (const capability of ["create_size_chart_draft", "preview_publish_size_chart", "publish_size_chart", "sizeRatio", "evidenceReference", "construction", "labeling", "packaging", "specialProcesses"]) {
    assert.ok(skill.includes(capability), `missing ${capability}`);
  }
});

test("acquisition guidance ends at CRM admission", () => {
  const skill = readFileSync("plugins/foreign-trade-ai/skills/acquisition-assistant/SKILL.md", "utf8");
  const workflow = readFileSync("plugins/foreign-trade-ai/skills/acquisition-assistant/references/acquisition-workflow.md", "utf8");
  assert.match(workflow, /start_codex_acquisition/);
  assert.match(skill, /Do not generate outreach drafts or send emails here/);
  assert.doesNotMatch(workflow, /## Outreach drafts/);
  assert.match(workflow, /those activities in the CRM workflow/);
});
