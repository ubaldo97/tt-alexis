-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-05-2022 a las 19:32:40
-- Versión del servidor: 10.4.22-MariaDB
-- Versión de PHP: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `database_tt`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `academia`
--

CREATE TABLE `academia` (
  `id_academia` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `academia`
--

INSERT INTO `academia` (`id_academia`, `nombre`) VALUES
(1, 'Sistemas Computacionales'),
(2, 'Bioingeniería'),
(3, 'Ingeniería'),
(4, 'Químico-Biólogicas'),
(5, 'Sociales e Inglés'),
(6, 'Metalúrgia'),
(7, 'Físico-Matemáticas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `fk_id_usuario` varchar(100) NOT NULL,
  `num_empleado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`fk_id_usuario`, `num_empleado`) VALUES
('a1958baf-159b-40c7-acb6-5c1c1da2a217', '147852');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno`
--

CREATE TABLE `alumno` (
  `fk_id_usuario` varchar(100) NOT NULL,
  `boleta` varchar(20) DEFAULT NULL,
  `fk_id_carrera` int(11) DEFAULT NULL,
  `fk_id_proyecto` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asesor_externo`
--

CREATE TABLE `asesor_externo` (
  `fk_id_usuario` varchar(100) NOT NULL,
  `url_curriculum` varchar(200) DEFAULT NULL,
  `fk_id_proyecto` varchar(100) NOT NULL,
  `url_carta_compromiso` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calendario`
--

CREATE TABLE `calendario` (
  `entrega1` date DEFAULT NULL,
  `entrega2` date DEFAULT NULL,
  `entrega3` date DEFAULT NULL,
  `revision1` date DEFAULT NULL,
  `revision2` date DEFAULT NULL,
  `revision3` date DEFAULT NULL,
  `id_calendario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrera`
--

CREATE TABLE `carrera` (
  `id_carrera` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `carrera`
--

INSERT INTO `carrera` (`id_carrera`, `nombre`) VALUES
(1, 'Ingenieria en sistemas computacionales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deysa`
--

CREATE TABLE `deysa` (
  `fk_id_usuario` varchar(100) NOT NULL,
  `num_empleado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente`
--

CREATE TABLE `docente` (
  `fk_id_usuario` varchar(100) DEFAULT NULL,
  `url_curriculum` varchar(200) DEFAULT NULL,
  `fk_id_academia` int(11) DEFAULT NULL,
  `num_empleado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `presentacion_asesor`
--

CREATE TABLE `presentacion_asesor` (
  `fk_id_proyecto` varchar(100) NOT NULL,
  `fk_id_usuario` varchar(100) NOT NULL,
  `estado` int(11) NOT NULL,
  `url_observaciones` varchar(150) DEFAULT NULL,
  `tipo_asesor` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `protocolo_asesor`
--

CREATE TABLE `protocolo_asesor` (
  `fk_id_proyecto` varchar(100) NOT NULL,
  `fk_id_usuario` varchar(100) NOT NULL,
  `estado` int(11) NOT NULL,
  `url_observaciones` varchar(200) DEFAULT NULL,
  `tipo_asesor` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `protocolo_revisor`
--

CREATE TABLE `protocolo_revisor` (
  `fk_id_proyecto` varchar(100) NOT NULL,
  `fk_id_usuario` varchar(100) NOT NULL,
  `url_protocolo_e1` varchar(200) NOT NULL,
  `estado_e1` int(11) NOT NULL,
  `url_observaciones_e1` varchar(200) NOT NULL,
  `url_protocolo_e2` varchar(200) NOT NULL,
  `estado_e2` int(11) NOT NULL,
  `url_observaciones_e2` varchar(200) NOT NULL,
  `url_protocolo_e3` varchar(200) NOT NULL,
  `estado_e3` int(11) NOT NULL,
  `url_observaciones_e3` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyecto`
--

CREATE TABLE `proyecto` (
  `id_proyecto` varchar(100) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `linea_investigacion` varchar(100) NOT NULL,
  `estado_solicitud_director` tinyint(1) NOT NULL,
  `estado_respuesta_deysa` tinyint(1) NOT NULL,
  `estado_proceso` int(11) NOT NULL,
  `url_solicitud_deysa` varchar(200) DEFAULT NULL,
  `url_respuesta_deysa` varchar(200) DEFAULT NULL,
  `url_observaciones_solicitud` varchar(200) DEFAULT NULL,
  `url_protocolo` varchar(200) DEFAULT NULL,
  `url_reporte` varchar(200) DEFAULT NULL,
  `url_presentacion` varchar(200) DEFAULT NULL,
  `fecha_reporte` date DEFAULT NULL,
  `lugar_examen` varchar(100) DEFAULT NULL,
  `fecha_examen` date DEFAULT NULL,
  `fk_id_director` varchar(100) DEFAULT NULL,
  `num_entregas_protocolo` int(11) NOT NULL,
  `estado_protocolo_asesores` int(11) DEFAULT NULL,
  `estado_protocolo_revisores` int(11) DEFAULT NULL,
  `estado_reporte_asesores` int(11) DEFAULT NULL,
  `estado_presentacion_asesores` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyecto_jurado`
--

CREATE TABLE `proyecto_jurado` (
  `fk_id_usuario` varchar(100) NOT NULL,
  `fk_id_proyecto` varchar(100) NOT NULL,
  `rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reporte_asesor`
--

CREATE TABLE `reporte_asesor` (
  `fk_id_proyecto` varchar(100) NOT NULL,
  `fk_id_usuario` varchar(100) NOT NULL,
  `estado` int(11) NOT NULL,
  `url_observaciones` varchar(200) DEFAULT NULL,
  `tipo_asesor` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo`
--

CREATE TABLE `tipo` (
  `id_tipo` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipo`
--

INSERT INTO `tipo` (`id_tipo`, `tipo`) VALUES
(1, 'Administrador'),
(2, 'Titular'),
(3, 'Deysa'),
(4, 'Docente'),
(5, 'Alumno'),
(6, 'Asesor externo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_usuario`
--

CREATE TABLE `tipo_usuario` (
  `fk_id_usuario` varchar(100) NOT NULL,
  `fk_id_tipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipo_usuario`
--

INSERT INTO `tipo_usuario` (`fk_id_usuario`, `fk_id_tipo`) VALUES
('a1958baf-159b-40c7-acb6-5c1c1da2a217', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` varchar(100) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido_paterno` varchar(50) DEFAULT NULL,
  `apellido_materno` varchar(50) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(200) DEFAULT NULL,
  `estado_registro` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido_paterno`, `apellido_materno`, `correo`, `password`, `estado_registro`) VALUES
('a1958baf-159b-40c7-acb6-5c1c1da2a217', 'Ubaldo', 'Panuco', 'Sandoval', 'ups9703@gmail.com', '$2a$10$Sgp/kFKtnSxui7jpZowFwuh94pERD5vMdY96OrP7ptAwGpdkPOOMG', 'Registrado');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `academia`
--
ALTER TABLE `academia`
  ADD PRIMARY KEY (`id_academia`);

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD KEY `fk_id_usuario` (`fk_id_usuario`);

--
-- Indices de la tabla `alumno`
--
ALTER TABLE `alumno`
  ADD KEY `fk_id_usuario` (`fk_id_usuario`),
  ADD KEY `fk_id_carrera` (`fk_id_carrera`),
  ADD KEY `fk_id_proyecto` (`fk_id_proyecto`);

--
-- Indices de la tabla `asesor_externo`
--
ALTER TABLE `asesor_externo`
  ADD KEY `fk_id_usuario` (`fk_id_usuario`),
  ADD KEY `fk_id_proyecto` (`fk_id_proyecto`);

--
-- Indices de la tabla `calendario`
--
ALTER TABLE `calendario`
  ADD PRIMARY KEY (`id_calendario`);

--
-- Indices de la tabla `carrera`
--
ALTER TABLE `carrera`
  ADD PRIMARY KEY (`id_carrera`);

--
-- Indices de la tabla `deysa`
--
ALTER TABLE `deysa`
  ADD KEY `fk_id_usuario` (`fk_id_usuario`);

--
-- Indices de la tabla `docente`
--
ALTER TABLE `docente`
  ADD KEY `fk_id_usuario` (`fk_id_usuario`),
  ADD KEY `fk_id_academia` (`fk_id_academia`);

--
-- Indices de la tabla `presentacion_asesor`
--
ALTER TABLE `presentacion_asesor`
  ADD KEY `fk_id_proyecto` (`fk_id_proyecto`),
  ADD KEY `fk_id_usuario` (`fk_id_usuario`);

--
-- Indices de la tabla `protocolo_asesor`
--
ALTER TABLE `protocolo_asesor`
  ADD KEY `fk_id_proyecto` (`fk_id_proyecto`),
  ADD KEY `fk_id_usuario` (`fk_id_usuario`);

--
-- Indices de la tabla `protocolo_revisor`
--
ALTER TABLE `protocolo_revisor`
  ADD KEY `fk_id_proyecto` (`fk_id_proyecto`),
  ADD KEY `fk_id_usuario` (`fk_id_usuario`);

--
-- Indices de la tabla `proyecto`
--
ALTER TABLE `proyecto`
  ADD PRIMARY KEY (`id_proyecto`),
  ADD KEY `fk_id_director` (`fk_id_director`);

--
-- Indices de la tabla `proyecto_jurado`
--
ALTER TABLE `proyecto_jurado`
  ADD KEY `fk_id_usuario` (`fk_id_usuario`),
  ADD KEY `fk_id_proyecto` (`fk_id_proyecto`);

--
-- Indices de la tabla `reporte_asesor`
--
ALTER TABLE `reporte_asesor`
  ADD KEY `fk_id_proyecto` (`fk_id_proyecto`),
  ADD KEY `fk_id_usuario` (`fk_id_usuario`);

--
-- Indices de la tabla `tipo`
--
ALTER TABLE `tipo`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD KEY `fk_id_usuario` (`fk_id_usuario`),
  ADD KEY `fk_id_tipo` (`fk_id_tipo`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `academia`
--
ALTER TABLE `academia`
  MODIFY `id_academia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `calendario`
--
ALTER TABLE `calendario`
  MODIFY `id_calendario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carrera`
--
ALTER TABLE `carrera`
  MODIFY `id_carrera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tipo`
--
ALTER TABLE `tipo`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `alumno`
--
ALTER TABLE `alumno`
  ADD CONSTRAINT `alumno_ibfk_1` FOREIGN KEY (`fk_id_carrera`) REFERENCES `carrera` (`id_carrera`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `alumno_ibfk_2` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `alumno_ibfk_3` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `asesor_externo`
--
ALTER TABLE `asesor_externo`
  ADD CONSTRAINT `asesor_externo_ibfk_1` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `asesor_externo_ibfk_2` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `deysa`
--
ALTER TABLE `deysa`
  ADD CONSTRAINT `deysa_ibfk_1` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `docente`
--
ALTER TABLE `docente`
  ADD CONSTRAINT `docente_ibfk_1` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `docente_ibfk_2` FOREIGN KEY (`fk_id_academia`) REFERENCES `academia` (`id_academia`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `presentacion_asesor`
--
ALTER TABLE `presentacion_asesor`
  ADD CONSTRAINT `presentacion_asesor_ibfk_1` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `presentacion_asesor_ibfk_2` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `protocolo_asesor`
--
ALTER TABLE `protocolo_asesor`
  ADD CONSTRAINT `protocolo_asesor_ibfk_1` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `protocolo_asesor_ibfk_2` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `protocolo_revisor`
--
ALTER TABLE `protocolo_revisor`
  ADD CONSTRAINT `protocolo_revisor_ibfk_1` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `protocolo_revisor_ibfk_2` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `proyecto`
--
ALTER TABLE `proyecto`
  ADD CONSTRAINT `proyecto_ibfk_1` FOREIGN KEY (`fk_id_director`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `proyecto_jurado`
--
ALTER TABLE `proyecto_jurado`
  ADD CONSTRAINT `proyecto_jurado_ibfk_1` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `proyecto_jurado_ibfk_2` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `reporte_asesor`
--
ALTER TABLE `reporte_asesor`
  ADD CONSTRAINT `reporte_asesor_ibfk_1` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reporte_asesor_ibfk_2` FOREIGN KEY (`fk_id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD CONSTRAINT `tipo_usuario_ibfk_1` FOREIGN KEY (`fk_id_tipo`) REFERENCES `tipo` (`id_tipo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tipo_usuario_ibfk_2` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
