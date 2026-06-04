from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.core.database import (
    Base
)


class Shot(Base):

    __tablename__ = (
        "shots"
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        Integer,
        ForeignKey(
            "projects.id"
        )
    )

    name = Column(
        String,
        nullable=False
    )

    artist = Column(
        String,
        nullable=True
    )

    status = Column(
        String,
        default=
        "Pending"
    )

    priority = Column(
        String,
        default=
        "Medium"
    )

    level = Column(
        String,
        nullable=True
    )

    due_date = Column(
        String,
        nullable=True
    )

    input_path = Column(
        String,
        nullable=True
    )

    work_path = Column(
        String,
        nullable=True
    )

    publish_path = Column(
        String,
        nullable=True
    )

    output_path = Column(
        String,
        nullable=True
    )

    lead_note = Column(
        String,
        nullable=True
    )

    supervisor_note = Column(
        String,
        nullable=True
    )