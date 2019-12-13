CREATE TABLE accounts (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
);

CREATE TABLE access_tokens (
    value TEXT PRIMARY KEY,
    username TEXT NOT NULL REFERENCES accounts(username),
    created TIMESTAMP NOT NULL,
    deprecated BOOLEAN NOT NULL
);
