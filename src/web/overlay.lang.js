// Translations from jellyfin-web/src/strings/
// Generated with:
// jq -n '[inputs | { lang: input_filename | split(".")[0], HeaderConnectToServer: .HeaderConnectToServer, LabelServerHost: .LabelServerHost, LabelServerHostHelp: .LabelServerHostHelp, Connect: .Connect, HeaderConnectionFailure: .HeaderConnectionFailure, MessageUnableToConnectToServer: .MessageUnableToConnectToServer, ButtonGotIt: .ButtonGotIt }]' *.json

const languages = [
  {
    "lang": "af",
    "HeaderConnectToServer": "Konnekteer aan Bediener",
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "Konnekteer",
    "HeaderConnectionFailure": "Konneksie Fout",
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "Het Dit So"
  },
  {
    "lang": "ar",
    "HeaderConnectToServer": "Ø§ØªØµÙ„ Ø¥Ù„Ù‰ Ø§Ù„Ø®Ø§Ø¯Ù…",
    "LabelServerHost": "Ø§Ù„Ù…Ø¶ÙŠÙ",
    "LabelServerHostHelp": "192.168.1.100:8096 Ø£Ùˆ https://myserver.com",
    "Connect": "Ø¥ØªØµØ§Ù„",
    "HeaderConnectionFailure": "ÙØ´Ù„ ÙÙŠ Ø§Ù„Ø§ØªØµØ§Ù„",
    "MessageUnableToConnectToServer": "Ù„Ù… Ù†Ø³ØªØ·Ø¹ Ø§Ù„Ø§ØªØµØ§Ù„ Ø¥Ù„Ù‰ Ø§Ù„Ø®Ø§Ø¯Ù… Ø§Ù„Ù…Ø®ØªØ§Ø± ÙÙŠ Ø§Ù„ÙˆÙ‚Øª Ø§Ù„Ø­Ø§Ù„ÙŠ. Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø§Ù„ØªØ£ÙƒØ¯ Ù…Ù† Ø£Ù†Ù‡ ÙŠØ¹Ù…Ù„ Ø«Ù… Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.",
    "ButtonGotIt": "Ø­Ø³Ù†Ø§"
  },
  {
    "lang": "as",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "be-by",
    "HeaderConnectToServer": "ÐŸÐ°Ð´Ð»ÑƒÑ‡Ñ‹Ñ†Ñ†Ð° Ð´Ð° ÑÐµÑ€Ð²ÐµÑ€Ð°",
    "LabelServerHost": "Ð’ÑÐ´ÑƒÑ‡Ñ‹",
    "LabelServerHostHelp": "192.168.1.100:8096 Ð°Ð±Ð¾ https://myserver.com",
    "Connect": "ÐŸÐ°Ð´Ð»ÑƒÑ‡Ñ‹Ñ†Ñ†Ð°",
    "HeaderConnectionFailure": "Ð—Ð±Ð¾Ð¹ Ð¿Ð°Ð´Ð»ÑƒÑ‡ÑÐ½Ð½Ñ",
    "MessageUnableToConnectToServer": "ÐœÑ‹ Ð½Ðµ Ð¼Ð¾Ð¶Ð°Ð¼ Ð·Ð°Ñ€Ð°Ð· Ð¿Ð°Ð´ÐºÐ»ÑŽÑ‡Ñ‹Ñ†Ñ†Ð° Ð´Ð° Ð²Ñ‹Ð±Ñ€Ð°Ð½Ð°Ð³Ð° ÑÐµÑ€Ð²ÐµÑ€Ð°. Ð£Ð¿ÑÑžÐ½Ñ–Ñ†ÐµÑÑ, ÑˆÑ‚Ð¾ Ñ‘Ð½ Ð·Ð°Ð¿ÑƒÑˆÑ‡Ð°Ð½Ñ‹, Ñ– Ð¿Ð°ÑžÑ‚Ð°Ñ€Ñ‹Ñ†Ðµ ÑÐ¿Ñ€Ð¾Ð±Ñƒ.",
    "ButtonGotIt": "Ð—Ñ€Ð°Ð·ÑƒÐ¼ÐµÐ»Ð°"
  },
  {
    "lang": "bg-bg",
    "HeaderConnectToServer": "Ð¡Ð²ÑŠÑ€Ð¶Ð¸ ÑÐµ ÑÑŠÑ ÑÑŠÑ€Ð²ÑŠÑ€",
    "LabelServerHost": "Ð¥Ð¾ÑÑ‚",
    "LabelServerHostHelp": "192.168.1.100:8096 Ð¸Ð»Ð¸ https://myserver.com",
    "Connect": "Ð¡Ð²ÑŠÑ€Ð·Ð²Ð°Ð½Ðµ",
    "HeaderConnectionFailure": "ÐŸÑ€Ð¾Ð±Ð»ÐµÐ¼ Ð¿Ñ€Ð¸ ÑÐ²ÑŠÑ€Ð·Ð²Ð°Ð½Ðµ",
    "MessageUnableToConnectToServer": "Ð’ Ð¼Ð¾Ð¼ÐµÐ½Ñ‚Ð° Ð½Ðµ Ð¼Ð¾Ð¶ÐµÐ¼ Ð´Ð° ÑÐµ ÑÐ²ÑŠÑ€Ð¶ÐµÐ¼ Ñ Ð¸Ð·Ð±Ñ€Ð°Ð½Ð¸Ñ ÑÑŠÑ€Ð²ÑŠÑ€. ÐœÐ¾Ð»Ñ, ÑƒÐ²ÐµÑ€ÐµÑ‚Ðµ ÑÐµ, Ñ‡Ðµ Ñ€Ð°Ð±Ð¾Ñ‚Ð¸ Ð¸ Ð¾Ð¿Ð¸Ñ‚Ð°Ð¹Ñ‚Ðµ Ð¾Ñ‚Ð½Ð¾Ð²Ð¾.",
    "ButtonGotIt": "Ð”Ð¾Ð±Ñ€Ðµ"
  },
  {
    "lang": "bn",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "bn_BD",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "à¦•à¦¾à¦¨à§‡à¦•à§à¦Ÿ",
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "à¦¬à§à¦à§‡à¦›à¦¿"
  },
  {
    "lang": "ca",
    "HeaderConnectToServer": "Connectar al servidor",
    "LabelServerHost": "AmfitriÃ³",
    "LabelServerHostHelp": "192.168.1.100:8096 o https://myserver.com",
    "Connect": "Connecta",
    "HeaderConnectionFailure": "Error de connexiÃ³",
    "MessageUnableToConnectToServer": "No es pot connectar amb el servidor seleccionat en aquest moment. Assegureu-vos que estÃ  funcionant i torni a intentar-ho.",
    "ButtonGotIt": "Entesos"
  },
  {
    "lang": "ch",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "cs",
    "HeaderConnectToServer": "PÅ™ipojit k serveru",
    "LabelServerHost": "Host",
    "LabelServerHostHelp": "192.168.1.100:8096 nebo https://mujserver.cz",
    "Connect": "PÅ™ipojit",
    "HeaderConnectionFailure": "PÅ™ipojenÃ­ selhalo",
    "MessageUnableToConnectToServer": "Nejsme schopni se pÅ™ipojit k vybranÃ©mu serveru prÃ¡vÄ› teÄ. ProsÃ­m, ujistÄ›te se, Å¾e je spuÅ¡tÄ›n a zkuste to znovu.",
    "ButtonGotIt": "RozumÃ­m"
  },
  {
    "lang": "cy",
    "HeaderConnectToServer": null,
    "LabelServerHost": "Lletywr",
    "LabelServerHostHelp": null,
    "Connect": "Cysylltu",
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "Dyna Fe"
  },
  {
    "lang": "da",
    "HeaderConnectToServer": "Forbind til server",
    "LabelServerHost": "VÃ¦rt",
    "LabelServerHostHelp": "F. eks: 192.168.1.100:8096 eller https://myserver.com",
    "Connect": "Forbind",
    "HeaderConnectionFailure": "Forbindelsesfejl",
    "MessageUnableToConnectToServer": "Vi kan ikke forbinde til den valgte server pÃ¥ nuvÃ¦rende tidspunkt. Sikrer dig venligst at serveren kÃ¸rer og prÃ¸v igen.",
    "ButtonGotIt": "ForstÃ¥et"
  },
  {
    "lang": "de",
    "HeaderConnectToServer": "Mit Server verbinden",
    "LabelServerHost": "Adresse",
    "LabelServerHostHelp": "192.168.1.100:8096 oder https://myserver.com",
    "Connect": "Verbinden",
    "HeaderConnectionFailure": "Verbindungsfehler",
    "MessageUnableToConnectToServer": "Wir kÃ¶nnen gerade keine Verbindung zum gewÃ¤hlten Server herstellen. Bitte stelle sicher, dass dieser lÃ¤uft und versuche es erneut.",
    "ButtonGotIt": "Verstanden"
  },
  {
    "lang": "el",
    "HeaderConnectToServer": "Î£ÏÎ½Î´ÎµÏƒÎ· ÏƒÏ„Î¿Î½ Î”Î¹Î±ÎºÎ¿Î¼Î¹ÏƒÏ„Î®",
    "LabelServerHost": "Host",
    "LabelServerHostHelp": "192.168.1.100:8096 Î® https://myserver.com",
    "Connect": "Î£ÏÎ½Î´ÎµÏƒÎ·",
    "HeaderConnectionFailure": "Î‘Ï€Î¿Ï„Ï…Ï‡Î¯Î± ÏƒÏÎ½Î´ÎµÏƒÎ·Ï‚",
    "MessageUnableToConnectToServer": "Î”ÎµÎ½ ÎµÎ¯Î½Î±Î¹ Î´Ï…Î½Î±Ï„Î® Î· ÏƒÏÎ½Î´ÎµÏƒÎ· Î¼Îµ Ï„Î¿Î½ ÎµÏ€Î¹Î»ÎµÎ³Î¼Î­Î½Î¿ Î´Î¹Î±ÎºÎ¿Î¼Î¹ÏƒÏ„Î® Î±Ï…Ï„Î® Ï„Î· ÏƒÏ„Î¹Î³Î¼Î®. Î’ÎµÎ²Î±Î¹Ï‰Î¸ÎµÎ¯Ï„Îµ ÏŒÏ„Î¹ ÎµÎºÏ„ÎµÎ»ÎµÎ¯Ï„Î±Î¹ ÎºÎ±Î¹ Ï€ÏÎ¿ÏƒÏ€Î±Î¸Î®ÏƒÏ„Îµ Î¾Î±Î½Î¬.",
    "ButtonGotIt": "Î¤Î¿ ÎºÎ±Ï„Î¬Î»Î±Î²Î±"
  },
  {
    "lang": "en-gb",
    "HeaderConnectToServer": "Connect to Server",
    "LabelServerHost": "Server Address",
    "LabelServerHostHelp": "192.168.1.100:8096 or https://myserver.com",
    "Connect": "Connect",
    "HeaderConnectionFailure": "Connection Failure",
    "MessageUnableToConnectToServer": "We're unable to connect to the selected server right now. Please ensure it is running and try again.",
    "ButtonGotIt": "Got It"
  },
  {
    "lang": "en-us",
    "HeaderConnectToServer": "Connect to Server",
    "LabelServerHost": "Server Address",
    "LabelServerHostHelp": "192.168.1.100:8096 or https://myserver.com",
    "Connect": "Connect",
    "HeaderConnectionFailure": "Connection Failure",
    "MessageUnableToConnectToServer": "We're unable to connect to the selected server right now. Please ensure it is running and try again.",
    "ButtonGotIt": "Got It"
  },
  {
    "lang": "eo",
    "HeaderConnectToServer": "Konekti al Servilo",
    "LabelServerHost": "Gastigo",
    "LabelServerHostHelp": "192.168.1.100:8096 aÅ­ https://myserver.com",
    "Connect": "Konektu",
    "HeaderConnectionFailure": "Konekto Malsukcesis",
    "MessageUnableToConnectToServer": "Ni ne povas konektiÄi al la elektita servilo nun. Certigi, ke Äi funkcias kaj provi denove.",
    "ButtonGotIt": "Kompreneblas"
  },
  {
    "lang": "es-ar",
    "HeaderConnectToServer": "Conectar al servidor",
    "LabelServerHost": "Host",
    "LabelServerHostHelp": "192.168.1.100:8096 o https://miservidor.com",
    "Connect": "Conectar",
    "HeaderConnectionFailure": "ConexiÃ³n fallida",
    "MessageUnableToConnectToServer": "No podemos conectarnos al servidor seleccionado en este momento. AsegÃºrese de que se estÃ© ejecutando e intente nuevamente.",
    "ButtonGotIt": "Lo entendÃ­"
  },
  {
    "lang": "es-mx",
    "HeaderConnectToServer": "Conectarse al servidor",
    "LabelServerHost": "Servidor",
    "LabelServerHostHelp": "192.168.1.100:8096 o https://miservidor.com",
    "Connect": "Conectar",
    "HeaderConnectionFailure": "Falla de conexiÃ³n",
    "MessageUnableToConnectToServer": "No podemos conectarnos al servidor seleccionado en este momento. Por favor, asegÃºrate de que estÃ¡ funcionando e intÃ©ntalo de nuevo.",
    "ButtonGotIt": "Hecho"
  },
  {
    "lang": "es",
    "HeaderConnectToServer": "Conectar al servidor",
    "LabelServerHost": "Host",
    "LabelServerHostHelp": "192.168.1.100:8096 o https://miservidor.com",
    "Connect": "Conectar",
    "HeaderConnectionFailure": "Fallo de conexiÃ³n",
    "MessageUnableToConnectToServer": "No podemos conectar con el servidor seleccionado ahora mismo. Por favor, asegÃºrate de que esta funcionando e intÃ©ntalo otra vez.",
    "ButtonGotIt": "Entendido"
  },
  {
    "lang": "es_419",
    "HeaderConnectToServer": "Conectarse al servidor",
    "LabelServerHost": "Servidor",
    "LabelServerHostHelp": "192.168.1.100:8096 o https://miservidor.com",
    "Connect": "Conectar",
    "HeaderConnectionFailure": "Falla de conexiÃ³n",
    "MessageUnableToConnectToServer": "No podemos conectarnos al servidor seleccionado en este momento. Por favor, asegÃºrate de que estÃ¡ funcionando e intÃ©ntalo de nuevo.",
    "ButtonGotIt": "Hecho"
  },
  {
    "lang": "es_DO",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "et",
    "HeaderConnectToServer": "Ãœhendu serveriga",
    "LabelServerHost": "Peremeesmasin",
    "LabelServerHostHelp": "192.168.1.100:8096 vÃµi https://myserver.com",
    "Connect": "Ãœhenda",
    "HeaderConnectionFailure": "Ãœhenduse tÃµrge",
    "MessageUnableToConnectToServer": "Me ei saa praegu valitud serveriga Ã¼hendust. Veendu, et see tÃ¶Ã¶tab ja proovi uuesti.",
    "ButtonGotIt": "Selge"
  },
  {
    "lang": "eu",
    "HeaderConnectToServer": "Zerbitzariari konektatu",
    "LabelServerHost": "Host",
    "LabelServerHostHelp": "192.168.1.100: 8096 edo https://miservidor.com",
    "Connect": "Konektatu",
    "HeaderConnectionFailure": "Konexio-akatsa",
    "MessageUnableToConnectToServer": "Ezin dugu une honetan hautatutako zerbitzariarekin konektatu. Mesedez, ziurtatu funtzionatzen ari dela eta saiatu berriro.",
    "ButtonGotIt": "Ulertua"
  },
  {
    "lang": "fa",
    "HeaderConnectToServer": "Ø§ØªØµØ§Ù„ Ø¨Ù‡ Ø³Ø±ÙˆØ±",
    "LabelServerHost": "Ù…ÛŒØ²Ø¨Ø§Ù†",
    "LabelServerHostHelp": "192.168.1.100:8096 ÛŒØ§ https://myserver.com",
    "Connect": "Ø§ØªØµØ§Ù„",
    "HeaderConnectionFailure": "Ø¹Ø¯Ù… Ø§ØªØµØ§Ù„",
    "MessageUnableToConnectToServer": "",
    "ButtonGotIt": "Ù…ØªÙˆØ¬Ù‡ Ø´Ø¯Ù…"
  },
  {
    "lang": "fi",
    "HeaderConnectToServer": "YhdistÃ¤ palvelimeen",
    "LabelServerHost": "IsÃ¤ntÃ¤",
    "LabelServerHostHelp": "192.168.1.100:8096 tai https://myserver.com",
    "Connect": "YhdistÃ¤",
    "HeaderConnectionFailure": "Yhteys epÃ¤onnistui",
    "MessageUnableToConnectToServer": "Valittuun palvelimeen yhdistÃ¤minen epÃ¤onnistui. Tarkista, ettÃ¤ se on pÃ¤Ã¤llÃ¤ ja yritÃ¤ uudestaan.",
    "ButtonGotIt": "SelvÃ¤"
  },
  {
    "lang": "fil",
    "HeaderConnectToServer": "Kumonekta sa Server",
    "LabelServerHost": "Host",
    "LabelServerHostHelp": "192.168.1.100:8096 o https://myserver.com",
    "Connect": "Kumonekta",
    "HeaderConnectionFailure": "Nag-fail ang koneksyon",
    "MessageUnableToConnectToServer": "Hindi kami makakonekta sa napiling server sa ngayon. Pakitiyak na ito ay tumatakbo at subukang muli.",
    "ButtonGotIt": "Nakuha ko"
  },
  {
    "lang": "fo",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "fr-ca",
    "DiscoveredServers": "Serveurs détectés sur le réseau",
    "HeaderConnectToServer": "Connexion au serveur",
    "LabelServerHost": "HÃ´te",
    "LabelServerHostHelp": "192.168.1.100:8096 ou https://monserveur.com",
    "Connect": "Connexion",
    "HeaderConnectionFailure": "Ã‰chec de connexion",
    "MessageUnableToConnectToServer": "Impossible de se connecter au serveur sÃ©lectionnÃ©. Assurez-vous qu'il est opÃ©rationnel.",
    "ButtonGotIt": "J'ai compris"
  },
  {
    "lang": "fr",
    "DiscoveredServers": "Serveurs détectés sur le réseau",
    "HeaderConnectToServer": "Connexion au serveur",
    "LabelServerHost": "Nom d'hÃ´te",
    "LabelServerHostHelp": "192.168.1.1:8096 ou https://monserveur.com",
    "Connect": "Se connecter",
    "HeaderConnectionFailure": "Ã‰chec de connexion",
    "MessageUnableToConnectToServer": "Nous sommes dans l'impossibilitÃ© de nous connecter au serveur sÃ©lectionnÃ©. Veuillez vÃ©rifier qu'il est opÃ©rationnel et rÃ©essayez.",
    "ButtonGotIt": "Compris"
  },
  {
    "lang": "ga",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "gl",
    "HeaderConnectToServer": "Conectar ao Servidor",
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "Conectar",
    "HeaderConnectionFailure": "Fallo de ConexiÃ³n",
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "Entendo"
  },
  {
    "lang": "gsw",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "gu",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "he",
    "HeaderConnectToServer": "×”×ª×—×‘×¨ ×œ×©×¨×ª",
    "LabelServerHost": "×ž××¨×—",
    "LabelServerHostHelp": "192.168.1.100:8096 ××• https://myserver.com",
    "Connect": "×”×ª×—×‘×¨",
    "HeaderConnectionFailure": "×›×©×œ ×‘×—×™×‘×•×¨",
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "×”×‘× ×ª×™"
  },
  {
    "lang": "hi-in",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "à¤¸à¤®à¤ à¤—à¤¯à¤¾"
  },
  {
    "lang": "hr",
    "HeaderConnectToServer": "Spoji se na Server",
    "LabelServerHost": "DomaÄ‡in",
    "LabelServerHostHelp": "192.168.1.100:8096 ili https://myserver.com",
    "Connect": "Povezati",
    "HeaderConnectionFailure": "Neuspjelo spajanje",
    "MessageUnableToConnectToServer": "Nismo u moguÄ‡nosti spojiti se na odabrani posluÅ¾itelj. Provjerite dali je pokrenut i pokuÅ¡ajte ponovno.",
    "ButtonGotIt": "ShvaÄ‡am"
  },
  {
    "lang": "hu",
    "HeaderConnectToServer": "KapcsolÃ³dÃ¡s a Szerverhez",
    "LabelServerHost": "KiszolgÃ¡lÃ³",
    "LabelServerHostHelp": "192.168.1.100:8096 vagy https://myserver.com",
    "Connect": "KapcsolÃ³dÃ¡s",
    "HeaderConnectionFailure": "Kapcsolathiba",
    "MessageUnableToConnectToServer": "Jelenleg nem tudunk csatlakozni a kivÃ¡lasztott szerverhez. GyÅ‘zÅ‘dj meg rÃ³la, hogy fut Ã©s prÃ³bÃ¡ld meg Ãºjra.",
    "ButtonGotIt": "Ã‰rtettem"
  },
  {
    "lang": "hy",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": "192.168.1.100:8096 Õ¯Õ¡Õ´ https://myserver.com",
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "id",
    "HeaderConnectToServer": "Sambungkan ke server",
    "LabelServerHost": "Host",
    "LabelServerHostHelp": "192.168.1.100:8096 atau https://myserver.com",
    "Connect": "Sambung",
    "HeaderConnectionFailure": "Koneksi Bermasalah",
    "MessageUnableToConnectToServer": "Kami tidak dapat terhubung ke server yang dipilih sekarang. Harap pastikan itu berjalan dan coba lagi.",
    "ButtonGotIt": "Paham"
  },
  {
    "lang": "is-is",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "Tengjast",
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "SkiliÃ°"
  },
  {
    "lang": "it",
    "HeaderConnectToServer": "Connettersi al Server",
    "LabelServerHost": "Host",
    "LabelServerHostHelp": "192.168.1.100:8096 o https://myserver.com",
    "Connect": "Connetti",
    "HeaderConnectionFailure": "Errore di connessione",
    "MessageUnableToConnectToServer": "Non siamo in grado di connettersi al server selezionato al momento. Per favore assicurati che sia in esecuzione e riprova.",
    "ButtonGotIt": "Ho capito"
  },
  {
    "lang": "ja",
    "HeaderConnectToServer": "ã‚µãƒ¼ãƒãƒ¼ã«æŽ¥ç¶š",
    "LabelServerHost": "ãƒ›ã‚¹ãƒˆ",
    "LabelServerHostHelp": "192.168.1.100:8096 åˆã¯ https://myserver.com",
    "Connect": "æŽ¥ç¶š",
    "HeaderConnectionFailure": "æŽ¥ç¶šå¤±æ•—",
    "MessageUnableToConnectToServer": "ç¾åœ¨ã€é¸æŠžã•ã‚ŒãŸã‚µãƒ¼ãƒãƒ¼ã¸ã®æŽ¥ç¶šãŒã§ãã¾ã›ã‚“ã€‚ç¨¼åƒã—ã¦ã„ã‚‹ã“ã¨ã‚’ç¢ºèªã—ã‚‚ã†ä¸€åº¦ã‚„ã‚Šç›´ã—ã¦ãã ã•ã„ã€‚",
    "ButtonGotIt": "äº†è§£"
  },
  {
    "lang": "jbo",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "je'e"
  },
  {
    "lang": "ka",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "áƒ’áƒáƒ¡áƒáƒ’áƒ”áƒ‘áƒ˜áƒ"
  },
  {
    "lang": "kab",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "kk",
    "HeaderConnectToServer": "Serverge qosylu",
    "LabelServerHost": "TÃ¼iÄ±n",
    "LabelServerHostHelp": "192.168.1.100:8096 nemese https://myserver.com",
    "Connect": "Qosylu",
    "HeaderConnectionFailure": "Qosylu sÃ¤tsÄ±z",
    "MessageUnableToConnectToServer": "TaÃ±dalÄŸan serverge qosyluymyz dÃ¤l qazÄ±r mÃ¼mkÄ±n emes. BÅ«l Ä±ske qosylÄŸanyna kÃ¶z jetkÄ±zÄ±Ã±Ä±z jÃ¤ne Ã¤rekettÄ± keiÄ±n qaitalaÃ±yz.",
    "ButtonGotIt": "TÃ¼sÄ±nÄ±ktÄ±"
  },
  {
    "lang": "kn",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "ko",
    "HeaderConnectToServer": "ì„œë²„ ì ‘ì†",
    "LabelServerHost": "í˜¸ìŠ¤íŠ¸",
    "LabelServerHostHelp": "192.168.1.100:8096 ë˜ëŠ” https://myserver.com",
    "Connect": "ì ‘ì†",
    "HeaderConnectionFailure": "ì—°ê²° ì‹¤íŒ¨",
    "MessageUnableToConnectToServer": "ì„ íƒí•œ ì„œë²„ì— ì—°ê²°í•  ìˆ˜ ì—†ìŠµë‹ˆë‹¤. ì„œë²„ê°€ ì‹¤í–‰ ì¤‘ì¸ì§€ í™•ì¸í›„ ë‹¤ì‹œ ì‹œë„í•˜ì„¸ìš”.",
    "ButtonGotIt": "ì•Œê² ìŠµë‹ˆë‹¤"
  },
  {
    "lang": "kw",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "ky",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "lt-lt",
    "HeaderConnectToServer": "Prisijungti prie Serverio",
    "LabelServerHost": null,
    "LabelServerHostHelp": "192.168.1.100:8096 arba https://manoserveris.lt",
    "Connect": "Prisijungti",
    "HeaderConnectionFailure": "Prisijungimo klaida",
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "Supratau"
  },
  {
    "lang": "lv",
    "HeaderConnectToServer": "Pievienoties pie servera",
    "LabelServerHost": "Resursdators",
    "LabelServerHostHelp": "192.168.1.100:8096 vai https://myserver.com",
    "Connect": "Savienot",
    "HeaderConnectionFailure": "Savienojuma kÄ¼Å«da",
    "MessageUnableToConnectToServer": "MÄ“s paÅ¡laik nevaram sazinÄties ar izvÄ“lÄ“to serveri. PÄrliecinies ka tas strÄdÄ, un mÄ“Ä£ini vÄ“lreiz.",
    "ButtonGotIt": "Sapratu"
  },
  {
    "lang": "mg",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "mk",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "ÐŸÐ¾Ð²Ñ€Ð·Ð¸",
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "ÐŸÐ¾Ñ‚Ð²Ñ€Ð´ÑƒÐ²Ð°Ð¼"
  },
  {
    "lang": "ml",
    "HeaderConnectToServer": "à´¸àµ†àµ¼à´µà´±à´¿à´²àµ‡à´•àµà´•àµ à´•à´£à´•àµà´±àµà´±àµà´šàµ†à´¯àµà´¯àµà´•",
    "LabelServerHost": "à´¹àµ‹à´¸àµà´±àµà´±àµ",
    "LabelServerHostHelp": "192.168.1.100:8096 à´…à´²àµà´²àµ†à´™àµà´•à´¿àµ½ https://myserver.com",
    "Connect": "à´¬à´¨àµà´§à´¿à´ªàµà´ªà´¿à´•àµà´•àµà´•",
    "HeaderConnectionFailure": "à´•à´£à´•àµà´·àµ» à´ªà´°à´¾à´œà´¯à´‚",
    "MessageUnableToConnectToServer": "à´¤à´¿à´°à´žàµà´žàµ†à´Ÿàµà´¤àµà´¤ à´¸àµ†àµ¼à´µà´±à´¿à´²àµ‡à´•àµà´•àµ à´žà´™àµà´™àµ¾à´•àµà´•àµ à´‡à´ªàµà´ªàµ‹àµ¾ à´•à´£à´•àµà´±àµà´±àµà´šàµ†à´¯àµà´¯à´¾àµ» à´•à´´à´¿à´¯à´¿à´²àµà´².Â à´‡à´¤àµ à´ªàµà´°à´µàµ¼à´¤àµà´¤à´¿à´•àµà´•àµà´¨àµà´¨àµà´µàµ†à´¨àµà´¨àµ à´‰à´±à´ªàµà´ªà´¾à´•àµà´•à´¿ à´µàµ€à´£àµà´Ÿàµà´‚ à´¶àµà´°à´®à´¿à´•àµà´•àµà´•.",
    "ButtonGotIt": "à´®à´¨à´¸àµà´¸à´¿à´²à´¾à´¯à´¿"
  },
  {
    "lang": "mn",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "mr",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "à¤¸à¤®à¤œà¤²à¥‡"
  },
  {
    "lang": "ms",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "Sambung",
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "Terima"
  },
  {
    "lang": "mt",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "my",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "á€á€»á€­á€á€ºá€†á€€á€ºá€•á€«",
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "á€›á€•á€¼á€®"
  },
  {
    "lang": "nb",
    "HeaderConnectToServer": "Koble til server",
    "LabelServerHost": "Vertsnavn",
    "LabelServerHostHelp": "192.168.1.100:8096 eller https://minserver.no",
    "Connect": "Koble til",
    "HeaderConnectionFailure": "Tilkobling feilet",
    "MessageUnableToConnectToServer": "Vi klarte ikke Ã¥ koble til den valgte serveren akkurat nÃ¥. Vennligst sÃ¸rg for at den kjÃ¸rer og prÃ¸v pÃ¥ nytt.",
    "ButtonGotIt": "SkjÃ¸nner"
  },
  {
    "lang": "ne",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "nl",
    "HeaderConnectToServer": "Verbinden met server",
    "LabelServerHost": "Host",
    "LabelServerHostHelp": "192.168.1.100:8096 of https://mijnserver.nl",
    "Connect": "Verbinden",
    "HeaderConnectionFailure": "Verbindingsfout",
    "MessageUnableToConnectToServer": "Het is momenteel niet mogelijk met de geselecteerde server te verbinden. Controleer of deze draait en probeer het opnieuw.",
    "ButtonGotIt": "Begrepen"
  },
  {
    "lang": "nn",
    "HeaderConnectToServer": "Kople til tenar",
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "Kople til",
    "HeaderConnectionFailure": "Tilkoplingsfeil",
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "SkjÃ¸nner"
  },
  {
    "lang": "pa",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "à¨•à¨¨à©ˆà¨•à¨Ÿ à¨•à¨°à©‹",
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "pl",
    "HeaderConnectToServer": "PodÅ‚Ä…cz do serwera",
    "LabelServerHost": "Serwer",
    "LabelServerHostHelp": "192.168.1.100:8096 lub https://mojserwer.pl",
    "Connect": "PoÅ‚Ä…cz",
    "HeaderConnectionFailure": "Niepowodzenie poÅ‚Ä…czenia",
    "MessageUnableToConnectToServer": "PoÅ‚Ä…czenie z wybranym serwerem jest teraz niemoÅ¼liwe. Upewnij siÄ™, Å¼e jest uruchomiony i sprÃ³buj ponownie.",
    "ButtonGotIt": "Rozumiem"
  },
  {
    "lang": "pr",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "Aye-Aye"
  },
  {
    "lang": "pt-br",
    "HeaderConnectToServer": "Conectar ao Servidor",
    "LabelServerHost": "Servidor",
    "LabelServerHostHelp": "192.168.1.100:8096 ou https://meuservidor.com",
    "Connect": "Conectar",
    "HeaderConnectionFailure": "Falha na ConexÃ£o",
    "MessageUnableToConnectToServer": "NÃ£o foi possÃ­vel conectar ao servidor selecionado. Por favor, verifique se estÃ¡ sendo executado e tente novamente.",
    "ButtonGotIt": "Feito"
  },
  {
    "lang": "pt-pt",
    "HeaderConnectToServer": "Ligar ao servidor",
    "LabelServerHost": "Servidor",
    "LabelServerHostHelp": "192.168.1.100:8096 ou https://omeudominio.com",
    "Connect": "Ligar",
    "HeaderConnectionFailure": "Falha de ligaÃ§Ã£o",
    "MessageUnableToConnectToServer": "NÃ£o foi possÃ­vel estabelecer ligaÃ§Ã£o ao servidor. Por favor, certifique-se de que o servidor estÃ¡ a correr e tente de novo.",
    "ButtonGotIt": "Entendido"
  },
  {
    "lang": "pt",
    "HeaderConnectToServer": "Ligar ao Servidor",
    "LabelServerHost": "Servidor",
    "LabelServerHostHelp": "192.168.1.100:8096 ou https://omeudominio.com",
    "Connect": "Ligar",
    "HeaderConnectionFailure": "Falha de LigaÃ§Ã£o",
    "MessageUnableToConnectToServer": "NÃ£o foi possÃ­vel estabelecer ligaÃ§Ã£o ao servidor. Por favor, certifique-se que o servidor estÃ¡ a correr e tente de novo.",
    "ButtonGotIt": "Entendido"
  },
  {
    "lang": "ro",
    "HeaderConnectToServer": "ConectaÈ›i-vÄƒ la server",
    "LabelServerHost": "GazdÄƒ",
    "LabelServerHostHelp": "192.168.1.100:8096 sau https://myserver.com",
    "Connect": "Conectare",
    "HeaderConnectionFailure": "Conexiune eÈ™uatÄƒ",
    "MessageUnableToConnectToServer": "Nu putem sÄƒ ne conectÄƒm la serverul selectat Ã®n acest moment. VÄƒ rugÄƒm sÄƒ vÄƒ asiguraÈ›i cÄƒ funcÈ›ioneazÄƒ È™i Ã®ncercaÈ›i din nou.",
    "ButtonGotIt": "Am Ã®nÈ›eles"
  },
  {
    "lang": "ru",
    "HeaderConnectToServer": "Ð¡Ð¾ÐµÐ´Ð¸Ð½ÐµÐ½Ð¸Ðµ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼",
    "LabelServerHost": "Ð£Ð·ÐµÐ»",
    "LabelServerHostHelp": "192.168.1.100:8096 Ð¸Ð»Ð¸ https://myserver.com",
    "Connect": "Ð¡Ð¾ÐµÐ´Ð¸Ð½Ð¸Ñ‚ÑŒÑÑ",
    "HeaderConnectionFailure": "Ð¡Ð±Ð¾Ð¹ ÑÐ¾ÐµÐ´Ð¸Ð½ÐµÐ½Ð¸Ñ",
    "MessageUnableToConnectToServer": "ÐœÑ‹ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÐ¼ Ð¿Ð¾Ð´ÑÐ¾ÐµÐ´Ð¸Ð½Ð¸Ñ‚ÑŒÑÑ Ðº Ð²Ñ‹Ð±Ñ€Ð°Ð½Ð½Ð¾Ð¼Ñƒ ÑÐµÑ€Ð²ÐµÑ€Ñƒ Ð² Ð´Ð°Ð½Ð½Ñ‹Ð¹ Ð¼Ð¾Ð¼ÐµÐ½Ñ‚. Ð£Ð±ÐµÐ´Ð¸Ñ‚ÐµÑÑŒ, Ñ‡Ñ‚Ð¾ Ð¾Ð½ Ð·Ð°Ð¿ÑƒÑ‰ÐµÐ½ Ð¸ Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€Ð¸Ñ‚Ðµ Ð¿Ð¾Ð¿Ñ‹Ñ‚ÐºÑƒ.",
    "ButtonGotIt": "ÐŸÐ¾Ð½ÑÑ‚Ð½Ð¾"
  },
  {
    "lang": "si",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "sk",
    "HeaderConnectToServer": "PripojiÅ¥ sa k serveru",
    "LabelServerHost": "HosÅ¥",
    "LabelServerHostHelp": "192.168.1.100:8096 alebo https://mojserver.sk",
    "Connect": "PripojiÅ¥",
    "HeaderConnectionFailure": "Pripojenie zlyhalo",
    "MessageUnableToConnectToServer": "Nie sme schopnÃ½ sa aktuÃ¡lne pripojiÅ¥ k vybranÃ©mu serveru. ProsÃ­m, uistite sa, Å¾e je spustenÃ½ a skÃºste to znovu.",
    "ButtonGotIt": "Rozumiem"
  },
  {
    "lang": "sl-si",
    "HeaderConnectToServer": "PoveÅ¾i s streÅ¾nikom",
    "LabelServerHost": "Naslov streÅ¾nika",
    "LabelServerHostHelp": "192.168.1.100:8096 ali https://myserver.com",
    "Connect": "PoveÅ¾i",
    "HeaderConnectionFailure": "Napaka povezave",
    "MessageUnableToConnectToServer": "Povezava s streÅ¾nikom trenutno ni mogoÄa. Preverite, da je streÅ¾nik zagnan in poskusite ponovno.",
    "ButtonGotIt": "Razumem"
  },
  {
    "lang": "so",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "sq",
    "HeaderConnectToServer": "Lidhuni me serverin",
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "Lidhu",
    "HeaderConnectionFailure": "DÃ«shtim nÃ« lidhje",
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "Kuptova"
  },
  {
    "lang": "sr",
    "HeaderConnectToServer": "ÐŸÐ¾Ð²ÐµÐ¶Ð¸ ÑÐµ ÑÐ° ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼",
    "LabelServerHost": "Ð”Ð¾Ð¼Ð°Ñ›Ð¸Ð½",
    "LabelServerHostHelp": "192.168.1.100:8096 Ð¸Ð»Ð¸ https://myserver.com",
    "Connect": "ÐŸÐ¾Ð²ÐµÐ¶Ð¸",
    "HeaderConnectionFailure": "Ð¡Ð¿Ð°Ñ˜Ð°ÑšÐµ Ð½ÐµÑƒÑÐ¿ÐµÑˆÐ½Ð¾",
    "MessageUnableToConnectToServer": "Ð¢Ñ€ÐµÐ½ÑƒÑ‚Ð½Ð¾ Ð½Ð¸ÑÐ¼Ð¾ Ñƒ Ð¼Ð¾Ð³ÑƒÑ›Ð½Ð¾ÑÑ‚Ð¸ Ð´Ð° ÑÐµ Ð¿Ð¾Ð²ÐµÐ¶ÐµÐ¼Ð¾ ÑÐ° Ð¸Ð·Ð°Ð±Ñ€Ð°Ð½Ð¸Ð¼ ÑÐµÑ€Ð²ÐµÑ€Ð¾Ð¼. Ð£Ð²ÐµÑ€Ð¸Ñ‚Ðµ ÑÐµ Ð´Ð° Ñ˜Ðµ Ð¿Ð¾ÐºÑ€ÐµÐ½ÑƒÑ‚ Ð¸ Ð¿Ð¾ÐºÑƒÑˆÐ°Ñ˜Ñ‚Ðµ Ð¿Ð¾Ð½Ð¾Ð²Ð¾.",
    "ButtonGotIt": "Ð£ Ñ€ÐµÐ´Ñƒ"
  },
  {
    "lang": "sv",
    "HeaderConnectToServer": "Anslut till server",
    "LabelServerHost": "VÃ¤rd",
    "LabelServerHostHelp": "192.168.1.100:8096 eller https://min.server.com",
    "Connect": "Anslut",
    "HeaderConnectionFailure": "Misslyckad anslutning",
    "MessageUnableToConnectToServer": "Vi kunde inte upprÃ¤tta en anslutning till vald server just nu. FÃ¶rsÃ¤kra dig om att den Ã¤r pÃ¥slagen och fÃ¶rsÃ¶k igen.",
    "ButtonGotIt": "Ok"
  },
  {
    "lang": "ta",
    "HeaderConnectToServer": "à®šà¯‡à®µà¯ˆà®¯à®•à®¤à¯à®¤à¯à®Ÿà®©à¯ à®‡à®£à¯ˆà®•à¯à®•à®µà¯à®®à¯",
    "LabelServerHost": "à®¤à¯Šà®•à¯à®ªà¯à®ªà®¾à®³à®°à¯",
    "LabelServerHostHelp": "192.168.1.100:8096 or https://myserver.com",
    "Connect": "à®‡à®£à¯ˆà®•à¯à®•à®µà¯à®®à¯",
    "HeaderConnectionFailure": "à®‡à®£à¯ˆà®ªà¯à®ªà¯ à®¤à¯‹à®²à¯à®µà®¿",
    "MessageUnableToConnectToServer": "à®¤à¯‡à®°à¯à®¨à¯à®¤à¯†à®Ÿà¯à®•à¯à®•à®ªà¯à®ªà®Ÿà¯à®Ÿ à®šà¯‡à®µà¯ˆà®¯à®•à®¤à¯à®¤à¯à®Ÿà®©à¯ à®‡à®ªà¯à®ªà¯‹à®¤à¯ à®Žà®™à¯à®•à®³à®¾à®²à¯ à®‡à®£à¯ˆà®•à¯à®• à®®à¯à®Ÿà®¿à®¯à®µà®¿à®²à¯à®²à¯ˆ. à®‡à®¤à¯ à®‡à®¯à®™à¯à®•à¯à®µà®¤à¯ˆ à®‰à®±à¯à®¤à®¿à®šà¯†à®¯à¯à®¤à¯ à®®à¯€à®£à¯à®Ÿà¯à®®à¯ à®®à¯à®¯à®±à¯à®šà®¿à®•à¯à®•à®µà¯à®®à¯.",
    "ButtonGotIt": "à®…à®±à®¿à®¨à¯à®¤à¯à®•à¯Šà®£à¯à®Ÿà¯‡à®©à¯"
  },
  {
    "lang": "te",
    "HeaderConnectToServer": "à°¸à°°à±à°µà°°à±â€Œà°•à± à°•à°¨à±†à°•à±à°Ÿà± à°…à°µà±à°µà°‚à°¡à°¿",
    "LabelServerHost": "à°¹à±‹à°¸à±à°Ÿà±",
    "LabelServerHostHelp": "192.168.1.100:8096 à°²à±‡à°¦à°¾ https://myserver.com",
    "Connect": "à°•à°¨à±†à°•à±à°Ÿà± à°šà±‡à°¯à°‚à°¡à°¿",
    "HeaderConnectionFailure": "à°•à°¨à±†à°•à±à°·à°¨à± à°µà±ˆà°«à°²à±à°¯à°‚",
    "MessageUnableToConnectToServer": "à°®à±‡à°®à± à°ªà±à°°à°¸à±à°¤à±à°¤à°‚ à°Žà°‚à°šà±à°•à±à°¨à±à°¨ à°¸à°°à±à°µà°°à±â€Œà°•à± à°•à°¨à±†à°•à±à°Ÿà± à°šà±‡à°¯à°²à±‡à°•à°ªà±‹à°¯à°¾à°®à±. à°¦à°¯à°šà±‡à°¸à°¿ à°‡à°¦à°¿ à°¨à°¡à±à°¸à±à°¤à±à°¨à±à°¨à°Ÿà±à°²à± à°¨à°¿à°°à±à°§à°¾à°°à°¿à°‚à°šà±à°•à±‹à°‚à°¡à°¿ à°®à°°à°¿à°¯à± à°®à°³à±à°²à±€ à°ªà±à°°à°¯à°¤à±à°¨à°¿à°‚à°šà°‚à°¡à°¿.",
    "ButtonGotIt": "à°¦à±Šà°°à°¿à°•à°¿à°‚à°¦à°¿"
  },
  {
    "lang": "th",
    "HeaderConnectToServer": "à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸•à¹ˆà¸­à¹€à¸‹à¸´à¸Ÿà¹€à¸§à¸­à¸£à¹Œ",
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸•à¹ˆà¸­",
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "tr",
    "HeaderConnectToServer": "Sunucuya BaÄŸlan",
    "LabelServerHost": "Ana Bilgisayar",
    "LabelServerHostHelp": "192.168.1.100:8096 veya https://sunucum.com",
    "Connect": "BaÄŸlan",
    "HeaderConnectionFailure": "BaÄŸlantÄ± HatasÄ±",
    "MessageUnableToConnectToServer": "SeÃ§ilen sunucuya ÅŸu anda baÄŸlanamÄ±yoruz. LÃ¼tfen sunucunun Ã§alÄ±ÅŸtÄ±ÄŸÄ±ndan emin olun ve tekrar deneyin.",
    "ButtonGotIt": "AnlaÅŸÄ±ldÄ±"
  },
  {
    "lang": "ug",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": null,
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  },
  {
    "lang": "uk",
    "HeaderConnectToServer": "ÐŸÑ–Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð½Ñ Ð´Ð¾ ÑÐµÑ€Ð²ÐµÑ€Ð°",
    "LabelServerHost": "Ð¥Ð¾ÑÑ‚",
    "LabelServerHostHelp": "192.168.1.100:8096 Ð°Ð±Ð¾ https://myserver.com",
    "Connect": "ÐŸÑ–Ð´ÐºÐ»ÑŽÑ‡Ð¸Ñ‚Ð¸ÑÑŒ",
    "HeaderConnectionFailure": "ÐŸÐ¾Ð¼Ð¸Ð»ÐºÐ° Ð¿Ñ–Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð½Ñ",
    "MessageUnableToConnectToServer": "ÐÐ°Ñ€Ð°Ð·Ñ– Ð½ÐµÐ¼Ð¾Ð¶Ð»Ð¸Ð²Ð¾ Ð¿Ñ–Ð´ÐºÐ»ÑŽÑ‡Ð¸Ñ‚Ð¸ÑÑ Ð´Ð¾ Ð¾Ð±Ñ€Ð°Ð½Ð¾Ð³Ð¾ ÑÐµÑ€Ð²ÐµÑ€Ð°. Ð‘ÑƒÐ´ÑŒ Ð»Ð°ÑÐºÐ°, Ð¿ÐµÑ€ÐµÐºÐ¾Ð½Ð°Ð¹Ñ‚ÐµÑÑ, Ñ‰Ð¾ Ð²Ñ–Ð½ Ð·Ð°Ð¿ÑƒÑ‰ÐµÐ½Ð¸Ð¹ Ñ– ÑÐ¿Ñ€Ð¾Ð±ÑƒÐ¹Ñ‚Ðµ Ñ‰Ðµ Ñ€Ð°Ð·.",
    "ButtonGotIt": "Ð—Ñ€Ð¾Ð·ÑƒÐ¼Ñ–Ð»Ð¾"
  },
  {
    "lang": "ur_PK",
    "HeaderConnectToServer": "Ø³Ø±ÙˆØ± Ø³Û’ Ø¬Ú‘ÛŒÚº",
    "LabelServerHost": "Ù…ÛŒØ²Ø¨Ø§Ù†",
    "LabelServerHostHelp": "192.168.1.100:8096 ÛŒØ§ https://myserver.com",
    "Connect": "Ø¬Ú‘ÛŒÚº",
    "HeaderConnectionFailure": "Ú©Ù†Ú©Ø´Ù† Ú©ÛŒ Ù†Ø§Ú©Ø§Ù…ÛŒ",
    "MessageUnableToConnectToServer": "ÛÙ… Ø§Ø¨Ú¾ÛŒ Ù…Ù†ØªØ®Ø¨ Ø³Ø±ÙˆØ± Ø³Û’ Ø±Ø§Ø¨Ø·Û Ù‚Ø§Ø¦Ù… Ú©Ø±Ù†Û’ Ø³Û’ Ù‚Ø§ØµØ± ÛÛŒÚºÛ” Ø¨Ø±Ø§Û Ú©Ø±Ù… ÛŒÙ‚ÛŒÙ†ÛŒ Ø¨Ù†Ø§Ø¦ÛŒÚº Ú©Û ÛŒÛ Ú†Ù„ Ø±ÛØ§ ÛÛ’ Ø§ÙˆØ± Ø¯ÙˆØ¨Ø§Ø±Û Ú©ÙˆØ´Ø´ Ú©Ø±ÛŒÚºÛ”",
    "ButtonGotIt": "ÛŒÛ Ù…Ù„ Ú¯ÛŒØ§"
  },
  {
    "lang": "uz",
    "HeaderConnectToServer": "Serverga ulanish",
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "Ulanish",
    "HeaderConnectionFailure": "Ulanish muvaffaqiyatsiz tugadi",
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": "Tushunarli"
  },
  {
    "lang": "vi",
    "HeaderConnectToServer": "Káº¿t Ná»‘i Äáº¿n MÃ¡y Chá»§",
    "LabelServerHost": "MÃ¡y chá»§",
    "LabelServerHostHelp": "192.168.1.100:8096 hoáº·c https://myserver.com",
    "Connect": "Káº¿t ná»‘i",
    "HeaderConnectionFailure": "Káº¿ Ná»‘i Tháº¥t Báº¡i",
    "MessageUnableToConnectToServer": "ChÃºng tÃ´i khÃ´ng thá»ƒ káº¿t ná»‘i vá»›i mÃ¡y chá»§ Ä‘Ã£ chá»n ngay bÃ¢y giá». HÃ£y Ä‘áº£m báº£o ráº±ng nÃ³ Ä‘ang cháº¡y vÃ  thá»­ láº¡i.",
    "ButtonGotIt": "Hiá»ƒu rá»“i"
  },
  {
    "lang": "zh-cn",
    "HeaderConnectToServer": "è¿žæŽ¥åˆ°æœåŠ¡å™¨",
    "LabelServerHost": "ä¸»æœº",
    "LabelServerHostHelp": "192.168.1.100:8096 æˆ– https://myserver.com",
    "Connect": "è¿žæŽ¥",
    "HeaderConnectionFailure": "è¿žæŽ¥å¤±è´¥",
    "MessageUnableToConnectToServer": "çŽ°åœ¨æ— æ³•è¿žæŽ¥æ‰€é€‰æ‹©çš„æœåŠ¡å™¨ï¼Œè¯·ç¡®ä¿è¯¥æœåŠ¡å™¨ç›®å‰æ­£åœ¨è¿è¡Œã€‚",
    "ButtonGotIt": "çŸ¥é“äº†"
  },
  {
    "lang": "zh-hk",
    "HeaderConnectToServer": "é€£æŽ¥è‡³ä¼ºæœå™¨",
    "LabelServerHost": "ä¸»æ©Ÿ",
    "LabelServerHostHelp": "192.168.1.100:8096 æˆ–æ˜¯ https://myserver.com",
    "Connect": "é€£æŽ¥",
    "HeaderConnectionFailure": "é€£æŽ¥å¤±æ•—",
    "MessageUnableToConnectToServer": "ç„¡æ³•é€£æŽ¥åˆ°æ‰€é¸çš„ä¼ºæœå™¨ï¼Œè«‹å…ˆæª¢æŸ¥ä¼ºæœå™¨çš„é‹ä½œæƒ…æ³ã€‚",
    "ButtonGotIt": "äº†è§£"
  },
  {
    "lang": "zh-tw",
    "HeaderConnectToServer": "é€£æŽ¥è‡³ä¼ºæœå™¨",
    "LabelServerHost": "ä¸»æ©Ÿ",
    "LabelServerHostHelp": "192.168.1.100:8096 æˆ–æ˜¯ https://myserver.com",
    "Connect": "é€£ç·š",
    "HeaderConnectionFailure": "é€£æŽ¥å¤±æ•—",
    "MessageUnableToConnectToServer": "ç„¡æ³•é€£ä¸Šæ‰€é¸çš„ä¼ºæœå™¨ï¼Œè«‹ç¢ºä¿ä¼ºæœå™¨æ­£åœ¨é‹ä½œä¸­ã€‚",
    "ButtonGotIt": "æˆ‘çŸ¥é“äº†"
  },
  {
    "lang": "zu",
    "HeaderConnectToServer": null,
    "LabelServerHost": null,
    "LabelServerHostHelp": null,
    "Connect": "Xhuma",
    "HeaderConnectionFailure": null,
    "MessageUnableToConnectToServer": null,
    "ButtonGotIt": null
  }
]
;

const fallbackLanguage = 'en-us';

function getDefaultLanguage() {
  if (navigator.language) {
      return navigator.language;
  }
  if (navigator.userLanguage) {
      return navigator.userLanguage;
  }
  if (navigator.languages && navigator.languages.length) {
      return navigator.languages[0];
  }

  return fallbackLanguage;
}

let language = getDefaultLanguage().toLowerCase();

if (!languages.find(l => l.lang === language)) {
  language = language.split('-')[0];
}

if (!languages.find(l => l.lang === language)) {
  language = fallbackLanguage;
}

const languageStrings = languages.find(l => l.lang === language);
const fallbackStrings = languages.find(l => l.lang === fallbackLanguage);

const titleText = languageStrings.LabelServerHost || fallbackStrings.LabelServerHost || 'Server Address';
const connectText = languageStrings.Connect || fallbackStrings.Connect;

const headerConnectionFailureText = languageStrings.HeaderConnectionFailure || fallbackStrings.HeaderConnectionFailure;
const messageUnableToConnectToServerText = languageStrings.MessageUnableToConnectToServer || fallbackStrings.MessageUnableToConnectToServer;
const buttonGotItText = languageStrings.ButtonGotIt || fallbackStrings.ButtonGotIt;

document.getElementById('title').innerText = titleText;
document.getElementById('title').setAttribute('data-original-text', titleText);
document.getElementById('address').placeholder = languageStrings.LabelServerHostHelp || fallbackStrings.LabelServerHostHelp;
document.getElementById('connect-button').innerText = connectText;
document.getElementById('connect-button').setAttribute('data-original-text', connectText);
window.cancelButtonText = 'Cancel';
