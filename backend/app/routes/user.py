from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.database import (
    get_db
)

from app.core.security import (
    hash_password,
    verify_password
)

from app.models.user import (
    User
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/register")
def register_user(
    name: str,
    email: str,
    password: str,
    role: str,
    db: Session =
    Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail=
            "Email already exists"
        )

    hashed_password = (
        hash_password(
            password
        )
    )

    user = User(
        name=name,
        email=email,
        password=
        hashed_password,
        role=role
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return {
        "message":
        "User registered",
        "user_id":
        user.id
    }


@router.post("/login")
def login_user(
    email: str,
    password: str,
    db: Session =
    Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail=
            "User not found"
        )

    valid_password = (
        verify_password(
            password,
            user.password
        )
    )

    if not valid_password:

        raise HTTPException(
            status_code=401,
            detail=
            "Invalid password"
        )

    return {
        "message":
        "Login successful",

        "user": {
            "id":
            user.id,

            "name":
            user.name,

            "email":
            user.email,

            "role":
            user.role
        }
    }


@router.get("/")
def get_users(
    db: Session =
    Depends(get_db)
):

    return (
        db.query(User)
        .all()
    )