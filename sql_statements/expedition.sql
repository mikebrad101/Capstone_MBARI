drop database if exists expedition;
create database expedition;
use expedition;

CREATE TABLE person(
	user_ID int NOT NULL AUTO_INCREMENT,
    email VARCHAR(50),
    password VARCHAR(255),
	first_name VARCHAR(50),
	last_name VARCHAR(50),
    role VARCHAR(30),
    occupation VARCHAR(30),
	PRIMARY KEY (user_ID)
);

CREATE TABLE expedition(
	expedition_ID int NOT NULL AUTO_INCREMENT,
    ship_name VARCHAR(20),
    purpose TEXT,
    chief_scientist VARCHAR(100),
    principal_investigator VARCHAR(100),
    sch_start DATE,
    sch_end DATE,
    equip_description TEXT,
    participants TEXT,
    region_description TEXT,
    planned_track_description TEXT,
    expedition_status VARCHAR(20),
    actual_start DATE,
    actual_end DATE,
    accomplishments TEXT,
    scientist_comments TEXT,
    operator_comments TEXT,
    sci_objective_met BOOLEAN,
    equipment_function BOOLEAN,
    other_comments TEXT,
    updated_by INT, 
    PRIMARY KEY (expedition_ID),
    FOREIGN KEY (updated_by) REFERENCES person(user_ID)
);

CREATE TABLE dive(
	expedition_ID INT,
    ROV_name TEXT,
    dive_number INT,
    dive_start DATE,
    dive_end DATE,
    dive_cheif_scientist VARCHAR(100),
    accomplishments TEXT,
    FOREIGN KEY (expedition_ID) REFERENCES expedition(expedition_ID)
);
