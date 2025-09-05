// nombre: servicios.js

// ============================================
// CONFIGURACIÓN DE SERVICIOS
// En este archivo se centraliza toda la información de los productos.
// ============================================

// PERFILES (1 dispositivo, perfil individual)
const perfiles = [
    { 
        name: "NETFLIX PERFIL", 
        price: "500,00 Bs", 
        numericPrice: 500.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/netflix.png",
        type: "perfil",
        available: true,
        popular: true, // Insignia "Más Vendido"
        details: [
            "✅ Acceso completo a todo el catálogo de Netflix",
            "🎬 Películas y series en HD y 4K",
            "📱 Compatible con todos los dispositivos",
            "🔄 No renovable 🕐1 mes ",
            "👤 Perfil personalizado exclusivo"
        ]
    },
    { 
        name: "MAX PERFIL", 
        price: "464,00 Bs", 
        numericPrice: 464.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/max.png",
        type: "perfil",
        available: true,
        popular: true, // Insignia "Más Vendido"
        details: [
             "🎬 Contenido HBO Max premium",
            "⚡ Estrenos simultáneos con cines",
            "🎭 Series originales de HBO",
            "🎨 Documentales y especiales",
            "👨‍👩‍👧‍👦 Contenido Warner Bros"
        ]   
   },
    { 
        name: "NETFLIX PERFIL 15 DÍAS", 
        price: "350,00 Bs", 
        numericPrice: 350.00,
        duration: "15 DÍAS", 
        devices: "1 DISPOSITIVO",
        image: "img/netflix.png",
        type: "perfil",
        available: true,
        details: [
            "✅ Acceso completo por 15 días",
            "🎬 Películas y series en HD",
            "📱 Compatible con móviles y tablets",
            "⚡ Activación inmediata",
            "💰 Opción económica para prueba"
        ]
     
    
   },
    { 
        name: "Universal + 1 perfil", 
        price: "437,00 Bs", 
        numericPrice: 437.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO",
        image: "img/universalper.png",
        type: "perfil",
        available: true,
        details: [
            "✅ ofrece una amplia variedad de contenido de televisión y cine, incluyendo series de estreno, películas de Hollywood, comedia, crímenes reales y reality shows.",
            "🎬 Películas y series en HD",
            "📱 Compatible con móviles y tablets",
            "⚡ Activación inmediata",
            "💰 Opción económica para prueba"
        ]

     },
    { 
        name: "Jellyfin perfil",
        price: "437,00 Bs", 
        numericPrice: 437.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO",
        image: "img/jellyfin.png",
        type: "perfil",
        available: false,
        details: [
            "🎥 Amplio catálogo de películas y series",
            "🌟 Contenido actualizado constantemente",
            "📺 Calidad HD y 4K disponible",
            "🔒 Servidor privado y seguro",
            "⚡ Sin publicidad ni interrupciones"
        ]   

   },
    { 
        name: "DISNEY ESTÁNDAR",
        price: "437,00 Bs", 
        numericPrice: 437.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO",
        image: "img/disney.png",
        type: "perfil",
        available: true,
        details: [
            "🏰 Todo el contenido de Disney+",
            "⭐ Marvel, Star Wars y Pixar",
            "👨‍👩‍👧‍👦 Perfecto para toda la familia",
            "🎬 Estrenos exclusivos de Disney",
            "📱 Descarga para ver sin conexión"
        ]   


   },
    { 
         name: "PRIME VIDEO PERFIL", 
        price: "437,00 Bs", 
        numericPrice: 437.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/primevideo.png",
        type: "perfil",
        available: true,
        details: [
            "🎭 Series originales de Amazon",
            "🎬 Películas taquilleras recientes",
            "🌍 Contenido internacional variado",
            "⚡ Streaming en alta calidad",
        ]   


   },
    { 
         name: "FLUJO TV PERFIL", 
        price: "420,00 Bs", 
        numericPrice: 420.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/flujotv.png",
        type: "perfil",
        available: true,
        details: [
            "📺 Canales de TV en vivo",
            "🎬 Películas y series on-demand",
            "⚽ Deportes y eventos en vivo",
            "🌎 Contenido latino e internacional",
            "💡 Interfaz fácil de usar"
        ]   

   },
    { 
        name: "TELE LATINO PERFIL", 
        price: "400,00 Bs", 
        numericPrice: 400.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/telelatino.png",
        type: "perfil",
        available: true,
        details: [
            "📺 Canales latinos en vivo",
            "🎬 Películas y series latinas",
            "📰 Noticias en español",
            "⚽ Deportes latinos",
            "🎵 Música y entretenimiento"
        ]   

   },
    { 
        name: "STELLA TV PERFIL", 
        price: "400,00 Bs", 
        numericPrice: 400.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/stellatv.png",
        type: "perfil",
        available: false,
        details: [
            "🌟 Contenido premium latino",
            "📺 Canales de TV variados",
            "🎬 Películas en español",
            "👨‍👩‍👧‍👦 Programación familiar",
            "⚽ Deportes y entretenimiento"
        ]   

   },
    { 
        name: "CRUNCHYROLL PERFIL", 
        price: "358,00 Bs", 
        numericPrice: 358.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/crunchyroll.png",
        type: "perfil",
        available: true,
        details: [
            "🎌 Anime exclusivo y simulcast",
            "📚 Manga digital incluido",
            "🎬 Series anime en HD",
            "⚡ Episodios nuevos cada semana",
            "🌟 Sin publicidad en contenido premium"
        ]   

   },
    { 
        name: "VIX PERFIL", 
        price: "400,00 Bs", 
        numericPrice: 400.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/vix.png",
        type: "perfil",
        available: true,
        details: [
            "🎭 Contenido original de ViX",
            "📺 Telenovelas y series latinas",
            "⚽ Deportes en vivo",
            "📰 Noticias en español",
            "🎬 Películas mexicanas y latinas"
        ]   


   },
    { 
        name: "PARAMOUNT PERFIL", 
        price: "385,00 Bs", 
        numericPrice: 385.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/paramount.png",
        type: "perfil",
        available: true,
        details: [
             "🎬 Películas de Paramount Pictures",
            "📺 Shows de Comedy Central y MTV",
            "⚽ Deportes CBS Sports",
            "👶 Contenido Nickelodeon",
            "🎭 Series originales exclusivas"
        ]   

   },
    { 
        name: "perfil IPTV Mi Entretenimiento", 
        price: "550,00 Bs", 
        numericPrice: 550.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/IPtvEntretenimiento.png",
        type: "perfil",
        available: true,
        details: [
             "🎬 Disfruta series, películas y canales en vivo 🎬📡",
            "📺 Con la interfaz más increíble 🤩 y fácil de usar 🖥️",
            "⚽ Deportes en vivo",
            "✨ ¡El mejor entretenimiento está aquí y al mejor precio! 💥💸",
            "🎭 Series originales exclusivas"
        ]   

    }
];
const cuentas = [
    { 
        name: "NETFLIX CUENTA COMPLETA", 
        price: "2000,00 Bs", 
        numericPrice: 2000.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "4 DISPOSITIVOS",
        image: "img/netflixcuenta.png",
        type: "cuenta",
        available: true,
        details: [
            "👥 Hasta 4 perfiles simultáneos",
            "📱 4 dispositivos conectados",
            "🎬 Catálogo completo en 4K",
            "💾 Descargas ilimitadas",
            "🌍 Contenido de todas las regiones",
            "👨‍👩‍👧‍👦 Control parental incluido"
        ]
    
    },
    { 
        name: "cuenta IPTV Mi Entretenimiento", 
        price: "937,00 Bs", 
        numericPrice: 937.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "3 DISPOSITIVO",
        image: "img/IPtvcuenta.png",
        type: "cuenta",
        available: true,
        details: [
             "🎬 Disfruta series, películas y canales en vivo 🎬📡",
            "📺 Con la interfaz más increíble 🤩 y fácil de usar 🖥️",
            "⚽ Deportes en vivo",
            "✨ ¡El mejor entretenimiento está aquí y al mejor precio! 💥💸",
            "🎭 Series originales exclusivas"
        ]   

   },
    { 
        name: "Disney+ Premium Completa", 
        price: "1698,00 Bs", 
        numericPrice: 1698.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "7 DISPOSITIVO",
        image: "img/disnepre.png",
        type: "cuenta",
        available: true,
        details: [
             "🍿Disney+: El Hogar de la Magia📡",
            "🏰✨Descubre un mundo de entretenimiento mágico con Disney+",
            "⚽ Deportes en vivo",
            "😉todo el contenido icónico de Disney, Pixar, Marvel y mucho mas,",
            "✅ RENOVABLE."
        ]   
    },
    { 
        name: "JELLYFIN CUENTA COMPLETA", 
        price: "995,00 Bs", 
        numericPrice: 995.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "4 DISPOSITIVOS",
        image: "img/jellyfincuenta.png",
        type: "cuenta",
        available: true,
        details: [
             "👥 Hasta 4 usuarios simultáneos",
            "🎬 Biblioteca completa HD/4K",
            "📱 Multi-dispositivo",
            "🔒 Servidor privado dedicado",
            "⚡ Sin límites de ancho de banda",
        ]       
    
   },
    { 
         name: "DISNEY ESTANDAR", 
        price: "1.069,00 Bs", 
        numericPrice: 1069.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "6 DISPOSITIVOS",
        image: "img/disneycuentas.png",
        type: "cuenta",
        available: true,
        details: [
             "👥 6 perfiles familiares",
            "🏰 Todo Disney, Marvel, Star Wars",
            "📱 4 dispositivos simultáneos",
            "💾 Descargas offline",
            "🎬 Contenido 4K HDR",
            "👶 Configuración infantil segura"
        ]       

   },
    { 
         name: "PRIME VIDEO CUENTA", 
        price: "755,00 Bs", 
        numericPrice: 755.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "5 DISPOSITIVOS",
        image: "img/primevideocuenta.png",
        type: "cuenta",
        available: true,
        details: [
             "👥 5 streams simultáneos",
            "🎬 Biblioteca completa de Amazon",
            "📱 Multi-dispositivo",
            "💾 Descargas para móviles",
            "🎵 Prime Music incluido",
            "📦 Beneficios Prime parciales"
        ]       
    },
    { 
          name: "FLUJO TV CUENTA", 
        price: "910,00 Bs", 
        numericPrice: 910.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "3 DISPOSITIVOS",
        image: "img/flujotvcuenta.png",
        type: "cuenta",
        available: true,
        details: [
             "👥 3 usuarios simultáneos",
            "📺 Canales TV en vivo",
            "🎬 VOD completo",
            "⚽ Deportes en vivo",
            "📱 Apps móviles incluidas",
            "📄 Grabación en la nube"
        ]       
   },
    { 
         name: "TELE LATINO CUENTA", 
        price: "885,00 Bs", 
        numericPrice: 885.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "4 DISPOSITIVOS",
        image: "img/telelatinocuenta.png",
        type: "cuenta",
        available: true,
        details: [
             "👥 4 conexiones simultáneas",
            "📺 Todos los canales latinos",
            "🎬 Películas y series completas",
            "📰 Noticias 24/7",
            "⚽ Deportes premium",
            "🎵 Canales musicais"
        ]       

    },
    { 
        name: "STELLA TV CUENTA COMPLETA", 
        price: "937,00 Bs", 
        numericPrice: 937.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "3 DISPOSITIVOS",
        image: "img/stellatvcuenta.png",
        type: "cuenta",
        available: true,
        details: [
             "👥 3 perfiles de usuario",
            "🌟 Contenido premium completo",
            "📺 Canales variados",
            "🎬 Biblioteca de películas",
            "👨‍👩‍👧‍👦 Programación familiar",
            "📱 Compatible com Smart TV"
        ]       
    },
    { 
         name: "CRUNCHYROLL CUENTA", 
        price: "569,00 Bs", 
        numericPrice: 569.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "5 DISPOSITIVOS",
        image: "img/crunchyrollcuenta.png",
        type: "cuenta",
        available: true,
        details: [
             "👥 4 streams simultáneos",
            "🎌 Anime completo sin ads",
            "📚 Manga ilimitado",
            "🎬 Simulcast de Japón",
            "📱 Apps móviles premium",
            "🌟 Calidad HD sin interrupciones"
        ]       
    },
    { 
         name: "Viki Rakuten", 
        price: "678,00 Bs", 
        numericPrice: 678.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "4 DISPOSITIVOS",
        image: "img/vikicuenta.png",
        type: "cuenta",
        available: true,
        details: [
             "👥 4 streams simultáneos",
            "🎌 disponible: 🇰🇷 K-Dramas (Corea del Sur) 🇨🇳 C-Dramas (China) 🇯🇵 J-Dramas (Japón)",
            "📚 🇹🇼 Dramas taiwaneses 🎤 Programas de variedades, reality shows y más",
            "🎬 Viki Rakuten Es una plataforma de streaming con dramas y programas de Asia 🌏",
            "🌟 Calidad HD sin interrupciones"
        ]       
    },
    { 
         name: "VIX CUENTA", 
        price: "622,00 Bs", 
        numericPrice: 622.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "5 DISPOSITIVOS",
        image: "img/vixcuenta.png",
        type: "cuenta",
        available: true,
        details: [
              "👥 4 dispositivos simultáneos",
            "🎭 Contenido ViX+ completo",
            "📺 Canales en vivo",
            "⚽ Deportes premium",
            "🎬 Originales exclusivos",
            "📰 Noticias Univision"
       ] 
   },
    { 
          name: "MAX CUENTA COMPLETA", 
        price: "754,00 Bs", 
        numericPrice: 754.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "4 DISPOSITIVOS",
        image: "img/maxcuenta.png",
        type: "cuenta",
        available: true,
        details: [
              "👥 4 streams simultáneos",
            "🎬 HBO Max completo",
            "⚡ Estrenos día y fecha",
            "🎭 Series HBO originales",
            "🎨 Documentales premium",
            "👨‍👩‍👧‍👦 Contenido para toda la familia"
       ] 
     },
    { 
           name: "PARAMONT CUENTA", 
        price: "615,00 Bs", 
        numericPrice: 615.00,
        duration: "1 MES (30 DÍAS)", 
        devices: "6 DISPOSITIVOS",
        image: "img/paramountcuenta.png",
        type: "cuenta",
        available: true,
        details: [
            "👥 5 streams simultáneos",
            "🎬 Biblioteca Paramount completa",
            "📺 CBS, MTV, Comedy Central",
            "⚽ CBS Sports incluido",
            "👶 Nickelodeon completo",
            "🎭 Originales de Paramount+"
       ] 
    }
];
const combos = [
    { 
        name: "COMBO 2", 
        price: "750,00 Bs", 
        numericPrice: 750.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO C/U",
        image: "img/combo2.png",
        type: "combo",
        available: true,
        popular: true, // Insignia "Más Vendido"
        details: [
            "✅ 1 Perfil Netflix",
            "✅ 1 Perfil max",
            "✨ El entretenimiento completo para la familia"
        ]
    },
    { 
        name: "COMBO 1", 
        price: "700,00 Bs", 
        numericPrice: 700.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO C/U",
        image: "img/combo-basico.png", // Sugerencia: crea una imagen para este combo
        type: "combo",
        available: true,
        details: [
            "✅ 1 Perfil paramont",
            "✅ 1 Perfil max",
            "💰 Ahorra llevando los dos juntos",
            "🎬 Acceso a miles de series y películas"
        ]
    },
    { 
        name: "COMBO 3", 
        price: "750,00 Bs", 
        numericPrice: 750.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO C/U",
        image: "img/combo3.png", // Sugerencia: crea una imagen para este combo
        type: "combo",
        available: true,
        details: [
            "✅ 1 Perfil Netflix",
            "✅ 1 Perfil paramount",
            "✨ El entretenimiento completo para la familia"
        ]
   
   },
    { 
        name: "COMBO 4", 
        price: "750,00 Bs", 
        numericPrice: 750.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO C/U",
        image: "img/combo4.png", // Sugerencia: crea una imagen para este combo
        type: "combo",
        available: true,
        details: [
            "✅ 1 Perfil Netflix",
            "✅ 1 Perfil vix",
            "✨ El entretenimiento completo para la familia"
        ]
   
   
   },
    { 
        name: "COMBO 5", 
        price: "750,00 Bs", 
        numericPrice: 750.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO C/U",
        image: "img/combo5.png", // Sugerencia: crea una imagen para este combo
        type: "combo",
        available: true,
        details: [
            "✅ 1 Perfil Netflix",
            "✅ 1 Perfil crunchiroll",
            "✨ El entretenimiento completo para la familia"
        ]

},
    { 
        name: "COMBO 6", 
        price: "750,00 Bs", 
        numericPrice: 750.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO C/U",
        image: "img/combo6.png", // Sugerencia: crea una imagen para este combo
        type: "combo",
        available: true,
        details: [
            "✅ 1 Perfil Netflix",
            "✅ 1 Perfil prime video",
            "✨ El entretenimiento completo para la familia"
        ]
    }
];
const otros = [
    { 
        name: "YOUTUBE PREMIUM", 
        price: "520,00 Bs", 
        numericPrice: 520.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO",
        image: "img/youtubeper.png",
        type: "otro",
        available: true,
        details: [
            "✅ YouTube y YouTube Music sin anuncios",
            "🎬 Mira videos sin interrupciones",
            "📱 Compatible con móviles y tablets",
            "⚡ Activación inmediata",
            "💰 Perfil individual exclusivo"
    
        ]
   
    },
    { 
        name: "Spotify",
        price: "624,00 Bs", 
        numericPrice: 624.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO",
        image: "img/spotify1.png",
        type: "otro",
        available: true,
        details: [
            "🎵✨tu música favorita sin anuncios, con descargas",
            "✅Sin anuncios, modo offlinemejor calidad de sonido",
            "⚠ Importante: Si la contraseña es cambiada,la garantía se anula",
            "✅Ideal para individuos,emprendedores y diseñadores independientes",
            "✅RENOVABLE"
        ]   
    
     },
    { 
        name: "Deezer",
        price: "624,00 Bs", 
        numericPrice: 624.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO",
        image: "img/Deezer1.png",
        type: "otro",
        available: true,
        details: [
            "🎵✨servicio de música en streaming",
            "✅el cual alberga más de 73.000.000 de canciones",
            "✅con licencia oficial de muchos artistas importantes de todo el mundo ",
            "✅RENOVABLE"
        ]   
    
    
    
    
    
    
    
    
    
    
    },
    { 
        name: "CANVA 1",
        price: "569,00 Bs", 
        numericPrice: 569.00,
        duration: "30 DÍAS", 
        devices: "1 DISPOSITIVO",
        image: "img/canva.png",
        type: "otro",
        available: true,
        details: [
            "✅ Miles de plantillas y recursos exclusivos",
            "✅ Edición fácil y profesional",
            "✅ Aumenta tu productividad con herramientas avanzadas",
            "✅Ideal para individuos, emprendedores y diseñadores independientes",
            "✅RENOVABLE"
        ]   
    },
    { 
        name: "CANVA 3", 
        price: "1063,00 Bs", 
        numericPrice: 1063.00,
        duration: "1 MES (90 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/canva3.png",
        type: "otro",
        available: true,
        details: [
            "✅ Tiene una duración de 3 meses, con garantia de 45 dias",
            "✅ Miles de plantillas y recursos exclusivos",
            "✅ Edición fácil y profesional",
            "✅ Aumenta tu productividad con herramientas avanzadas",
            "❌NO RENOVABLE"
        ]   
     },
    { 
        name: "CANVA 12", 
        price: "2669,00 Bs", 
        numericPrice: 2669.00,
        duration: "12 MESES (365 DÍAS)", 
        devices: "1 DISPOSITIVO",
        image: "img/canva12.png",
        type: "otro",
        available: true,
        details: [
            "✅Tiene una duración de 12 meses, con garantia de 6 meses",
            "✅ Miles de plantillas y recursos exclusivos",
            "✅ Edición fácil y profesional",
            "✅ Aumenta tu productividad con herramientas avanzadas",
            "❌NO RENOVABLE"
        ]   
    }
];
const featuredOffers = [
    { 
        name: "max perfil estandar", 
        price: "380,00 Bs", 
        numericPrice: 380.00,
        duration: "1 MES", 
        devices: "1 DISPOSITIVO",
        image: "img/MAXOFERTA.png",
        type: "oferta",
        available: true,
        details: [
            "🍿Max 1 perfil,Con esta pantalla disfruta de estrenos",
            "✅ permite 1 conexión simultánea",
            "📱 disponible para smart tv,celulares,odenadores,",
            "🚫No Renovable"
        ]
    },
    { 
        name: "paramount Estándar perfil", 
        price: "380,00 Bs", 
        numericPrice: 380.00,
        duration: "1 MES", 
        devices: "1 DISPOSITIVO",
        image: "img/PARAMOUNTPROMO.png",
        type: "oferta",
        available: true,
        details: [
            "🎬 Películas de Paramount Pictures",
            "📺 Shows de Comedy Central y MTV",
            "⚽ Deportes CBS Sports,",
            "👶 Contenido Nickelodeeon",
            "🎭 Series originales exclusivas"
        ]
    }
];