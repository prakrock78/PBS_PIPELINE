from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.core.database import (
    engine,
    Base
)

from app.models.user import (
    User
)

from app.models.project import (
    Project
)

from app.models.shot import (
    Shot
)

from app.routes.user import (
    router as user_router
)

from app.routes.auth import (
    router as auth_router
)

from app.routes.project import (
    router as project_router
)

from app.routes.shot import (
    router as shot_router
)

from app.routes.workflow import (
    router as workflow_router
)

Base.metadata.create_all(
    bind=engine
)

app = FastAPI(
    title=
    "PBS Pipeline"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176"
    ],
    allow_credentials=
    True,
    allow_methods=
    ["*"],
    allow_headers=
    ["*"],
)

app.include_router(
    user_router
)

app.include_router(
    auth_router
)

app.include_router(
    project_router
)

app.include_router(
    shot_router
)

app.include_router(
    workflow_router
)


@app.get("/")
def home():

    return {
        "message":
        "PBS Running"
    }