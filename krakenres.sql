CREATE TABLE zonas (
    zonas_id SERIAL NOT NULL,
    zonas_nombre VARCHAR(45) UNIQUE NOT NULL,
    PRIMARY KEY(zonas_id)
);

CREATE TABLE tipos_productos (
    tipos_productos_id SERIAL NOT NULL, 
    tipos_productos_nombre VARCHAR(45) UNIQUE NOT NULL,
    PRIMARY KEY(tipos_productos_id)
);

CREATE TABLE puestos (
    puestos_id SERIAL NOT NULL,
    puestos_nombre VARCHAR(45) UNIQUE NOT NULL,
    PRIMARY KEY(puestos_id)
);

CREATE TABLE usuarios (
    usuarios_id SERIAL NOT NULL,
    nombres VARCHAR(45),
    apellidos VARCHAR(45),
    usuario VARCHAR(45) UNIQUE,
    password VARCHAR(1024),
    salt VARCHAR(180),
    puesto INT,
    status INT,
    PRIMARY KEY(usuarios_id),
    FOREIGN KEY(puesto) REFERENCES puestos(puestos_id)
);

CREATE TABLE productos (
    productos_id SERIAL NOT NULL,
    nombre_producto VARCHAR(45),
    precio_produccion FLOAT,
    precio_venta FLOAT,
    tipo INT,
    desripcion VARCHAR(140),
    status INT,
    PRIMARY KEY(productos_id)
);

CREATE TABLE comandas (
    comandas_id SERIAL NOT NULL,
    mesa VARCHAR(45),
    mesero INT,
    fecha timestamp DEFAULT now(),
    status INT,
    PRIMARY KEY(comandas_id),
    FOREIGN KEY(mesero) REFERENCES usuarios(usuarios_id)
);

CREATE TABLE pedidos (
    pedidos_id SERIAL NOT NULL,
    comanda INT,
    hora time DEFAULT current_time,
    estado INT,
    producto INT,
    nota VARCHAR(200),
    PRIMARY KEY(pedidos_id),
    FOREIGN KEY(comanda) REFERENCES comandas(comandas_id),
    FOREIGN KEY(producto) REFERENCES productos(productos_id)
);

CREATE TABLE horarios (
    horarios_id SERIAL NOT NULL,
    usuario INT,
    puesto INT,
    dia INT,
    PRIMARY KEY(horarios_id),
    FOREIGN KEY(usuario) REFERENCES usuarios(usuarios_id),
    FOREIGN KEY(puesto) REFERENCES puestos(puestos_id)
);