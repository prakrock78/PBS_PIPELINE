from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import (
    Session
)

from app.core.database import (
    get_db
)

from app.models.project import (
    Project
)

from app.schemas.project import (
    ProjectCreate,
    ProjectResponse
)

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.get(
    "/",
    response_model=
    list[
      ProjectResponse
    ]
)
def get_projects(
    db: Session =
    Depends(get_db)
):

    return (
        db.query(
            Project
        ).all()
    )


@router.post(
    "/",
    response_model=
    ProjectResponse
)
def create_project(
    payload:
    ProjectCreate,

    db: Session =
    Depends(get_db)
):

    project = Project(
        name=
        payload.name,

        client=
        payload.client,

        deadline=
        payload.deadline,

        status=
        payload.status
    )

    db.add(
        project
    )

    db.commit()

    db.refresh(
        project
    )

    return project
