create database todo_database;

create table app_user ( id serial primary key, email varchar(50), password varchar(250));

CREATE TABLE todo(
	id serial PRIMARY KEY,
	creator_id integer,
	created_at TIMESTAMP,
	title VARCHAR (50),
	content VARCHAR (255),
	CONSTRAINT fk_todo_user 
		FOREIGN KEY (creator_id)
		REFERENCES app_user (id)
);


ALTER TABLE todo ALTER COLUMN creator_id SET NOT NULL;
ALTER TABLE todo ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE todo ALTER COLUMN title SET NOT NULL;
ALTER TABLE todo ALTER COLUMN content SET NOT NULL;