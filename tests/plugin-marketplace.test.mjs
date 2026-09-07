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
  assert.equal(plugin.version, "0.6.2+codex.20260907062236");
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
