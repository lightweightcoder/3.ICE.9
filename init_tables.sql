CREATEDB museum;

CREATE TABLE artists (id SERIAL PRIMARY KEY, name TEXT);
CREATE TABLE collections (id SERIAL PRIMARY KEY, name TEXT);
CREATE TABLE paintings (id SERIAL PRIMARY KEY, name TEXT, artist_id INTEGER, collection_id INTEGER);

INSERT INTO artists (name) VALUES ('Hans Hofmann');
INSERT INTO artists (name) VALUES ('Anne Ryan');
INSERT INTO artists (name) VALUES ('Georg Vilhelm Pauli');
INSERT INTO  artists (name) VALUES  ('Henri Matisse');

INSERT INTO collections (name) VALUES ('New York School');
INSERT INTO collections (name) VALUES ('Cubism');
INSERT INTO collections (name) VALUES ('Donors');



INSERT INTO paintings(name, artist_id, collection_id) VALUES('The Wind', 1, 1);
INSERT INTO paintings(name, artist_id, collection_id) VALUES('The Garden', 1, 1);
INSERT INTO paintings(name, artist_id, collection_id) VALUES('Gray Collage', 2, 1);
INSERT INTO paintings(name, artist_id, collection_id) VALUES('French Confirmation', 3, 2);

INSERT INTO paintings(name, artist_id, collection_id) VALUES('Girls of Avignon')