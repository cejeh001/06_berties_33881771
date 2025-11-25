CREATE DATABASE berties_books;
USE berties_books;
CREATE TABLE books (id INT AUTO_INCREMENT, name VARCHAR(50), price DECIMAL(5,2) unsigned, PRIMARY KEY(id));
INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25), ('Brave New World', 25.00), ('Animal Farm', 12.99), ('Making Comics', 26.77), ('Middle School, The Worst Years of My Life', 6.99);
CREATE USER 'berties_books_app'@'localhost' IDENTIFIED WITH mysql_native_password BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON myBookshop.* TO 'berties_books_app'@'localhost';

