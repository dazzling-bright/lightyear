import math
from fastapi import APIRouter
from models import ConcreteCalcRequest, BlockCalcRequest, PaintCalcRequest, RoofCalcRequest

router = APIRouter(prefix="/calculators", tags=["Calculators"])

@router.post("/concrete")
async def concrete_calculator(body: ConcreteCalcRequest):
    """Calculate materials for a concrete slab/beam/column."""
    volume_m3 = body.length_m * body.width_m * body.depth_m

    # Parse mix ratio e.g. "1:2:4"
    try:
        parts = list(map(int, body.mix_ratio.split(":")))
        cement_part, sand_part, agg_part = parts[0], parts[1], parts[2]
    except Exception:
        cement_part, sand_part, agg_part = 1, 2, 4

    total_parts = cement_part + sand_part + agg_part
    # Dry volume factor = 1.54 (accounts for voids/compaction)
    dry_volume = volume_m3 * 1.54

    cement_m3 = (cement_part / total_parts) * dry_volume
    sand_m3 = (sand_part / total_parts) * dry_volume
    aggregate_m3 = (agg_part / total_parts) * dry_volume

    # 1 bag cement = 0.0347 m³
    bags_of_cement = math.ceil(cement_m3 / 0.0347)
    sand_tonnes = round(sand_m3 * 1.6, 2)         # 1 m³ sand ≈ 1.6 tonnes
    aggregate_tonnes = round(aggregate_m3 * 1.5, 2)  # 1 m³ agg ≈ 1.5 tonnes

    # Nigerian cost estimates (₦)
    cement_cost = bags_of_cement * 9500          # ~₦9,500 per bag
    sand_cost = sand_tonnes * 25000              # ~₦25,000 per tonne
    aggregate_cost = aggregate_tonnes * 30000    # ~₦30,000 per tonne

    return {
        "volume_m3": round(volume_m3, 3),
        "mix_ratio": body.mix_ratio,
        "materials": {
            "cement_bags_50kg": bags_of_cement,
            "sand_tonnes": sand_tonnes,
            "coarse_aggregate_tonnes": aggregate_tonnes,
        },
        "estimated_cost_ngn": {
            "cement": cement_cost,
            "sand": sand_cost,
            "aggregate": aggregate_cost,
            "total": cement_cost + sand_cost + aggregate_cost,
        },
        "notes": [
            "Add 5–10% wastage allowance",
            "Costs based on 2024 Nigerian market rates",
            "Labour not included",
            "Water-cement ratio should be ≤ 0.5 for structural concrete",
        ],
    }

@router.post("/blocks")
async def block_calculator(body: BlockCalcRequest):
    """Calculate number of blocks needed for a wall."""
    # Block sizes (LxHxW in metres)
    block_dims = {
        "6inch": {"length": 0.45, "height": 0.225, "cost": 450},
        "9inch": {"length": 0.45, "height": 0.225, "cost": 600},
    }
    block = block_dims.get(body.block_size, block_dims["9inch"])

    # Gross wall area
    gross_area = body.wall_length_m * body.wall_height_m

    # Deduct openings
    opening_area = body.num_openings * body.opening_width_m * body.opening_height_m
    net_area = gross_area - opening_area

    # Blocks per m² (with ~10mm mortar joints)
    blocks_per_sqm = 1 / ((block["length"] + 0.01) * (block["height"] + 0.01))
    num_blocks = math.ceil(net_area * blocks_per_sqm)
    # Add 5% wastage
    num_blocks_with_wastage = math.ceil(num_blocks * 1.05)

    # Mortar (cement + sand) estimate for laying
    # ~0.03 bags cement per m² + 0.045 m³ sand per m²
    cement_bags = math.ceil(net_area * 0.03)
    sand_m3 = round(net_area * 0.045, 2)

    return {
        "wall_area_sqm": round(net_area, 2),
        "gross_wall_area_sqm": round(gross_area, 2),
        "openings_area_sqm": round(opening_area, 2),
        "block_size": body.block_size,
        "materials": {
            "blocks_required": num_blocks_with_wastage,
            "cement_bags_for_mortar": cement_bags,
            "sand_m3_for_mortar": sand_m3,
        },
        "estimated_cost_ngn": {
            "blocks": num_blocks_with_wastage * block["cost"],
            "cement": cement_bags * 9500,
            "sand": math.ceil(sand_m3 * 1.6) * 25000,
            "total": (num_blocks_with_wastage * block["cost"]) + (cement_bags * 9500) + (math.ceil(sand_m3 * 1.6) * 25000),
        },
        "notes": [
            "5% wastage already included",
            "Does not include plastering",
            "Costs based on 2024 market rates",
        ],
    }

@router.post("/paint")
async def paint_calculator(body: PaintCalcRequest):
    """Calculate paint needed for a surface."""
    total_coverage = body.area_sqm * body.coats
    litres_needed = math.ceil(total_coverage / body.coverage_per_litre)

    # Standard tin sizes
    tins_4L = math.ceil(litres_needed / 4)
    tins_20L = math.ceil(litres_needed / 20)

    return {
        "area_sqm": body.area_sqm,
        "coats": body.coats,
        "litres_required": litres_needed,
        "tins": {
            "4_litre_tins": tins_4L,
            "20_litre_tins": tins_20L,
            "recommendation": f"Buy {tins_20L} × 20L tins" if litres_needed >= 20 else f"Buy {tins_4L} × 4L tins",
        },
        "estimated_cost_ngn": {
            "budget_paint_20L": tins_20L * 18000,
            "mid_range_paint_20L": tins_20L * 30000,
            "premium_paint_20L": tins_20L * 55000,
        },
        "notes": [
            "Coverage varies by surface texture",
            "New/porous surfaces may require extra coat",
            "Add 10% extra for wastage",
        ],
    }

@router.post("/roof")
async def roof_calculator(body: RoofCalcRequest):
    """Calculate roofing sheets needed."""
    # Calculate roof slope area
    pitch_rad = math.radians(body.roof_pitch_degrees)
    slope_factor = 1 / math.cos(pitch_rad)
    slope_length = (body.width_m / 2) * slope_factor

    # Total roof area (both sides)
    total_roof_area = 2 * body.length_m * slope_length

    # Effective sheet coverage (10% overlap)
    effective_width = body.sheet_width_m * 0.9
    effective_length = body.sheet_length_m * 0.9
    sheet_coverage = effective_width * effective_length

    num_sheets = math.ceil(total_roof_area / sheet_coverage)
    num_sheets_with_wastage = math.ceil(num_sheets * 1.08)  # 8% wastage

    # Screws: ~12 per sheet
    num_screws = num_sheets_with_wastage * 12

    return {
        "roof_area_sqm": round(total_roof_area, 2),
        "pitch_degrees": body.roof_pitch_degrees,
        "materials": {
            "roofing_sheets": num_sheets_with_wastage,
            "roofing_screws": num_screws,
            "ridges_estimated": math.ceil(body.length_m / body.sheet_length_m),
        },
        "estimated_cost_ngn": {
            "aluminium_sheets": num_sheets_with_wastage * 4500,
            "long_span_sheets": num_sheets_with_wastage * 8000,
            "stone_coated_sheets": num_sheets_with_wastage * 22000,
        },
        "notes": [
            "8% wastage already included",
            "Fascia boards and purlins not included",
            "Consider insulation under roof sheets",
        ],
    }

@router.post("/tiles")
async def tiles_calculator(length_m: float, width_m: float, tile_size_cm: float = 60):
    """Calculate floor/wall tiles needed."""
    area = length_m * width_m
    tile_size_m = tile_size_cm / 100
    tile_area = tile_size_m ** 2
    num_tiles = math.ceil((area / tile_area) * 1.1)  # 10% wastage

    return {
        "area_sqm": round(area, 2),
        "tile_size_cm": tile_size_cm,
        "tiles_required": num_tiles,
        "estimated_cost_ngn": {
            "budget_tiles": num_tiles * 800,
            "mid_range_tiles": num_tiles * 1500,
            "premium_tiles": num_tiles * 3500,
        },
        "notes": ["10% wastage included", "Add grout, adhesive, and tile spacers"],
    }
