from __future__ import annotations

import csv
import json
import re
import ssl
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import quote_plus, urlparse


ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT / "output"
DATA_DIR = ROOT / "data"
INDEX_HTML = ROOT / "index.html"
CANDIDATES_CSV = DATA_DIR / "strict_candidates.csv"

KRERA_VIEW_ALL_PROJECTS = "https://rera.karnataka.gov.in/viewAllProjects?language=en"

LEGACY_BUILDER_FIELDS = [
    "listing_id",
    "project_name",
    "area",
    "property_type",
    "bedrooms",
    "status",
    "builder_name",
    "builder_track_record",
    "builder_delay_history",
    "builder_handover_reliability",
    "builder_legal_cleanliness",
    "builder_construction_sentiment",
    "price_base_cr",
    "price_all_in_cr",
    "water_backup",
    "power_backup",
    "security",
    "parking",
    "clubhouse",
    "kid_senior_spaces",
    "builder_score",
    "rank",
    "effective_price_cr",
]
LEGACY_RISK_FIELDS = [
    "listing_id",
    "project_name",
    "area",
    "property_type",
    "bedrooms",
    "status",
    "builder_name",
    "builder_track_record",
    "builder_delay_history",
    "builder_handover_reliability",
    "builder_legal_cleanliness",
    "builder_construction_sentiment",
    "price_base_cr",
    "price_all_in_cr",
    "water_backup",
    "power_backup",
    "security",
    "parking",
    "clubhouse",
    "kid_senior_spaces",
    "builder_risk_score",
    "amenities_score",
    "price_fit",
    "builder_score",
    "risk_adjusted_score",
    "rank",
]
LEGACY_FINAL_FIELDS = [
    "listing_id",
    "project_name",
    "area",
    "property_type",
    "bedrooms",
    "status",
    "builder_name",
    "builder_track_record",
    "builder_delay_history",
    "builder_handover_reliability",
    "builder_legal_cleanliness",
    "builder_construction_sentiment",
    "price_base_cr",
    "price_all_in_cr",
    "water_backup",
    "power_backup",
    "security",
    "parking",
    "clubhouse",
    "kid_senior_spaces",
    "builder_score",
    "rank",
    "effective_price_cr",
    "amenities_score",
    "final_score",
]

# Columns for data/strict_candidates.csv (header-only files stay schema-stable).
CANDIDATE_CSV_FIELDS = [
    "listing_id",
    "project_name",
    "area",
    "travel_time_min",
    "property_type",
    "bedrooms",
    "status",
    "builder_name",
    "source_type",
    "price_all_in_cr",
    "carpet_sqft",
    "floor_type",
    "rera_id",
    "evidence_link_1",
    "evidence_link_2",
    "handover_year",
    "approval_authority",
    "dc_conversion_complete",
    "water_plan",
    "water_gate_pass",
    "oc_status",
    "rera_plan_alignment_verified",
    "maintenance_per_sqft",
    "unit_count",
    "delivered_projects_blr",
    "rera_resolution_rate",
    "unresolved_rera_pattern_3y",
    "active_consumer_nclt_case",
    "max_delay_months",
]


@dataclass
class Listing:
    listing_id: str
    project_name: str
    area: str
    travel_time_min: int
    property_type: str
    bedrooms: int
    status: str
    builder_name: str
    source_type: str
    price_all_in_cr: float
    carpet_sqft: int
    floor_type: str
    rera_id: str
    evidence_link_1: str
    evidence_link_2: str
    handover_year: int
    approval_authority: str
    dc_conversion_complete: int
    water_plan: str
    water_gate_pass: int
    oc_status: str
    rera_plan_alignment_verified: int
    maintenance_per_sqft: float
    unit_count: int
    delivered_projects_blr: int
    rera_resolution_rate: int
    unresolved_rera_pattern_3y: int
    active_consumer_nclt_case: int
    max_delay_months: int
    source_confidence: str

    def builder_pulse_good(self) -> int:
        complaint_gate = self.unresolved_rera_pattern_3y == 0 or self.rera_resolution_rate > 80
        return int(
            complaint_gate
            and self.delivered_projects_blr >= 1
            and self.active_consumer_nclt_case == 0
            and self.max_delay_months <= 18
        )

    def builder_pulse_band(self) -> str:
        if self.builder_pulse_good():
            return "good"
        if self.delivered_projects_blr == 0 or self.active_consumer_nclt_case == 1:
            return "poor"
        return "watch"


AREA_UNIVERSE = [
    ("SahakaraNagar", 32, 84, 83, 80, 83, 63, 60, 86, 83),
    ("Yelahanka", 48, 82, 77, 75, 79, 71, 55, 76, 81),
    ("Jakkur", 35, 81, 74, 73, 80, 67, 59, 74, 79),
    ("Hennur", 40, 79, 76, 70, 78, 64, 61, 78, 76),
    ("Kogilu", 45, 77, 70, 68, 76, 65, 57, 72, 75),
    ("Thanisandra", 36, 74, 80, 72, 75, 58, 70, 82, 72),
    ("Hebbal", 28, 81, 85, 79, 80, 56, 67, 89, 78),
    ("AirportRoad", 50, 76, 73, 75, 74, 68, 58, 71, 74),
    ("Devanahalli", 58, 71, 67, 72, 70, 73, 52, 64, 68),
    ("Bagalur", 55, 68, 61, 66, 67, 69, 57, 60, 54),
]


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


def _normalize_netloc(netloc: str) -> str:
    n = (netloc or "").strip().lower()
    if n.startswith("www."):
        n = n[4:]
    return n


def _parse_http_url(url: str) -> Optional[urlparse]:
    raw = (url or "").strip()
    if not raw:
        return None
    try:
        p = urlparse(raw)
        if p.scheme not in ("http", "https") or not p.netloc:
            return None
        return p
    except Exception:
        return None


def _is_krera_official_host(netloc: str) -> bool:
    n = _normalize_netloc(netloc)
    return n == "rera.karnataka.gov.in" or n.endswith(".rera.karnataka.gov.in")


def _is_major_portal_host(netloc: str) -> bool:
    n = _normalize_netloc(netloc)
    return any(
        n == h or n.endswith("." + h)
        for h in (
            "99acres.com",
            "magicbricks.com",
            "housing.com",
        )
    )


def _is_builder_style_host(netloc: str) -> bool:
    """Non-portal, non-KRERA https host treated as official builder site candidate."""
    n = _normalize_netloc(netloc)
    if not n or "." not in n:
        return False
    if _is_krera_official_host(n) or _is_major_portal_host(n):
        return False
    return True


def evaluate_evidence(listing: Listing) -> Tuple[bool, str, str]:
    """
    Returns (ok, fail_reason_code, evidence_tier).
    Policy:
    - Any Karnataka KRERA official host link -> pass (tier official_krera)
    - Else any https builder-style host on link1 or link2 -> pass (tier official_builder)
    - Else two distinct https major-portal links -> pass (tier dual_portal)
    """
    l1 = (listing.evidence_link_1 or "").strip()
    l2 = (listing.evidence_link_2 or "").strip()
    if not l1:
        return False, "evidence_missing_link1", "fail"
    p1 = _parse_http_url(l1)
    if not p1:
        return False, "evidence_invalid_link1", "fail"
    p2 = _parse_http_url(l2) if l2 else None
    if l2 and not p2:
        return False, "evidence_invalid_link2", "fail"

    if _is_krera_official_host(p1.netloc) or (p2 and _is_krera_official_host(p2.netloc)):
        return True, "", "official_krera"

    if _is_builder_style_host(p1.netloc) or (p2 and _is_builder_style_host(p2.netloc)):
        return True, "", "official_builder"

    if p2 and _is_major_portal_host(p1.netloc) and _is_major_portal_host(p2.netloc):
        if l1.rstrip("/") != l2.rstrip("/"):
            return True, "", "dual_portal"
        return False, "evidence_portal_links_not_distinct", "fail"

    if _is_major_portal_host(p1.netloc) and not l2:
        return False, "portal_requires_second_link", "fail"

    return False, "evidence_failed_domain_or_policy", "fail"


def fetch_krera_projects_html() -> Tuple[str, int, Optional[str]]:
    """Optional: fetch KRERA HTML for optional rera_id substring cross-check only."""
    req = urllib.request.Request(
        KRERA_VIEW_ALL_PROJECTS,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
    )
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=120) as resp:
            body = resp.read().decode("utf-8", "replace")
            return body, int(resp.status), None
    except urllib.error.HTTPError as e:
        return "", int(e.code), str(e.reason or e)
    except urllib.error.URLError as e:
        return "", 0, str(e.reason or e)
    except Exception as e:
        return "", 0, str(e)


def rera_id_in_registry_html(body: str, rera_id: str) -> bool:
    rid = (rera_id or "").strip()
    if not rid or not body:
        return False
    if rid in body:
        return True
    if rid.replace("/", "%2F") in body:
        return True
    if rid.replace("/", "&#47;") in body:
        return True
    if rid.replace("/", "&#x2F;") in body:
        return True
    return rid.lower() in body.lower()


def load_candidates_from_csv() -> List[Listing]:
    if not CANDIDATES_CSV.is_file():
        return []
    text = CANDIDATES_CSV.read_text(encoding="utf-8").strip()
    if not text:
        return []
    with CANDIDATES_CSV.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            return []
        rows = list(reader)
    out: List[Listing] = []
    for i, row in enumerate(rows):
        if not any((v or "").strip() for v in row.values()):
            continue
        lid = (row.get("listing_id") or "").strip() or f"C{i + 1:03d}"
        out.append(
            Listing(
                listing_id=lid,
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
        )
    return out


def write_csv(path: Path, rows: List[Dict[str, object]], fieldnames: Optional[List[str]] = None) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        path.write_text("", encoding="utf-8")
        return
    names = fieldnames or list(rows[0].keys())
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=names, extrasaction="ignore")
        writer.writeheader()
        for r in rows:
            writer.writerow({k: r.get(k, "") for k in names})


def write_csv_header_only(path: Path, fieldnames: List[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        csv.DictWriter(f, fieldnames=fieldnames).writeheader()


def build_area_rows() -> List[Dict[str, object]]:
    rows: List[Dict[str, object]] = []
    for area in AREA_UNIVERSE:
        (
            name,
            travel_time,
            safety,
            social_infra,
            road_access,
            neighborhood_quality,
            green_spaces,
            noise_congestion,
            amenities_density,
            cauvery_reliability,
        ) = area
        rows.append(
            {
                "area": name,
                "travel_time_min": travel_time,
                "safety": safety,
                "social_infra": social_infra,
                "road_access": road_access,
                "neighborhood_quality": neighborhood_quality,
                "green_spaces": green_spaces,
                "noise_congestion": noise_congestion,
                "amenities_density": amenities_density,
                "cauvery_reliability": cauvery_reliability,
            }
        )
    return rows


def build_area_stage_outputs(area_rows: List[Dict[str, object]]) -> Tuple[List[Dict[str, object]], List[Dict[str, object]]]:
    top_livability = []
    for row in area_rows:
        livability = round(
            (0.18 * float(row["safety"]))
            + (0.16 * float(row["social_infra"]))
            + (0.12 * float(row["road_access"]))
            + (0.14 * float(row["neighborhood_quality"]))
            + (0.08 * float(row["green_spaces"]))
            + (0.08 * float(row["noise_congestion"]))
            + (0.14 * float(row["amenities_density"]))
            + (0.10 * float(row["cauvery_reliability"])),
            2,
        )
        top_livability.append({**row, "livability_score": livability})
    top_livability = sorted(top_livability, key=lambda x: float(x["livability_score"]), reverse=True)[:5]
    for i, row in enumerate(top_livability, start=1):
        row["rank"] = i

    top_amenities = []
    for row in top_livability:
        weighted = round(
            (0.6 * float(row["amenities_density"])) + (0.4 * float(row["cauvery_reliability"])),
            2,
        )
        top_amenities.append({**row, "area_amenities_cauvery_score": weighted})
    top_amenities = sorted(top_amenities, key=lambda x: float(x["area_amenities_cauvery_score"]), reverse=True)[:2]
    return top_livability, top_amenities


def _builder_scores(listing: Listing) -> Dict[str, int]:
    track = min(100, 55 + (listing.delivered_projects_blr * 8))
    delay_history = max(40, 100 - (listing.max_delay_months * 3))
    handover = min(100, 50 + max(0, listing.rera_resolution_rate // 2))
    legal_clean = 100 if listing.unresolved_rera_pattern_3y == 0 and listing.active_consumer_nclt_case == 0 else 55
    sentiment = 68 if listing.builder_pulse_good() else 52
    return {
        "builder_track_record": int(track),
        "builder_delay_history": int(delay_history),
        "builder_handover_reliability": int(handover),
        "builder_legal_cleanliness": int(legal_clean),
        "builder_construction_sentiment": int(sentiment),
    }


def build_legacy_builder_rows(listings: List[Listing]) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    for listing in listings:
        scores = _builder_scores(listing)
        builder_score = round(
            (
                scores["builder_track_record"]
                + scores["builder_delay_history"]
                + scores["builder_handover_reliability"]
                + scores["builder_legal_cleanliness"]
                + scores["builder_construction_sentiment"]
            )
            / 5,
            2,
        )
        price_base = round(max(0.0, listing.price_all_in_cr - 0.11), 2)
        effective = round(listing.price_all_in_cr + 0.08, 2)
        rows.append(
            {
                "listing_id": listing.listing_id,
                "project_name": listing.project_name,
                "area": listing.area,
                "property_type": listing.property_type,
                "bedrooms": listing.bedrooms,
                "status": listing.status,
                "builder_name": listing.builder_name,
                **scores,
                "price_base_cr": price_base,
                "price_all_in_cr": round(listing.price_all_in_cr, 2),
                "water_backup": int(listing.water_gate_pass == 1),
                "power_backup": 1,
                "security": 1,
                "parking": 1,
                "clubhouse": 1,
                "kid_senior_spaces": 1,
                "builder_score": builder_score,
                "effective_price_cr": effective,
            }
        )
    rows = sorted(rows, key=lambda x: float(x["builder_score"]), reverse=True)[:20]
    for i, row in enumerate(rows, start=1):
        row["rank"] = i
    return rows


def build_legacy_risk_rows(builder_rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    for row in builder_rows:
        amenities_score = int(
            (
                int(row["water_backup"])
                + int(row["power_backup"])
                + int(row["security"])
                + int(row["parking"])
                + int(row["clubhouse"])
                + int(row["kid_senior_spaces"])
            )
            / 6
            * 100
        )
        price_fit = round(max(0.0, 100 - (float(row["price_all_in_cr"]) * 20)), 2)
        risk_adjusted = round(
            (0.45 * float(row["builder_score"])) + (0.35 * amenities_score) + (0.20 * price_fit),
            2,
        )
        rows.append(
            {
                **row,
                "builder_risk_score": round(100 - float(row["builder_score"]), 2),
                "amenities_score": amenities_score,
                "price_fit": price_fit,
                "risk_adjusted_score": risk_adjusted,
            }
        )
    rows = sorted(rows, key=lambda x: float(x["risk_adjusted_score"]), reverse=True)[:10]
    for i, row in enumerate(rows, start=1):
        row["rank"] = i
    return rows


def extract_short_name(project_name: str) -> str:
    compact = re.sub(r"[^A-Za-z0-9 ]+", "", project_name).strip()
    if not compact:
        return "Project"
    return compact.split()[0][:12]


def _to_proper_status(status: str) -> str:
    return "UC" if (status or "").strip().lower() == "under_construction" else "RTM"


def _to_index_property(row: Dict[str, Any]) -> Dict[str, Any]:
    name = str(row.get("project_name", "")).strip()
    area = str(row.get("area", "")).strip()
    builder = str(row.get("builder_name", "")).strip()
    price = float(row.get("price_all_in_cr", 0.0))
    maps_url = f"https://maps.google.com/?q={quote_plus((name + ' ' + area).strip())}"
    pulse = "Good" if float(row.get("builder_score", 0.0)) >= 75 else "Watch"
    risk_flags = []
    if float(row.get("builder_risk_score", 0.0)) > 30:
        risk_flags.append("builder_risk")
    if float(row.get("price_fit", 100.0)) < 45:
        risk_flags.append("price_fit_low")
    return {
        "rank": int(row.get("rank", 0)),
        "day": 1 if int(row.get("rank", 0)) <= 5 else 2,
        "shortName": extract_short_name(name),
        "name": name,
        "builder": builder,
        "grade": "A-",
        "status": _to_proper_status(str(row.get("status", ""))),
        "priority": "Strict shortlist",
        "price": f"~₹{price:.2f} Cr all-in",
        "size": "See carpet field",
        "launched": "TBC",
        "possession": "2027-2030 window",
        "area": area,
        "address": f"{area}, North Bangalore",
        "mapsUrl": maps_url,
        "drive": f"~{int(max(20, min(60, float(row.get('rank', 1)) * 5 + 20)))} min from Manyata Embassy",
        "visitTime": "TBC",
        "contact": "Link-verified via strict shortlist evidence policy",
        "rera": str(row.get("rera_id", "")).strip() or "Optional / verify",
        "ocStatus": "N/A - Under Construction",
        "carpetSqft": int(row.get("carpet_sqft", 0)),
        "approval": str(row.get("approval_authority", "")).strip() or "TBC",
        "waterPlan": str(row.get("water_plan", "")).strip() or "TBC",
        "maintenance": f"₹{float(row.get('maintenance_per_sqft', 0.0)):.1f}/sqft",
        "floorType": str(row.get("floor_type", "")).strip() or "mid",
        "projectSize": f"{int(row.get('unit_count', 0))} units",
        "buyerPulse": pulse,
        "riskFlags": ", ".join(risk_flags) if risk_flags else "none",
    }


def sync_index_properties(rows: List[Dict[str, Any]]) -> None:
    if not INDEX_HTML.is_file():
        return
    text = INDEX_HTML.read_text(encoding="utf-8")
    payload = json.dumps([_to_index_property(r) for r in rows], indent=2)
    replacement = "const PROPERTIES = " + payload + ";"
    pattern = r"const PROPERTIES = \[(?:.|\r|\n)*?\];\r?\n\r?\nconst QUESTIONS ="
    text_new, count = re.subn(
        pattern,
        lambda _: replacement + "\n\nconst QUESTIONS =",
        text,
        count=1,
    )
    if count == 1:
        INDEX_HTML.write_text(text_new, encoding="utf-8")


def evaluate_listing(
    listing: Listing,
    *,
    evidence_ok: bool,
    evidence_fail_code: str,
    evidence_tier: str,
    rera_optional_registry_hit: bool,
    krera_http_status: int,
    krera_fetch_error: Optional[str],
) -> Tuple[bool, str, Dict[str, object]]:
    builder_pulse_good = listing.builder_pulse_good()
    enriched = asdict(listing)
    enriched["builder_pulse_good"] = builder_pulse_good
    enriched["builder_pulse_band"] = listing.builder_pulse_band()
    enriched["floor_risk_flag"] = int(listing.floor_type in {"ground", "stilt", "podium"})
    enriched["maintenance_risk_flag"] = int(listing.maintenance_per_sqft > 5.0)
    enriched["project_size_risk_flag"] = int(listing.unit_count < 200)
    enriched["delay_risk_flag"] = int(listing.max_delay_months > 15)
    enriched["strict_score"] = round(
        100
        - (listing.price_all_in_cr * 8)
        + (listing.carpet_sqft / 100)
        - (listing.travel_time_min / 2)
        - (enriched["maintenance_risk_flag"] * 4)
        - (enriched["project_size_risk_flag"] * 3)
        - (enriched["delay_risk_flag"] * 5),
        2,
    )

    enriched["evidence_ok"] = int(evidence_ok)
    enriched["evidence_fail_code"] = evidence_fail_code if not evidence_ok else ""
    enriched["evidence_tier"] = evidence_tier
    enriched["evidence_checked_at_utc"] = datetime.now(timezone.utc).isoformat()
    enriched["rera_optional_registry_hit"] = int(bool(rera_optional_registry_hit))
    enriched["krera_registry_url"] = KRERA_VIEW_ALL_PROJECTS
    enriched["krera_http_status"] = krera_http_status
    enriched["krera_fetch_error"] = krera_fetch_error or ""

    if evidence_ok:
        enriched["source_confidence"] = f"link_verified_{evidence_tier}"
    else:
        enriched["source_confidence"] = evidence_fail_code or "evidence_failed"

    checks = [
        ("project_not_verified", evidence_ok),
        ("travel_gt_60", listing.travel_time_min <= 60),
        ("status_not_uc", listing.status == "under_construction"),
        ("not_target_config", listing.property_type in {"apartment", "row_house"} and listing.bedrooms >= 3),
        ("over_budget", listing.price_all_in_cr <= 2.5),
        ("carpet_lt_1200", listing.carpet_sqft >= 1200),
        ("handover_outside_2027_2030", 2027 <= listing.handover_year <= 2030),
        ("gp_or_unknown_approval", listing.approval_authority in {"BBMP", "BDA", "BIAAPA"}),
        ("dc_not_complete", listing.dc_conversion_complete == 1),
        ("water_gate_fail", listing.water_gate_pass == 1),
        ("oc_path_fail", listing.oc_status == "na_uc" and listing.rera_plan_alignment_verified == 1),
        ("investor_resale", listing.source_type == "builder_direct"),
        ("builder_pulse_not_good", builder_pulse_good == 1),
    ]
    failed = [reason for reason, ok in checks if not ok]
    return (len(failed) == 0, "|".join(failed), enriched)


def _template_listing() -> Listing:
    return Listing(
        "template",
        "",
        "",
        0,
        "apartment",
        3,
        "under_construction",
        "",
        "builder_direct",
        0.0,
        0,
        "mid",
        "",
        "",
        "",
        2027,
        "BBMP",
        1,
        "Cauvery+STP",
        1,
        "na_uc",
        1,
        0.0,
        0,
        0,
        0,
        0,
        0,
        0,
        "pending_verify",
    )


def build_outputs() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    area_rows = build_area_rows()
    write_csv(OUTPUT_DIR / "01_area_universe.csv", area_rows)
    area_top5, area_top2 = build_area_stage_outputs(area_rows)
    write_csv(OUTPUT_DIR / "02_top5_livability_areas.csv", area_top5)
    write_csv(OUTPUT_DIR / "03_top2_amenities_cauvery_areas.csv", area_top2)

    listings = load_candidates_from_csv()
    inventory_rows = [asdict(x) for x in listings]
    if inventory_rows:
        write_csv(OUTPUT_DIR / "04_inventory_filtered.csv", inventory_rows)
    else:
        write_csv_header_only(OUTPUT_DIR / "04_inventory_filtered.csv", CANDIDATE_CSV_FIELDS)

    legacy_builder_rows = build_legacy_builder_rows(listings)
    if legacy_builder_rows:
        write_csv(OUTPUT_DIR / "05_top20_builder_ranked.csv", legacy_builder_rows, fieldnames=LEGACY_BUILDER_FIELDS)
    else:
        write_csv_header_only(OUTPUT_DIR / "05_top20_builder_ranked.csv", LEGACY_BUILDER_FIELDS)

    budget_rows = [x for x in legacy_builder_rows if float(x.get("effective_price_cr", 0.0)) <= 3.0]
    if budget_rows:
        write_csv(OUTPUT_DIR / "06_budget_filtered.csv", budget_rows, fieldnames=LEGACY_BUILDER_FIELDS)
    else:
        write_csv_header_only(OUTPUT_DIR / "06_budget_filtered.csv", LEGACY_BUILDER_FIELDS)

    legacy_risk_rows = build_legacy_risk_rows(budget_rows)
    if legacy_risk_rows:
        write_csv(OUTPUT_DIR / "08_risk_adjusted_top10.csv", legacy_risk_rows, fieldnames=LEGACY_RISK_FIELDS)
    else:
        write_csv_header_only(OUTPUT_DIR / "08_risk_adjusted_top10.csv", LEGACY_RISK_FIELDS)

    legacy_final_rows = [{**x, "final_score": x["risk_adjusted_score"]} for x in legacy_risk_rows[:10]]
    if legacy_final_rows:
        write_csv(OUTPUT_DIR / "07_final_top10.csv", legacy_final_rows, fieldnames=LEGACY_FINAL_FIELDS)
    else:
        write_csv_header_only(OUTPUT_DIR / "07_final_top10.csv", LEGACY_FINAL_FIELDS)

    body, http_status, fetch_err = fetch_krera_projects_html()

    enriched_rows: List[Dict[str, object]] = []
    eligible_rows: List[Dict[str, object]] = []
    excluded_rows: List[Dict[str, object]] = []

    for listing in listings:
        ev_ok, ev_code, ev_tier = evaluate_evidence(listing)
        rera_optional = False
        if listing.rera_id.strip() and body:
            rera_optional = rera_id_in_registry_html(body, listing.rera_id)
        passed, reason, enriched = evaluate_listing(
            listing,
            evidence_ok=ev_ok,
            evidence_fail_code=ev_code,
            evidence_tier=ev_tier,
            rera_optional_registry_hit=rera_optional,
            krera_http_status=http_status,
            krera_fetch_error=fetch_err,
        )
        enriched_rows.append(enriched)
        if passed:
            eligible_rows.append({**enriched, "excluded_reason": ""})
        else:
            excluded_rows.append({**enriched, "excluded_reason": reason})

    if enriched_rows:
        write_csv(OUTPUT_DIR / "09_enriched_inventory_strict.csv", enriched_rows)
    else:
        probe = _template_listing()
        _, _, template_enriched = evaluate_listing(
            probe,
            evidence_ok=False,
            evidence_fail_code="evidence_missing_link1",
            evidence_tier="fail",
            rera_optional_registry_hit=False,
            krera_http_status=http_status,
            krera_fetch_error=fetch_err,
        )
        write_csv_header_only(OUTPUT_DIR / "09_enriched_inventory_strict.csv", list(template_enriched.keys()))

    ranked_eligible = sorted(eligible_rows, key=lambda x: float(x["strict_score"]), reverse=True)
    for i, row in enumerate(ranked_eligible, start=1):
        row["rank"] = i
    for i, row in enumerate(sorted(excluded_rows, key=lambda x: str(x["listing_id"])), start=1):
        row["rank"] = i

    if ranked_eligible:
        eligible_fieldnames = list(ranked_eligible[0].keys())
    elif enriched_rows:
        eligible_fieldnames = list(enriched_rows[0].keys()) + ["excluded_reason", "rank"]
    else:
        probe = _template_listing()
        _, _, template_enriched = evaluate_listing(
            probe,
            evidence_ok=False,
            evidence_fail_code="evidence_missing_link1",
            evidence_tier="fail",
            rera_optional_registry_hit=False,
            krera_http_status=http_status,
            krera_fetch_error=fetch_err,
        )
        eligible_fieldnames = list(template_enriched.keys()) + ["excluded_reason", "rank"]
    if ranked_eligible:
        write_csv(OUTPUT_DIR / "10_strict_eligible.csv", ranked_eligible, fieldnames=eligible_fieldnames)
    else:
        write_csv_header_only(OUTPUT_DIR / "10_strict_eligible.csv", eligible_fieldnames)

    if excluded_rows:
        write_csv(OUTPUT_DIR / "11_strict_exclusions.csv", excluded_rows)
    else:
        probe = _template_listing()
        _, _, ex_base = evaluate_listing(
            probe,
            evidence_ok=False,
            evidence_fail_code="evidence_missing_link1",
            evidence_tier="fail",
            rera_optional_registry_hit=False,
            krera_http_status=http_status,
            krera_fetch_error=fetch_err,
        )
        write_csv_header_only(
            OUTPUT_DIR / "11_strict_exclusions.csv",
            list(ex_base.keys()) + ["excluded_reason", "rank"],
        )

    top10 = ranked_eligible[:10]
    if top10:
        write_csv(OUTPUT_DIR / "12_strict_top10.csv", top10, fieldnames=eligible_fieldnames)
    else:
        write_csv_header_only(OUTPUT_DIR / "12_strict_top10.csv", eligible_fieldnames)

    summary = [
        {"metric": "inventory_total", "value": len(listings)},
        {"metric": "eligible_total", "value": len(ranked_eligible)},
        {"metric": "excluded_total", "value": len(excluded_rows)},
        {"metric": "evidence_pass", "value": sum(1 for x in enriched_rows if int(x.get("evidence_ok", 0)) == 1)},
        {"metric": "evidence_fail", "value": sum(1 for x in enriched_rows if int(x.get("evidence_ok", 0)) == 0)},
        {"metric": "project_not_verified_excluded", "value": sum(1 for x in excluded_rows if "project_not_verified" in x["excluded_reason"])},
        {"metric": "krera_fetch_failed", "value": int(fetch_err is not None)},
        {"metric": "krera_http_status", "value": http_status},
        {"metric": "rera_optional_registry_hit", "value": sum(1 for x in enriched_rows if int(x.get("rera_optional_registry_hit", 0)) == 1)},
        {"metric": "builder_pulse_failures", "value": sum(1 for x in excluded_rows if "builder_pulse_not_good" in x["excluded_reason"])},
    ]
    write_csv(OUTPUT_DIR / "13_csv_cleanup_audit.csv", summary)
    sync_index_properties(top10)


if __name__ == "__main__":
    build_outputs()
