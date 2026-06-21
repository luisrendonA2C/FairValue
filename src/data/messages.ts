import type { Message } from '@/types';

export const messages: Message[] = [
  // ─── Thread 1: buyer-007 ↔ dealer-003 (post-lead unlock) ─────────
  {
    id: 'msg-001',
    threadId: 'thread-001',
    senderId: 'dealer-user-003',
    senderName: 'Ricardo Montero (Elite Autos CR)',
    text: 'Hola Roberto, gracias por tu interés en el Honda Civic Type R. ¿Te gustaría agendar una visita para verlo en persona?',
    timestamp: '2024-11-10T09:00:00Z',
  },
  {
    id: 'msg-002',
    threadId: 'thread-001',
    senderId: 'buyer-007',
    senderName: 'Roberto Hernández',
    text: '¡Hola! Sí, me interesa mucho. ¿Tienen disponibilidad esta semana? Prefiero en la tarde después de las 4pm.',
    timestamp: '2024-11-10T10:30:00Z',
  },
  {
    id: 'msg-003',
    threadId: 'thread-001',
    senderId: 'dealer-user-003',
    senderName: 'Ricardo Montero (Elite Autos CR)',
    text: 'Perfecto, podemos el jueves a las 4:30pm. Estamos en San Rafael de Alajuela. ¿Le parece bien?',
    timestamp: '2024-11-10T11:15:00Z',
  },
  {
    id: 'msg-004',
    threadId: 'thread-001',
    senderId: 'buyer-007',
    senderName: 'Roberto Hernández',
    text: 'Excelente, ahí estaré. ¿Me pueden enviar la ubicación exacta por favor?',
    timestamp: '2024-11-10T12:00:00Z',
  },
  {
    id: 'msg-005',
    threadId: 'thread-001',
    senderId: 'dealer-user-003',
    senderName: 'Ricardo Montero (Elite Autos CR)',
    text: 'Claro, estamos 200m norte del Mall Oxígeno en Alajuela. Le envío el pin por Waze. ¡Lo esperamos!',
    timestamp: '2024-11-10T12:45:00Z',
  },

  // ─── Thread 2: buyer-004 ↔ dealer-003 (post-lead unlock) ─────────
  {
    id: 'msg-006',
    threadId: 'thread-002',
    senderId: 'dealer-user-003',
    senderName: 'Ricardo Montero (Elite Autos CR)',
    text: 'Hola Sofía, gracias por participar en el evento. Tu oferta por el Civic Type R fue muy competitiva. ¿Seguís interesada?',
    timestamp: '2024-11-11T08:00:00Z',
  },
  {
    id: 'msg-007',
    threadId: 'thread-002',
    senderId: 'buyer-004',
    senderName: 'Sofía Villalobos',
    text: 'Hola Ricardo. Sí, sigo interesada aunque vi que no fui la oferta más alta. ¿Hay posibilidad de negociar?',
    timestamp: '2024-11-11T09:20:00Z',
  },
  {
    id: 'msg-008',
    threadId: 'thread-002',
    senderId: 'dealer-user-003',
    senderName: 'Ricardo Montero (Elite Autos CR)',
    text: 'Claro, siempre hay espacio para conversar. ¿Le gustaría venir a verlo y platicamos las opciones de financiamiento también?',
    timestamp: '2024-11-11T10:00:00Z',
  },

  // ─── Thread buyer-dealer-001: buyer-001 ↔ dealer-user-001 (post-lead unlock) ──
  {
    id: 'msg-bd-001',
    threadId: 'thread-buyer-dealer-001',
    senderId: 'dealer-user-001',
    senderName: 'José Luis Quesada (Auto Premium CR)',
    text: 'Hola Carlos, gracias por tu oferta en el Toyota RAV4 2023. Fue seleccionado como lead prioritario. ¿Te gustaría coordinar una visita?',
    timestamp: '2024-12-05T09:00:00Z',
  },
  {
    id: 'msg-bd-002',
    threadId: 'thread-buyer-dealer-001',
    senderId: 'buyer-001',
    senderName: 'Carlos Méndez Solano',
    text: '¡Excelente noticia! Sí, me encantaría verlo en persona. ¿Cuándo tienen disponibilidad?',
    timestamp: '2024-12-05T09:45:00Z',
  },
  {
    id: 'msg-bd-003',
    threadId: 'thread-buyer-dealer-001',
    senderId: 'dealer-user-001',
    senderName: 'José Luis Quesada (Auto Premium CR)',
    text: 'Podemos recibirlo el viernes a las 3pm en nuestro showroom en Escazú. ¿Le parece bien?',
    timestamp: '2024-12-05T10:30:00Z',
  },

  // ─── Thread 3: admin ↔ dealer-004 (approval process) ─────────────
  {
    id: 'msg-009',
    threadId: 'thread-003',
    senderId: 'admin-001',
    senderName: 'Administrador Fair Value',
    text: 'Hola Laura, hemos recibido su solicitud de registro para Patio del Valle Heredia. Necesitamos que complete la documentación: cédula jurídica, patente comercial y certificación de la SUGEF.',
    timestamp: '2024-09-21T08:00:00Z',
  },
  {
    id: 'msg-010',
    threadId: 'thread-003',
    senderId: 'dealer-user-004',
    senderName: 'Laura Esquivel (Patio del Valle)',
    text: 'Buenos días. Ya subí la cédula jurídica y la patente. La certificación SUGEF la tengo en trámite, ¿cuánto tiempo tengo para enviarla?',
    timestamp: '2024-09-22T10:30:00Z',
  },
  {
    id: 'msg-011',
    threadId: 'thread-003',
    senderId: 'admin-001',
    senderName: 'Administrador Fair Value',
    text: 'Tiene 15 días hábiles para completar la documentación. Una vez recibida, el proceso de aprobación toma de 3 a 5 días hábiles.',
    timestamp: '2024-09-22T11:00:00Z',
  },
];
