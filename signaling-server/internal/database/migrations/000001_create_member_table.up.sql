CREATE TABLE MEMBERS
(
    name       text,
    surname    text,
    identifier text,
    id         bigserial primary key,
    created_at timestamptz,
    updated_at timestamptz,
    deleted_at timestamptz
);

CREATE INDEX idx_members_identifier ON MEMBERS (identifier);
