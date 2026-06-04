from pydantic import (
    BaseModel
)


class ProjectCreate(
    BaseModel
):

    name: str
    client: str
    deadline: str
    status: str


class ProjectResponse(
    BaseModel
):

    id: int
    name: str
    client: str
    deadline: str
    status: str

    class Config:

        from_attributes = (
            True
        )
        