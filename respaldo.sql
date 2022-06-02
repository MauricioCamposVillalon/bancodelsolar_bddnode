CREATE DATABASE bancosolar;

CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(50),
balance FLOAT CHECK (balance >= 0));

CREATE TABLE transferencias (id SERIAL PRIMARY KEY, emisor INT, receptor
INT, monto FLOAT, fecha TIMESTAMP, FOREIGN KEY (emisor) REFERENCES
usuarios(id), FOREIGN KEY (receptor) REFERENCES usuarios(id));

SELECT * FROM usuarios;
SELECT * FROm transferencias; 

INSERT INTO usuarios (nombre, balance) VALUES ('Juan',30000);

UPDATE usuarios SET nombre='Mauri', balance=100000  WHERE id = 1 ;