# Seguridad Proyecto Agro Sustentable
## Configuacion backend
* http://localhost:8095/
* Usuarios de prueba:
      user(Admin): orozcocristian860@gmail.com
      user(Operador): user01@gmail.com
      user(Visita): user02@gmail.com
      passGlobal: 12345 

## Instalación Base de datos desde Docker Compose 
### Pasos:
   1. Habilitar Virtualización de hardware en la BIOS 
   2. Instalar Docker 
   3. Comprobar que se encuentre correctamente instalado Docker y Docker Compose.
      3.1 Iniciar la aplicación y verificar que inicie en su totalidad
      3.2 Ir a alguna terminal y verificar si el path "docker-compose" en el sistema operativo es reconocido:
      * docker-compose --version
      * Debe devolver la versión del mismo.
   4. En raíz del proyecto se encuentra el archivo docker-compose.yml, con el que podemos ejecutar desde un IDE si cuenta con un pluguin necesario como el de IntelliJ
      4.2 Si su IDE no soporta docker, en aluna terminal, siituado en la carpeta donde esta el archivo docker-compose.yml, ejecute: docker-compose up

## PgAdmin:
### Configurar
   1. Verifique el contenedor generado con docker comopose, son dos imagenes, una de postgres y otra de pgadmin
   2. Ingresar a PgAdmin desde http://localhost:5050/
   3. Usuario: orozcocristian860@gmail.com, contraseña: Donna103
   4. Registrar el servidor:
      *     Nombre: <cualquiera>
      *     host name/address: <db-agro>
      *     port: <5432>
      *     maintenance: <postgres>
      *     username: <wolf103>
      *     password: <Donna103>

