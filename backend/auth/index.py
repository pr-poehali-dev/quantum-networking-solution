"""Авторизация и регистрация пользователей GoChat"""
import json
import os
import hashlib
import secrets
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")

    conn = get_conn()
    cur = conn.cursor()

    if action == "register":
        username = body.get("username", "").strip()
        display_name = body.get("display_name", "").strip()
        password = body.get("password", "")

        if not username or not password or not display_name:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Заполните все поля"})}

        cur.execute("SELECT id FROM users WHERE username = %s", (username,))
        if cur.fetchone():
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Имя пользователя уже занято"})}

        colors = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"]
        color = colors[len(username) % len(colors)]

        cur.execute(
            "INSERT INTO users (username, display_name, password_hash, avatar_color) VALUES (%s, %s, %s, %s) RETURNING id, username, display_name, avatar_color",
            (username, display_name, hash_password(password), color),
        )
        user = cur.fetchone()
        conn.commit()
        session_token = secrets.token_hex(32)

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "token": session_token,
                "user": {"id": user[0], "username": user[1], "display_name": user[2], "avatar_color": user[3]},
            }),
        }

    if action == "login":
        username = body.get("username", "").strip()
        password = body.get("password", "")

        cur.execute(
            "SELECT id, username, display_name, avatar_color FROM users WHERE username = %s AND password_hash = %s",
            (username, hash_password(password)),
        )
        user = cur.fetchone()
        if not user:
            return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Неверный логин или пароль"})}

        session_token = secrets.token_hex(32)
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "token": session_token,
                "user": {"id": user[0], "username": user[1], "display_name": user[2], "avatar_color": user[3]},
            }),
        }

    if action == "users":
        cur.execute("SELECT id, username, display_name, avatar_color FROM users ORDER BY display_name")
        rows = cur.fetchall()
        users = [{"id": r[0], "username": r[1], "display_name": r[2], "avatar_color": r[3]} for r in rows]
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"users": users})}

    return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Unknown action"})}
