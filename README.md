# ceibo-back

Documentacion de la API :
http://localhost:(numero_de_puerto)/api-doc/

Antes de correr el servidor deberas crear la siguiente variable de entorno :
NODE_ENV=swagger-test

NODE_ENV servira para que los test de swagger den los resultados esperados sin afectar a la base de datos principal
en caso de querer manipular la base de datos principal , deberas cambiarle el nombre a cualquiera, tirar abajo el server y volver
a levantarlo, esto nos permitira que la variable de entorno se recargue
