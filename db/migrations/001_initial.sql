CREATE TABLE accounts (
 id uuid PRIMARY KEY, email text NOT NULL UNIQUE, password_hash text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE account_sessions (
 token_hash text PRIMARY KEY, account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL
);
CREATE TABLE class_definitions (id text PRIMARY KEY, name_th text NOT NULL, weapon_th text NOT NULL);
CREATE TABLE characters (
 id uuid PRIMARY KEY, account_id uuid NOT NULL REFERENCES accounts(id), name text NOT NULL,
 class_id text NOT NULL REFERENCES class_definitions(id), map_id text NOT NULL DEFAULT 'town',
 x double precision NOT NULL DEFAULT 240, y double precision NOT NULL DEFAULT 350,
 level integer NOT NULL DEFAULT 1 CHECK(level>0), exp bigint NOT NULL DEFAULT 0 CHECK(exp>=0),
 money bigint NOT NULL DEFAULT 0 CHECK(money>=0), hp integer NOT NULL DEFAULT 100, mp integer NOT NULL DEFAULT 50,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE item_definitions (id text PRIMARY KEY, name_th text NOT NULL, tier text NOT NULL CHECK(tier IN ('starter','rare','very_rare')), data jsonb NOT NULL DEFAULT '{}');
CREATE TABLE inventory (character_id uuid NOT NULL REFERENCES characters(id), slot integer NOT NULL CHECK(slot>=0), item_id text NOT NULL REFERENCES item_definitions(id), quantity integer NOT NULL CHECK(quantity>0), PRIMARY KEY(character_id,slot));
CREATE TABLE equipment (character_id uuid NOT NULL REFERENCES characters(id), slot text NOT NULL, item_id text NOT NULL REFERENCES item_definitions(id), PRIMARY KEY(character_id,slot));
CREATE TABLE quests (character_id uuid NOT NULL REFERENCES characters(id), quest_id text NOT NULL, progress jsonb NOT NULL DEFAULT '{}', rewarded_at timestamptz, PRIMARY KEY(character_id,quest_id));
-- M3 must lock affected character/inventory rows and write mutation plus result in one transaction.
CREATE TABLE action_receipts (character_id uuid NOT NULL REFERENCES characters(id), request_id uuid NOT NULL, action text NOT NULL, result jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(character_id,request_id));
CREATE INDEX characters_account_idx ON characters(account_id);
