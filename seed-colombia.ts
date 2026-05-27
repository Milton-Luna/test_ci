import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';

// ---------------------------------------------------------------------------
// Datos oficiales DANE — 33 departamentos (32 + D.C.), ~1100 municipios
// ---------------------------------------------------------------------------
const COLOMBIA: { nombre: string; municipios: string[] }[] = [
  {
    nombre: 'Amazonas',
    municipios: ['Leticia', 'Puerto Nariño'],
  },
  {
    nombre: 'Antioquia',
    municipios: [
      'Medellín', 'Abejorral', 'Abriaquí', 'Alejandría', 'Amagá', 'Amalfi',
      'Andes', 'Angelópolis', 'Angostura', 'Anorí', 'Anzá', 'Apartadó',
      'Arboletes', 'Argelia', 'Armenia', 'Barbosa', 'Bello', 'Belmira',
      'Betania', 'Betulia', 'Briceño', 'Buriticá', 'Cáceres', 'Caicedo',
      'Caldas', 'Campamento', 'Cañasgordas', 'Caracolí', 'Caramanta', 'Carepa',
      'Carolina del Príncipe', 'Caucasia', 'Chigorodó', 'Cisneros',
      'Ciudad Bolívar', 'Cocorná', 'Concepción', 'Concordia', 'Copacabana',
      'Dabeiba', 'Don Matías', 'Ebéjico', 'El Bagre', 'El Carmen de Viboral',
      'El Santuario', 'Entrerríos', 'Envigado', 'Fredonia', 'Frontino',
      'Giraldo', 'Girardota', 'Gómez Plata', 'Granada', 'Guadalupe', 'Guarne',
      'Guatapé', 'Heliconia', 'Hispania', 'Itagüí', 'Ituango', 'Jardín',
      'Jericó', 'La Ceja', 'La Estrella', 'La Pintada', 'La Unión', 'Liborina',
      'Maceo', 'Marinilla', 'Montebello', 'Murindó', 'Mutatá', 'Nariño',
      'Nechí', 'Necoclí', 'Olaya', 'Peñol', 'Peque', 'Pueblorrico',
      'Puerto Berrío', 'Puerto Nare', 'Puerto Triunfo', 'Remedios', 'Retiro',
      'Rionegro', 'Sabanalarga', 'Sabaneta', 'Salgar', 'San Andrés de Cuerquia',
      'San Carlos', 'San Francisco', 'San Jerónimo', 'San José de la Montaña',
      'San Juan de Urabá', 'San Luis', 'San Pedro de Urabá',
      'San Pedro de los Milagros', 'San Rafael', 'San Roque', 'San Vicente Ferrer',
      'Santa Bárbara', 'Santa Fe de Antioquia', 'Santa Rosa de Osos',
      'Santo Domingo', 'Segovia', 'Sonsón', 'Sopetrán', 'Támesis', 'Tarazá',
      'Tarso', 'Titiribí', 'Toledo', 'Turbo', 'Uramita', 'Urrao', 'Valdivia',
      'Valparaíso', 'Vegachí', 'Venecia', 'Vigía del Fuerte', 'Yalí', 'Yarumal',
      'Yolombó', 'Yondó', 'Zaragoza',
    ],
  },
  {
    nombre: 'Arauca',
    municipios: [
      'Arauca', 'Arauquita', 'Cravo Norte', 'Fortul', 'Puerto Rondón',
      'Saravena', 'Tame',
    ],
  },
  {
    nombre: 'Atlántico',
    municipios: [
      'Barranquilla', 'Baranoa', 'Campo de la Cruz', 'Candelaria', 'Galapa',
      'Juan de Acosta', 'Luruaco', 'Malambo', 'Manatí', 'Palmar de Varela',
      'Piojó', 'Polonuevo', 'Ponedera', 'Puerto Colombia', 'Repelón',
      'Sabanagrande', 'Sabanalarga', 'Santa Lucía', 'Santo Tomás', 'Soledad',
      'Suán', 'Tubará', 'Usiacurí',
    ],
  },
  {
    nombre: 'Bogotá D.C.',
    municipios: ['Bogotá D.C.'],
  },
  {
    nombre: 'Bolívar',
    municipios: [
      'Cartagena de Indias', 'Achí', 'Altos del Rosario', 'Arenal', 'Arjona',
      'Arroyohondo', 'Barranco de Loba', 'Calamar', 'Cantagallo', 'Cicuco',
      'Clemencia', 'Córdoba', 'El Carmen de Bolívar', 'El Guamo', 'El Peñón',
      'Hatillo de Loba', 'Magangué', 'Mahates', 'Margarita', 'María la Baja',
      'Mompox', 'Montecristo', 'Morales', 'Norosí', 'Pinillos', 'Regidor',
      'Río Viejo', 'San Cristóbal', 'San Estanislao', 'San Fernando',
      'San Jacinto', 'San Jacinto del Cauca', 'San Juan Nepomuceno',
      'San Martín de Loba', 'San Pablo', 'Santa Catalina', 'Santa Rosa',
      'Santa Rosa del Sur', 'Simití', 'Soplaviento', 'Talaigua Nuevo',
      'Tiquisio', 'Turbaco', 'Turbaná', 'Villanueva', 'Zambrano',
    ],
  },
  {
    nombre: 'Boyacá',
    municipios: [
      'Tunja', 'Almeida', 'Aquitania', 'Arcabuco', 'Belén', 'Berbeo',
      'Betéitiva', 'Boavita', 'Boyacá', 'Briceño', 'Buenavista', 'Busbanzá',
      'Caldas', 'Campohermoso', 'Cerinza', 'Chinavita', 'Chiquinquirá',
      'Chiquiza', 'Chiscas', 'Chita', 'Chitaraque', 'Chivatá', 'Ciénega',
      'Cómbita', 'Coper', 'Corrales', 'Covarachía', 'Cubará', 'Cucaita',
      'Cuítiva', 'Duitama', 'El Cocuy', 'El Espino', 'Firavitoba', 'Floresta',
      'Gachantivá', 'Gameza', 'Garagoa', 'Guacamayas', 'Guateque', 'Guayatá',
      'Güicán de la Sierra', 'Iza', 'Jenesano', 'Jericó', 'La Capilla',
      'La Uvita', 'La Victoria', 'Labranzagrande', 'Macanal', 'Maripí',
      'Miraflores', 'Mongua', 'Monguí', 'Moniquirá', 'Motavita', 'Muzo',
      'Nobsa', 'Nuevo Colón', 'Oicatá', 'Otanche', 'Pachavita', 'Páez',
      'Paipa', 'Pajarito', 'Panqueba', 'Pauna', 'Paya', 'Paz de Río', 'Pesca',
      'Pisba', 'Puerto Boyacá', 'Quípama', 'Ramiriquí', 'Ráquira', 'Rondón',
      'Saboyá', 'Sáchica', 'Samacá', 'San Eduardo', 'San José de Pare',
      'San Luis de Gaceno', 'San Mateo', 'San Miguel de Sema',
      'San Pablo de Borbur', 'Santana', 'Santa María', 'Santa Rosa de Viterbo',
      'Santa Sofía', 'Sativanorte', 'Sativasur', 'Siachoque', 'Soatá',
      'Socotá', 'Socha', 'Sogamoso', 'Somondoco', 'Sora', 'Soracá',
      'Sotaquirá', 'Susacón', 'Sutamarchán', 'Sutatenza', 'Tasco', 'Tenza',
      'Tibaná', 'Tibasosa', 'Tinjacá', 'Tipacoque', 'Toca', 'Togüí', 'Tópaga',
      'Tota', 'Turmequé', 'Tuta', 'Tutazá', 'Umbita', 'Ventaquemada',
      'Villa de Leyva', 'Viracachá', 'Zetaquira',
    ],
  },
  {
    nombre: 'Caldas',
    municipios: [
      'Manizales', 'Aguadas', 'Anserma', 'Aranzazu', 'Belalcázar', 'Chinchiná',
      'Filadelfia', 'La Dorada', 'La Merced', 'Manzanares', 'Marmato',
      'Marquetalia', 'Marulanda', 'Neira', 'Norcasia', 'Pácora', 'Palestina',
      'Pensilvania', 'Riosucio', 'Risaralda', 'Salamina', 'Samaná', 'San José',
      'Supía', 'Victoria', 'Villamaría', 'Viterbo',
    ],
  },
  {
    nombre: 'Caquetá',
    municipios: [
      'Florencia', 'Albania', 'Belén de los Andaquíes', 'Cartagena del Chairá',
      'Curillo', 'El Doncello', 'El Paujil', 'La Montañita', 'Milán', 'Morelia',
      'Puerto Rico', 'San José del Fragua', 'San Vicente del Caguán', 'Solano',
      'Solita', 'Valparaíso',
    ],
  },
  {
    nombre: 'Casanare',
    municipios: [
      'Yopal', 'Aguazul', 'Chámeza', 'Hato Corozal', 'La Salina', 'Maní',
      'Monterrey', 'Nunchía', 'Orocué', 'Paz de Ariporo', 'Pore', 'Recetor',
      'Sabanalarga', 'Sácama', 'San Luis de Palenque', 'Tauramena', 'Trinidad',
      'Villanueva', 'Támara',
    ],
  },
  {
    nombre: 'Cauca',
    municipios: [
      'Popayán', 'Almaguer', 'Argelia', 'Balboa', 'Bolívar', 'Buenos Aires',
      'Cajibío', 'Caldono', 'Caloto', 'Corinto', 'El Tambo', 'Florencia',
      'Guachené', 'Guapi', 'Inzá', 'Jambaló', 'La Sierra', 'La Vega',
      'López de Micay', 'Mercaderes', 'Miranda', 'Morales', 'Padilla', 'Páez',
      'Patía', 'Piamonte', 'Piendamó', 'Puerto Tejada', 'Puracé', 'Rosas',
      'San Sebastián', 'Santander de Quilichao', 'Santa Rosa', 'Silvia',
      'Sotara', 'Suárez', 'Sucre', 'Timbío', 'Timbiquí', 'Toribío', 'Totoró',
      'Villa Rica',
    ],
  },
  {
    nombre: 'Cesar',
    municipios: [
      'Valledupar', 'Aguachica', 'Agustín Codazzi', 'Astrea', 'Becerril',
      'Bosconia', 'Chimichagua', 'Chiriguaná', 'Curumaní', 'El Copey',
      'El Paso', 'Gamarra', 'González', 'La Gloria', 'La Jagua de Ibirico',
      'La Jagua del Pilar', 'La Paz', 'Manaure Balcón del Cesar', 'Pailitas',
      'Pelaya', 'Pueblo Bello', 'Río de Oro', 'San Alberto', 'San Diego',
      'San Martín', 'Tamalameque',
    ],
  },
  {
    nombre: 'Chocó',
    municipios: [
      'Quibdó', 'Acandí', 'Alto Baudó', 'Atrato', 'Bagadó', 'Bahía Solano',
      'Bajo Baudó', 'Bojayá', 'Carmen del Darién', 'Cértegui', 'Condoto',
      'El Carmen de Atrato', 'El Litoral del San Juan', 'Istmina', 'Juradó',
      'Lloró', 'Medio Atrato', 'Medio Baudó', 'Medio San Juan', 'Nóvita',
      'Nuquí', 'Río Iró', 'Río Quito', 'Riosucio', 'San José del Palmar',
      'Sipí', 'Tadó', 'Unguía', 'Unión Panamericana',
    ],
  },
  {
    nombre: 'Córdoba',
    municipios: [
      'Montería', 'Ayapel', 'Buenavista', 'Canalete', 'Cereté', 'Chimá',
      'Chinú', 'Ciénaga de Oro', 'Cotorra', 'La Apartada', 'Lorica',
      'Los Córdobas', 'Momil', 'Montelíbano', 'Moñitos', 'Planeta Rica',
      'Pueblo Nuevo', 'Puerto Escondido', 'Puerto Libertador',
      'Purísima de la Concepción', 'Sahagún', 'San Andrés de Sotavento',
      'San Antero', 'San Bernardo del Viento', 'San Carlos', 'San José de Uré',
      'San Pelayo', 'Tierralta', 'Tuchín', 'Valencia',
    ],
  },
  {
    nombre: 'Cundinamarca',
    municipios: [
      'Agua de Dios', 'Albán', 'Anapoima', 'Anolaima', 'Apulo', 'Arbeláez',
      'Beltrán', 'Bituima', 'Bojacá', 'Cabrera', 'Cachipay', 'Cajicá',
      'Caparrapí', 'Cáqueza', 'Carmen de Carupa', 'Chaguaní', 'Chía',
      'Chipaque', 'Choachí', 'Chocontá', 'Cogua', 'Cota', 'Cucunubá',
      'El Colegio', 'El Peñón', 'El Rosal', 'Facatativá', 'Fomeque', 'Fosca',
      'Funza', 'Fúquene', 'Fusagasugá', 'Gachalá', 'Gachancipá', 'Gachetá',
      'Gama', 'Girardot', 'Granada', 'Guachetá', 'Guaduas', 'Guasca',
      'Guataquí', 'Guatavita', 'Guayabal de Síquima', 'Guayabetal', 'Gutiérrez',
      'Jerusalén', 'Junín', 'La Calera', 'La Mesa', 'La Palma', 'La Peña',
      'La Vega', 'Lenguazaque', 'Machetá', 'Madrid', 'Manta', 'Medina',
      'Mosquera', 'Nariño', 'Nemocón', 'Nilo', 'Nimaima', 'Nocaima',
      'Venecia', 'Pacho', 'Paime', 'Pandi', 'Paratebueno', 'Pasca',
      'Puerto Salgar', 'Pulí', 'Quebradanegra', 'Quetame', 'Quipile',
      'Ricaurte', 'San Antonio del Tequendama', 'San Bernardo', 'San Cayetano',
      'San Francisco', 'San Juan de Rioseco', 'Sasaima', 'Sesquilé', 'Sibaté',
      'Silvania', 'Simijaca', 'Soacha', 'Sopó', 'Subachoque', 'Suesca',
      'Supatá', 'Susa', 'Sutatausa', 'Tabio', 'Tausa', 'Tena', 'Tenjo',
      'Tibacuy', 'Tibirita', 'Tocaima', 'Tocancipá', 'Topaipí', 'Ubalá',
      'Ubaté', 'Une', 'Útica', 'Vergara', 'Vianí', 'Villagómez', 'Villapinzón',
      'Villeta', 'Viotá', 'Yacopí', 'Zipacón', 'Zipaquirá',
    ],
  },
  {
    nombre: 'Guainía',
    municipios: ['Inírida'],
  },
  {
    nombre: 'Guaviare',
    municipios: [
      'San José del Guaviare', 'Calamar', 'El Retorno', 'Miraflores',
    ],
  },
  {
    nombre: 'Huila',
    municipios: [
      'Neiva', 'Acevedo', 'Agrado', 'Aipe', 'Algeciras', 'Altamira', 'Baraya',
      'Campoalegre', 'Colombia', 'Elías', 'Garzón', 'Gigante', 'Guadalupe',
      'Hobo', 'Iquira', 'Isnos', 'La Argentina', 'La Plata', 'Nátaga',
      'Oporapa', 'Paicol', 'Palermo', 'Palestina', 'Pital', 'Pitalito',
      'Rivera', 'Saladoblanco', 'San Agustín', 'Santa María', 'Suaza', 'Tarqui',
      'Tello', 'Teruel', 'Tesalia', 'Timaná', 'Villavieja', 'Yaguará',
    ],
  },
  {
    nombre: 'La Guajira',
    municipios: [
      'Riohacha', 'Albania', 'Barrancas', 'Dibulla', 'Distracción', 'El Molino',
      'Fonseca', 'Hatonuevo', 'Maicao', 'Manaure', 'Páez', 'San Juan del Cesar',
      'Uribia', 'Urumita', 'Villanueva',
    ],
  },
  {
    nombre: 'Magdalena',
    municipios: [
      'Santa Marta', 'Algarrobo', 'Aracataca', 'Ariguaní', 'Cerro de San Antonio',
      'Chivolo', 'Ciénaga', 'Concordia', 'El Banco', 'El Piñón', 'El Retén',
      'Fundación', 'Guamal', 'Nueva Granada', 'Pedraza', 'Pijiño del Carmen',
      'Pivijay', 'Plato', 'Puebloviejo', 'Remolino', 'Sabanas de San Ángel',
      'Salamina', 'San Sebastián de Buenavista', 'San Zenón', 'Santa Ana',
      'Santa Bárbara de Pinto', 'Sitionuevo', 'Tenerife', 'Zapayán',
      'Zona Bananera',
    ],
  },
  {
    nombre: 'Meta',
    municipios: [
      'Villavicencio', 'Acacías', 'Barranca de Upía', 'Cabuyaro',
      'Castilla la Nueva', 'Cubarral', 'Cumaral', 'El Calvario', 'El Castillo',
      'El Dorado', 'Fuente de Oro', 'Granada', 'Guamal', 'La Macarena',
      'La Uribe', 'Lejanías', 'Mapiripán', 'Mesetas', 'Puerto Concordia',
      'Puerto Gaitán', 'Puerto Lleras', 'Puerto López', 'Puerto Rico',
      'Restrepo', 'San Carlos de Guaroa', 'San Juan de Arama', 'San Juanito',
      'San Martín', 'Vistahermosa',
    ],
  },
  {
    nombre: 'Nariño',
    municipios: [
      'Pasto', 'Albán', 'Aldana', 'Ancuyá', 'Arboleda', 'Barbacoas', 'Belén',
      'Buesaco', 'Colón', 'Consacá', 'Contadero', 'Córdoba', 'Cuaspud Carlosama',
      'Cumbal', 'Cumbitara', 'El Charco', 'El Peñol', 'El Rosario',
      'El Tablón de Gómez', 'El Tambo', 'Francisco Pizarro', 'Funes',
      'Guachucal', 'Guaitarilla', 'Gualmatán', 'Iles', 'Imués', 'Ipiales',
      'La Cruz', 'La Florida', 'La Llanada', 'La Tola', 'La Unión', 'Leiva',
      'Linares', 'Los Andes', 'Magüí Payán', 'Mallama', 'Mosquera', 'Nariño',
      'Olaya Herrera', 'Ospina', 'Policarpa', 'Potosí', 'Providencia',
      'Puerres', 'Pupiales', 'Ricaurte', 'Roberto Payán', 'Samaniego',
      'San Bernardo', 'San Lorenzo', 'San Pablo', 'San Pedro de Cartago',
      'Sandoná', 'Santa Bárbara', 'Santacruz', 'Sapuyes', 'Taminango',
      'Tangua', 'Tumaco', 'Túquerres', 'Yacuanquer',
    ],
  },
  {
    nombre: 'Norte de Santander',
    municipios: [
      'Cúcuta', 'Ábrego', 'Arboledas', 'Bochalema', 'Bucarasica', 'Cachirá',
      'Cácota', 'Chinácota', 'Chitagá', 'Convención', 'Cucutilla', 'Durania',
      'El Carmen', 'El Tarra', 'El Zulia', 'Gramalote', 'Hacarí', 'Herrán',
      'La Esperanza', 'La Playa', 'Labateca', 'Lourdes', 'Mutiscua', 'Ocaña',
      'Pamplona', 'Pamplonita', 'Puerto Santander', 'Ragonvalia', 'Salazar',
      'San Calixto', 'San Cayetano', 'Santiago', 'Sardinata', 'Silos',
      'Teorama', 'Tibú', 'Toledo', 'Villa Caro', 'Villa del Rosario',
      'Los Patios',
    ],
  },
  {
    nombre: 'Putumayo',
    municipios: [
      'Mocoa', 'Colón', 'Orito', 'Puerto Asís', 'Puerto Caicedo',
      'Puerto Guzmán', 'Puerto Leguízamo', 'San Francisco', 'San Miguel',
      'Santiago', 'Sibundoy', 'Valle del Guamuez', 'Villagarzón',
    ],
  },
  {
    nombre: 'Quindío',
    municipios: [
      'Armenia', 'Buenavista', 'Calarcá', 'Circasia', 'Córdoba', 'Filandia',
      'Génova', 'La Tebaida', 'Montenegro', 'Pijao', 'Quimbaya', 'Salento',
    ],
  },
  {
    nombre: 'Risaralda',
    municipios: [
      'Pereira', 'Apía', 'Balboa', 'Belén de Umbría', 'Dosquebradas', 'Guática',
      'La Celia', 'La Virginia', 'Marsella', 'Mistrató', 'Pueblo Rico',
      'Quinchía', 'Santa Rosa de Cabal', 'Santuario',
    ],
  },
  {
    nombre: 'San Andrés y Providencia',
    municipios: ['San Andrés', 'Providencia y Santa Catalina'],
  },
  {
    nombre: 'Santander',
    municipios: [
      'Bucaramanga', 'Aguada', 'Albania', 'Aratoca', 'Barbosa', 'Barichara',
      'Barrancabermeja', 'Betulia', 'Bolivia', 'Cabrera', 'California',
      'Capitanejo', 'Carcasí', 'Cepitá', 'Cerrito', 'Charalá', 'Charta',
      'Chima', 'Chipatá', 'Cimitarra', 'Concepción', 'Confines', 'Contratación',
      'Coromoro', 'Curití', 'El Carmen de Chucurí', 'El Guacamayo', 'El Hato',
      'El Peñón', 'El Playón', 'Encino', 'Enciso', 'Florián', 'Floridablanca',
      'Galán', 'Gámbita', 'Girón', 'Guaca', 'Guadalupe', 'Guapotá', 'Guavatá',
      'Güepsa', 'Hato', 'Jesús María', 'Jordán', 'La Belleza', 'Landázuri',
      'La Paz', 'Lebrija', 'Los Santos', 'Macaravita', 'Málaga', 'Matanza',
      'Mogotes', 'Molagavita', 'Ocamonte', 'Oiba', 'Onzaga', 'Palmar',
      'Palmas del Socorro', 'Páramo', 'Piedecuesta', 'Pinchote',
      'Puente Nacional', 'Puerto Parra', 'Puerto Wilches', 'Rionegro',
      'Sabana de Torres', 'San Andrés', 'San Benito', 'San Gil', 'San Joaquín',
      'San José de Miranda', 'San Miguel', 'San Vicente de Chucurí',
      'Santa Bárbara', 'Santa Helena del Opón', 'Simacota', 'Socorro',
      'Suaita', 'Sucre', 'Suratá', 'Tona', 'Valle de San José', 'Vélez',
      'Vetas', 'Villanueva', 'Zapatoca',
    ],
  },
  {
    nombre: 'Sucre',
    municipios: [
      'Sincelejo', 'Buenavista', 'Caimito', 'Chalán', 'Colosó', 'Corozal',
      'Coveñas', 'El Roble', 'Galeras', 'Guaranda', 'La Unión', 'Los Palmitos',
      'Majagual', 'Morroa', 'Ovejas', 'Palmito', 'Sampués', 'San Benito Abad',
      'San Juan de Betulia', 'San Marcos', 'San Onofre', 'San Pedro',
      'Santiago de Tolú', 'Sincé', 'Sucre', 'Tolú Viejo',
    ],
  },
  {
    nombre: 'Tolima',
    municipios: [
      'Ibagué', 'Alpujarra', 'Alvarado', 'Ambalema', 'Anzoátegui',
      'Armero-Guayabal', 'Ataco', 'Cajamarca', 'Carmen de Apicalá',
      'Casabianca', 'Chaparral', 'Coello', 'Coyaima', 'Cunday', 'Dolores',
      'Espinal', 'Falan', 'Flandes', 'Fresno', 'Guamo', 'Herveo', 'Honda',
      'Icononzo', 'Lérida', 'Líbano', 'Mariquita', 'Melgar', 'Murillo',
      'Natagaima', 'Ortega', 'Palocabildo', 'Piedras', 'Planadas', 'Prado',
      'Purificación', 'Rioblanco', 'Roncesvalles', 'Rovira', 'Saldaña',
      'San Antonio', 'San Luis', 'Santa Isabel', 'Suárez', 'Valle de San Juan',
      'Venadillo', 'Villahermosa', 'Villarrica',
    ],
  },
  {
    nombre: 'Valle del Cauca',
    municipios: [
      'Cali', 'Alcalá', 'Andalucía', 'Ansermanuevo', 'Argelia', 'Bolívar',
      'Buenaventura', 'Buga', 'Bugalagrande', 'Caicedonia', 'Calima',
      'Candelaria', 'Cartago', 'Dagua', 'El Águila', 'El Cairo', 'El Cerrito',
      'El Dovio', 'Florida', 'Ginebra', 'Guacarí', 'Jamundí', 'La Cumbre',
      'La Unión', 'La Victoria', 'Obando', 'Palmira', 'Pradera', 'Restrepo',
      'Riofrío', 'Roldanillo', 'San Pedro', 'Sevilla', 'Toro', 'Trujillo',
      'Tuluá', 'Ulloa', 'Versalles', 'Vijes', 'Yotoco', 'Yumbo', 'Zarzal',
    ],
  },
  {
    nombre: 'Vaupés',
    municipios: ['Mitú', 'Caruru', 'Taraira'],
  },
  {
    nombre: 'Vichada',
    municipios: [
      'Puerto Carreño', 'Cumaribo', 'La Primavera', 'Santa Rosalía',
    ],
  },
];

// ---------------------------------------------------------------------------

async function seed() {
  const host = process.env.DB_HOST ?? 'localhost';
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  const sslEnabled = process.env.DB_SSL === 'true' && !isLocal;

  const ds = new DataSource({
    type: 'postgres',
    host,
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [],
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    logging: false,
  });

  await ds.initialize();
  console.log('✓ Conectado a la base de datos\n');

  let insertedDepts = 0;
  let insertedMunis = 0;
  let skippedDepts = 0;
  let skippedMunis = 0;

  for (const { nombre, municipios } of COLOMBIA) {
    // UPSERT departamento — devuelve el id sin importar si ya existía
    const [dept] = await ds.query<{ id_departamento: number; created: boolean }[]>(
      `INSERT INTO departamento (nombre)
       VALUES ($1)
       ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
       RETURNING id_departamento, (xmax = 0) AS created`,
      [nombre],
    );

    if (dept.created) {
      console.log(`  ✓ Departamento: ${nombre}`);
      insertedDepts++;
    } else {
      console.log(`  ~ Departamento ya existía: ${nombre}`);
      skippedDepts++;
    }

    // Insertar municipios omitiendo duplicados (no hay UNIQUE en nombre+dept)
    let muniInserted = 0;
    for (const muni of municipios) {
      const result = await ds.query<{ id_municipio: number }[]>(
        `INSERT INTO municipio (nombre, id_departamento)
         SELECT $1::varchar, $2::integer
         WHERE NOT EXISTS (
           SELECT 1 FROM municipio
           WHERE nombre = $1::varchar AND id_departamento = $2::integer
         )
         RETURNING id_municipio`,
        [muni, dept.id_departamento],
      );
      if (result.length > 0) {
        muniInserted++;
        insertedMunis++;
      } else {
        skippedMunis++;
      }
    }
    console.log(`    → ${muniInserted} municipios insertados, ${municipios.length - muniInserted} ya existían`);
  }

  await ds.destroy();

  console.log('\n────────────────────────────────────────');
  console.log('✅ Seed completado');
  console.log(`   Departamentos insertados : ${insertedDepts}`);
  console.log(`   Departamentos ya existían: ${skippedDepts}`);
  console.log(`   Municipios insertados     : ${insertedMunis}`);
  console.log(`   Municipios ya existían    : ${skippedMunis}`);
  console.log('────────────────────────────────────────');
}

seed().catch((err: Error) => {
  console.error('\n❌ Error al ejecutar seed:', err.message);
  process.exit(1);
});
