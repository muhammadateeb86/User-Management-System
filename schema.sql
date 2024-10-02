create table data(
id int primary key,
name varchar(50) unique not null,
email varchar(70) unique not null,
password varchar(50) not null
);