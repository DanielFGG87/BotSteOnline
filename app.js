const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

// HORARIO

function horarioActual() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours(); // Hora actual (0 - 23)
    const currentDay = currentDate.getDay(); // Día de la semana (0 es domingo, 6 es sábado)

    // Definimos que el horario de atención es de lunes a viernes, de 8:00 a 18:00
    if (currentDay >= 0 && currentDay <= 6 && currentHour >= 1 && currentHour < 23) {
        return true; // Dentro del horario de atención
    }
    return false; // Fuera del horario de atención
}

// PEDIDO DE DATOS

async function pedirDatosUsuario(flowDynamic) {
    const datos = {};

    // Pedir el nombre
    await flowDynamic('Por favor, ingresa tu nombre:', { capture: true }, async (message) => {
        datos.nombre = message.body;
    });

    // Pedir la edad
    await flowDynamic('Gracias, ahora ingresa tu edad:', { capture: true }, async (message) => {
        datos.edad = message.body;
    });

    // Pedir el correo
    await flowDynamic('Ahora ingresa tu correo electrónico:', { capture: true }, async (message) => {
        datos.correo = message.body;
    });

    // Mostrar los datos capturados
    await flowDynamic(`Datos ingresados:
    - Nombre: ${datos.nombre}
    - Edad: ${datos.edad}
    - Correo: ${datos.correo}`);

    // Retorna los datos si necesitas procesarlos después
    return datos;
}


// MENSAJES

function mensage() {
    return [`Por favor, ingrese los siguientes datos:\n
    Apellido y Nombre:\n
    DNI:\n
    Fecha de Nacimiento:\n
    Localidad:\n
    Obra social (recuerde que los pacientes de PAMI deberán presentar la Orden médica digital y la credencial actualizada)\n
    Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo`]}

function mensage2() {
    return [`Por favor, ingrese los siguientes datos:\n
    Apellido y Nombre:\n
    DNI:\n
    Fecha de Nacimiento:\n
    Localidad:\n
    Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo`]}  

function mensage3() {
    return [`Por favor, ingrese los siguientes datos:\n
    Apellido y Nombre:\n
    DNI:\n
    Fecha de Nacimiento:\n
    Localidad:\n
    Obra social:\n
    Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo`]}


function mensage4() {
   return [`Enviar foto de la orden de indicación\n
   Apellido y Nombre:\n
   DNI:\n
   Fecha de Nacimiento:\n
   Localidad:\n
   *Obra social (recuerde que los pacientes de PAMI deben dirigirse a la agencia de PAMI para consultar convenio o puede también hacerlo telefónicamente a nuestras líneas fijas)*\n
    Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo`]}

    
// ######
// Especialidades Medicas
// ######


// CARDIOLOGIA

const flowDrBilbao = addKeyword(['1','bilbao']).addAnswer([
    mensage()
])

const flowDrAlamada = addKeyword(['2','almada']).addAnswer([
    mensage()
])

const flowDrGarcia = addKeyword(['3','garcia']).addAnswer([
    mensage()
])

const flowCardiologia = addKeyword(['1', 'cardiologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dr.Bilbao',
        '*2*.- Dr. Almada',
        '*3*.- Dr. Garcia'],
        null,
        null,
        [flowDrBilbao, flowDrAlamada, flowDrGarcia
    ])

// CLINICA MEDICA

const flowDrLopez = addKeyword(['2','lopez']).addAnswer([
    mensage()
])

const flowDrRegina = addKeyword(['1','regina']).addAnswer([
    mensage()
    ])

const flowClinicaMed = addKeyword(['2', 'clinica']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dr. La Regina',
        '*2*.- Dra. Lopez',
    ],
    null,
    null,
    [flowDrRegina, flowDrLopez]
    )

// CIRUGIA

const flowDrNegro = addKeyword(['1','negro']).addAnswer([ mensage()  
])

const flowDrWallace = addKeyword(['2','wallace']).addAnswer([mensage()
])

const flowDrLopezC = addKeyword(['3','lopez']).addAnswer([
    mensage()])

const flowDrArmendariz = addKeyword(['4','armendariz']).addAnswer([
    mensage()])

const flowDrBubilllo = addKeyword(['bubillo','5']).addAnswer([
    mensage()])

const flowDrMichelis = addKeyword(['michelis','6']).addAnswer([
    mensage()])

const flowDrMiranda = addKeyword(['miranda','7']).addAnswer([
    mensage()])

const flowCirugiaIntervencion = addKeyword(['2', 'no']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dr. Negro',
        '*2*.- Dr. Wallace',
        '*3*.- Dra. Lopez',
        '*4*.- Dr. Armendariz',
        '*5*.- Dra. Bubillo',
        '*6*.- Dr. De Michelis',
        '*7*.- Dr Miranda',
    ],
    null,
    null,
    [flowDrNegro, flowDrWallace, flowDrLopezC, flowDrArmendariz, flowDrBubilllo, flowDrMichelis, flowDrMiranda]
    )

const flowCirugiaCuracion = addKeyword(['1','si','curacion']).addAnswer([mensage2()])

    
const flowCirugia = addKeyword(['3', 'cirugia']).addAnswer(['¿Desea turno para curaciones o retirar puntos?'])
           .addAnswer([
           ' ',
            '*1*.- SI',
            '*2*.- NO'],
          null,
          null,
          [flowCirugiaCuracion, flowCirugiaIntervencion])
    

// DERMATOLOGIA

const flowDrPierini = addKeyword(['pierini','1']).addAnswer([
    mensage()])

const flowDermatologia = addKeyword(['4', 'dermatologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dra. Pierini'],
        null,
        null,
    [flowDrPierini])

// ENDOCRINOLOGIA

const flowDrFeretta = addKeyword(['feretta','1']).addAnswer([
    mensage3()])

const flowEndocrinologia = addKeyword(['5', 'endocrinologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dra. Feretta',
   //     'Medico 2',
   //     'Medico 3'
    ],
    null,
    null,
    [flowDrFeretta])

// FONOUDIOLOGIA

const flowTratamientoL = addKeyword(['tratamiento','1']).addAnswer([
    mensage4()])

const flowOEA = addKeyword(['oea','2']).addAnswer([
    'Por favor, ingrese los siguientes datos:',
    'Apellido y nombre',
    'DNI',
    'Fecha de nacimiento',
    'Localidad',
    '*Obra social (recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada)*'
])

const flowEstudiosA = addKeyword(['estudios','3']).addAnswer([
    mensage4()])


const flowFonoaudiologia = addKeyword(['6', 'fonoaudiologia']).addAnswer(['Por favor selecione el estudio'])
    .addAnswer([
        '*1*.- Tratamiento del Lenguaje',
        '*2*.- OEA',
        '*3*.- Estudios Audiologicos'],
        null,
        null,
    [flowTratamientoL, flowOEA, flowEstudiosA])

// GASTROENTEROLOGIA

const flowDrDelNegro = addKeyword(['1','negro']).addAnswer([
    mensage()])

const flowDrWallaceG = addKeyword(['2','wallace']).addAnswer([
    mensage()])

const flowDrLucia = addKeyword(['3','lucia']).addAnswer([
    mensage()])

const flowDrFacciutto = addKeyword(['4','facciutto']).addAnswer([
    mensage()])

const flowGastroenterologia = addKeyword(['7', 'gastro']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dr. Del Negro',
        '*2*.- Dr. Wallace',
        '*3*.- Dr. De Lucia',
        '*4*.- Dr. Facciutto'],
        null,
        null,
        [flowDrDelNegro, flowDrWallaceG, flowDrLucia, flowDrFacciutto])

// GINECOLOGIA

const flowDrGrimoldi = addKeyword(['1','grimoldi']).addAnswer([
    mensage()])

const flowDrEstevez = addKeyword(['2','estevez']).addAnswer([
    mensage()])

const flowDrLevitan = addKeyword(['3','levitan']).addAnswer([
    mensage()])

const flowDrMartinez = addKeyword(['4','martinez']).addAnswer([
    mensage()])

const flowDrPiyero = addKeyword(['5','piyero']).addAnswer([
    mensage()])

const flowDrArciprete = addKeyword(['6','arciprete']).addAnswer([
    mensage()])

const flowGinecologia = addKeyword(['8','ginecologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dra. Grimoldi',
        '*2*.- Dr. Estevez',
        '*3*.- Dra. Levitan',
        '*4*.- Dr. Martinez',
        '*5*.- Dr. Piyero',
        '*6*.- Dr. Arciprete'],
        null,
        null,
        [flowDrGrimoldi, flowDrEstevez, flowDrLevitan, flowDrMartinez, flowDrPiyero, flowDrArciprete

])

// HEMATOLOGIA

const flowDrBarbieris = addKeyword(['1','barbieris']).addAnswer([
    mensage()])

const flowHematologia = addKeyword(['9', 'hematologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dra. Barbieris',
        //'Medico 2',
        //'Medico 3'
    ],
    null,
    null,
    [flowDrBarbieris
])


// NEUROCIRUGIA

const flowDrGomez = addKeyword(['1','gomez']).addAnswer([
    mensage3()])

const flowDrGuerra = addKeyword(['2','gurra']).addAnswer([
    mensage3()])    

const flowDrCondori = addKeyword(['3','condori']).addAnswer([
    mensage3()])

const flowNeurocirugia = addKeyword(['10','neurocirugia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dra. Gomez',
        '*2*.- Dra. Guerra',
        '*3*.- Dr Condori'],
        null,
        null,
        [flowDrGomez, flowDrGuerra, flowDrCondori])


// OFTALMOLOGIA

const flowDrGiustozzi = addKeyword(['1','giustozzi']).addAnswer([
    mensage()])

const flowDrZanovello = addKeyword(['2','zanoveloo']).addAnswer([
    mensage()])

const flowOftalmologia = addKeyword(['11', 'oftalmologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dra. Giustozzi',
        '*2*.- Dr Zanovello'],
        //'Medico 3'
        null,
        null,
        [flowDrGiustozzi, flowDrZanovello])


// ONCOLOGIA

const flowDrBozzano = addKeyword(['1','bozano']).addAnswer([
    mensage3()])

const flowOncologia = addKeyword(['12', 'oncologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dr. Bozzano'],
       //'Medico 2',
        //'Medico 3'
        null,
        null,
        [flowDrBozzano])

// PSIQUIATRIA

const flowDrEcheverria = addKeyword(['1','echeverria']).addAnswer([
    mensage3()])

const flowDrGiuli = addKeyword(['2','giuli']).addAnswer([
    mensage3()])

const flowPsiquiatria = addKeyword(['13', 'psiquiatria']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dra. Echeverria',
        '*2*.- Dra. Di Giuli'],
        //'Medico 3'
        null,
        null,
        [flowDrGiuli, flowDrEcheverria])

// TRAUMATOLOGIA

const flowDrAcuña = addKeyword(['1','acuña']).addAnswer([
    mensage()])

const flowDrCastellani = addKeyword(['2','castellani']).addAnswer([
    mensage()])  

const flowDrRimmaudo = addKeyword(['3','rimmaudo']).addAnswer([
    mensage()])

const flowDrGallego = addKeyword(['4','gallego']).addAnswer([
    mensage()])

const flowTraumatologia = addKeyword(['14', 'traumatologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dr. Acuña',
        '*2*.- Dr. Castellani',
        '*3*.- Dr. Rimmaudo',
        '*4*.- Dra. Gallego'],
        null,
        null,
        [flowDrAcuña, flowDrCastellani, flowDrRimmaudo, flowDrGallego])


// PEDIATRIA


const flowPediatriaSano = addKeyword(['1', 'si']).addAnswer([
    mensage3()
])

const flowPediatriaNoSano = addKeyword(['2', 'no']).addAnswer(['*Turno de manera presencial de 8:30 hs a 11:30 hs'])


const flowPediatria = addKeyword(['15', 'pediatria']).addAnswer(['Por favor selecione si es para un niño/a completamente sano.'])
  .addAnswer([
     ' ',
      '*1*.- SI',
      '*2*.- NO'],
    null,
    null,
    [flowPediatriaSano, flowPediatriaNoSano])


// UROLOGIA

const flowDrGuaragnini = addKeyword(['1','guaragnini']).addAnswer([
    mensage()])

const flowDrMassaccesi = addKeyword(['2','massaccesi']).addAnswer([
    mensage()])

const flowUrologia = addKeyword(['16', 'urologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dr. Guaragnini',
        '*2*.- Dr. Massaccesi'],
        //'Medico 3'
        null,
        null,
        [flowDrGuaragnini, flowDrMassaccesi])

// NUTRICION

const flowLicPompozzi = addKeyword(['1','pompozzi']).addAnswer([
    mensage()])

const flowLicDalto = addKeyword(['2','dalto']).addAnswer([
        mensage()])

const flowLicEstevez = addKeyword(['3','estevez']).addAnswer([
            mensage()])

const flowNutricion = addKeyword(['17', 'nutricion']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Lic. Pompozzi',
        '*2*.- Lic. Dalto',
        '*3*.- Lic. Estevez'],
        null,
        null,
        [flowLicPompozzi, flowLicDalto, flowLicEstevez])

// ODONTOLOGIA

const flowOdonNiños = addKeyword(['2', 'niños']).addAnswer([mensage3()])

const flowOdonAdulosMañana = addKeyword(['1', 'mañana']).addAnswer([mensage3()])

const flowOdonAdultosTarde = addKeyword(['2', 'tarde']).addAnswer([mensage3()])

const flowOdonAdultos = addKeyword(['1', 'adultos']).addAnswer(['Porfavaor selecione el turno:',
    '',
    '*1*.- Turno Mañana',
    '*2*.- Turno Tarde'],
    null,
    null,
    [flowOdonAdulosMañana, flowOdonAdultosTarde])


const flowOdontologia = addKeyword(['18', 'odontologia']).addAnswer(['Por favor selecione una opcion'])
    .addAnswer([
        '*1*.- Adultos',
        '*2*.- Niños'],
        // 'Medico 3'
        null,
        null,
        [flowOdonAdultos, flowOdonNiños])


// FISIATRIA

const flowDrArocena = addKeyword(['1','arocena']).addAnswer([
    mensage()])

const flowFisiatria = addKeyword(['19', 'fisiatria']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dra. Arocena'],
        //'Medico 2',
        //'Medico 3'
        null,
        null,
        [flowDrArocena])


// NEUMOLOGIA

const flowDrSpinelli = addKeyword(['1','arocena']).addAnswer([
    mensage()]) 

const flowNeumologia = addKeyword(['20', 'neumologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dra. Spinelli'],
        //'Medico 2'
        null,
        null,
        [flowDrSpinelli])


// OBSTRETICIA

const flowDrArias = addKeyword(['1','arias']).addAnswer([
    mensage()])

const flowDrLemme = addKeyword(['2','lemme']).addAnswer([
    mensage()])

const flowDrTenaglia = addKeyword(['3','tenaglia']).addAnswer([
    mensage()])

const flowDrOrtiz = addKeyword(['4','ortiz']).addAnswer([
    mensage()])

const flowDrSerrani = addKeyword(['5','serrani']).addAnswer([
     mensage()])

const flowObstreticia = addKeyword(['21', 'obstreticia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Arias',
        '*2*.- Lemme',
        '*3*.- Tenaglia',
        '*4*.- Gil Ortiz',
        '*5*.- Serrani'],
        null,
        null,
        [flowDrArias, flowDrLemme, flowDrOrtiz, flowDrSerrani, flowDrTenaglia])


// OTORRINONARINGOLOGIA

const flowDrMazzei = addKeyword(['1','mazzei']).addAnswer([
    mensage()])

const flowOtorrino = addKeyword(['22', 'otorrino']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dr. Mazzei'],
        //'Medico 2',
        //'Medico 3'
        null,
        null,
        [flowDrMazzei])


// NEFROLOGIA

const flowDrCarriquiri = addKeyword(['1','carriquiri']).addAnswer([
    mensage()])

const flowNefrologia = addKeyword(['23', 'nefrologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*1*.- Dr. Carriquiri'],
        //'Medico 2',
        //'Medico 3'
        null,
        null,
        [flowDrCarriquiri])


// KINESIOLOGIA

const flowKinesiologia = addKeyword(['25', 'kinesiologia']).addAnswer([mensage4()])
  
        //'Medico 2',
        //'Medico 3'
    //])


// TERAPIA OCUPACIONAL

    const flowTerapiaOcu = addKeyword(['26', 'terapia']).addAnswer([mensage3()])
    //.addAnswer([
        //'Medico 1',
        //'Medico 2',
        //'Medico 3'
//])


// VACUNACION

const flowVacunacion = addKeyword(['24', 'vacunacion']).addAnswer(['Horario de atencion de 7:00 hs a 18:00 hs',
    'Los turnos son a demanda, previamente pasando por ventanilla de *TURNOS*.',
    '*Todos los dias se dan todas las vacunas, para FIEBRE AMARILLA debe solicitar turno previo llamando a las lineas fijas intero: 110*'
    //'Medico 2',
    //'Medico 3'
])


// PSICOLOGIA

const flowPsicologia = addKeyword(['27', 'psicologia']).addAnswer([mensage3()])


// NEUROLOGIA

const flowDraAyarza = addKeyword(['1','ayarza']).addAnswer([mensage3()])

const flowNeurologia = addKeyword(['28', 'neurologia']).addAnswer(['Por favor selecione el medico'])
.addAnswer([
    '*1*.- Dra. Ayarza Ana'],
    null,
    null,
    [flowDraAyarza])








// #######

// ESPECIALIDADES

// #######


const flowConsultorio = addKeyword(['1','consultorio','medico'])
    .addAnswer(['Indicar especialidad requerida',
        ' ',
        '*1.-* Cardiologia',
        '*2.-* Clinica Medica',
        '*3.-* Cirugia',
        '*4.-* Dermatologia',
        '*5.-* Endocrinologia',
        '*6.-* Fonoaudiologia',
        '*7.-* Gastroenterologia',
        '*8.-* Ginecologia',
        '*9.-* Hematologia',
        '*10.-* Neurocirugia',
        '*11.-* Oftalmologia',
        '*12.-* Oncologia',
        '*13.-* Psiquiatria',
        '*14.-* Traumatologia',
        '*15.-* Pediatria',
        '*16.-* Urologia',
        '*17.-* Nutricion',
        '*18.-* Odontologia',
        '*19.-* Fisiatria',
        '*20.-* Neumologia',
        '*21.-* Obstreticia',
        '*22.-* Otorrinonaringologia',
        '*23.-* Nefrologia',
        '*24.-* Vacunacion',
        '*25.-* Kinesiologia',
        '*26.-* Terapia ocupacional',
        '*27.-* Psicologia',
        '*28.-* Neurologia'
    ],
    null,
    null,
    [flowNeurologia, flowPsicologia, flowTerapiaOcu, flowKinesiologia, flowVacunacion, flowNeumologia, flowObstreticia, flowOtorrino, flowNefrologia, flowNutricion, flowOdontologia, flowFisiatria, flowOftalmologia, flowOncologia, flowPsiquiatria, flowTraumatologia, flowPediatria, flowUrologia, flowFonoaudiologia, flowGastroenterologia, flowGinecologia, flowHematologia, flowNeurocirugia, flowCardiologia, flowClinicaMed, flowCirugia, flowDermatologia, flowEndocrinologia]
    )

// ######

// ESTUDIOS DE DIAGNÓSTICO 

// ######

// ESTUDIO GASTROENTEROLOGICO

const flowEstGastroenterologicos = addKeyword(['10','Gastroenterologicos'])
    .addAnswer([mensage4()])

    
// RAYOS

const flowRayos = addKeyword(['rayos','1'])
    .addAnswer(['Enviar foto de la orden de indicación',
        'Apellido y nombre:',
        'DNI:', 
        'Fecha de nacimiento:',
        'Localidad:',
        '*Obra social (recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada)*',
        'Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo'
        ])


// ESPINOGRAFIA

const flowEspinografia = addKeyword(['2','Espinografia'])
    .addAnswer(['Enviar foto de la orden de indicación',
        'Apellido y nombre:',
        'DNI:', 
        'Fecha de nacimiento:',
        'Localidad:',
        '*Obra social (recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada)*',
        '*Presentar radiografia previa de columna, el dia de atención',
        'Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo'
        ])

// TOMOGRAFIA

const flowTomografia = addKeyword(['3','Tomografia'])
    .addAnswer(['Enviar foto de la orden de indicación',
        'Apellido y nombre:',
        'DNI:', 
        'Fecha de nacimiento:',
        'Localidad:',
        '*Obra social (recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada)*',
        '*Peso aproximado del paciente*',
        'Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo'
        ])

// MAGNIFICACIONES

const flowMamografia = addKeyword(['4','Mamografía'])
    .addAnswer([mensage4()])

// MAGNIFICACIONES

const flowMagnificaciones = addKeyword(['5','Magnificaciones'])
    .addAnswer(['Enviar foto de la orden de indicación',
        'Apellido y nombre:',
        'DNI.', 
        'Fecha de nacimiento:',
        'Localidad:',
        '*Obra social (recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada)*',
        'Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo'
         ])

// ECOCARDIOGRAMA

const flowEcocardiograma = addKeyword(['6','Ecocardiograma'])
    .addAnswer([mensage4()])

// ELECTROENFACELOGRAMA

const flowElectroenfacelograma = addKeyword(['7','Electroencefalograma'])
    .addAnswer(['Enviar foto de la orden de indicación',
        'Apellido y nombre:',
        'DNI:', 
        'Fecha de nacimiento:',
        'Localidad:',
        '*Obra social (recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada)*',
        'Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo'
        ])

// DOPPLER

const flowDoppler = addKeyword(['8','Doppler'])
    .addAnswer(['Enviar foto de la orden de indicación',
        'Apellido y nombre:',
        'DNI:', 
        'Fecha de nacimiento:',
        'Localidad:',
        '*Obra social (recuerde que los pacientes de PAMI deben dirigirse a la agencia de PAMI para consultar convenio o puede también hacerlo telefónicamente a nuestras líneas fijas)*',
        '*Recuerde que solo se realizan Doppler de vasos de cuello, cardíaco, obstétrico, venoso de MMII y arterial de MMII*',
        'Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo'
        ])

// ESTUDIO AUDIOLOGICO

const flowEstAudiologicos = addKeyword(['9','Estudios audiologicos'])
    .addAnswer([mensage4()])



// LABORATORIO

const flowLaboratorio = addKeyword(['11','laboratorio'])
    .addAnswer([mensage4()])

// ESPIROMETRIA

const flowEspirometria = addKeyword(['12','espirometria'])
    .addAnswer(['Enviar foto de la orden de indicación',
        'Apellido y nombre:',
        'DNI.', 
        'Fecha de nacimiento:',
        'Localidad:',
        '*Obra social (recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada)*',
        'Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo'
        ])

// ESTUDIO DE DIAGNOSTICO

 const flowEstudioDiag = addKeyword(['2','diagnostico','estudio'])
        .addAnswer([
            '*1.-* Rayos',
            '*2.-* Espinografia',
            '*3.-* Tomografía',
            '*4.-* Mamografía',
            '*5.-* Magnificaciones',
            '*6.-* Ecocardiograma',
            '*7.-* Electroencefalograma', 
            '*8.-* Doppler',
            '*9.-* Estudios Audiologicos', 
            '*10.-* Estudios Gastroenterológicos',
            '*11.-* Laboratorio',
            '*12.-* Espirometria'
        ],
        null,
        null,
        [
            flowLaboratorio, flowEstGastroenterologicos, flowEspirometria, flowRayos, flowEspinografia, flowTomografia, flowMamografia, 
            flowMagnificaciones, flowEcocardiograma, flowElectroenfacelograma, 
            flowDoppler, flowEstAudiologicos
        ])
    

// ######

// PEDIDO DE TURNOS

// ######
 
const flowResTurno = addKeyword(['1','turno']).addAnswer(
    [
        'Aqui podes selecionar el numero al tipo de especialidad a la cual quieres pedir turno, recuerda que debes cumplir ciertos requisitos que estaran informados',
        ' ',
        ' ',
        '*1.-* Consultorios Medicos',
        '*2.-* Estudios de Diagnostico'],
    null,
    null,
    [flowConsultorio, flowEstudioDiag]
)   

// ######

// MODIFICACION CANCELACION DE TURNOS

// ######

const flowModificarT = addKeyword(['1','modificar']).addAnswer([
'Indique los siguientes datos para poder modificar su turno',
        'Apellido y nombre:',
        'DNI:',
        'Fecha de nacimiento:',
        'Localidad:',
        'Obra social:',
        'Turno que tenía otorgado (Médico/Especialidad, día que tiene el turno asignado'])

 const flowCancelarT = addKeyword(['1','mopdificar']).addAnswer([
        'Indique los siguientes datos para poder cancelar su turno',
        'Apellido y nombre:',
        'DNI:',
        'Fecha de nacimiento:',
        'Localidad:',
        'Obra social:',
       'Turno que tenía otorgado (Médico/Especialidad, día que tiene el turno asignado'])

const flowModificarCancelarT = addKeyword(['2','modificacion'])
    .addAnswer([
        '*Indique si quiere Cancelar o modificar su turno*',
        '',
        '*1*.- Modificar',
        '*2*.- Cancelar'],
        null,
        null,
        [flowModificarT, flowCancelarT])

// #####
// CONFIRMACION DE TURNOS
// #####

const flowConfirmacion = addKeyword(['3','confirmacion'])
    .addAnswer([
    'Indique los siguientes datos para poder confirmar su turno',
    'Apellido y nombre:',
    'DNI:',
    'Fecha de nacimiento:',
    'Localidad:',
    'Obra social:',
    'Turno que tenía otorgado (Médico/Especialidad, día que tiene el turno asignado'])
    /*.addAnswer('Has seleccionado al Médico 1. Por favor, ingresa tu nombre:', { capture: true }, async (message, { flowDynamic }) => {
        const nombre = message.body;
        console.log('Nombre ingresado:', nombre); // Verificar si se captura el nombre
        await flowDynamic(`Gracias, ${nombre}.`);
    });*/



// #####
// CONSULTAS
// #####

const flowConsultas = addKeyword(['4','consultas'])
    .addAnswer(['Por consultas debe comunicarse a nuestras líneas fijas:',
        ' ',
        '2344-454112',
        '2344-454114',
        '2344-454113',
        'De lunes a viernes (días hábiles) en horario de 7:00 a 17:00 hs'])





// MENU INICIAL 


const flowHorarioAtencion = addKeyword(['repollo'])
    .addAnswer(
        [
        //'¡Hola!',
        //'  ',
        '🤖 Soy el Asistente Virtual del *Hospital Dr Posadas de Saladillo*',
        'Por favor escriba el número de la opción correspondiente',
        '  ',
        '*1.-*  Reservar turnos',
        '*2.-*  Modificación o cancelación de turnos reservados',
        '*3.-*  Confirmación de asistencia',
        '*4.-*  Consultas',
        ],
        null,
        null,
        [flowConsultas, flowConfirmacion, flowModificarCancelarT, flowResTurno]
    )
const flowFueraDeHorario = addKeyword(['repollo']).addAnswer([
    '*Horarios de atención*',
    'Lunes a viernes (días hábiles) de 7:00 a 12:00 Hs.',
    'Los *mensajes no quedan guardados*',
    'Por favor, vuelva a comunicarse.',
    'Muchas gracias'
])

 const flowPrincipal = addKeyword(['repollo'])
    .addAction(async (_, {flowDynamic, gotoFlow}) => {
        // Verifica si está en horario de atención o no
    if (horarioActual()) {
            // Si está en horario de atención, redirige a `flowHorarioAtencion`
        await flowDynamic('¡Hola!')
        return gotoFlow(flowHorarioAtencion)
             // Cambiado para redirigir correctamente
    } else {
         // Si está fuera de horario, redirige a `flowFueraDeHorario`
         await flowDynamic('¡Hola! Actualmente estamos *FUERA DEL HORARIO DE ATENCIÓN*. 🕔')
         return gotoFlow(flowFueraDeHorario) // Cambiado para redirigir correctamente
        }
    })


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
