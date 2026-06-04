from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.shot import Shot

router = APIRouter(
    prefix="/workflow",
    tags=["Workflow"]
)


@router.put(
    "/shot/{shot_id}"
)
def update_shot_status(
    shot_id: int,
    payload: dict,
    db: Session = Depends(
        get_db
    )
):

    shot = db.query(
        Shot
    ).filter(
        Shot.id == shot_id
    ).first()

    if not shot:

        return {
            "error":
            "Shot not found"
        }

    new_status = (
        payload.get(
            "status"
        )
    )

    shot.status = (
        new_status
    )

    db.commit()
    db.refresh(
        shot
    )

    return shot
