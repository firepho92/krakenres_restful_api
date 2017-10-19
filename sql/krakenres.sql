CREATE TABLE TiposProductos(
  Id int NOT NULL AUTO_INCREMENT,
  tipo varchar(45),
  PRIMARY KEY(Id)
);

CREATE TABLE Status(
  Id int NOT NULL AUTO_INCREMENT,
  status_name varchar(45),
  PRIMARY KEY(Id)
);

CREATE TABLE Estados(
  Id int NOT NULL AUTO_INCREMENT,
  estado varchar(45),
  PRIMARY KEY(Id)
);

CREATE TABLE Puestos(
  Id int NOT NULL AUTO_INCREMENT,
  puesto varchar(45),
  sueldo float,
  PRIMARY KEY(Id)
);

CREATE TABLE Zonas(
  Id int NOT NULL AUTO_INCREMENT,
  zona varchar(45),
  PRIMARY KEY(Id)
);

CREATE TABLE Mesas(
  Id int NOT NULL AUTO_INCREMENT,
  mesa varchar(45),
  zona int,
  PRIMARY KEY(Id),
  FOREIGN KEY(zona) REFERENCES Zonas(Id)
);

CREATE TABLE Usuarios(
  Id int NOT NULL AUTO_INCREMENT,
  nombre varchar(140),
  password varchar(28),
  salt varchar(512),
  inicio timestamp DEFAULT NOW(),
  puesto int,
  status int,
  dias varchar(140),
  PRIMARY KEY(Id),
  FOREIGN KEY(puesto) REFERENCES Puestos(Id),
  FOREIGN KEY(status) REFERENCES Status(Id)
);

CREATE TABLE Corte(
  Id int NOT NULL AUTO_INCREMENT,
  fecha timestamp DEFAULT NOW(),
  inicio float,
  venta float,
  empleado int,
  PRIMARY KEY(Id),
  FOREIGN KEY(empleado) REFERENCES Usuarios(Id)
);

CREATE TABLE Productos(
  Id int NOT NULL AUTO_INCREMENT,
  producto varchar(45),
  descripcion varchar(140),
  precioVenta float,
  precioCompra float,
  tipo int,
  fecha date,
  PRIMARY KEY(Id),
  FOREIGN KEY(tipo) REFERENCES TiposProductos(Id)
);

CREATE TABLE Gastos(
  Id int NOT NULL AUTO_INCREMENT,
  gasto varchar(45),
  descripcion varchar(140),
  precio float,
  corte int,
  PRIMARY KEY(Id),
  FOREIGN KEY(corte) REFERENCES Corte(Id)
);

CREATE TABLE Comandas(
  Id int NOT NULL AUTO_INCREMENT,
  mesa int,
  mesero int,
  PRIMARY KEY(Id),
  FOREIGN KEY(mesa) REFERENCES Mesas(Id),
  FOREIGN KEY(mesero) REFERENCES Usuarios(Id)
);

CREATE TABLE Pedidos(
  Id int NOT NULL AUTO_INCREMENT,
  producto int,
  tiempo timestamp DEFAULT NOW(),
  estado int,
  comanda int,
  PRIMARY KEY(Id),
  FOREIGN KEY(producto) REFERENCES Productos(Id),
  FOREIGN KEY(estado) REFERENCES Estados(Id),
  FOREIGN KEY(comanda) REFERENCES Comandas(Id)
);