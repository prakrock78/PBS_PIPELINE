from pydantic import (
    BaseModel
)

from typing import (
    Optional
)


class ShotCreate(
    BaseModel
):

    project_id: int
    name: str
    artist: str
    status: str
    priority: str
    due_date: str

    level: Optional[str] = None
    input_path: Optional[str] = None
    work_path: Optional[str] = None
    publish_path: Optional[str] = None
    output_path: Optional[str] = None


class ShotResponse(
    BaseModel
):

    id: int
    project_id: int
    name: str
    artist: str
    status: str
    priority: str
    due_date: str

    level: Optional[str] = None
    input_path: Optional[str] = None
    work_path: Optional[str] = None
    publish_path: Optional[str] = None
    output_path: Optional[str] = None

    class Config:
        from_attributes = True