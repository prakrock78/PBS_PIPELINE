from fastapi import FastAPI
from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.core.database import (
    engine,
    Base
)

from app.models.user import User

from app.routes.user import (
    router as user_router
)

Base.metadata.create_all(
    bind=engine
)

app = FastAPI(
    title="PBS Pipeline"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    user_router
)


@app.get("/")
def home():

    return {
        "message":
        "PBS Running"
    }
