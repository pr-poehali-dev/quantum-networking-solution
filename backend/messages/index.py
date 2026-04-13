"""Отправка и получение сообщений GoChat"""
import json
import os
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


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

    if action == "send":
        sender_id = body.get("sender_id")
        receiver_id = body.get("receiver_id")
        text = body.get("text", "").strip()

        if not text or not sender_id or not receiver_id:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Не заполнены поля"})}

        cur.execute(
            "INSERT INTO messages (sender_id, receiver_id, text) VALUES (%s, %s, %s) RETURNING id, created_at",
            (sender_id, receiver_id, text),
        )
        row = cur.fetchone()
        conn.commit()

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"id": row[0], "created_at": str(row[1])}),
        }

    if action == "get":
        user_a = body.get("user_a")
        user_b = body.get("user_b")

        cur.execute(
            """SELECT m.id, m.sender_id, m.receiver_id, m.text, m.created_at, m.is_read
               FROM messages m
               WHERE (m.sender_id = %s AND m.receiver_id = %s)
                  OR (m.sender_id = %s AND m.receiver_id = %s)
               ORDER BY m.created_at ASC""",
            (user_a, user_b, user_b, user_a),
        )
        rows = cur.fetchall()
        msgs = [
            {"id": r[0], "sender_id": r[1], "receiver_id": r[2], "text": r[3], "created_at": str(r[4]), "is_read": r[5]}
            for r in rows
        ]

        cur.execute(
            "UPDATE messages SET is_read = TRUE WHERE receiver_id = %s AND sender_id = %s AND is_read = FALSE",
            (user_a, user_b),
        )
        conn.commit()

        return {"statusCode": 200, "headers": headers, "body": json.dumps({"messages": msgs})}

    if action == "dialogs":
        user_id = body.get("user_id")
        cur.execute(
            """SELECT DISTINCT ON (contact_id)
                 contact_id,
                 m.text,
                 m.created_at,
                 u.display_name,
                 u.avatar_color,
                 u.username,
                 (SELECT COUNT(*) FROM messages WHERE receiver_id = %s AND sender_id = contact_id AND is_read = FALSE) as unread
               FROM (
                 SELECT CASE WHEN sender_id = %s THEN receiver_id ELSE sender_id END as contact_id,
                        text, created_at
                 FROM messages WHERE sender_id = %s OR receiver_id = %s
                 ORDER BY created_at DESC
               ) m
               JOIN users u ON u.id = m.contact_id
               ORDER BY contact_id, m.created_at DESC""",
            (user_id, user_id, user_id, user_id),
        )
        rows = cur.fetchall()
        dialogs = [
            {"contact_id": r[0], "last_message": r[1], "created_at": str(r[2]),
             "display_name": r[3], "avatar_color": r[4], "username": r[5], "unread": r[6]}
            for r in rows
        ]
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"dialogs": dialogs})}

    return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Unknown action"})}
