import firebase_admin
from firebase_admin import credentials, auth, firestore
import os

# 1. Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app(cred)

db = firestore.client()

# 2. Define Mock Data
mock_ngos = [
    {
        "email": "contact@techforall.org",
        "password": "Password@123",
        "name": "Tech For All Foundation",
        "city": "Mumbai",
        "area": "Andheri",
        "phone": "+91 9876543210",
        "description": "Empowering students with technology and educational resources.",
        "website": "www.techforall.org",
        "lat": 19.1136, 
        "lon": 72.8697
    },
    {
        "email": "contact@tambaramedu.org",
        "password": "Password@123",
        "name": "Tambaram NGO Foundation",
        "city": "Chennai",
        "area": "Tambaram",
        "phone": "+91 9123456780",
        "description": "NGO dedicated to providing schooling aids to children in South Chennai.",
        "website": "www.tambaramngo.org",
        "lat": 12.9229, 
        "lon": 80.1275
    },
    {
        "email": "books@velacherykids.org",
        "password": "Password@123",
        "name": "Velachery NGO Trust",
        "city": "Chennai",
        "area": "Velachery",
        "phone": "+91 9234567891",
        "description": "Non-profit NGO focused on primary education and children's welfare.",
        "website": "www.velacheryngo.org",
        "lat": 12.9791,
        "lon": 80.2185
    },
    {
        "email": "admin@annanagaredu.org",
        "password": "Password@123",
        "name": "Anna Nagar NGO Center",
        "city": "Chennai",
        "area": "Anna Nagar",
        "phone": "+91 9345678902",
        "description": "NGO providing digital learning resources for underprivileged students.",
        "website": "www.annanagarngo.org",
        "lat": 13.0850,
        "lon": 80.2101
    },
    {
        "email": "hello@tnagarbooks.org",
        "password": "Password@123",
        "name": "T-Nagar Youth NGO",
        "city": "Chennai",
        "area": "T-Nagar",
        "phone": "+91 9456789013",
        "description": "City-based NGO connecting student donors with eager learners.",
        "website": "www.tnagarngo.org",
        "lat": 13.0418,
        "lon": 80.2341
    },
    {
        "email": "hello@greenearthedu.org",
        "password": "Password@123",
        "name": "Adyar Eco NGO",
        "city": "Chennai",
        "area": "Adyar",
        "phone": "+91 5432109876",
        "description": "NGO teaching sustainability and environmental science to students.",
        "website": "www.adyarecongo.org",
        "lat": 13.0067,
        "lon": 80.2545
    }
]

print("-" * 60)
print(f"{'NGO Name':<30} | {'Email':<30} | {'Password'}")
print("-" * 60)

for ngo in mock_ngos:
    try:
        # Check if user exists
        try:
            user = auth.get_user_by_email(ngo["email"])
            print(f"User {ngo['email']} already exists. Updating profile & password...")
            uid = user.uid
            auth.update_user(uid, password=ngo["password"])
        except auth.UserNotFoundError:
            # Create new user
            user = auth.create_user(
                email=ngo["email"],
                password=ngo["password"],
                display_name=ngo["name"],
                email_verified=True # Pre-verify email
            )
            uid = user.uid
            
        # Create/Update Firestore Profile
        user_data = {
            "uid": uid,
            "email": ngo["email"],
            "role": "ngo",
            "organization_name": ngo["name"],
            "display_name": ngo["name"], # For compatibility
            "city": ngo["city"],
            "area": ngo["area"],
            "phone": ngo["phone"],
            "description": ngo["description"],
            "website": ngo["website"],
            "is_verified": True, # <--- VERIFIED STATUS
            "created_at": firestore.SERVER_TIMESTAMP,
            "edu_credits": 100, # Give them some starting credits
            "coordinates": {"lat": ngo["lat"], "lon": ngo["lon"]} if "lat" in ngo else None
        }
        
        # Merge ensures we don't overwrite existing fields if we just want to update verified status
        # But here we want to enforce the mock data, so we use set with merge=True
        db.collection("users").document(uid).set(user_data, merge=True)
        
        print(f"{ngo['name']:<30} | {ngo['email']:<30} | {ngo['password']}")

    except Exception as e:
        print(f"Error creating {ngo['name']}: {e}")

print("-" * 60)
print("✅ Mock NGOs seeded successfully!")
print("Use these credentials for your demo.")
