# ceibo-back

API Documentation:  
http://localhost:(port_number)/api-doc/

Before running the server, you must create the following environment variable:  
`NODE_ENV=swagger-test`

`NODE_ENV` will ensure that the Swagger tests return the expected results without affecting the main database.  
If you want to manipulate the main database, you should rename it, shut down the server, and restart it. This will allow the environment variable to reload.
