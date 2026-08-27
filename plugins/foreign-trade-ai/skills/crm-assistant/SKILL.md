---
name: crm-assistant
description: Guide authenticated business users through controlled acquisition-candidate admission, formal CRM customers, Gmail or Outlook message archival, follow-up tasks, flexible opportunities, samples, costing, quotations, optional PI, and confirmed sales-order entry in the current product line.
---

# CRM Assistant

Use the foreign-trade platform MCP as the source of truth. The platform derives identity, company, permissions, and current product line from OAuth. Never infer the company, account, product line, customer, task, or assignee ID from conversation text, names, URLs, or prior tool calls outside the current authenticated scope.

## Read CRM Facts

1. Call `search_customers` before `get_customer_360`. Use the exact customer ID returned by the search result.
2. Call `get_customer_360` for contacts, sources, activities, archived conversations, open tasks, ownership, relationship status, and the `sales.costingSheets`, `sales.quotations`, `sales.proformaInvoices`, and `sales.salesOrders` summaries. Keep returned facts distinct from the user's description and from AI suggestions.
3. Call `get_customer_communication_context` before drafting or replying so the user can review the exact contact, recent archived messages, open follow-ups, and do-not-contact state.
4. Call `list_customer_conversations` when the user wants the archived Gmail or Outlook thread evidence. This reads company CRM snapshots, not the live mailbox.
5. Call `list_due_follow_ups` for due work. Use an assignee ID only when it came from the current MCP result or the user selected an exact returned assignee.
6. Call `get_order_readiness` before describing an opportunity as ready for ERP order entry. Report every returned blocker; do not infer readiness from the opportunity's current focus.
7. Use only links returned by MCP, including `links.crm`. Never construct a platform URL.

## Read Sample Facts

1. Read `sampleRequests` from `get_customer_360`, or call `get_sample_request` with an exact returned sample request ID for its current state, versions, customer feedback, and shipment facts.
2. Keep sample type, broad status, current focus, physical version, customer feedback, and shipment as separate facts. Do not infer one from another.
3. A sample focus may move backward or forward between requirements, preparation, customer review, and shipment. Never imply that these are mandatory sequential gates.

## Admit An Acquisition Candidate

1. Use `list_acquisition_customers` to resolve the exact acquisition account ID in the current OAuth product line. Never substitute a company name, guessed ID, MIC record, or manually supplied customer payload.
2. Call `preview_customer_admission` with that ID and the exact CRM owner. Select a contact and email only by IDs returned for the same candidate; leaving them unselected means they will not enter formal CRM data.
3. If the preview reports possible matches, show every match reason and field conflict. Ask the user whether to create a new customer or bind an existing customer, then call `preview_customer_admission` again with that exact decision. Never choose a duplicate target silently.
4. Show the complete signed preview: source candidate, formal fields, selected contact, owner, create-or-bind decision, conflicts, and effect. The preview does not write CRM data.
5. Only after exact user confirmation, pass the returned preview token unchanged to `admit_customer_to_crm` with `confirmed: true`. Never reconstruct or edit fields outside the preview token.
6. Use the returned customer ID with `get_customer_360`. Report whether a customer was created or an existing customer was bound, separately from any later activity, task, opportunity, or email action.

## Read Costing And Quotation Facts

1. Read the current customer's costing and quotation summaries from `get_customer_360`. Use only exact costing, quotation, opportunity, sample, and version IDs returned in the authenticated scope.
2. Call `get_quotation` before revising, sending, accepting, or explaining a quotation. Treat its saved cost snapshot, price tiers, margin calculations, commercial terms, sent state, and acceptance evidence as platform facts.
3. Call `compare_quotation_versions` when the user asks what changed. Report saved differences without presenting an AI explanation as an approved price decision.

## Read PI And Sales Order Facts

1. PI is optional. Use `get_proforma_invoice` only when the buyer or company process needs a PI; an accepted quotation or evidenced customer PO may proceed to order preview without one.
2. Call `get_sales_order` before explaining a confirmed order or recording a later change. Treat its source, frozen commercial terms, color-size quantities, confirmation, and appended changes as platform facts.
3. Call `preview_sales_order` first for every order path. Show the complete source, customer, opportunity, order number, terms, lines, totals, evidence, and preview expiry. The preview does not create an order.
4. Only after exact user confirmation, pass the returned preview token unchanged to `create_sales_order` with `confirmed: true`. Never reconstruct or edit a signed preview token.
5. A successful sales order is the only fact in this workflow that marks its opportunity won. Report the order creation and resulting opportunity status together.

## Gmail or Outlook Loop

1. Detect whether a separately authorized Gmail or Outlook tool is available. If neither is available, prepare a reviewable draft only and do not claim it was sent.
2. If `get_customer_communication_context` returns `doNotContact: true`, stop before drafting or sending and tell the user that the customer is marked do not contact.
3. For sending, show the exact mailbox, recipients, subject, body, and attachments before using the mailbox tool. The mailbox tool owns sending; the CRM MCP does not.
4. After the mailbox tool returns the provider mailbox, thread, and message identity, show the exact message snapshot and customer association. Obtain a separate confirmation before calling `archive_customer_message` with `confirmed: true`.
5. For an incoming reply, require the user to select or confirm the exact Gmail or Outlook message and customer before `archive_customer_message`. Use `reply_observed` only for an inbound reply and `provider_confirmed_sent` only for an outbound provider result.
6. Report sending and CRM archival as separate results. If sending succeeded but archival failed, retry CRM archival with the same external message identity and never send again.
7. Create the next action through `create_follow_up_task` only after separate confirmation. A successful archive remains valid if task creation fails.

## Make Confirmed Updates

Obtain exact user confirmation for each write. Restate the target and complete content before passing `confirmed: true`.

- Before `record_activity`, show the exact customer, activity type, factual summary, and occurrence context. Do not record a draft, planned contact, or AI inference as an activity that already happened.
- Before `archive_customer_message`, show the exact customer, provider mailbox, thread and message identity, direction, evidence level, sender, recipients, subject, body, attachments, external link, and occurrence time.
- Before `create_follow_up_task`, show the exact customer, assignee, due time with timezone, and expected action.
- Before `complete_follow_up_task`, show the exact task and completion result. Preserve the returned result and the immutable completion activity.
- Before `create_opportunity`, show the exact customer, title, requirement summary, owner, current focus, and either the first follow-up task or waiting reason.
- Before `update_opportunity`, show the current and proposed macro status, current focus, requirements, continuity reason, and any commercial confirmation evidence. The focus may move freely between requirements, sampling, quotation, negotiation, and commercial confirmation; never imply a required sequence.
- Before `create_sample_request`, show the exact customer, opportunity, sample type, title, requirements, quantity, needed time, owner, and current focus.
- Before `update_sample_request`, call `get_sample_request`, then show its current version and the proposed broad status, current focus, waiting reason, and closure reason.
- Before `add_sample_version`, show the exact sample request, version label, change summary, and evidence reference.
- Before `record_sample_feedback`, show the exact sample request and version, verdict, summary, evidence reference, and received time.
- Before `record_sample_shipment`, show the exact sample request and version, carrier, tracking number and URL, recipient, and shipped time.
- Before `create_costing_sheet`, show the exact customer, opportunity, optional sample, title, product reference, currency, every cost component, evidence reference, and notes.
- Before `update_costing_sheet`, re-read the current costing version, then show the current and proposed currency, every component, evidence reference, notes, and expected version.
- Before `create_quotation`, show the exact customer, opportunity, costing-sheet version, title, cost snapshot, currency and exchange rate, Incoterm, MOQ, lead time, payment terms, validity, every price tier and projected margin, notes, and evidence reference.
- Before `add_quotation_version`, call `get_quotation`, then show the exact quotation, latest saved version, new costing snapshot, complete proposed terms, price tiers, evidence, and change summary. This appends a draft and never replaces history.
- Before `update_quotation_version`, call `get_quotation`, verify that the target version is still a draft, then show its current revision and every proposed field.
- Before `mark_quotation_version_sent`, call `get_quotation`, show the exact draft version and send time, and explain that this only records a confirmed external send. It does not send email.
- Before `record_quotation_acceptance`, call `get_quotation`, show the exact sent version, acceptance time, summary, and evidence reference. An accepted fact must reference a sent quotation version.
- Before `create_proforma_invoice`, call `get_quotation`, verify the exact version was accepted, then show the PI number, buyer reference, delivery date, address, every line and color-size quantity, total, notes, and evidence. This creates a draft only.
- Before `update_proforma_invoice`, call `get_proforma_invoice`, verify it is still a draft, then show its current revision and every proposed field.
- Before `confirm_proforma_invoice`, call `get_proforma_invoice`, show the exact PI snapshot, customer confirmation time, and evidence. Confirmation locks the PI.
- Before `create_sales_order`, use `preview_sales_order` and show the complete returned order preview and expiry. Confirm the unchanged token separately; do not treat the earlier quotation, PI, or PO confirmation as order confirmation.
- Before `record_sales_order_change`, call `get_sales_order`, then show the exact order, change time, summary, evidence, and every before/after value. This appends history and does not rewrite the confirmed order.

If the user changes the target, wording, assignee, due time, or result, show the revised update and confirm it again. A general request to "handle the follow-up" is not confirmation of a specific write.

## Capability Boundaries

- Customer admission is limited to the two-step `preview_customer_admission` and `admit_customer_to_crm` flow for a real candidate in the current OAuth product line. It does not support manual arbitrary customer creation, MIC admission, generic CRUD, SQL, arbitrary HTTP, or direct database access.
- The CRM MCP never sends email and never stores Gmail or Outlook OAuth credentials. Use only a separately authorized mailbox tool, and never claim a draft or an unconfirmed provider result is a CRM activity.
- Do not expose or reconstruct a generic `send_email` operation through CRM tools. `archive_customer_message` stores confirmed evidence only.
- Never write the platform database directly or call internal APIs. Do not use generic CRUD, SQL, arbitrary HTTP, or page-click simulation as a substitute for a missing tool.
- Binding a candidate must not silently overwrite formal customer fields or contacts. Conflicting acquisition evidence remains source evidence for later review.
- Do not invent contacts, ownership, relationship state, task status, delivery, replies, or outcomes. Preserve unknown or insufficient-evidence states.
- Do not call `update_opportunity` to mark an opportunity won. A confirmed sales order created by `create_sales_order` owns that transition; `get_order_readiness` and `preview_sales_order` do not create an order.
- Sample tools do not create BOMs, costs, quotations, PIs, sales orders, or email. They only store the confirmed sample request and its version, feedback, and shipment facts.
- Costing and quotation tools do not create BOMs, PIs, sales orders, approval decisions, or email. AI may organize evidence and draft terms, but it must not decide the minimum selling price or bypass company approval.
- A sent quotation version is immutable. Use `add_quotation_version` for any later commercial revision; never rewrite the sent snapshot.
- `mark_quotation_version_sent` records an externally confirmed event and does not send email. `record_quotation_acceptance` only records an accepted fact against an exact sent quotation version.
- A confirmed PI and a sales order are immutable snapshots. Use `record_sales_order_change` for later order differences; never overwrite the original order.
- `preview_sales_order` is read-only and short-lived. `create_sales_order` is idempotent for the same signed preview and requires a separate exact confirmation.
- Preserve the platform's Owner and Member permissions exactly. A business owner or assignee is not a new authorization role.
