from sqlalchemy import (
    Column,
    Integer,
    String
)

from app.core.database import (
    Base
)


class Project(
    Base
):

    __tablename__ = (
        "projects"
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    client = Column(
        String,
        nullable=False
    )

    deadline = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default=
        "Active"
    )
    