"""
CLI helper: validate evidence_link policy for rows in data/strict_candidates.csv.
Loads pipeline module from file path (no package install required).
"""
from __future__ import annotations

import csv
import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANDIDATES = ROOT / "data" / "strict_candidates.csv"


def _parse_int(value: str, default: int = 0) -> int:
    v = (value or "").strip()
    if not v:
        return default
    return int(float(v))


def _parse_float(value: str, default: float = 0.0) -> float:
    v = (value or "").strip()
    if not v:
        return default
    return float(v)


def _load_pipeline():
    path = ROOT / "src" / "blr_shortlist" / "pipeline.py"
    spec = importlib.util.spec_from_file_location("blr_pipeline", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("Cannot load pipeline module")
    mod = importlib.util.module_from_spec(spec)
    mod.__name__ = "blr_pipeline"
    mod.__file__ = str(path)
    sys.modules["blr_pipeline"] = mod
    spec.loader.exec_module(mod)
    return mod


def main() -> None:
    p = _load_pipeline()
    rows = []
    if CANDIDATES.is_file():
        with CANDIDATES.open(encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
    ok_n = 0
    for row in rows:
        if not any((v or "").strip() for v in row.values()):
            continue
        lst = p.Listing(
            listing_id=(row.get("listing_id") or "x").strip(),
            project_name=(row.get("project_name") or "").strip(),
            area=(row.get("area") or "").strip(),
            travel_time_min=_parse_int(row.get("travel_time_min", ""), 0),
            property_type=(row.get("property_type") or "apartment").strip().lower(),
            bedrooms=_parse_int(row.get("bedrooms", ""), 0),
            status=(row.get("status") or "under_construction").strip().lower(),
            builder_name=(row.get("builder_name") or "").strip(),
            source_type=(row.get("source_type") or "builder_direct").strip().lower(),
            price_all_in_cr=_parse_float(row.get("price_all_in_cr", ""), 0.0),
            carpet_sqft=_parse_int(row.get("carpet_sqft", ""), 0),
            floor_type=(row.get("floor_type") or "mid").strip().lower(),
            rera_id=(row.get("rera_id") or "").strip(),
            evidence_link_1=(row.get("evidence_link_1") or "").strip(),
            evidence_link_2=(row.get("evidence_link_2") or "").strip(),
            handover_year=_parse_int(row.get("handover_year", ""), 0),
            approval_authority=(row.get("approval_authority") or "").strip().upper(),
            dc_conversion_complete=_parse_int(row.get("dc_conversion_complete", ""), 0),
            water_plan=(row.get("water_plan") or "").strip(),
            water_gate_pass=_parse_int(row.get("water_gate_pass", ""), 0),
            oc_status=(row.get("oc_status") or "na_uc").strip().lower(),
            rera_plan_alignment_verified=_parse_int(row.get("rera_plan_alignment_verified", ""), 0),
            maintenance_per_sqft=_parse_float(row.get("maintenance_per_sqft", ""), 0.0),
            unit_count=_parse_int(row.get("unit_count", ""), 0),
            delivered_projects_blr=_parse_int(row.get("delivered_projects_blr", ""), 0),
            rera_resolution_rate=_parse_int(row.get("rera_resolution_rate", ""), 0),
            unresolved_rera_pattern_3y=_parse_int(row.get("unresolved_rera_pattern_3y", ""), 0),
            active_consumer_nclt_case=_parse_int(row.get("active_consumer_nclt_case", ""), 0),
            max_delay_months=_parse_int(row.get("max_delay_months", ""), 0),
            source_confidence="pending_verify",
        )
        ev_ok, code, tier = p.evaluate_evidence(lst)
        if ev_ok:
            ok_n += 1
        print(f"{lst.listing_id}\tevidence_ok={ev_ok}\ttier={tier}\tcode={code}\t{lst.project_name[:40]}")
    print(f"candidate_rows={len(rows)} evidence_ok_rows={ok_n}")


if __name__ == "__main__":
    main()
