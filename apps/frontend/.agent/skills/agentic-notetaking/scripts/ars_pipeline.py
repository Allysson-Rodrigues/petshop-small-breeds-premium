#!/usr/bin/env python3
"""
Ars Pipeline v0.8.1 - Agentic Notetaking Orchestrator
====================================================
Implements the 6 Rs pipeline and Kernel primitives.

Commands:
    /reduce   - Extract insights with domain labels
    /reflect  - Find connections, update MOCs
    /reweave  - Update older notes with new context
    /verify   - Health check (schema + links)
    /stats    - Graph metrics
"""

import os
import sys
import argparse
import re
import yaml
from pathlib import Path
from typing import List, Dict, Optional

class ArsPipeline:
    def __init__(self, workspace_root: Path):
        self.root = workspace_root
        self.kb_path = self.root / "biblioteca-conhecimento"
        self.ops_path = self.kb_path / "90 - Sistema/ArsContexta/Ops"
        self.self_path = self.kb_path / "90 - Sistema/ArsContexta/Self"

    def _get_all_notes(self) -> List[Path]:
        return list(self.kb_path.glob("**/*.md"))

    def reduce(self, target: str):
        """Phase 1: Record -> Reduce. Summarize and atomize."""
        path = Path(target)
        if not path.exists():
            print(f"Error: {target} not found.")
            return

        print(f"[*] Reducing {path.name}...")
        # Summarization logic would be handled by the Agent calling this script
        # This script provides the structural 'hook'
        pass

    def reflect(self):
        """Phase 2: Reflect. Find connections and update MOCs."""
        print("[*] Reflecting on knowledge graph...")
        notes = self._get_all_notes()
        mocs = [n for n in notes if "MOC" in n.name]

        for note in notes:
            if "MOC" in note.name or "Templates" in str(note):
                continue

            # Check if note is in at least one MOC
            content = note.read_text()
            found_in_moc = False
            for moc in mocs:
                if f"[[{note.stem}]]" in moc.read_text():
                    found_in_moc = True
                    break

            if not found_in_moc:
                print(f"   [!] Orphan detected: {note.relative_to(self.kb_path)}")

    def reweave(self):
        """Phase 3: Reweave. Backward pass to update older notes."""
        print("[*] Reweaving older notes...")
        # Logic to suggest links based on new notes
        pass

    def verify(self, path: Optional[str] = None):
        """Phase 4: Verify. Schema + Links + Health."""
        target = Path(path) if path else self.kb_path
        print(f"[*] Verifying {target}...")

        errors = 0
        notes = list(target.glob("**/*.md")) if target.is_dir() else [target]

        for note in notes:
            content = note.read_text()

            # 1. Check YAML frontmatter
            if not content.startswith("---"):
                print(f"   [FAIL] {note.name}: Missing frontmatter")
                errors += 1
                continue

            try:
                # Basic YAML check
                parts = content.split("---")
                if len(parts) >= 3:
                    metadata = yaml.safe_load(parts[1])
                    # 2. Check description field (Kernel primitive)
                    if "description" not in metadata:
                        print(f"   [WARN] {note.name}: Missing description")
                else:
                    print(f"   [FAIL] {note.name}: Invalid YAML block")
                    errors += 1
            except Exception as e:
                print(f"   [FAIL] {note.name}: YAML parse error: {e}")
                errors += 1

            # 3. Check Wiki links
            links = re.findall(r"\[\[(.*?)\]\]", content)
            for link in links:
                # Basic check: just see if a file with that stem exists
                # In a real impl, we'd handle aliases like [[Note|Alias]]
                link_stem = link.split("|")[0]
                found = False
                for n in self._get_all_notes():
                    if n.stem == link_stem:
                        found = True
                        break
                if not found:
                    print(f"   [FAIL] {note.name}: Broken link [[{link}]]")
                    errors += 1

        print(f"\nVerification complete. {errors} errors found.")
        return errors == 0

    def distill(self, auto_archive: bool = False):
        """Phase 5: Distill. High-level extraction of Claims and Observations."""
        print("[*] Distilling knowledge from recently changed notes...")
        # In a real implementation, this would involve LLM analysis.
        # Here we simulate the pipeline step.
        notes = self._get_all_notes()
        for note in notes[:5]: # Example: process first 5 notes
            print(f"   [+] Processed: {note.stem}")

        if auto_archive:
            print("[*] Auto-archiving processed context...")

    def stats(self):
        """Vault metrics."""
        notes = self._get_all_notes()
        mocs = [n for n in notes if "MOC" in n.name]

        print("\n=== Ars Contexta Stats ===")
        print(f"📄 Total Notes: {len(notes)}")
        print(f"🗺️  MOCs: {len(mocs)}")
        if mocs:
            print(f"📊 Density: {len(notes)/len(mocs):.2f} notes/MOC")

        # Count sessions
        sessions = list((self.ops_path / "sessions").glob("*.md"))
        print(f"⏳ Sessions: {len(sessions)}")
        print("==========================\n")

def main():
    # Workspace root detection
    current = Path.cwd()
    while current != current.parent:
        if (current / ".agent").exists():
            break
        current = current.parent

    parser = argparse.ArgumentParser(description="Ars Contexta Pipeline")
    parser.add_argument("command", choices=["reduce", "reflect", "reweave", "verify", "stats", "distill"])
    parser.add_argument("target", nargs="?", default=None)
    parser.add_argument("--vault", type=str, help="Vault directory path")
    parser.add_argument("--mode", type=str, help="Mode for distill") # Alias for command
    parser.add_argument("--auto-archive", action="store_true", help="Auto-archive after distillation")

    args = parser.parse_args()

    # Use vault from args if provided
    kb_path = Path(args.vault) if args.vault else current
    pipeline = ArsPipeline(current)
    if args.vault:
        pipeline.kb_path = Path(args.vault)

    command = args.mode if args.mode else args.command

    if command == "reduce":
        pipeline.reduce(args.target or ".")
    elif command == "reflect":
        pipeline.reflect()
    elif command == "reweave":
        pipeline.reweave()
    elif command == "verify":
        pipeline.verify(args.target)
    elif command == "stats":
        pipeline.stats()
    elif command == "distill":
        pipeline.distill(auto_archive=args.auto_archive)

if __name__ == "__main__":
    main()
