from app.core.database import (
    SessionLocal
)

from app.models.user import (
    User
)

from app.core.security import (
    hash_password
)

db = SessionLocal()

users = [

    {
        "email":
        "admin@pbs.com",

        "password":
        "1234",

        "role":
        "admin",

        "name":
        "Admin"
    },

    {
        "email":
        "supervisor@pbs.com",

        "password":
        "1234",

        "role":
        "supervisor",

        "name":
        "Supervisor"
    },

    {
        "email":
        "artist@pbs.com",

        "password":
        "1234",

        "role":
        "artist",

        "name":
        "Kapil"
    },

    {
        "email":
        "client@pbs.com",

        "password":
        "1234",

        "role":
        "client",

        "name":
        "Client"
    }
]

for item in users:

    exists = (
        db.query(User)
        .filter(
            User.email ==
            item["email"]
        )
        .first()
    )

    if not exists:

        user = User(
            email=
            item["email"],

            password=
            hash_password(
                item[
                  "password"
                ]
            ),

            role=
            item["role"],

            name=
            item["name"]
        )

        db.add(
            user
        )

db.commit()

print(
    "Users seeded successfully"
)
