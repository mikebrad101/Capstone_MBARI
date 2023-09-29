drop database if exists expedition;
create database expedition;
use expedition;

CREATE TABLE person(
	user_ID VARCHAR(10),
	first_name VARCHAR(50),
	last_name VARCHAR(50),
    email VARCHAR(50),
    position VARCHAR(30),
	PRIMARY KEY (user_ID)
);

CREATE TABLE expedition(
	expedition_ID VARCHAR(10),
    PRIMARY KEY(expedition_ID)
);

CREATE TABLE precruise(
	expedition_ID VARCHAR(10),
    ship_name VARCHAR(20),
    purpose TEXT,
    chief_scientist VARCHAR(100),
    principal_investigator VARCHAR(100),
    sch_start DATETIME,
    sch_end DATETIME,
    equip_description TEXT,
    participants TEXT,
    region_description TEXT,
    planned_track_description TEXT,
    updated_by VARCHAR(10), 
    PRIMARY KEY (expedition_ID),
    FOREIGN KEY (updated_by) REFERENCES person(user_ID),
    FOREIGN KEY (expedition_ID) REFERENCES expedition(expedition_ID)
);

CREATE TABLE postcruise(
	expedition_ID VARCHAR(10),
	actual_start DATETIME,
    actual_end DATETIME,
    accomplishments TEXT,
    scientist_comments TEXT,
    operator_comments TEXT,
    sci_objective_met BOOLEAN,
    equipment_function BOOLEAN,
    other_comments TEXT,
    updated_by VARCHAR(10),
    PRIMARY KEY (expedition_ID),
    FOREIGN KEY (updated_by) REFERENCES person(user_ID),
    FOREIGN KEY (expedition_ID) REFERENCES expedition(expedition_ID)
);

CREATE TABLE dive(
	expedition_ID VARCHAR(10),
    ROV_name TEXT,
    dive_number INT,
    dive_start DATETIME,
    dive_end DATETIME,
    dive_cheif_scientist VARCHAR(100),
    accomplishments TEXT,
    FOREIGN KEY (expedition_ID) REFERENCES expedition(expedition_ID)
);
