--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


SET search_path = public, pg_catalog;

--
-- Name: film_weighted_tsv_trigger(); Type: FUNCTION; Schema: public; Owner: postgres (1, 0.4, 0.2, 0.1)
--

CREATE FUNCTION film_weighted_tsv_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.weighted_tsv :=
     setweight(to_tsvector(coalesce(new.title,'')), 'A')    ||
		    setweight(to_tsvector(coalesce(new.categories,'')), 'B')  ||
		    setweight(to_tsvector(coalesce(new.summary,'')), 'C') ||
		    setweight(to_tsvector(coalesce(new.description,'')), 'D');
  return new;
end
$$;


ALTER FUNCTION public.film_weighted_tsv_trigger() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: log; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE log (
    id integer NOT NULL,
    "time" timestamp without time zone NOT NULL,
    query text NOT NULL
);


ALTER TABLE log OWNER TO postgres;

--
-- Name: movie; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE movie (
    movieid bigint NOT NULL,
    title character varying(255),
    categories character varying(255),
    summary text,
    description text,
    weighted_tsv tsvector
);


ALTER TABLE movie OWNER TO postgres;

--
-- Name: movie_movieid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE movie_movieid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE movie_movieid_seq OWNER TO postgres;

--
-- Name: movie_movieid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE movie_movieid_seq OWNED BY movie.movieid;


--
-- Name: searchLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "searchLog_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "searchLog_id_seq" OWNER TO postgres;

--
-- Name: searchLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "searchLog_id_seq" OWNED BY log.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY log ALTER COLUMN id SET DEFAULT nextval('"searchLog_id_seq"'::regclass);


--
-- Name: movieid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY movie ALTER COLUMN movieid SET DEFAULT nextval('movie_movieid_seq'::regclass);


--
-- Name: movie_movieid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('movie_movieid_seq', 1010, true);


--
-- Name: searchLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"searchLog_id_seq"', 75, true);


--
-- Name: movie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY movie
    ADD CONSTRAINT movie_pkey PRIMARY KEY (movieid);


--
-- Name: searchLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY log
    ADD CONSTRAINT "searchLog_pkey" PRIMARY KEY (id);


--
-- Name: weighted_tsv_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace:
--

CREATE INDEX weighted_tsv_idx ON movie USING gist (weighted_tsv);


--
-- Name: upd_tsvector; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER upd_tsvector BEFORE INSERT OR UPDATE ON movie FOR EACH ROW EXECUTE PROCEDURE film_weighted_tsv_trigger();


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

