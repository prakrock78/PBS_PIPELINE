from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from sqlalchemy.orm import (
    Session
)

from app.core.database import (
    get_db
)

from app.models.user import (
    User
)

from app.schemas.auth import (
    LoginRequest,
    TokenResponse
)

from app.core.security import (
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.email ==
            payload.email
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail=
            "Invalid credentials"
        )

    valid = verify_password(
        payload.password,
        user.password
    )

    if not valid:

        raise HTTPException(
            status_code=401,
            detail=
            "Invalid credentials"
        )

    token = create_access_token(
        {
            "user_id":
            user.id,

            "email":
            user.email,

            "role":
            user.role
        }
    )

    return {
        "access_token":
        token,

        "token_type":
        "bearer",

        "role":
        user.role,

        "name":
        user.name
    }
