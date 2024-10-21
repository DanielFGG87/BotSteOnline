import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const PORT = process.env.PORT ?? 3008

// HORARIO

function horarioActual() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours(); // Hora actual (0 - 23)
    const currentDay = currentDate.getDay(); // Día de la semana (0 es domingo, 6 es sábado)

    // Definimos que el horario de atención es de lunes a viernes, de 8:00 a 18:00
    if (currentDay >= 1 && currentDay <= 5 && currentHour >= 7 && currentHour < 10) {
        return true; // Dentro del horario de atención
    }
    return false; // Fuera del horario de atención
}



// MENSAJES
//Datos obrasocial PAMI
function mensage() {
    return [`ecuerde que los pacientes de PAMI deberán presentar la Orden médica digital y la credencial actualizada)\n
    Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo`]}
//Datos
function mensage2() {
    return [`Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo`]}  
//Datos y obrasocial
function mensage3() {
    return [`Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo`]}

//Con foto

//Datos, obrasocial PAMI
function mensage4() {
   return ['*Recuerde que los pacientes de PAMI deben dirigirse a la agencia de PAMI para consultar convenio o puede también hacerlo telefónicamente a nuestras líneas fijas)*\
    Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo']}
//Datos y obrasocial
function mensage5() {
    return [`Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo`]}    

// PETICION DE DATOS

    const flowDatosObra = addKeyword(EVENTS.ACTION)
    .addAnswer('Voy a pedirte unos datos para agendar tu turno')
    .addAnswer(
        '¿Cual es tu apellido y nombre?',
        {capture: true},
        async (ctx, { flowDynamic, state }) => {
            await state.update({ name: ctx.body })
            const myState = state.getMyState()
          //  await flowDynamic(`Gracias por tu Nombre! ${myState.name}`)
        }
    )
    .addAnswer(
        '¿Cual es tu DNI?',
        {capture: true},
        async (ctx, { flowDynamic, state }) => {
            await state.update({ dni: ctx.body })
            const myState = state.getMyState()
          //  await flowDynamic(`Gracias por tu DNI! ${myState.dni}`)
        }
    )
    .addAnswer(
        '¿Cual es tu fecha de nacimiento?',
        {capture: true},
        async (ctx, { flowDynamic, state }) => {
            await state.update({ nac: ctx.body })
            const myState = state.getMyState()
           // await flowDynamic(`Gracias por tu edad! ${myState.nac}`)
        }
    )
    
    .addAnswer(
        '¿Cual es tu localidad?',
        {capture: true},
        async (ctx, { flowDynamic, state }) => {
            await state.update({ loc: ctx.body })
            const myState = state.getMyState()
           // await flowDynamic(`Gracias por tu edad! ${myState.loc}`)
        }
    )
    
    .addAnswer(
        '¿Cual es tu obra social?',
        {capture: true},
        async (ctx, { flowDynamic, state }) => {
            await state.update({ obr: ctx.body })
            const myState = state.getMyState()
            //await flowDynamic(`Gracias por tu edad! ${myState.nac}`)
        }
    )
    
    .addAnswer('Tus datos son:', null, async (_, { flowDynamic, state }) => {
        const myState = state.getMyState()
        flowDynamic(`   Nombre: ${myState.name}
        Fecha de nacimiento : ${myState.nac}
        DNI: ${myState.dni}
        Localidad : ${myState.nac}
        Obra social: ${myState.obr}
        Especialidad: ${myState.especialidad}
        Medico: ${myState.medico}
    
        ${mensage()}`)
        
    })

// PETICION DE FOTO

let attemptCount = 0; // Variable global para contar los intentos

const flowFoto = addKeyword(EVENTS.ACTION)
.addAnswer('Por favor, envíame la foto del orden.', {
    capture: true
}, async (ctx, { flowDynamic, endFlow, fallBack, gotoFlow }) => {
    attemptCount++; // Incrementa el contador de intentos

    // Verifica si el mensaje contiene una imagen
    if (ctx?.message?.imageMessage) {
        console.log('Recibiste una imagen.');
        // Resetea el contador de intentos
        attemptCount = 0;
        // Continúa el flujo ya que recibiste una foto
        await flowDynamic('Gracias, continuemos.');
        return gotoFlow(flowDatosFoto)
    } else {
        console.log(`No se recibió una imagen. Intento ${attemptCount} de 5.`);
        // Si ha alcanzado los 5 intentos, finaliza el flujo
        if (attemptCount >= 5) {
            attemptCount = 0; // Resetea el contador
            return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
        }
        // Volver a pedir la imagen si no se envió una
        await flowDynamic(`Esto no es una foto. Tienes ${5 - attemptCount} intentos restantes, por favor envia la foto de la orden.`);
        // Reintentar el mismo flujo
        return fallBack(); // Reinicia el flujo hasta recibir la imagen o alcanzar el límite
    }
});

// ROTORNO AL MENU INICIAL

const flowRetorno = addKeyword('0', {sensitive: true}).addAnswer(['_Volviendo al menu inicial.._'])
.addAction(
    async (ctx, { gotoFlow }) => {
    // Ir automáticamente al siguiente flujo (flow2)
   return gotoFlow(flowHorarioAtencion);
   })

// ######
// Especialidades Medicas
// ######



// CARDIOLOGIA

const flowDrBilbao = addKeyword(['1','bilbao'])
    .addAction(
    async (ctx, { state }) => {
    const medico = 'Dr.Bilbao'; // Tu dato
    await state.update({ medico: medico })
    const especialidad = 'Cardiologia'; // Tu dato
    await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
    await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
    return gotoFlow(flowDatosObra);
    }) 

const flowDrAlamada = addKeyword(['2','almada'])
    .addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Almada'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Cardiologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrGarcia = addKeyword(['3','garcia'])
    .addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Garcia Gadda'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Cardiologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
    return gotoFlow(flowDatosObra);
    })
const flowCardiologia = addKeyword(['1', 'cardiologia']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dr.Bilbao',
        '*2*.- Dr. Almada',
        '*3*.- Dr. Garcia Gadda'],
        null,
        null,
        [flowRetorno, flowDrBilbao, flowDrAlamada, flowDrGarcia
    ])

// CLINICA MEDICA

const flowDrLopez = addKeyword(['2','lopez'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Lopez'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Clinica'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrRegina = addKeyword(['1','regina'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. La Regina'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Clinica'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowClinicaMed = addKeyword(['2', 'clinica']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dr. La Regina',
        '*2*.- Dra. Lopez',
    ],
    null,
    null,
    [flowRetorno, flowDrRegina, flowDrLopez]
    )

// CIRUGIA

const flowDrNegro = addKeyword(['1','negro'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Negro'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Cirugia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrWallace = addKeyword(['2','wallace'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Wallace'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Cirugia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrLopezC = addKeyword(['3','lopez'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Wallace'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Cirugia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrArmendariz = addKeyword(['4','armendariz'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Armendariz'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Cirugia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
    return gotoFlow(flowDatosObra);
    })

const flowDrBubilllo = addKeyword(['bubillo','5'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Bubillo'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Cirugia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrMichelis = addKeyword(['michelis','6'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. De Michelis'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Cirugia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrMiranda = addKeyword(['miranda','7'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr Miranda'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Cirugia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowCirugiaIntervencion = addKeyword(['2', 'no']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
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
    [flowRetorno, flowDrNegro, flowDrWallace, flowDrLopezC, flowDrArmendariz, flowDrBubilllo, flowDrMichelis, flowDrMiranda])

const flowCirugiaCuracion = addKeyword(['1','si','curacion'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'No asignado'; // Medico selecionado
        await state.update({ medico: medico })
    const especialidad = 'Curaciones de cirugia'; // Especialidad elejida
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Mensaje
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })


    
const flowCirugia = addKeyword(['3', 'cirugia']).addAnswer(['¿Desea turno para curaciones o retirar puntos?'])
    .addAnswer([
    ' ',
    '*0*.- Retornar al menu inicial',
    '*1*.- SI',
    '*2*.- NO'],
    null,
    null,
    [flowRetorno, flowCirugiaCuracion, flowCirugiaIntervencion])
    

// DERMATOLOGIA

const flowDrPierini = addKeyword(['pierini','1'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Pierini'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Dermatologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDermatologia = addKeyword(['4', 'dermatologia']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dra. Pierini'],
        null,
        null,
    [flowRetorno, flowDrPierini])

// ENDOCRINOLOGIA

const flowDrFeretta = addKeyword(['feretta','1'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Feretta'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Endocrinologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowEndocrinologia = addKeyword(['5', 'endocrinologia']).addAnswer(['Por favor selecione el medico'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dra. Feretta',

    ],
    null,
    null,
    [flowRetorno, flowDrFeretta])

// FONOUDIOLOGIA

const flowTratamientoL = addKeyword(['tratamiento','1'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Feretta'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Endocrinologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage4(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosFoto);
    })

const flowOEA = addKeyword(['oea','2']).addAnswer([
    'Por favor, ingrese los siguientes datos del paciente y del familiar a cargo:',
    '',
    'Apellido y nombre:',
    '',
    'DNI:',
    '',
    'Fecha de nacimiento:',
    '',
    'Localidad:',
    '',
    'Obra social:',
    '',
    '*(recuerde que el día de la atención, deberá concurrir con la libreta sanitaria)*'
])

const flowEstudiosA = addKeyword(['estudios','3'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'No asignado'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Fonoaudiologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage4(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosFoto);
    })


const flowFonoaudiologia = addKeyword(['6', 'fonoaudiologia']).addAnswer(['Por favor selecione el estudio.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Tratamiento del Lenguaje',
        '*2*.- OEA',
        '*3*.- Estudios Audiologicos'],
        null,
        null,
    [flowRetorno, flowTratamientoL, flowOEA, flowEstudiosA])

// GASTROENTEROLOGIA

const flowDrDelNegro = addKeyword(['1','negro'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Del Negro'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Gastroenterologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrWallaceG = addKeyword(['2','wallace'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Wallace'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Gastroenterologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosFoto);
    })

const flowDrLucia = addKeyword(['3','lucia'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. De Lucia'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Gastroenterologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosFoto);
    })

const flowDrFacciutto = addKeyword(['4','facciutto'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Facciutto'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Gastroenterologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosFoto);
    })
const flowGastroenterologia = addKeyword(['7', 'gastro']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dr. Del Negro',
        '*2*.- Dr. Wallace',
        '*3*.- Dr. De Lucia',
        '*4*.- Dr. Facciutto'],
        null,
        null,
        [flowRetorno, flowDrDelNegro, flowDrWallaceG, flowDrLucia, flowDrFacciutto])

// GINECOLOGIA

const flowDrGrimoldi = addKeyword(['1','grimoldi'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Grimoldi'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Ginecologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrEstevez = addKeyword(['2','estevez']).addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Estevez'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Ginecologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrLevitan = addKeyword(['3','levitan']).addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Levitan'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Ginecologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrMartinez = addKeyword(['4','martinez'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Martinez'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Ginecologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrPiyero = addKeyword(['5','piyero'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Piyero'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Ginecologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrArciprete = addKeyword(['6','arciprete'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Arciprete'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Ginecologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowGinecologia = addKeyword(['8','ginecologia']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dra. Grimoldi',
        '*2*.- Dr. Estevez',
        '*3*.- Dra. Levitan',
        '*4*.- Dr. Martinez',
        '*5*.- Dr. Piyero',
        '*6*.- Dr. Arciprete'],
        null,
        null,
        [flowRetorno, flowDrGrimoldi, flowDrEstevez, flowDrLevitan, flowDrMartinez, flowDrPiyero, flowDrArciprete

])

// HEMATOLOGIA

const flowDrBarbieris = addKeyword(['1','barbieris'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Barbieris'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Hematologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowHematologia = addKeyword(['9', 'hematologia']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dra. Barbieris',
        //'Medico 2',
        //'Medico 3'
    ],
    null,
    null,
    [flowRetorno, flowDrBarbieris
])


// NEUROCIRUGIA

const flowDrGomez = addKeyword(['1','gomez'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Gomez'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Neurocirugia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrGuerra = addKeyword(['2','gurra'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Guerra'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Neurocirugia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })
const flowDrCondori = addKeyword(['3','condori'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Condori'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Neurocirugia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowNeurocirugia = addKeyword(['10','neurocirugia']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dr. Gomez',
        '*2*.- Dra. Guerra',
        '*3*.- Dr. Condori'],
        null,
        null,
        [flowRetorno, flowDrGomez, flowDrGuerra, flowDrCondori])


// OFTALMOLOGIA

const flowDrGiustozzi = addKeyword(['1','giustozzi'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Giustozzi'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Oftalmologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrZanovello = addKeyword(['2','zanoveloo'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr Zanovello'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Oftalmologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowOftalmologia = addKeyword(['11','oftalmologia'], {sensitive:true}).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dra. Giustozzi',
        '*2*.- Dr Zanovello'],        
        null,
        null,
        [flowRetorno, flowDrGiustozzi, flowDrZanovello])


// ONCOLOGIA

const flowDrBozzano = addKeyword(['1','bozano'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Bozzano'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Oncologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowOncologia = addKeyword(['12', 'oncologia']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dr. Bozzano'],
       //'Medico 2',
        //'Medico 3'
        null,
        null,
        [flowRetorno, flowDrBozzano])

// PSIQUIATRIA

const flowDrEcheverria = addKeyword(['1','echeverria'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Echeverria'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Psiquiatria'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrGiuli = addKeyword(['2','giuli'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Di Giuli'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Psiquiatria'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowPsiquiatria = addKeyword(['13', 'psiquiatria']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dra. Echeverria',
        '*2*.- Dra. Di Giuli'],
        //'Medico 3'
        null,
        null,
        [flowRetorno, flowDrGiuli, flowDrEcheverria])

// TRAUMATOLOGIA

const flowDrAcuña = addKeyword(['1','acuña'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Acuña'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Traumatologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrCastellani = addKeyword(['2','castellani'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Castellani'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Traumatologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrRimmaudo = addKeyword(['3','rimmaudo'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Rimmaudo'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Traumatologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrGallego = addKeyword(['4','gallego'])
.addAction(
    async (ctx, { state }) => {
    const medico = ' Dra. Gallego'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Traumatologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowTraumatologia = addKeyword(['14', 'traumatologia']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dr. Acuña',
        '*2*.- Dr. Castellani',
        '*3*.- Dr. Rimmaudo',
        '*4*.- Dra. Gallego'],
        null,
        null,
        [flowRetorno, flowDrAcuña, flowDrCastellani, flowDrRimmaudo, flowDrGallego])


// PEDIATRIA


const flowPediatriaSano = addKeyword(['1', 'si'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Pediatria'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowPediatriaNoSano = addKeyword(['2', 'no']).addAnswer(['*Turno de manera presencial de 8:30 hs a 11:30 hs.'])


const flowPediatria = addKeyword(['15', 'pediatria']).addAnswer(['Por favor selecione si es para un niño/a completamente sano.'])
  .addAnswer([
     ' ',
     '*0*.- Retornar al menu inicial',
      '*1*.- SI',
      '*2*.- NO'],
    null,
    null,
    [flowRetorno, flowPediatriaSano, flowPediatriaNoSano])


// UROLOGIA

const flowDrGuaragnini = addKeyword(['1','guaragnini'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Guaragnini'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Urologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrMassaccesi = addKeyword(['2','massaccesi'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Massaccesi'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Urologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowUrologia = addKeyword(['16', 'urologia']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dr. Guaragnini',
        '*2*.- Dr. Massaccesi'],
        //'Medico 3'
        null,
        null,
        [flowRetorno, flowDrGuaragnini, flowDrMassaccesi])

// NUTRICION

const flowLicPompozzi = addKeyword(['1','pompozzi']).addAction(
    async (ctx, { state }) => {
    const medico = 'Lic. Pompozzi'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Nutricion'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowLicDalto = addKeyword(['2','dalto']).addAction(
    async (ctx, { state }) => {
    const medico = 'Lic. Dalto'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Nutricion'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowLicEstevez = addKeyword(['3','estevez']).addAction(
    async (ctx, { state }) => {
    const medico = 'Lic. Estevez'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Nutricion'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowNutricion = addKeyword(['17', 'nutricion']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Lic. Pompozzi',
        '*2*.- Lic. Dalto',
        '*3*.- Lic. Estevez'],
        null,
        null,
        [flowRetorno, flowLicPompozzi, flowLicDalto, flowLicEstevez])

// ODONTOLOGIA

const flowOdonNiños = addKeyword(['2', 'niños']).addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Pediatria'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowOdonAdulosMañana = addKeyword(['1', 'mañana']).addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Pediatria'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowOdonAdultosTarde = addKeyword(['2', 'tarde']).addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Pediatria'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowOdonAdultos = addKeyword(['1', 'adultos']).addAnswer(['Porfavaor selecione el turno:',
    '',
    '*0*.- Retornar al menu inicial',
    '*1*.- Turno Mañana',
    '*2*.- Turno Tarde'],
    null,
    null,
    [flowRetorno, flowOdonAdulosMañana, flowOdonAdultosTarde])


const flowOdontologia = addKeyword(['18','odontologia'], {sensitive:true}).addAnswer(['Por favor selecione una opcion:'])
.addAnswer([
    '*0*.- Retornar al menu inicial',
    '*1*.- Adultos',
    '*2*.- Niños'],
        // 'Medico 3'        
    null,
    null,
    [flowRetorno, flowOdonAdultos, flowOdonNiños])


// FISIATRIA

const flowDrArocena = addKeyword(['1','arocena']).addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Arocena'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Fisiatria'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowFisiatria = addKeyword(['19','fisiatria']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dra. Arocena'],
        //'Medico 2',
        //'Medico 3'
        null,
        null,
        [flowRetorno, flowDrArocena])


// NEUMOLOGIA

const flowDrSpinelli = addKeyword(['1','Spinelli']).addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Spinelli'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Neumologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowNeumologia = addKeyword(['20', 'neumologia']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dra. Spinelli'],
        //'Medico 2'
        null,
        null,
        [flowRetorno, flowDrSpinelli])


// OBSTRETICIA

const flowDrArias = addKeyword(['1','arias']).addAction(
    async (ctx, { state }) => {
    const medico = 'Arias'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Obstreticia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrLemme = addKeyword(['2','lemme']).addAction(
    async (ctx, { state }) => {
    const medico = 'Lemme'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Obstreticia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrTenaglia = addKeyword(['3','tenaglia']).addAction(
    async (ctx, { state }) => {
    const medico = 'Tenaglia'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Obstreticia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrOrtiz = addKeyword(['4','ortiz']).addAction(
    async (ctx, { state }) => {
    const medico = 'Gil Ortiz'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Obstreticia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowDrSerrani = addKeyword(['5','serrani']).addAction(
    async (ctx, { state }) => {
    const medico = 'Serrani'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Obstreticia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowObstreticia = addKeyword(['21', 'obstreticia']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Arias',
        '*2*.- Lemme',
        '*3*.- Tenaglia',
        '*4*.- Gil Ortiz',
        '*5*.- Serrani'],
        null,
        null,
        [flowRetorno, flowDrArias, flowDrLemme, flowDrOrtiz, flowDrSerrani, flowDrTenaglia])


// OTORRINONARINGOLOGIA

const flowDrMazzei = addKeyword(['1','mazzei']).addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Mazzei'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Otorrinonaringologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowOtorrino = addKeyword(['22', 'otorrino']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dr. Mazzei'],
        //'Medico 2',
        //'Medico 3'
        null,
        null,
        [flowRetorno, flowDrMazzei])


// NEFROLOGIA

const flowDrCarriquiri = addKeyword(['1','carriquiri']).addAction(
    async (ctx, { state }) => {
    const medico = 'Dr. Carriquiri'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Nefrologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })

const flowNefrologia = addKeyword(['23', 'nefrologia']).addAnswer(['Por favor selecione el medico.'])
    .addAnswer([
        '*0*.- Retornar al menu inicial',
        '*1*.- Dr. Carriquiri'],
        //'Medico 2',
        //'Medico 3'
        null,
        null,
        [flowRetorno, flowDrCarriquiri])


// KINESIOLOGIA

const flowKinesiologia = addKeyword(['25', 'kinesiologia']).addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Kinesiologia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage4(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosFoto);
    })


// TERAPIA OCUPACIONAL

const flowTerapiaOcu = addKeyword(['26', 'terapia']).addAction(
        async (ctx, { state }) => {
        const medico = 'Sin asignar'; // Tu dato
            await state.update({ medico: medico })
        const especialidad = 'Terapia Ocupacional'; // Tu dato
            await state.update({ especialidad: especialidad })
        const msj = mensage5(); // Tu dato
            await state.update({ msj: msj })})
        .addAction(
        async (ctx, { gotoFlow }) => {
            return gotoFlow(flowDatosFoto);
        })



// VACUNACION

const flowVacunacion = addKeyword(['24', 'vacunacion']).addAnswer(['Horario de atencion de 7:00 hs a 18:00 hs',
    'Los turnos son a demanda, previamente pasando por ventanilla de *Sala de Gestión del Usuario*.',
    '',
    '*Todos los dias se dan todas las vacunas, para FIEBRE AMARILLA debe solicitar turno previo llamando a las lineas fijas intero: 110*'
    //'Medico 2',
    //'Medico 3'
])


// PSICOLOGIA

const flowPsicologia = addKeyword(['27', 'psicologia']).addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
    await state.update({ medico: medico })
    const especialidad = 'Psicologia'; // Tu dato
    await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
    await state.update({ msj: msj })})
.addAction(
    async (ctx, { gotoFlow }) => {
    return gotoFlow(flowDatosObra);
    })


// NEUROLOGIA

const flowDraAyarza = addKeyword(['1','ayarza']).addAction(
    async (ctx, { state }) => {
    const medico = 'Dra. Ayarza Ana'; // Tu dato
    await state.update({ medico: medico })
    const especialidad = 'Neurologia'; // Tu dato
    await state.update({ especialidad: especialidad })
    const msj = mensage3(); // Tu dato
    await state.update({ msj: msj })})
.addAction(
    async (ctx, { gotoFlow }) => {
    return gotoFlow(flowDatosObra);
    })

const flowNeurologia = addKeyword(['28', 'neurologia']).addAnswer(['Por favor selecione el medico.'])
.addAnswer([
    '*0*.- Retornar al menu inicial',
    '*1*.- Dra. Ayarza Ana'],
    null,
    null,
    [flowRetorno, flowDraAyarza])


// PUERICULTORA

const flowPuericultora = addKeyword(['29','puericultora']).addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Puericultora'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosObra);
    })



// #######

// ESPECIALIDADES

// #######


const flowConsultorio = addKeyword(['1','consultorio','medico','0'])
    .addAnswer(['*Indicar especialidad requerida:*',
        ' ',
        '*0*.- Retornar al menu inicial',
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
        '*28.-* Neurologia',
        '*29.-* Puericultora'
    ],
    null,
    null,
    [flowRetorno, flowPuericultora, flowNeurologia, flowPsicologia, flowTerapiaOcu, flowKinesiologia, flowVacunacion, flowNeumologia, flowObstreticia, flowOtorrino, flowNefrologia, flowNutricion, flowOdontologia, flowFisiatria, flowOftalmologia, flowOncologia, flowPsiquiatria, flowTraumatologia, flowPediatria, flowUrologia, flowFonoaudiologia, flowGastroenterologia, flowGinecologia, flowHematologia, flowNeurocirugia, flowCardiologia, flowClinicaMed, flowCirugia, flowDermatologia, flowEndocrinologia]
    )
    

// ######

// ESTUDIOS DE DIAGNÓSTICO 

// ######


// ESTUDIO GASTROENTEROLOGICO

const flowEstGastroenterologicos = addKeyword(['10','Gastroenterologicos'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Estudio Gastroenterologo'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage4(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosFoto);
    })

    
// RAYOS

const flowRayos = addKeyword(['rayos','1'])
    /*.addAnswer(['Enviar foto de la orden de indicación',
        '',
        'Apellido y nombre:',
        '',
        'DNI:',
        '',
        'Fecha de nacimiento:',
        '',
        'Localidad:',
        '',
        '*Obra social (recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada)*',
        '',
        '*Presentar radiografia previa de columna, el dia de atención*',
        '',
        'Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo',
        '',
        '_Recuerde que para radiografía de columna lumbar, lumbosacra o espinograma, debe realizar una dieta liviana 48 hrs antes, evitando consumir lacteos o productos gasificados_'
        ])*/
    .addAnswer(['Para solicitar turno de *rayos*, debe concurrir de manera presencial a la ventanilla de Sala de Gestión del Usuario de lunes a viernes (días hábiles) de 12 a 18 hs con la orden física.',
'Muchas gracias.'])

// ESPINOGRAFIA

const flowEspinografia = addKeyword(['2','Espinografia'])
    /*.addAnswer(['Enviar foto de la orden de indicación',
        '',
        'Apellido y nombre:',
        '',
        'DNI:',
        '',
        'Fecha de nacimiento:',
        '',
        'Localidad:',
        '',
        '*Obra social (recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada)*',
        '',
        '*Presentar radiografia previa de columna, el dia de atención*',
        '',
        'Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo',
        '',
        '_Recuerde que para radiografía de columna lumbar, lumbosacra o espinograma, debe realizar una dieta liviana 48 hrs antes, evitando consumir lacteos o productos gasificados_'
       ])*/
        .addAnswer(['Para solicitar turno de *espinografia*, debe concurrir de manera presencial a la ventanilla de Sala de Gestión del Usuario de lunes a viernes (días hábiles) de 12 a 18 hs con la orden física.',
            'Muchas gracias'])
// TOMOGRAFIA

const flowTomografia = addKeyword(['3','Tomografia'])
    .addAnswer(['Para solicitar turno de *tomografía*, debe concurrir de manera presencial a la ventanilla de *Sala de Gestión del Usuario* de lunes a viernes (días hábiles) de 12 a 18 hs con la orden física.',
        'Muchas gracias'])

// MAMOGRAFIA

const flowMamografia = addKeyword(['4','Mamografía'])
    .addAnswer(['Para solicitar turno de *mamografía*, debe concurrir de manera presencial a la ventanilla de *Sala de Gestión del Usuario* de lunes a viernes (días hábiles) de 12 a 18 hs con la orden física.',
        'Muchas gracias'])

// MAGNIFICACIONES

const flowMagnificaciones = addKeyword(['5','Magnificaciones'])
    /*.addAnswer(['Enviar foto de la orden de indicación',
        '',
        'Apellido y nombre:',
        '',
        'DNI.', 
        '',
        'Fecha de nacimiento:',
        '',
        'Localidad:',
        '',
        '*Obra social (recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada)*',
        '',
        'Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo'
         ])*/
        .addAnswer(['Para solicitar turno de *magnificaciones*, debe concurrir de manera presencial a la ventanilla de Sala de Gestión del Usuario de lunes a viernes (días hábiles) de 12 a 18 hs con la orden física.',
            'Muchas gracias'])

// ECOCARDIOGRAMA

const flowEcocardiograma = addKeyword(['6','Ecocardiograma'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Estudio Gastroenterologo'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage4(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosFoto);
    })

// ELECTROENFACELOGRAMA

const flowElectroenfacelograma = addKeyword(['7','Electroencefalograma'])
    //'Enviar foto de la orden de indicación',
        .addAction(
            async (ctx, { state }) => {
            const medico = 'Sin asignar'; // Tu dato
                await state.update({ medico: medico })
            const especialidad = 'Electroenfacelograma'; // Tu dato
                await state.update({ especialidad: especialidad })
            const msj = '*Recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada*\
            \
        Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo' // Tu dato
                await state.update({ msj: msj })})
            .addAction(
            async (ctx, { gotoFlow }) => {
                return gotoFlow(flowFoto);
            })

// DOPPLER

const flowDoppler = addKeyword(['8','Doppler'])
    //.addAnswer(['Enviar foto de la orden de indicación',
    .addAction(
        async (ctx, { state }) => {
        const medico = 'Sin asignar'; // Tu dato
            await state.update({ medico: medico })
        const especialidad = 'Electroenfacelograma'; // Tu dato
            await state.update({ especialidad: especialidad })
        const msj = '*Recuerde que los pacientes de PAMI deben dirigirse a la agencia de PAMI para consultar convenio o puede también hacerlo telefónicamente a nuestras líneas fijas)*\
        \
        *Recuerde que solo se realizan Doppler de vasos de cuello, cardíaco, obstétrico, venoso de MMII y arterial de MMII*\
        \
    Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo' // Tu dato
            await state.update({ msj: msj })})
        .addAction(
        async (ctx, { gotoFlow }) => {
            return gotoFlow(flowFoto);
        })
        

// ESTUDIO AUDIOLOGICO

const flowEstAudiologicos = addKeyword(['9','Estudios audiologicos'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Estudios Audiologicos'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage4(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosFoto);
    })



// LABORATORIO

const flowLaboratorio = addKeyword(['11','laboratorio'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Estudio Gastroenterologo'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = mensage4(); // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowDatosFoto);
    })

// ESPIROMETRIA

const flowEspirometria = addKeyword(['12','espirometria'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Electroenfacelograma'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = '*Recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada*\
    \
Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo' // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowFoto);
    })
    //.addAnswer(['Enviar foto de la orden de indicación',
    

// ECOGRAFIA

const flowEcografia = addKeyword(['13','ecografia'])
    .addAnswer(['Para solicitar turno de *ecografía*, debe concurrir de manera presencial a la ventanilla de *Sala de Gestión del Usuario* de lunes a viernes (días hábiles) de 12 a 18 hs con la orden física.',
        'Muchas gracias'])

        
// ELECTROCARDIOGRAMA

const flowElectrocardiograma = addKeyword(['14', 'electrocardiograma'])
.addAction(
    async (ctx, { state }) => {
    const medico = 'Sin asignar'; // Tu dato
        await state.update({ medico: medico })
    const especialidad = 'Ecografia'; // Tu dato
        await state.update({ especialidad: especialidad })
    const msj = '*Recuerde que los pacientes de PAMI deberán presentar la Orden medica digital y la credencial actualizada*\
    \
Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo' // Tu dato
        await state.update({ msj: msj })})
    .addAction(
    async (ctx, { gotoFlow }) => {
        return gotoFlow(flowFoto);
    })
         

// ESTUDIO DE DIAGNOSTICO

 const flowEstudioDiag = addKeyword(['2','diagnostico','estudio'])
        .addAnswer(['*Idicar el estudios requerido:*',
            '',
            '*0*.- Retornar al menu inicial',
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
            '*12.-* Espirometria',
            '*13.-* Ecografia',
            '*14.-* Electrocardiograma'
        ],
        null,
        null,
        [
            flowRetorno, flowElectrocardiograma, flowEcografia, flowLaboratorio, flowEstGastroenterologicos, flowEspirometria, flowRayos, flowEspinografia, flowTomografia, flowMamografia, 
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
        '*0*.- Retornar al menu inicial',
        '*1.-* Consultorios Medicos',
        '*2.-* Estudios de Diagnostico'],
    null,
    null,
    [flowRetorno, flowConsultorio, flowEstudioDiag]
)   

// ######

// MODIFICACION CANCELACION DE TURNOS

// ######

const flowModificarT = addKeyword(['1','modificar']).addAnswer([
        'Indique los siguientes datos para poder *MODIFICAR* su turno',
        '',
        'Apellido y nombre:',
        '',
        'DNI:',
        '',
        'Fecha de nacimiento:',
        '',
        'Localidad:',
        '',
        'Obra social:',
        '',
        'Turno que tenía otorgado (Médico/Especialidad, día que tiene el turno asignado)'])

 const flowCancelarT = addKeyword(['2','cancelar']).addAnswer([
        'Indique los siguientes datos para poder *CANCELAR* su turno',
        '',
        'Apellido y nombre:',
        '',
        'DNI:',
        '',
        'Fecha de nacimiento:',
        '',
        'Localidad:',
        '',
        'Obra social:',
        '',
        'Turno que tenía otorgado (Médico/Especialidad, día que tiene el turno asignado)'])

const flowModificarCancelarT = addKeyword(['2','modificacion'])
    .addAnswer([
        '*Indique si quiere Cancelar o modificar su turno*',
        '',
        '*0*.- Retornar al menu inicial',
        '*1*.- Modificar',
        '*2*.- Cancelar'],
        null,
        null,
        [flowRetorno, flowModificarT, flowCancelarT])

// #####
// CONFIRMACION DE TURNOS
// #####

const flowConfirmacion = addKeyword(['3','confirmacion'])
    .addAnswer([
    'Indique los siguientes datos para poder *CONFIRMAR* su turno',
    '',
        'Apellido y nombre:',
        '',
        'DNI:',
        '',
        'Fecha de nacimiento:',
        '',
        'Localidad:',
        '',
        'Obra social:',
        '',
        'Turno que tenía otorgado (Médico/Especialidad, día que tiene el turno asignado)'])
  



// #####
// CONSULTAS
// #####

const flowConsultas = addKeyword(['4','consultas'])
    .addAnswer(['Por consultas debe comunicarse a nuestras líneas fijas:',
        ' ',
        '2344-454112',
        '2344-454114',
        '2344-454113',
        'De lunes a viernes (días hábiles) en horario de 7:00 a 12:00 hs'])


// DONAR SANGRE  

// MENSAJE DE DONANTE VOLUNTARIO

const flowDonacionVoluntaria = addKeyword(['1','voluntario']).addAnswer([
    mensage2()])

// MENSAJE DE DONANTE POR INTERVENCION

const flowDonacionIntervencion = addKeyword(['2','intervencion']).addAnswer([
    'Por favor, ingrese los siguientes datos:',
    '',
    'Apellido y nombre',
    '',
    'DNI',
    '',
    'Fecha de nacimiento',
    '',
    'Localidad',
    '',
    'Para quien donaras:',
    '',
    'Y luego aguarde mientras gestionamos su turno, recibirá un mensaje con la confirmación del mismo'
    ])   

const flowDonacionSangre = addKeyword(['5','donar'])
    .addAnswer(['¿Para que voy a donar?:',
        ' ',
        '*0*.- Retornar al menu inicial',
        '*1.-* Donante voluntario.',
        '*2.-* Donación por cirugía o intervención.'],
    null,
    null,
    [flowRetorno, flowDonacionIntervencion, flowDonacionVoluntaria])



// MENU INICIAL 


const flowHorarioAtencion = addKeyword(['Hola','HOLA','hola','qwer'], { sensitive: true })

    .addAnswer(
        [
        '¡Hola!',
        '  ',
        '🤖 Soy el Asistente Virtual del *Hospital Dr Posadas de Saladillo*',
        'Por favor escriba el número de la opción correspondiente',
        '  ',
        '*1.-*  Reservar turnos',
        '*2.-*  Modificación o cancelación de turnos reservados',
        '*3.-*  Confirmación de asistencia',
        '*4.-*  Consultas',
        '*5.-*  Quiero donar sangre 🩸'
        ],
        null,
        null,
        [flowDonacionSangre, flowConsultas, flowConfirmacion, flowModificarCancelarT, flowResTurno])


const flowFueraDeHorario = addKeyword(['fuera de horario']).addAnswer([
    '¡Hola! Actualmente estamos *FUERA DEL HORARIO DE ATENCIÓN*. 🕔',
    '*Horarios de atención*',
    'Lunes a viernes (días hábiles) de 7:00 a 10:00 Hs.',
    'Los *mensajes no quedan guardados*',
    'Por favor, vuelva a comunicarse.',
    'Muchas gracias'
])

const flowMenu = addKeyword(['menu']).addAnswer([
    'Para iniciar el menú, escriba la palabra *Hola*'],
    null,
    null,
    [flowHorarioAtencion])

 const flowPrincipal = addKeyword(['turno','hola','buen','dia'])
    .addAction(async (_, {flowDynamic, gotoFlow}) => {
        // Verifica si está en horario de atención o no
    if (horarioActual()) {
            // Si está en horario de atención, redirige a `flowHorarioAtencion`
        //await flowDynamic('¡Hola!')
        return gotoFlow(flowMenu)
             // Cambiado para redirigir correctamente
    } else {
         // Si está fuera de horario, redirige a `flowFueraDeHorario`
        // await flowDynamic('¡Hola! Actualmente estamos *FUERA DEL HORARIO DE ATENCIÓN*. 🕔')
         return gotoFlow(flowFueraDeHorario) // Cambiado para redirigir correctamente
        }
    })


const main = async () => {
    const adapterFlow = createFlow([flowPrincipal, flowDatos, flowHorarioAtencion, flowDatosFoto, flowFoto])
                
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()
            
    const { handleCtx, httpServer } = await createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        })
            
            adapterProvider.server.post(
            '/v1/messages',
            handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
            })
            )
            
        adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
        const { number, name } = req.body
        await bot.dispatch('REGISTER_FLOW', { from: number, name })
        return res.end('trigger')
        })
        )
            
        adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
        const { number, name } = req.body
        await bot.dispatch('SAMPLES', { from: number, name })
        return res.end('trigger')
        })
        )
            
        adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
        const { number, intent } = req.body
        if (intent === 'remove') bot.blacklist.remove(number)
        if (intent === 'add') bot.blacklist.add(number)
            
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
        )
            
        httpServer(+PORT)
        }
            
main()