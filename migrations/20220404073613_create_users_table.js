/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary().unsigned();
    table.string("email", 255).defaultTo("");
    table.string("encrypted_password", 255).defaultTo("");
    table.string("reset_password_token", 255);
    table.timestamp("reset_password_sent_at", { useTz: false });
    table.timestamp("remember_created_at", { useTz: false });
    table.timestamps(true, true); //Add created_at and also updated_at
    table.boolean("admin").defaultTo(false);
    table.string("name");
    table.string("referralcode", 250);
    table.string("confirmation_token", 250);
    table.timestamp("confirmed_at", { useTz: false });
    table.timestamp("confirmation_sent_at", { useTz: false });
    table.boolean("tcb_flag");
    table.jsonb("shipping_address");
    table.jsonb("billing_address");
    table.index(["confirmation_token"], "index_users_on_confirmation_token");
    table.index(["email"], "index_users_on_email");
    table.index(
      ["reset_password_token"],
      "index_users_on_reset_password_token"
    );
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([knex.schema.dropTableIfExists("users")]);
};

/*
-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email character varying COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    encrypted_password character varying COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    reset_password_token character varying COLLATE pg_catalog."default",
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    admin boolean DEFAULT false,
    name character varying COLLATE pg_catalog."default",
    referralcode character varying COLLATE pg_catalog."default",
    confirmation_token character varying COLLATE pg_catalog."default",
    confirmed_at timestamp without time zone,
    confirmation_sent_at timestamp without time zone,
    tcb_flag boolean,
    shipping_address jsonb,
    billing_address jsonb,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to ajtniseghgfhge;
-- Index: index_users_on_confirmation_token

-- DROP INDEX public.index_users_on_confirmation_token;

CREATE UNIQUE INDEX index_users_on_confirmation_token
    ON public.users USING btree
    (confirmation_token COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: index_users_on_email

-- DROP INDEX public.index_users_on_email;

CREATE UNIQUE INDEX index_users_on_email
    ON public.users USING btree
    (email COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: index_users_on_reset_password_token

-- DROP INDEX public.index_users_on_reset_password_token;

CREATE UNIQUE INDEX index_users_on_reset_password_token
    ON public.users USING btree
    (reset_password_token COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
*/
