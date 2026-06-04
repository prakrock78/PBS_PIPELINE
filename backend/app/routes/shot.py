
from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import (
    Session
)

from app.core.database import (
    get_db
)

from app.models.shot import (
    Shot
)

from app.schemas.shot import (
    ShotCreate,
    ShotResponse
)

import os
import subprocess


router = APIRouter(
    prefix="/shots",
    tags=["Shots"]
)


@router.get(
    "/",
    response_model=list[
        ShotResponse
    ]
)
def get_shots(
    db: Session =
    Depends(get_db)
):

    return (
        db.query(
            Shot
        ).all()
    )


@router.get(
    "/artist/{artist_name}",
    response_model=list[
        ShotResponse
    ]
)
def get_artist_shots(
    artist_name: str,

    db: Session =
    Depends(get_db)
):

    return (
        db.query(
            Shot
        )
        .filter(
            Shot.artist ==
            artist_name
        )
        .all()
    )


@router.post(
    "/",
    response_model=
    ShotResponse
)
def create_shot(
    payload:
    ShotCreate,

    db: Session =
    Depends(get_db)
):

    shot = Shot(

        project_id=
        payload.project_id,

        name=
        payload.name,

        artist=
        payload.artist,

        status=
        payload.status,

        priority=
        payload.priority,

        due_date=
        payload.due_date,

        level=
        payload.level,

        input_path=
        payload.input_path,

        work_path=
        payload.work_path,

        publish_path=
        payload.publish_path,

        output_path=
        payload.output_path
    )

    db.add(
        shot
    )

    db.commit()

    db.refresh(
        shot
    )

    return shot


@router.get(
    "/open-folder"
)
def open_folder(
    path: str
):

    if (
        not path
    ):

        raise HTTPException(
            status_code=400,
            detail=
            "Path missing"
        )

    if (
        not os.path.exists(
            path
        )
    ):

        raise HTTPException(
            status_code=404,
            detail=
            "Folder not found"
        )

    subprocess.Popen(
        [
            "explorer",
            path
        ]
    )

    return {
        "message":
        "Folder opened"
    }