# Strict shortlist candidates (`strict_candidates.csv`)

Add one row per project. The pipeline keeps a row only if:

1. **Evidence links prove the project exists** (no hallucinated names), using the policy below, and  
2. All other strict gates pass (see `src/blr_shortlist/pipeline.py`).

`rera_id` is **optional**. If you provide it, the pipeline may set `rera_optional_registry_hit=1` when that string appears in the live Karnataka RERA project list HTML (best-effort; not required for eligibility).

## Evidence link policy (hard gate)

Use `https` URLs only.

**Pass if any of these is true:**

- **Official KRERA**: `evidence_link_1` or `evidence_link_2` uses host `rera.karnataka.gov.in` (or a subdomain of it).
- **Official builder site**: `evidence_link_1` or `evidence_link_2` uses a normal domain that is **not** KRERA and **not** a major portal (treated as builder official page).
- **Dual major portals**: `evidence_link_1` and `evidence_link_2` are **two different URLs** on **99acres**, **MagicBricks**, or **Housing** (any combination).

**Fail examples:**

- Only one portal link when you do not also provide KRERA or a builder official link.
- Invalid URL, empty `evidence_link_1`, or two identical portal URLs.

## Column reference

| Column | Required | Notes |
|--------|------------|--------|
| listing_id | yes | Unique id |
| project_name | yes | Must match the evidence pages |
| area | yes | Micro-market label |
| travel_time_min | yes | Minutes from Manyata Embassy (your estimate) |
| property_type | yes | `apartment` or `row_house` |
| bedrooms | yes | Integer (>=3 for current gate) |
| status | yes | Must be `under_construction` for current gates |
| builder_name | yes | |
| source_type | yes | `builder_direct` (not `investor_resale`) |
| price_all_in_cr | yes | All-in in Crores; must be <= 2.5 |
| carpet_sqft | yes | Carpet area; must be >= 1200 |
| floor_type | yes | `ground`, `stilt`, `podium`, or `mid` |
| rera_id | no | Optional; substring check vs live KRERA HTML when present |
| evidence_link_1 | yes | Primary evidence URL |
| evidence_link_2 | conditional | Second URL required for **portal-only** proof (two distinct portal links) |
| handover_year | yes | 2027–2030 |
| approval_authority | yes | `BBMP`, `BDA`, or `BIAAPA` |
| dc_conversion_complete | yes | 0 or 1 |
| water_plan | yes | Free text |
| water_gate_pass | yes | 0 or 1 |
| oc_status | yes | e.g. `na_uc` for under-construction path |
| rera_plan_alignment_verified | yes | 0 or 1 |
| maintenance_per_sqft | yes | Monthly ₹ per sqft |
| unit_count | yes | Total units |
| delivered_projects_blr | yes | Builder pulse field |
| rera_resolution_rate | yes | Percent |
| unresolved_rera_pattern_3y | yes | 0 or 1 |
| active_consumer_nclt_case | yes | 0 or 1 |
| max_delay_months | yes | Builder pulse field |

If the CSV is missing or has only a header row, strict outputs stay empty.
