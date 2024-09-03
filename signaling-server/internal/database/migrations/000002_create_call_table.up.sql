CREATE TABLE CALLS
(
    identifier text,
    id         bigserial primary key,
    created_at timestamptz,
    updated_at timestamptz,
    deleted_at timestamptz
);

CREATE INDEX idx_call_identifier ON CALLS (identifier);

ALTER TABLE MEMBERS
    ADD COLUMN call_id bigint
        CONSTRAINT fk_members_call REFERENCES CALLS (id)
            ON UPDATE CASCADE ON DELETE CASCADE;