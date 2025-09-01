// ============================================
// CONFIGURACIÓN DE SERVICIOS - EDITA AQUÍ
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
    // ... (El resto de tus perfiles sin cambios)
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
            "📱 Compatible con Smart TV"
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
    // ... (El resto de tus combos sin cambios)
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
        price: "300,00 Bs", 
        numericPrice: 300.00,
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
        price: "300,00 Bs", 
        numericPrice: 300.00,
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

// ============================================
// LÓGICA DEL SITIO - NO EDITAR DESDE AQUÍ
// ============================================
let cart = [];
let hasSoundPermission = false; // NUEVA VARIABLE GLOBAL

// --- Funciones del Carrito ---
function saveCart() {
    localStorage.setItem('connectTVCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('connectTVCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

async function addToCart(serviceName, numericPrice, displayPrice, serviceType) {
    const existingItem = cart.find(item => item.name === serviceName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: serviceName, price: numericPrice, displayPrice: displayPrice, quantity: 1, months: 1, type: serviceType });
    }
    saveCart();
    updateCartDisplay();
    showNotification('✅ ¡Producto agregado al carrito!');
    await playSound('addSound');
}

async function removeFromCart(serviceName) {
    cart = cart.filter(item => item.name !== serviceName);
    saveCart();
    updateCartDisplay();
    showNotification('🗑️ Producto eliminado del carrito.', 'remove');
    await playSound('removeSound');
}

function updateQuantity(serviceName, change) {
    const item = cart.find(item => item.name === serviceName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(serviceName);
            return; // Salimos para evitar doble guardado
        }
    }
    saveCart();
    updateCartDisplay();
}

function updateDuration(serviceName, newDuration) {
    const item = cart.find(item => item.name === serviceName);
    if (item) {
        item.months = parseInt(newDuration, 10);
    }
    saveCart();
    updateCartDisplay();
}

function emptyCart() {
    if (cart.length > 0 && confirm("¿Estás seguro de que quieres vaciar tu carrito?")) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('🛒 Carrito vaciado.', 'remove');
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartTotalSection = document.getElementById('cartTotalSection');
    const cartActions = document.querySelector('.cart-actions');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    if (cart.length === 0) {
        if(emptyCartMessage) emptyCartMessage.style.display = 'block';
        if(cartItems) cartItems.innerHTML = '';
        if(cartTotalSection) cartTotalSection.style.display = 'none';
        if(cartActions) cartActions.style.display = 'none';
    } else {
        if(emptyCartMessage) emptyCartMessage.style.display = 'none';
        if(cartTotalSection) cartTotalSection.style.display = 'block';
        if(cartActions) cartActions.style.display = 'flex';
        if(cartItems) {
            cartItems.innerHTML = cart.map(item => {
                const safeItemName = item.name.replace(/[^a-zA-Z0-9]/g, '-');
                let durationControlsHTML = '';
                let subtotalHTML = '';

                if (item.type === 'combo') {
                    item.months = 1; 
                    durationControlsHTML = `<div class="quantity-controls"><span style="font-size: 0.8em; margin-right: 5px;">Duración:</span><span style="font-weight: bold;">1 Mes</span></div>`;
                } else {
                    durationControlsHTML = `<div class="quantity-controls"><label for="months-${safeItemName}" style="font-size: 0.8em; margin-right: 5px;">Meses:</label><select id="months-${safeItemName}" onchange="updateDuration('${item.name}', this.value)" style="background: var(--input-bg); color: var(--text-color); border: 1px solid var(--card-border); border-radius: 5px; padding: 3px; cursor: pointer;"><option value="1" ${item.months === 1 ? 'selected' : ''}>1 Mes</option><option value="2" ${item.months === 2 ? 'selected' : ''}>2 Meses</option><option value="3" ${item.months === 3 ? 'selected' : ''}>3 Meses</option></select></div>`;
                }

                const originalSubtotal = item.price * item.quantity * item.months;
                let finalSubtotal = originalSubtotal;

                if (item.months === 3 && item.type !== 'combo') {
                    const discount = originalSubtotal * 0.05;
                    finalSubtotal = originalSubtotal - discount;
                    subtotalHTML = `<div class="discount-details"><span class="original-price">${originalSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs</span> <span>(5% Dcto.)</span></div> <div>${finalSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs</div>`;
                } else {
                    subtotalHTML = `${finalSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
                }
                
                item.finalSubtotal = finalSubtotal;

                return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.displayPrice} / mes</div>
                    </div>
                    <div class="cart-item-controls">
                        ${durationControlsHTML}
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${item.name}')">Eliminar</button>
                    </div>
                     <div style="width: 100%; text-align: right; font-weight: bold; margin-top: 10px; font-size: 1.1em;">
                        Subtotal: ${subtotalHTML}
                    </div>
                </div>`;
            }).join('');
        }

        const total = cart.reduce((sum, item) => sum + item.finalSubtotal, 0);
        if(totalAmount) totalAmount.textContent = `${total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
    }
}

function createServiceCard(service, index) {
    const card = document.createElement('div');
    card.className = `service-card ${!service.available ? 'out-of-stock' : ''}`;
    card.style.setProperty('--card-index', index);
    
    const stockBadge = !service.available ? '<div class="stock-badge">Agotado</div>' : '';
    const popularBadge = service.popular ? '<div class="popular-badge">🔥 Más Vendido</div>' : '';
    
    card.innerHTML = `
        ${stockBadge}
        ${popularBadge}
        <div>
            <img src="${service.image}" alt="${service.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjYwIiB5PSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwZmYwMCIgZm9udC1zaXplPSIxMiI+${service.name.replace(/ /g, '%20').split('%20')[0].substring(0,6)}</dGV4dD48L3N2Zz4='}">
            <h3>${service.name}</h3>
        </div>
        <div class="service-info">
            <div>
                <div class="service-details">📅 ${service.duration}</div>
                <div class="service-details">🔴 ${service.devices}</div>
                <div class="price">${service.price}</div>
                <div class="details-toggle" onclick="toggleDetails('${service.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}')">ℹ️ Ver Detalles</div>
                <div class="service-details-content" id="details-${service.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}">
                    <ul>${service.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
                </div>
            </div>
            <button class="add-to-cart-btn ${!service.available ? 'out-of-stock' : ''}" onclick="addToCart('${service.name}', ${service.numericPrice}, '${service.price}', '${service.type}')" ${!service.available ? 'disabled' : ''}>
                ${service.available ? '🛒 Agregar al Carrito' : '❌ Agotado'}
            </button>
        </div>
    `;
    return card;
}

function searchServices() {
    const input = document.getElementById('serviceSearch');
    const filter = input.value.toUpperCase();
    const grids = document.querySelectorAll('.services-grid');
    const noResultsMessage = document.getElementById('noResultsMessage');
    let resultsFound = false;

    grids.forEach(grid => {
        const cards = grid.getElementsByClassName('service-card');
        for (let card of cards) {
            const h3 = card.getElementsByTagName("h3")[0];
            if (h3) {
                const txtValue = h3.textContent || h3.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    card.style.display = "";
                    resultsFound = true;
                } else {
                    card.style.display = "none";
                }
            }
        }
    });

    noResultsMessage.style.display = resultsFound ? "none" : "block";
}

// --- Lógica de Navegación y UI ---
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });

    if (sectionId === 'store') showServicesTab('perfiles');
}

function showServicesTab(tabName) {
    document.querySelectorAll('.services-container').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

function loadServices() {
    const loader = document.getElementById('servicesLoader');
    loader.style.display = 'flex';

    setTimeout(() => {
        document.getElementById('perfilesGrid').innerHTML = perfiles.map((s, i) => createServiceCard(s, i).outerHTML).join('');
        document.getElementById('cuentasGrid').innerHTML = cuentas.map((s, i) => createServiceCard(s, i).outerHTML).join('');
        document.getElementById('combosGrid').innerHTML = combos.map((s, i) => createServiceCard(s, i).outerHTML).join('');
        document.getElementById('otrosGrid').innerHTML = otros.map((s, i) => createServiceCard(s, i).outerHTML).join('');
        document.getElementById('featuredOffersGrid').innerHTML = featuredOffers.map((s, i) => createServiceCard(s, i).outerHTML).join('');
        loader.style.display = 'none';
    }, 500); // Simula una pequeña carga
}

// --- Mensajes de WhatsApp ---
function sendSupportMessage() {
    const message = `👋 ¡Hola ConnectTV! Necesito ayuda con un problema.\n\n*🚨 MI ERROR O PROBLEMA ES:*\n(Describe aquí tu inconveniente)\n\n*📺 SERVICIO AFECTADO:*\n(Ej: Netflix, Disney+)\n\n*🔍 YA INTENTÉ:*\n(Ej: Reiniciar la app, cambiar de dispositivo)\n\nEspero su pronta respuesta. ¡Gracias!`;
    window.open(`https://wa.me/584242357804?text=${encodeURIComponent(message)}`, '_blank');
}

function sendResellerMessage() {
    const message = `👋 ¡Hola ConnectTV! Estoy interesado/a en obtener información sobre los precios y condiciones para ser distribuidor. ¡Gracias!`;
    window.open(`https://wa.me/584242357804?text=${encodeURIComponent(message)}`, '_blank');
}

// ============================================
// FUNCIÓN DE CHECKOUT MODIFICADA
// ============================================
function processCheckout() {
    const customerName = document.getElementById('customerName').value.trim();
    if (!customerName) {
        alert('Por favor, ingresa tu nombre para continuar.');
        navigateToStep(2);
        return;
    }

    // 1. Generar fecha de compra
    const purchaseDate = new Date();
    const formattedPurchaseDate = purchaseDate.toLocaleDateString('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const total = cart.reduce((sum, item) => sum + item.finalSubtotal, 0);

    // 2. Añadir fecha de corte a cada item en el resumen
    const itemsList = cart.map(item => {
        let priceDetail = ` - ${item.finalSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`;
        if (item.months === 3 && item.type !== 'combo') {
            priceDetail += ` (dcto. aplicado)`;
        }

        // Calcular la fecha de corte para este item
        const cutOffDate = new Date(purchaseDate);
        cutOffDate.setMonth(cutOffDate.getMonth() + item.months);
        const formattedCutOffDate = cutOffDate.toLocaleDateString('es-VE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        return `• ${item.quantity}x ${item.name} (${item.months} ${item.months > 1 ? 'Meses' : 'Mes'})${priceDetail}\n  └─ *Vence:* ${formattedCutOffDate}`;
    }).join('\n\n');

    // 3. Crear el nuevo mensaje de WhatsApp con toda la información
    const message = `👋 *Hola, mi nombre es ${customerName}*.\n\n` +
                    `🛒 *Quisiera confirmar el siguiente pedido:*\n\n` +
                    `*Fecha de Compra:* ${formattedPurchaseDate}\n` +
                    `-----------------------------------\n` +
                    `${itemsList}\n` +
                    `-----------------------------------\n` +
                    `💰 *TOTAL A PAGAR:* ${total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs\n\n` +
                    `✅ *Pedido generado desde la web.*\n\n` +
                    `Quedo atento a las instrucciones para el pago. ¡Gracias!`;

    window.open(`https://wa.me/584242357804?text=${encodeURIComponent(message)}`, '_blank');

    cart = [];
    saveCart();
    updateCartDisplay();
    closeCart();
}

// --- Lógica para el Modal de Términos y Condiciones ---
function setupTermsModal() {
    const modal = document.getElementById('termsModal');
    const link = document.getElementById('termsLink');
    const closeBtn = document.querySelector('.terms-modal-close');

    if (!modal || !link || !closeBtn) {
        console.error('Terms modal elements not found!');
        return;
    }

    link.onclick = function(event) {
        event.preventDefault();
        modal.style.display = 'block';
    }

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}


// --- Inicialización y Event Listeners ---
document.addEventListener('DOMContentLoaded', function() {
    setupSoundPermission();
    loadCart();
    createParticles();
    loadServices();
    updateCartDisplay();
    createDots();
    showSection('home');
    setupFAQAccordion();
    setupTermsModal(); // Inicializa el modal de términos
    loadTheme();
    // Prepara los audios para que puedan sonar sin interacción previa
    document.querySelectorAll('audio').forEach(audio => audio.load());
});


// ============================================
// LÓGICA DE PERMISO DE SONIDO
// ============================================
function setupSoundPermission() {
    const modal = document.getElementById('sound-permission-modal');
    const confirmBtn = document.getElementById('confirm-sound-btn');
    const permissionGiven = localStorage.getItem('soundPermissionGiven');

    if (permissionGiven) {
        hasSoundPermission = true;
        modal.style.display = 'none';
        return;
    }

    modal.classList.add('visible');

    confirmBtn.addEventListener('click', async () => {
        // Intenta reproducir un sonido para "desbloquear" el audio
        await playSound('addSound');
        hasSoundPermission = true;
        localStorage.setItem('soundPermissionGiven', 'true');
        modal.classList.remove('visible');
         setTimeout(() => {
             modal.style.display = 'none';
         }, 400); // Espera a que la transición de opacidad termine
    });
}


// ============================================
// El resto de funciones de UI (sin cambios mayores)
// ============================================
const carouselWrapper = document.getElementById('carouselWrapper');
const carouselDots = document.getElementById('carouselDots');
const carouselItems = document.querySelectorAll('.carousel-item');
let currentSlide = 0;
function createDots() { if (!carouselDots) return; carouselDots.innerHTML = ''; carouselItems.forEach((_, index) => { const dot = document.createElement('div'); dot.classList.add('dot'); if (index === 0) dot.classList.add('active'); dot.addEventListener('click', () => changeSlide(index)); carouselDots.appendChild(dot); }); }
function updateCarousel() { if (!carouselWrapper) return; carouselWrapper.style.transform = `translateX(-${currentSlide * 100}%)`; document.querySelectorAll('.dot').forEach((dot, index) => { dot.classList.toggle('active', index === currentSlide); }); }
function changeSlide(index) { currentSlide = index; updateCarousel(); }
function autoSlide() { if (carouselItems.length > 0) { currentSlide = (currentSlide + 1) % carouselItems.length; updateCarousel(); } }
setInterval(autoSlide, 5000);
function createParticles() { const particles = document.getElementById('particles'); if(!particles) return; for (let i = 0; i < 15; i++) { const particle = document.createElement('div'); particle.className = 'particle'; particle.style.left = Math.random() * 100 + '%'; particle.style.animationDelay = Math.random() * 15 + 's'; particle.style.animationDuration = (Math.random() * 10 + 10) + 's'; particles.appendChild(particle); } }
function toggleDetails(serviceId) { const detailsElement = document.getElementById(`details-${serviceId}`); if (detailsElement.classList.contains('active')) { detailsElement.classList.remove('active'); event.target.innerHTML = 'ℹ️ Ver Detalles'; } else { document.querySelectorAll('.service-details-content.active').forEach(el => el.classList.remove('active')); document.querySelectorAll('.details-toggle').forEach(btn => btn.innerHTML = 'ℹ️ Ver Detalles'); detailsElement.classList.add('active'); event.target.innerHTML = '❌ Cerrar Detalles'; } }

async function playSound(soundId) {
    if (!hasSoundPermission && !localStorage.getItem('soundPermissionGiven')) return;
    
    const sound = document.getElementById(soundId);
    if (!sound) {
        console.error(`Sound element with id "${soundId}" not found.`);
        return;
    }
    sound.currentTime = 0;
    sound.volume = 0.5;

    try {
        await sound.play();
    } catch (error) {
        console.error(`Error playing sound "${soundId}":`, error);
    }
}

function showNotification(message, type = 'add') { const notification = document.createElement('div'); const color = type === 'add' ? 'linear-gradient(45deg, var(--primary-color), #00cc00)' : 'linear-gradient(45deg, #ff9800, #ff5722)'; notification.style.cssText = `position: fixed; top: 100px; right: 20px; background: ${color}; color: black; padding: 1rem 1.5rem; border-radius: 10px; font-weight: bold; z-index: 10000; animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s; box-shadow: 0 5px 15px rgba(0, 255, 0, 0.4);`; notification.innerHTML = message; document.body.appendChild(notification); setTimeout(() => notification.remove(), 3000); }
function openCart() { document.getElementById('cartModal').style.display = 'block'; document.body.style.overflow = 'hidden'; navigateToStep(1); }
function closeCart() { document.getElementById('cartModal').style.display = 'none'; document.body.style.overflow = 'auto'; }

function navigateToStep(step) {
    if (step === 3 && !document.getElementById('customerName').value.trim()) {
        alert('Por favor, ingresa tu nombre para continuar.');
        document.getElementById('customerName').focus();
        return;
    }
    document.querySelectorAll('.cart-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`cart-step-${step}`).classList.add('active');
    
    const progressBar = document.getElementById('progressBar');
    if (cart.length > 0) {
        progressBar.style.display = 'flex';
        document.querySelectorAll('.progress-step').forEach(p => {
            p.classList.remove('active', 'completed');
            const pStep = parseInt(p.dataset.step);
            if (pStep < step) {
                p.classList.add('completed');
            } else if (pStep === step) {
                p.classList.add('active');
            }
        });
    } else {
        progressBar.style.display = 'none';
    }

    const cartTitle = document.getElementById('cart-title');
    if(step === 1) cartTitle.innerText = "🛒 Tu Carrito de Compras";
    if(step === 2) cartTitle.innerText = "📝 Completa tus Datos";
    if(step === 3) {
        cartTitle.innerText = "✅ Confirma tu Pedido";
        generateFinalSummary();
    }
}

function generateFinalSummary() { const customerName = document.getElementById('customerName').value.trim(); const itemsList = cart.map(item => `<tr><td style="padding: 5px; text-align: left;">${item.quantity}x ${item.name} (${item.months} ${item.months > 1 ? 'Meses' : 'Mes'})</td><td style="padding: 5px; text-align: right;">${item.finalSubtotal.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs</td></tr>`).join(''); const summaryHTML = `<div style="text-align: left; padding: 10px;"><p><strong>Cliente:</strong> ${customerName}</p><hr style="border-color: rgba(0,255,0,0.2); margin: 1rem 0;"><table style="width: 100%; border-collapse: collapse;"><thead><tr><th style="text-align: left; padding-bottom: 5px; border-bottom: 1px solid rgba(0,255,0,0.2);">Descripción</th><th style="text-align: right; padding-bottom: 5px; border-bottom: 1px solid rgba(0,255,0,0.2);">Subtotal</th></tr></thead><tbody>${itemsList}</tbody></table></div>`; document.getElementById('finalSummary').innerHTML = summaryHTML; const total = cart.reduce((sum, item) => sum + item.finalSubtotal, 0); document.getElementById('finalTotalAmount').textContent = `${total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`; }
function setupFAQAccordion() { document.querySelectorAll('.faq-question').forEach(q => { q.addEventListener('click', () => { const parentItem = q.parentElement; const isActive = parentItem.classList.contains('active'); document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active')); if (!isActive) parentItem.classList.add('active'); }); }); }
function toggleMobileMenu() { document.getElementById('mobileMenu').classList.toggle('active'); }
window.onclick = (event) => { if (event.target == document.getElementById('cartModal')) closeCart(); }
const desktopToggle = document.getElementById('theme-toggle');
const mobileToggle = document.getElementById('mobile-theme-toggle');
function setTheme(isLight) { if (isLight) { document.body.classList.add('light-theme'); if(desktopToggle) desktopToggle.checked = true; if(mobileToggle) mobileToggle.checked = true; localStorage.setItem('theme', 'light'); } else { document.body.classList.remove('light-theme'); if(desktopToggle) desktopToggle.checked = false; if(mobileToggle) mobileToggle.checked = false; localStorage.setItem('theme', 'dark'); } }
if(desktopToggle) desktopToggle.addEventListener('change', () => setTheme(desktopToggle.checked));
if(mobileToggle) mobileToggle.addEventListener('change', () => setTheme(mobileToggle.checked));
function loadTheme() { setTheme(localStorage.getItem('theme') === 'light'); }

// Funciones globales para HTML
window.toggleDetails = toggleDetails; 
window.addToCart = addToCart; 
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity; 
window.openCart = openCart; 
window.closeCart = closeCart;
window.processCheckout = processCheckout;
window.showServicesTab = showServicesTab; 
window.showSection = showSection; 
window.toggleMobileMenu = toggleMobileMenu;
window.sendSupportMessage = sendSupportMessage;
window.sendResellerMessage = sendResellerMessage;
window.searchServices = searchServices;
window.navigateToStep = navigateToStep;
window.updateDuration = updateDuration;
window.emptyCart = emptyCart;