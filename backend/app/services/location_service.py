import httpx


async def verify_pickup_location(name: str, city: str):
    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": f"{name}, {city}",
        "format": "json",
        "limit": 1,
    }

    async with httpx.AsyncClient() as client:
        res = await client.get(url, params=params, headers={
            "User-Agent": "EduCycle/1.0"
        })

    data = res.json()
    return len(data) > 0
