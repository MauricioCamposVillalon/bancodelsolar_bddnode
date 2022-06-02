SELECT * FROM transferencias;
select * from usuarios;


SELECT nombre  FROM usuarios u INNER JOIN transferencias on where ;


SELECT (select u.nombre from usuarios u inner join transferencias t on u.id=t.emisor)as emisor from transferencias t group by emisor;


SELECT t.id, u.nombre as emisor,(select nombre from usuarios where id=t.receptor) as receptor, t.monto, t.fecha FROM transferencias t 
INNER JOIN usuarios u ON u.id=t.emisor group by t.id,t.fecha, t.monto, u.nombre,receptor ORDER BY t.id ASC;