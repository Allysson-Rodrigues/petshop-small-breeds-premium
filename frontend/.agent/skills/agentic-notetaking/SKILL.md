---
name: agentic-notetaking
description: Master of recursive knowledge curation using the Ars Contexta framework (6 Rs pipeline).
allowed-tools: Read, Write, Edit, Search
version: 1.0
priority: HIGH
---

# Agentic Notetaking - Ars Contexta Framework

> **Philosophy**: Intelligence is not just about having information, but about the recursive processing of that information into distilled, interconnected knowledge.

---

## The 6 Rs Pipeline

Every session or major learning block must pass through these stages:

1. **Reduce**: Filter the noise. Extract only the essence from logs and research.
2. **Reflect**: Metacognition. What did we learn? What surprised us? What are the key takeaways?
3. **Reweave**: Connect the dots. Use `[[wiki-links]]` to link new notes to existing MOCs (Maps of Content).
4. **Verify**: Grounding. Ensure every technical claim is backed by documentation or empirical test.
5. **Rethink**: Challenge assumptions. Is there a better way? What are the trade-offs?
6. **Refactor**: Optimization. Re-organize notes and knowledge structures to maintain clarity.

---

## Core Primitives

| Primitive | Rule |
|-----------|------|
| **Atomic Note** | One concept per note. Self-contained and addressable. |
| **Wiki-Links** | Use them aggressively to create a semantic graph. |
| **MOC (Map of Content)** | A hub that lists related atomic notes for a specific topic. |
| **Session Log** | Capture of the cognitive process, not just the output. |

---

## Writing Standards (Atomic Notes)

- **Bloco `_schema`**: Every atomic note should start with an optional metadata block.
- **Conciseness**: Avoid fluff. Use bullet points and headers.
- **Grounding**: Cite the source or the session where the knowledge was born.

---

## Knowledge Verification

When asked to "Verify" or "Audit" knowledge:
- Use `ars_pipeline.py --verify <path>` to check for broken links.
- Check if claims in `90 - Sistema/ArsContexta/Claims` still hold true.

---

## Anti-Patterns

- ❌ **Copy-pasting long logs**: Always **Reduce** before saving.
- ❌ **Isolated Notes**: Notes without links are "orphans" and should be avoided.
- ❌ **Monolithic Files**: If a note covers two topics, split it into two atomic notes.
