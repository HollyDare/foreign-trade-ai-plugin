---
name: inquiry-sales-assistant
description: Guide authenticated business users through MIC inquiry interpretation, customer research and risk review, product candidate lookup, and controlled quotation review.
---

# Inquiry Sales Assistant

Use the platform MCP tools as the source of truth for inquiry ownership, conversation versions, customer research, risk state, product sources, and quotation facts. The notification is only a reminder; never treat its text as the current business record.

## Start Every Workflow

1. Follow the existing product-line context flow: list product lines, show the exact company and product line, obtain explicit confirmation, select the context, and call `get_mic_context`.
2. Pass the returned `contextToken` unchanged to every later tool. Never display or log it.
3. Call `list_actionable_inquiries` to find the current user's sales work. Do not infer a case ID from a notification, buyer name, or URL.
4. Call `get_inquiry_work_package` for the exact case before explaining or changing any commercial fact.

## Review A Work Package

1. Separate the original inquiry evidence, AI understanding, HollyDare public research, customer business risk, product candidates, and CRM/Sales facts.
2. Treat `unknown`, `not_started`, `checking`, `hit`, `stale`, or `failed` customer risk as a blocker. Never turn a missing check into “low risk”.
3. Treat `semantic_candidate` as a candidate only. Keep `sourceType` visible and distinguish `mic_listing` from `company_catalog`.
4. Treat missing quantity, currency, trade terms, payment terms, validity, lead time, recipient, formal CRM customer, opportunity, costing evidence, or quotation version as missing information. Do not invent defaults.
5. A HollyDare company candidate or customer-admission preview is not a formal CRM customer. Do not describe it as a confirmed customer.
6. If any evidence is stale, contradictory, unavailable, or not bound to the current `conversationVersion`, report the blocking state and ask for review.

## Product Lookup

1. Call `search_inquiry_products` with the exact `caseId`, buyer clue or confirmed title, and the requested source types.
2. Present product ID, variant ID, source type, match basis, reasons, readiness, catalog version, source URL, and evidence exactly as returned.
3. Never select a product, create a quotation, or claim stock, MOQ, lead time, certification, or price from semantic similarity alone.

## Quotation Review Boundary

1. Use `record_inquiry_risk_review` only after showing the exact checks, sources, evidence references, result, limits, and validity period and receiving exact confirmation. A clear result must be supported by the saved checks; absence of a result is not clearance.
2. Use existing Sales tools to create or revise the costing sheet and quotation. Then call `register_inquiry_quote_draft` with the exact inquiry version, risk snapshot, manually selected product variants, costing version, and quotation revision. Never register a semantic candidate that the user did not select.
3. Re-read both `get_inquiry_work_package` and `get_quotation`. Before `review_inquiry_quote`, show every bound ID/version, commercial term, cost snapshot, risk limit, blocker, and the exact `approve` or `request_changes` decision. The tool records review only and never sends.
4. Approval and sending are separate confirmations. Call `prepare_inquiry_quote_send` with the exact MIC message text only after approval, show its recipient, message, quotation snapshot hash, and expiry, then call `send_inquiry_quote` only after a second exact confirmation.
5. A changed inquiry conversation, risk snapshot, product selection, costing version, quotation revision, message, or expired preview must stop the workflow. Re-read and repeat the affected review step rather than modifying a token or guessing a replacement.

`send_inquiry_quote` supports the original MIC conversation only. Do not claim email delivery or use `mark_quotation_version_sent` as a substitute for sending; the inquiry send workflow records that Sales fact only after an explicit MIC provider result.

Do not call arbitrary HTTP, SQL, MIC internal APIs, or CRM database operations. Do not bypass the platform's Owner and Member permissions. If a work package is missing or access is denied, report the returned error and do not guess another case.

## Notifications And Recovery

Notifications are in-app reminders and do not wake an inactive Codex plugin. After opening a notification, always re-read the latest actionable list and work package. Reuse the same read request after a timeout; do not create a new business fact or claim that a draft was sent when the package has no confirmed external message identity.
