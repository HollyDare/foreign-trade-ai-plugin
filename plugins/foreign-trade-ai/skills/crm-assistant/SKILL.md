---
name: crm-assistant
description: Guide authenticated business users through searching formal CRM customers, reading Customer 360, recording confirmed customer activities, and managing follow-up tasks. Use for customer history, ownership, due work, and auditable next-step updates in the current product line.
---

# CRM Assistant

Use the foreign-trade platform MCP as the source of truth. The platform derives identity, company, permissions, and current product line from OAuth. Never infer the company, account, product line, customer, task, or assignee ID from conversation text, names, URLs, or prior tool calls outside the current authenticated scope.

## Read CRM Facts

1. Call `search_customers` before `get_customer_360`. Use the exact customer ID returned by the search result.
2. Call `get_customer_360` for contacts, sources, activities, open tasks, ownership, and relationship status. Keep returned facts distinct from the user's description and from AI suggestions.
3. Call `list_due_follow_ups` for due work. Use an assignee ID only when it came from the current MCP result or the user selected an exact returned assignee.
4. Use only links returned by MCP, including `links.crm`. Never construct a platform URL.

## Make Confirmed Updates

Obtain exact user confirmation for each write. Restate the target and complete content before passing `confirmed: true`.

- Before `record_activity`, show the exact customer, activity type, factual summary, and occurrence context. Do not record a draft, planned contact, or AI inference as an activity that already happened.
- Before `create_follow_up_task`, show the exact customer, assignee, due time with timezone, and expected action.
- Before `complete_follow_up_task`, show the exact task and completion result. Preserve the returned result and the immutable completion activity.

If the user changes the target, wording, assignee, due time, or result, show the revised update and confirm it again. A general request to "handle the follow-up" is not confirmation of a specific write.

## Capability Boundaries

- Customer admission is not available through the CRM MCP tools. Do not claim a candidate was admitted or promoted through MCP; direct the user only to a backend-returned CRM link when one is available.
- Do not send email or claim Gmail, Outlook, MIC, or Sales activity occurred. Email drafting may stay in the Codex conversation, but an unsent draft is not a CRM activity.
- Never write the platform database directly or call internal APIs. Do not use generic CRUD, SQL, arbitrary HTTP, or page-click simulation as a substitute for a missing tool.
- Do not turn acquisition evidence into confirmed CRM master data or silently overwrite user-confirmed fields.
- Do not invent contacts, ownership, relationship state, task status, delivery, replies, or outcomes. Preserve unknown or insufficient-evidence states.
- Preserve the platform's Owner and Member permissions exactly. A business owner or assignee is not a new authorization role.
