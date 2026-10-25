# Slipmark context demo

Your reviewer passed the code. Who wrote the reviewer's instructions?

The 2026 attacks on coding agents mostly left the code alone. They changed what
the agent was told: an AGENTS.md pointing at an image with hidden text
(Ghostcommit), an MCP server whose tools turned malicious after approval
(Deadbugz), skills with instructions in HTML comments GitHub doesn't show.
A review verdict bound only to the code can be valid on paper and worthless in
practice.

This repo runs [Slipmark](https://github.com/founder-ship-it/Slipmark) v0.5.0
with one line in its policy, `"context": {}`. Each open pull request is one
attack. Every attacking PR also carries a passing verdict from an agent, as an
attacker's would. Look at the checks on each.

| Pull request | What it does | Gate |
|---|---|---|
| `attack/ghostcommit` | AGENTS.md links an image with near-white text telling the agent to log `process.env` | Refused: `hidden_content`, `context_unapproved` |
| `attack/hidden-comment` | Adds a release skill with an instruction in an HTML comment | Refused: `hidden_content`, `context_unapproved` |
| `attack/invisible-text` | Hides a sentence in AGENTS.md with invisible Unicode tag characters | Refused: `hidden_content`, `context_unapproved` |
| `attack/deadbugz` | Adds an MCP server on `@latest`, so its tools can change after approval | Refused: `context_unapproved`, `context_changed` |
| `attack/loosen-policy` | Deletes the `context` section from the policy, then hides a comment in AGENTS.md | Refused: the policy is read from `main`, not the PR |
| `ok/code-change` | A normal code fix with a fresh agent verdict | Passes |
| `ok/approved-context` | A visible change to AGENTS.md, approved by a person | Passes |

The injected text is labelled `DEMO INJECTION` and does nothing harmful.

## What the gate checks

1. **Verdicts record their context.** When an agent records a verdict,
   Slipmark hashes AGENTS.md, CLAUDE.md, skills, hooks, Cursor rules and MCP
   configs, and stores the list with the verdict.
2. **A verdict lapses when its context changes.** Change any of those files and
   every earlier agent verdict stops counting (`context_changed`).
3. **A context change needs an approver.** A changed context file needs a
   passing verdict from a person (`context_unapproved`). Here CODEOWNERS makes
   GitHub enforce that the approver is real.
4. **Agent instructions must be plain Markdown GitHub shows in full.** Images,
   HTML, comments, invisible characters and anything unknown are refused
   (`hidden_content`). In Actions the file is also checked against GitHub's own
   renderer: every word in the file has to appear on the page.
5. **The policy comes from the branch you merge into.** A PR can't switch the
   checks off for itself.

Policy for this repo, in `.slipmark/policy.json`:

```json
{
  "schema": "slipmark/policy@1",
  "coverage": { "mode": "diff", "base": "origin/main", "ignore": ["README.md", "results/**"] },
  "context": {}
}
```

## Try it on your repo

```bash
npx slipmark@0.5.0 init
```

Then add `"context": {}` to `.slipmark/policy.json`. Details and limits are in
the [docs](https://github.com/founder-ship-it/Slipmark/blob/main/docs/attestation.md#agent-context).

## What it doesn't cover

It hashes MCP configs and pinned versions, not the tool definitions a server
returns at run time. Files the instructions point to only count as context if
you add them to the policy. The full list is in the docs.

Built by [Reply Intelligence Group](https://replyintelligencegroup.co.uk) in Watford.
