from fastapi import APIRouter, HTTPException, Query
from app.services.location_service import geocode_address, find_nearby_ngos, reverse_geocode_coordinates

router = APIRouter()


@router.get("/pickup-points")
async def get_pickup_points(
    city: str = Query(None), 
    area: str = Query(None), 
    lat: float = Query(None),
    lon: float = Query(None),
    radius: float = Query(5.0, description="Search radius in km")
):
    """
    Find safe NGO pickup points.
    Prioritizes direct lat/lon (GPS) if provided.
    Otherwise falls back to geocoding City/Area.
    """
    search_lat, search_lon = lat, lon
    detected_address = None

    if search_lat is None or search_lon is None:
        if not city or not area:
             # Fallback to IP Geolocation (Mocked for dev to Mumbai)
             # In a real app, use request.client.host with a geoip library
             search_lat, search_lon = 19.0760, 72.8777
             detected_address = {"city": "Mumbai", "area": "Maharashtra (IP Detected)"}
             
        else:
            address = f"{area}, {city}"
            try:
                search_lat, search_lon = await geocode_address(address)
                if search_lat is None:
                     search_lat, search_lon = await geocode_address(city)
            except Exception as e:
                 raise HTTPException(status_code=500, detail=f"Geocoding service unavailable: {str(e)}")
    else:
        # If lat/lon provided, reverse geocode to get city/area name for UI
        detected_address = await reverse_geocode_coordinates(search_lat, search_lon)
             
    if search_lat is None or search_lon is None:
        raise HTTPException(status_code=404, detail="Could not identify location")
        
    # Smart Search: Auto-expand radius if no NGOs found nearby
    # Try requested radius first (default 5km)
    ngos = await find_nearby_ngos(search_lat, search_lon, radius)
    
    expanded = False
    if not ngos and radius < 20:
        # Try 20km
        ngos = await find_nearby_ngos(search_lat, search_lon, 20.0)
        expanded = True
        
    if not ngos and radius < 50:
        # Try 50km
        ngos = await find_nearby_ngos(search_lat, search_lon, 50.0)
        expanded = True

    return {
        "user_location": {
            "lat": search_lat, 
            "lon": search_lon,
            "detected_address": detected_address
        },
        "pickup_points": ngos,
        "search_expanded": expanded
    }
