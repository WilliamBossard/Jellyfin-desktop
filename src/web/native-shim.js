(function() {
    console.debug('[Media] Installing native shim...');

    const _savedSettings = JSON.parse('__SETTINGS_JSON__');
    window._isFullscreen = _savedSettings.initialFullscreen || false;
    window._userFullscreen = _savedSettings.initialFullscreen || false;

    document.addEventListener('fullscreenchange', () => {
        const fullscreen = !!document.fullscreenElement;
        if (window._isFullscreen === fullscreen) return;
        window._isFullscreen = fullscreen;
        console.log('[Media] Fullscreen changed:', fullscreen);
        const player = window._mpvVideoPlayerInstance;
        if (player && player.events) {
            player.events.trigger(player, 'fullscreenchange');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F11') {
            e.preventDefault();
            window._userFullscreen = !window._isFullscreen;
            window.jmpNative.toggleFullscreen();
        }
        if (e.key === 'Escape' && window._isFullscreen) {
            window.jmpNative.toggleFullscreen();
        }
    });

    (function() {
        let lastTime = 0, lastX = 0, lastY = 0;
        document.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || !e.target.classList.contains("mainAnimatedPage")) return;
            const now = Date.now();
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            if ((now - lastTime) < 500 && (dx * dx + dy * dy) < 25) {
                if (document.querySelector('.videoPlayerContainer')) {
                    if (window.jmpNative) window.jmpNative.toggleFullscreen();
                }
                lastTime = 0;
            } else {
                lastTime = now;
                lastX = e.clientX;
                lastY = e.clientY;
            }
        }, true);  // capture phase — before jellyfin-web can stopPropagation
    })();

    window._bufferedRanges = [];
    window._nativeUpdateBufferedRanges = function(ranges) {
        window._bufferedRanges = ranges || [];
    };

    function createSignal(name) {
        const callbacks = [];
        const signal = function(...args) {
            for (const cb of callbacks) {
                try { cb(...args); } catch(e) { console.error('[Media] [Signal] ' + name + ' error:', e); }
            }
        };
        signal.connect = (cb) => {
            callbacks.push(cb);
            console.debug('[Media] [Signal] ' + name + ' connected, now has', callbacks.length, 'listeners');
        };
        signal.disconnect = (cb) => {
            const idx = callbacks.indexOf(cb);
            if (idx >= 0) callbacks.splice(idx, 1);
            console.debug('[Media] [Signal] ' + name + ' disconnected, now has', callbacks.length, 'listeners');
        };
        return signal;
    }

    
    const _i18n = {
        fr: {
            playbackSection: 'Lecture',
            audioSection: 'Audio',
            transcodeSection: 'Transcodage',
            advancedSection: 'Avancé',
            hwdecName: 'Décodage matériel',
            hwdecHelp: 'Mode de décodage vidéo matériel. Utilisez "auto" pour une détection automatique ou "no" pour désactiver.',
            audioPassthroughName: 'Passthrough Audio',
            audioPassthroughHelp: 'Liste séparée par des virgules de codecs à transmettre au périphérique audio (ex: ac3,eac3,dts-hd,truehd). Laissez vide pour désactiver.',
            audioExclusiveName: 'Sortie Audio Exclusive',
            audioExclusiveHelp: 'Prendre le contrôle exclusif du périphérique audio. Peut réduire la latence mais empêche les autres applications d\'émettre du son.',
            audioChannelsName: 'Disposition des canaux audio',
            audioChannelsHelp: 'Forcer une disposition spécifique. Laissez vide pour une détection automatique.',
            auto: 'Auto',
            stereo: 'Stéréo',
            surround51: '5.1 Surround',
            surround71: '7.1 Surround',
            audioLanguageName: 'Langues audio préférées',
            audioLanguageHelp: 'Liste séparée par des virgules de codes de langues (ex: ja,en,fr).',
            forceTranscodeName: 'Forcer le transcodage',
            forceTranscodeHelp: 'Toujours demander un flux transcodé au serveur, même si la lecture directe est possible.',
            transparentTitlebarName: 'Barre de titre transparente',
            transparentTitlebarHelp: 'Superposer les boutons de fenêtre sur le contenu au lieu d\'une barre séparée. Nécessite un redémarrage.',
            windowDecorationsName: 'Décorations de fenêtre',
            windowDecorationsHelp: 'Apparence de la barre de titre. Nécessite un redémarrage.',
            hideScrollbarName: 'Masquer la barre de défilement',
            hideScrollbarHelp: 'Masque les barres de défilement de l\'application. Le défilement avec la molette ou le clavier fonctionne toujours. Nécessite un redémarrage.',
            deviceNameName: 'Nom de l\'appareil',
            deviceNameHelp: 'Identifie cet appareil auprès du serveur. Laissez vide pour utiliser le nom d\'hôte du système.',
            uiZoomName: 'Zoom de l\'interface',
            uiZoomHelp: 'Mise à l\'échelle de l\'interface pour une utilisation HTPC ou TV.',
            systemServer: 'Système (côté serveur)',
            systemThemed: 'Système, avec thème (KDE)',
            clientSide: 'Côté client (Bordure personnalisée)'
        },
        en: {
            playbackSection: 'Playback',
            audioSection: 'Audio',
            transcodeSection: 'Transcode',
            advancedSection: 'Advanced',
            hwdecName: 'Hardware Decoding',
            hwdecHelp: 'Hardware video decoding mode. Use "auto" for automatic detection or "no" to disable.',
            audioPassthroughName: 'Audio Passthrough',
            audioPassthroughHelp: 'Comma-separated list of codecs to pass through to the audio device (e.g. ac3,eac3,dts-hd,truehd). Leave empty to disable.',
            audioExclusiveName: 'Exclusive Audio Output',
            audioExclusiveHelp: 'Take exclusive control of the audio device during playback. May reduce latency but prevents other apps from playing audio.',
            audioChannelsName: 'Audio Channel Layout',
            audioChannelsHelp: 'Force a specific channel layout. Leave empty for auto-detection.',
            auto: 'Auto',
            stereo: 'Stereo',
            surround51: '5.1 Surround',
            surround71: '7.1 Surround',
            audioLanguageName: 'Preferred Audio Languages',
            audioLanguageHelp: 'Comma-separated list of audio language codes (e.g. ja,en,fr).',
            forceTranscodeName: 'Force Transcoding',
            forceTranscodeHelp: 'Always request a transcoded stream from the server, even when direct play would work.',
            transparentTitlebarName: 'Transparent Titlebar',
            transparentTitlebarHelp: 'Overlay traffic light buttons on the window content instead of a separate titlebar. Requires restart.',
            windowDecorationsName: 'Window Decorations',
            windowDecorationsHelp: 'How the window titlebar is drawn. Changing requires restart.',
            hideScrollbarName: 'Hide Scrollbar',
            hideScrollbarHelp: 'Hide scrollbars throughout the app. Scrolling with the wheel, trackpad, and keyboard still works. Requires restart.',
            deviceNameName: 'Device Name',
            deviceNameHelp: 'Identifies this machine to the server. Leave blank to use the system hostname.',
            uiZoomName: 'Interface Zoom',
            uiZoomHelp: 'Scale the UI for HTPC or TV mode usage.',
            systemServer: 'System (server-side)',
            systemThemed: 'System, themed (KDE)',
            clientSide: 'Client-side (Custom Border)'
        }
    };
    
    function t(key) {
        let lang = 'en';
        try {
            if (window.ApiClient && typeof window.ApiClient.language === 'function') {
                lang = window.ApiClient.language();
            } else if (window.ApiClient && typeof window.ApiClient.language === 'string') {
                lang = window.ApiClient.language;
            } else {
                lang = document.documentElement.lang || window.localStorage.getItem('displaylanguage') || window.localStorage.getItem('displayLanguage') || window.localStorage.getItem('language') || navigator.language || 'en';
            }
        } catch (e) {
            lang = navigator.language || 'en';
        }
        lang = lang.toLowerCase();
        
        if (lang.startsWith('fr')) return _i18n.fr[key] || _i18n.en[key];
        return _i18n.en[key] || key;
    }

    const applyZoom = () => { if (document.documentElement) document.documentElement.style.zoom = _savedSettings.uiZoom || '1.0'; };
    if (document.documentElement) applyZoom(); else document.addEventListener('DOMContentLoaded', applyZoom);
    
    if (!localStorage.getItem('displaylanguage') || localStorage.getItem('displaylanguage') === 'auto') {
        localStorage.setItem('displaylanguage', _savedSettings.sysLocale || 'auto');
    }

    window.jmpInfo = {
        version: '__APP_VERSION__',
        deviceName: _savedSettings.deviceName || _savedSettings.deviceNameDefault,
        mode: 'desktop',
        userAgent: navigator.userAgent,
        scriptPath: '',
        sections: [
            { key: 'playback', get name() { return t('playbackSection'); }, order: 0 },
            { key: 'audio', get name() { return t('audioSection'); }, order: 1 },
            { key: 'transcode', get name() { return t('transcodeSection'); }, order: 2 },
            { key: 'advanced', get name() { return t('advancedSection'); }, order: 3 }
        ],
        settings: {
            main: { enableMPV: true, fullscreen: false },
            playback: {
                hwdec: _savedSettings.hwdec || 'auto',
                audioPassthrough: _savedSettings.audioPassthrough || '',
                audioExclusive: _savedSettings.audioExclusive || false,
                audioChannels: _savedSettings.audioChannels || '',
                audioLanguage: _savedSettings.audioLanguage || ''
            },
            transcode: {
                forceTranscoding: !!_savedSettings.forceTranscoding
            },
            advanced: {
                transparentTitlebar: _savedSettings.transparentTitlebar !== false,
                windowDecorations: __WINDOW_DECORATIONS__,
                hideScrollbar: _savedSettings.hideScrollbar !== false,
                logLevel: _savedSettings.logLevel || '',
                deviceName: _savedSettings.deviceName || ''
            }
        },
        settingsDescriptions: {
            playback: [
                { key: 'hwdec', get displayName() { return t('hwdecName'); }, get help() { return t('hwdecHelp'); }, options: _savedSettings.hwdecOptions },
                { key: 'audioPassthrough', get displayName() { return t('audioPassthroughName'); }, get help() { return t('audioPassthroughHelp'); }, inputType: 'textarea' },
                { key: 'audioExclusive', get displayName() { return t('audioExclusiveName'); }, get help() { return t('audioExclusiveHelp'); } },
                { key: 'audioChannels', get displayName() { return t('audioChannelsName'); }, get help() { return t('audioChannelsHelp'); }, options: [
                    { value: '', get title() { return t('auto'); } },
                    { value: 'stereo', get title() { return t('stereo'); } },
                    { value: '5.1', get title() { return t('surround51'); } },
                    { value: '7.1', get title() { return t('surround71'); } }
                ] },
                { key: 'audioLanguage', get displayName() { return t('audioLanguageName'); }, get help() { return t('audioLanguageHelp'); }, inputType: 'text', maxLength: 128 }
            ],
            transcode: [
                { key: 'forceTranscoding', get displayName() { return t('forceTranscodeName'); }, get help() { return t('forceTranscodeHelp'); } }
            ],
            advanced: [
                { key: 'hideScrollbar', get displayName() { return t('hideScrollbarName'); }, get help() { return t('hideScrollbarHelp'); } },
                { key: 'deviceName', get displayName() { return t('deviceNameName'); }, get help() { return t('deviceNameHelp'); }, inputType: 'text', maxLength: 64, placeholder: _savedSettings.deviceNameDefault },
                { key: 'uiZoom', get displayName() { return t('uiZoomName'); }, get help() { return t('uiZoomHelp'); }, options: [
                    { value: '0.5', title: '50%' },
                    { value: '0.75', title: '75%' },
                    { value: '1.0', title: '100% (Default)' },
                    { value: '1.25', title: '125%' },
                    { value: '1.5', title: '150%' },
                    { value: '2.0', title: '200%' }
                ] },
                { key: 'logLevel', displayName: 'Log Level', help: 'Set the application log verbosity level.', options: [
                    { value: '', title: 'Default (Info)' },
                    { value: 'verbose', title: 'Verbose' },
                    { value: 'debug', title: 'Debug' },
                    { value: 'warn', title: 'Warning' },
                    { value: 'error', title: 'Error' }
                ]}
            ]
        },
        settingsUpdate: [],
        settingsDescriptionsUpdate: []
    };

    if (navigator.platform.startsWith('Mac')) {
        jmpInfo.settingsDescriptions.advanced.unshift({
            key: 'transparentTitlebar',
            get displayName() { return t('transparentTitlebarName'); },
            get help() { return t('transparentTitlebarHelp'); }
        });
    }

    const decorationValues = __WINDOW_DECORATION_OPTIONS__;
    if (decorationValues.length > 1) {
        const decorationTitles = {
            get csd() { return t('clientSide'); },
            get server() { return t('systemServer'); },
            get serverThemed() { return t('systemThemed'); }
        };
        jmpInfo.settingsDescriptions.advanced.unshift({
            key: 'windowDecorations',
            get displayName() { return t('windowDecorationsName'); },
            get help() { return t('windowDecorationsHelp'); },
            options: [
                { value: null, get title() { return t('auto'); } },
                ...decorationValues.map((value) => ({ value, title: decorationTitles[value] || value }))
            ]
        });
    }

    const playerState = {
        position: 0,
        duration: 0,
        volume: 100,
        muted: false,
        paused: false
    };

    window.api = {
        player: {
            playing: createSignal('playing'),
            paused: createSignal('paused'),
            finished: createSignal('finished'),
            stopped: createSignal('stopped'),
            canceled: createSignal('canceled'),
            error: createSignal('error'),
            buffering: createSignal('buffering'),
            seeking: createSignal('seeking'),
            positionUpdate: createSignal('positionUpdate'),
            updateDuration: createSignal('updateDuration'),
            stateChanged: createSignal('stateChanged'),
            videoPlaybackActive: createSignal('videoPlaybackActive'),
            windowVisible: createSignal('windowVisible'),
            onVideoRecangleChanged: createSignal('onVideoRecangleChanged'),
            onMetaData: createSignal('onMetaData'),

            load(url, options, streamdata, videoStream, audioStream, subtitleStream, externalAudioUrl, externalSubUrl, callback) {
                console.debug('[Media] player.load:', url);
                if (callback) {
                    const onPlaying = () => {
                        this.playing.disconnect(onPlaying);
                        this.error.disconnect(onError);
                        callback();
                    };
                    const onError = () => {
                        this.playing.disconnect(onPlaying);
                        this.error.disconnect(onError);
                        callback();
                    };
                    this.playing.connect(onPlaying);
                    this.error.connect(onError);
                }
                if (window.jmpNative && window.jmpNative.playerLoad) {
                    const metadataJson = streamdata?.metadata ? JSON.stringify(streamdata.metadata) : '{}';
                    window.jmpNative.playerLoad(url, options.startMilliseconds, videoStream, audioStream, subtitleStream, metadataJson, externalAudioUrl || '', externalSubUrl || '', !!options.isInfiniteStream);
                }
            },
            stop() {
                console.debug('[Media] player.stop');
                if (window.jmpNative) window.jmpNative.playerStop();
            },
            pause() {
                console.debug('[Media] player.pause');
                if (window.jmpNative) window.jmpNative.playerPause();
                playerState.paused = true;
            },
            play() {
                console.debug('[Media] player.play');
                if (window.jmpNative) window.jmpNative.playerPlay();
                playerState.paused = false;
            },
            seekTo(ms) {
                console.debug('[Media] player.seekTo:', ms);
                if (window.jmpNative) window.jmpNative.playerSeek(ms);
            },
            setVolume(vol) {
                console.debug('[Media] player.setVolume:', vol);
                playerState.volume = vol;
                if (window.jmpNative) window.jmpNative.playerSetVolume(vol);
            },
            setMuted(muted) {
                console.debug('[Media] player.setMuted:', muted);
                playerState.muted = muted;
                if (window.jmpNative) window.jmpNative.playerSetMuted(muted);
            },
            setPlaybackRate(rate) {
                console.debug('[Media] player.setPlaybackRate:', rate);
                if (window.jmpNative) window.jmpNative.playerSetSpeed(rate);
            },
            setSubtitleStream(index) {
                console.debug('[Media] player.setSubtitleStream:', index);
                if (window.jmpNative) window.jmpNative.playerSetSubtitle(index);
            },
            addSubtitleStream(url) {
                console.debug('[Media] player.addSubtitleStream:', url);
                if (window.jmpNative) window.jmpNative.playerAddSubtitle(url);
            },
            setAudioStream(index) {
                console.debug('[Media] player.setAudioStream:', index);
                if (window.jmpNative) window.jmpNative.playerSetAudio(index);
            },
            addAudioStream(url) {
                console.debug('[Media] player.addAudioStream:', url);
                if (window.jmpNative) window.jmpNative.playerAddAudio(url);
            },
            setSubtitleDelay(ms) {
                console.debug('[Media] player.setSubtitleDelay:', ms);
                if (window.jmpNative) window.jmpNative.playerSetSubtitleDelay(ms / 1000.0);
            },
            setAudioDelay(ms) {
                console.debug('[Media] player.setAudioDelay:', ms);
                if (window.jmpNative) window.jmpNative.playerSetAudioDelay(ms / 1000.0);
            },
            setAspectMode(mode) {
                console.debug('[Media] player.setAspectMode:', mode);
                if (window.jmpNative) window.jmpNative.playerSetAspectMode(mode);
            },
            setVideoRectangle(x, y, w, h) {
            },
            getPosition(callback) {
                if (callback) callback(playerState.position);
                return playerState.position;
            },
            getDuration(callback) {
                if (callback) callback(playerState.duration);
                return playerState.duration;
            },
        },
        system: {
            openExternalUrl(url) {
                window.open(url, '_blank');
            },
            exit() {
                if (window.jmpNative) window.jmpNative.appExit();
            },
            cancelServerConnectivity() {
                if (window.jmpCheckServerConnectivity && window.jmpCheckServerConnectivity.abort) {
                    window.jmpCheckServerConnectivity.abort();
                }
            }
        },
        settings: {
            setValue(section, key, value, callback) {
                if (window.jmpNative && window.jmpNative.setSettingValue) {
                    let serialized;
                    if (value === null)                  serialized = null;
                    else if (typeof value === 'boolean') serialized = value ? 'true' : 'false';
                    else if (Array.isArray(value))       serialized = JSON.stringify(value);
                    else                                 serialized = String(value);
                    window.jmpNative.setSettingValue(section, key, serialized);
                }
                if (callback) callback();
            },
            sectionValueUpdate: createSignal('sectionValueUpdate'),
            groupUpdate: createSignal('groupUpdate')
        },
        input: {
            hostInput: createSignal('hostInput'),
            positionSeek: createSignal('positionSeek'),
            rateChanged: createSignal('rateChanged'),
            volumeChanged: createSignal('volumeChanged'),

            executeActions() {}
        }
    };

    window._nativeEmit = function(signal, ...args) {
        console.debug('[Media] _nativeEmit called with signal:', signal, 'args:', args);
        if (window.api && window.api.player && window.api.player[signal]) {
            console.debug('[Media] Firing signal:', signal);
            window.api.player[signal](...args);
        } else {
            console.error('[Media] Signal not found:', signal, 'api exists:', !!window.api);
        }
    };
    window._nativeFullscreenChanged = function(fullscreen) {
        window._isFullscreen = fullscreen;
        const player = window._mpvVideoPlayerInstance;
        if (player && player.events) {
            player.events.trigger(player, 'fullscreenchange');
        }
    };
    window._nativeUpdatePosition = function(ms) {
        playerState.position = ms;
        window.api.player.positionUpdate(ms);
    };
    window._nativeUpdateDuration = function(ms) {
        playerState.duration = ms;
        window.api.player.updateDuration(ms);
    };
    window._nativeHostInput = function(actions) {
        console.debug('[Media] _nativeHostInput:', actions);
        window.api.input.hostInput(actions);
    };
    window._nativeSetRate = function(rate) {
        console.debug('[Media] _nativeSetRate:', rate);
        window.api.input.rateChanged(rate);
    };
    window._nativeSeek = function(positionMs) {
        console.debug('[Media] _nativeSeek:', positionMs);
        window.api.input.positionSeek(positionMs);
    };

    const plugins = ['mpvVideoPlayer', 'mpvAudioPlayer', 'inputPlugin'];
    for (const plugin of plugins) {
        window[plugin] = () => window['_' + plugin];
    }

    window.NativeShell = {
        openUrl(url, target) {
            window.api.system.openExternalUrl(url);
        },
        downloadFile(info) {
            window.api.system.openExternalUrl(info.url);
        },
        openClientSettings() {
            window._openClientSettings();
        },
        getPlugins() {
            return plugins;
        }
    };

    window._nativeFindServersResult = function(json) {
        let servers = [];
        try {
            servers = typeof json === 'string' ? JSON.parse(json) : json;
        } catch (e) {
            servers = [];
        }
        if (window._findServersResolve) {
            try { window._findServersResolve(servers); } catch (e) {}
            window._findServersResolve = null;
        }

        let container = document.getElementById('jellium-discovery-container');
        if (container) container.remove();

        const path = (window.location.hash || window.location.pathname || '').toLowerCase();
        // NEVER show discovery if on login page or if password input exists
        if (path.includes('login') || document.querySelector('input[type="password"]')) {
            return;
        }

        // Strictly allow on selectserver or addserver pages
        const isServerPage = path.includes('selectserver') || path.includes('addserver') ||
                             document.querySelector('#txtServerHost') ||
                             document.querySelector('.manualServerConnection') ||
                             document.querySelector('.selectServerPage');
        if (!isServerPage) return;
        if (!servers || !Array.isArray(servers) || servers.length === 0) return;

        let anchor = document.querySelector('.page:not(.hide) .manualServerConnection') || 
                     document.querySelector('.page:not(.hide) #txtServerHost')?.closest('form, div') ||
                     document.querySelector('.page:not(.hide) form') ||
                     document.querySelector('.manualServerConnection') || 
                     document.querySelector('#txtServerHost')?.closest('form, div') ||
                     document.querySelector('.selectServerPage') ||
                     document.querySelector('.serverList') ||
                     document.querySelector('.pageContainer');
        if (!anchor) return;

        container = document.createElement('div');
        container.id = 'jellium-discovery-container';
        container.style.marginTop = '28px';
        container.style.width = '100%';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.innerHTML = '<h3 style="color:rgba(255,255,255,0.7);margin-bottom:14px;font-weight:500;font-size:1.1em;text-align:center;">Serveurs d\u00E9tect\u00E9s sur le r\u00E9seau :</h3><div id="jellium-discovery-list" style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:450px;align-items:center;"></div>';
        
        if (anchor.tagName === 'FORM' || anchor.classList.contains('manualServerConnection')) {
            anchor.parentNode.insertBefore(container, anchor.nextSibling);
        } else {
            anchor.appendChild(container);
        }

        const list = document.getElementById('jellium-discovery-list');
        if (!list) return;
        list.innerHTML = '';
        
        let count = 0;
        servers.forEach(s => {
            const sAddr = s.Address || s.address || '';
            const sName = s.Name || s.name || 'Jellyfin Server';
            if (!sAddr) return;

            const btn = document.createElement('div');
            btn.className = 'server-card';
            btn.style.width = '100%';
            btn.style.maxWidth = '450px';
            btn.style.backgroundColor = '#292929';
            btn.style.padding = '1em';
            btn.style.border = '0.16em solid transparent';
            btn.style.borderRadius = '0.2em';
            btn.style.cursor = 'pointer';
            btn.style.display = 'flex';
            btn.style.flexDirection = 'column';
            btn.style.transition = 'background 0.15s ease-in-out, border-color 0.15s ease-in-out';
            btn.style.boxSizing = 'border-box';
            
            btn.onmouseenter = () => {
                btn.style.backgroundColor = '#333333';
                btn.style.borderColor = '#00a4dc';
            };
            btn.onmouseleave = () => {
                btn.style.backgroundColor = '#292929';
                btn.style.borderColor = 'transparent';
            };
            
            const title = document.createElement('div');
            title.innerText = sName;
            title.style.fontSize = '1.1em';
            title.style.fontWeight = '500';
            title.style.color = '#fff';
            title.style.marginBottom = '0.25em';
            title.style.textAlign = 'left';
            
            const subtitle = document.createElement('div');
            subtitle.innerText = sAddr;
            subtitle.style.fontSize = '0.9em';
            subtitle.style.color = 'rgba(255, 255, 255, 0.5)';
            subtitle.style.textAlign = 'left';
            
            btn.appendChild(title);
            btn.appendChild(subtitle);

            btn.onclick = (e) => {
                e.preventDefault();
                if (window.jmpNative && window.jmpNative.saveServerUrl) {
                    window.jmpNative.saveServerUrl(sAddr);
                }
                window.location.href = sAddr;
            };
            list.appendChild(btn);
            count++;
        });
        
        if (count === 0) {
            container.style.display = 'none';
        } else {
            container.style.display = 'flex';
        }
    };

    function triggerDiscoveryIfNeeded() {
        if (!window.jmpNative || !window.jmpNative.findServers) return;
        const path = (window.location.hash || window.location.pathname || '').toLowerCase();
        // NEVER run discovery on login or authenticated pages
        if (path.includes('login') || document.querySelector('input[type="password"]')) {
            const container = document.getElementById('jellium-discovery-container');
            if (container) container.remove();
            return;
        }

        const isServerSelectOrAdd = path.includes('selectserver') || 
                                   path.includes('addserver') ||
                                   document.querySelector('#txtServerHost') ||
                                   document.querySelector('.manualServerConnection') ||
                                   document.querySelector('.selectServerPage');

        if (isServerSelectOrAdd) {
            // When user is on server selection or add page, clear the saved server in config so restart doesn't force old server
            if (window.jmpNative && window.jmpNative.saveServerUrl) {
                window.jmpNative.saveServerUrl('');
            }

            const form = document.querySelector('.page:not(.hide) .manualServerConnection') || 
                         document.querySelector('.page:not(.hide) #txtServerHost')?.closest('form, div') ||
                         document.querySelector('.page:not(.hide) form') ||
                         document.querySelector('.manualServerConnection') || 
                         document.querySelector('#txtServerHost')?.closest('form, div') ||
                         document.querySelector('.selectServerPage');

            if (form && !document.getElementById('jellium-discovery-container')) {
                window.jmpNative.findServers(2000);
            }
        } else {
            const container = document.getElementById('jellium-discovery-container');
            if (container) container.remove();
        }
    }

    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        triggerDiscoveryIfNeeded();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        triggerDiscoveryIfNeeded();
    };

    window.addEventListener('hashchange', () => {
        triggerDiscoveryIfNeeded();
    });

    window.addEventListener('popstate', () => {
        triggerDiscoveryIfNeeded();
    });

    // Watch for dynamic DOM additions in Jellyfin's single-page app
    const discoveryObserver = new MutationObserver(() => {
        triggerDiscoveryIfNeeded();
    });
    if (document.body) {
        discoveryObserver.observe(document.body, { childList: true, subtree: true });
        triggerDiscoveryIfNeeded();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            discoveryObserver.observe(document.body, { childList: true, subtree: true });
            triggerDiscoveryIfNeeded();
        });
    }

    const _deviceProfile = __DEVICE_PROFILE_JSON__;
    function getDeviceProfile() {
        return _deviceProfile;
    }

    window.NativeShell.AppHost = {
        init() {
            return Promise.resolve({
                deviceName: jmpInfo.deviceName,
                appName: 'Jellyfin Desktop',
                appVersion: jmpInfo.version
            });
        },
        getDefaultLayout() {
            return jmpInfo.mode;
        },
        supports(command) {
            const features = [
                'fileinput', 'filedownload', 'displaylanguage', 'htmlaudioautoplay',
                'htmlvideoautoplay', 'externallinks', 'multiserver',
                'fullscreenchange', 'remotevideo', 'displaymode',
                'exitmenu', 'clientsettings', 'servermanagement', 'displaymessage'
            ];
            return features.includes(command.toLowerCase());
        },
        getDeviceProfile,
        getSyncProfile: getDeviceProfile,
        displayMessage(msg) {
            let title = '';
            let text = '';
            if (typeof msg === 'string') {
                text = msg;
            } else if (msg) {
                title = msg.title || '';
                text = msg.text || '';
            }
            
            const toast = document.createElement('div');
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            toast.style.color = '#fff';
            toast.style.padding = '12px 24px';
            toast.style.borderRadius = '8px';
            toast.style.zIndex = '999999';
            toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
            toast.style.fontFamily = 'sans-serif';
            toast.style.textAlign = 'center';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            toast.style.pointerEvents = 'none';

            if (title) {
                const h = document.createElement('strong');
                h.style.display = 'block';
                h.style.marginBottom = '4px';
                h.innerText = title;
                toast.appendChild(h);
            }
            if (text) {
                const p = document.createElement('span');
                p.innerText = text;
                toast.appendChild(p);
            }
            
            document.body.appendChild(toast);
            
            // Fade in
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
            });
            
            // Fade out and remove after 3s
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },
        appName() { return 'Jellyfin Desktop'; },
        appVersion() { return jmpInfo.version; },
        deviceName() { return jmpInfo.deviceName; },
        exit() { window.api.system.exit(); }
    };

    const DOWNLOAD_ICONS = {
        play: '<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M8 5v14l11-7z"/></svg>',
        check: '<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
        arrowBack: '<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
        close: '<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
        folder: '<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>',
        trash: '<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
        download: '<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
        jellyfin: '<svg viewBox="0 0 250 250" style="width:100%;height:100%;"><defs><linearGradient id="jfGradient" x1="110.25" y1="213.3" x2="496.14" y2="436.09" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#AA5CC3"/><stop offset="100%" stop-color="#00A4DC"/></linearGradient></defs><g transform="matrix(0.50424,0,0,0.50424,-3.788,-3.494)"><path fill="url(#jfGradient)" d="m 256,201.6 c -20.4,0 -86.2,119.3 -76.2,139.4 10,20.1 142.5,19.9 152.4,0 9.9,-19.9 -55.7,-139.4 -76.2,-139.4 z"/><path fill="url(#jfGradient)" d="m 256,23.3 c -61.6,0 -259.8,359.4 -229.6,420.1 30.2,60.7 429.3,60 459.2,0 C 515.5,383.4 317.6,23.3 256,23.3 Z m 150.5,367.5 c -19.6,39.3 -281.1,39.8 -300.9,0 C 85.8,351 215.7,115.5 256,115.5 c 40.3,0 170.1,235.9 150.5,275.3 z"/></g></svg>'
    };

    function ensureDownloadsStyle() {
        if (document.getElementById('jellium-downloads-style')) return;
        const style = document.createElement('style');
        style.id = 'jellium-downloads-style';
        style.textContent = `
/* Jellyfin Buttons Design System */
.jf-btn {
    font-family: inherit;
    font-size: 0.9em;
    font-weight: 500;
    letter-spacing: 0.025em;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    outline: none;
    user-select: none;
    text-decoration: none;
    transition: background 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.1s ease;
}
.jf-btn:active:not(:disabled) {
    transform: scale(0.97);
}

.jf-btn-primary {
    background: #00a4dc !important;
    color: #ffffff !important;
    border: none !important;
    padding: 8px 18px !important;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35) !important;
}
.jf-btn-primary:hover:not(:disabled) {
    background: #0cb0e8 !important;
    box-shadow: 0 4px 12px rgba(0, 164, 220, 0.45) !important;
}
.jf-btn-primary:disabled {
    background: rgba(255, 255, 255, 0.08) !important;
    color: rgba(255, 255, 255, 0.35) !important;
    box-shadow: none !important;
    cursor: not-allowed !important;
    opacity: 0.4 !important;
}

.jf-btn-secondary {
    background: rgba(255, 255, 255, 0.08) !important;
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    padding: 8px 16px !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25) !important;
}
.jf-btn-secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.16) !important;
    border-color: rgba(255, 255, 255, 0.32) !important;
}

.jf-btn-danger {
    background: rgba(200, 35, 51, 0.15) !important;
    color: #ff6b6b !important;
    border: 1px solid rgba(200, 35, 51, 0.35) !important;
    padding: 8px 16px !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25) !important;
}
.jf-btn-danger:hover:not(:disabled) {
    background: #c82333 !important;
    border-color: #c82333 !important;
    color: #ffffff !important;
    box-shadow: 0 4px 12px rgba(200, 35, 51, 0.45) !important;
}

.jf-btn-sm {
    padding: 6px 14px !important;
    font-size: 0.84em !important;
    min-height: 32px !important;
}

.jf-btn-icon {
    width: 38px !important;
    height: 38px !important;
    border-radius: 50% !important;
    background: transparent !important;
    border: none !important;
    color: #ffffff !important;
    cursor: pointer !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 7px !important;
    box-sizing: border-box !important;
    transition: background 0.18s ease, transform 0.1s ease !important;
}
.jf-btn-icon:hover {
    background: rgba(255, 255, 255, 0.12) !important;
}
.jf-btn-icon:active {
    background: rgba(255, 255, 255, 0.2) !important;
    transform: scale(0.95) !important;
}

.jf-btn-card-delete {
    position: absolute !important;
    bottom: 8px !important;
    right: 8px !important;
    width: 30px !important;
    height: 30px !important;
    border-radius: 50% !important;
    background: rgba(20, 20, 20, 0.85) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: #ff6b6b !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    padding: 6px !important;
    box-sizing: border-box !important;
    transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.12s ease, box-shadow 0.18s ease !important;
}
.jf-btn-card-delete:hover {
    background: #c82333 !important;
    border-color: #c82333 !important;
    color: #ffffff !important;
    transform: scale(1.1) !important;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5) !important;
}
.jf-btn-card-delete:active {
    transform: scale(1.0) !important;
}

.jf-tab-btn {
    padding: 16px 18px !important;
    background: transparent !important;
    border: none !important;
    font: inherit !important;
    font-size: 0.95em !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    cursor: pointer !important;
    transition: color 0.18s ease, background 0.18s ease, border-color 0.18s ease !important;
    border-bottom: 2px solid transparent !important;
    color: rgba(255, 255, 255, 0.65) !important;
    user-select: none !important;
}
.jf-tab-btn:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.04) !important;
}
.jf-tab-btn.is-active {
    color: #00a4dc !important;
    border-bottom: 2px solid #00a4dc !important;
}

/* Progress Bars */
.dl-card-track {
    overflow: hidden !important;
}

.dl-poster-track {
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    height: 5px !important;
    background: rgba(0, 0, 0, 0.65) !important;
    z-index: 6 !important;
}

.dl-row-track {
    position: relative !important;
    height: 4px !important;
    background: rgba(255, 255, 255, 0.12) !important;
    border-radius: 2px !important;
    margin-top: 4px !important;
    max-width: 300px !important;
}

.dl-card-bar {
    height: 100% !important;
    background: #00a4dc !important;
    transition: width 0.2s ease !important;
}

.dl-card-track.is-pending {
    background: rgba(255, 255, 255, 0.15) !important;
}

.dl-card-bar.is-pending {
    position: absolute !important;
    top: 0 !important;
    bottom: 0 !important;
    height: 100% !important;
    border-radius: 2px !important;
    background: linear-gradient(90deg, transparent 0%, rgba(0, 164, 220, 0.3) 20%, #00a4dc 50%, #52d3ff 75%, transparent 100%) !important;
    box-shadow: 0 0 10px rgba(0, 164, 220, 0.8), 0 0 4px #52d3ff !important;
    animation: dl-indeterminate-wave 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite !important;
}

@keyframes dl-indeterminate-wave {
    0% {
        left: -45%;
        width: 40%;
    }
    50% {
        left: 20%;
        width: 60%;
    }
    100% {
        left: 100%;
        width: 40%;
    }
}
`;
        (document.head || document.documentElement).appendChild(style);
    }
    try { ensureDownloadsStyle(); } catch (_) {}

    window._downloadsUiState = window._downloadsUiState || {
        activeTab: 'films',
        openSeries: null,
        openSeason: null,
        records: []
    };
    var _downloadsUiState = window._downloadsUiState;

    function downloadsArtworkUrl(record) {
        if (!record || !record.filename) return '';
        return 'app://resources/downloads/artwork?path=' + encodeURIComponent(record.filename);
    }

    function closeDownloadsView() {
        if (_downloadsUiState) {
            _downloadsUiState.isOpen = false;
            _downloadsUiState.openSeries = null;
            _downloadsUiState.openSeason = null;
        }
        const view = document.getElementById('jellium-downloads-view');
        if (view) view.remove();
        if (window._downloadsRefreshTimer) {
            clearInterval(window._downloadsRefreshTimer);
            window._downloadsRefreshTimer = null;
        }
        const placeholder = document.getElementById('offline-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    }

    function formatDownloadSize(bytes) {
        if (!Number.isFinite(bytes) || bytes <= 0) return '0 Mo';
        const units = ['o', 'Ko', 'Mo', 'Go', 'To'];
        const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        return `${(bytes / Math.pow(1024, index)).toFixed(index ? 1 : 0)} ${units[index]}`;
    }

    function ensurePlayerStyle() {
        if (document.getElementById('jellium-player-style')) return;
        const style = document.createElement('style');
        style.id = 'jellium-player-style';
        style.textContent = `
html.transparentDocument,
body.transparentDocument,
html.transparentDocument body,
.transparentDocument #app,
.transparentDocument .mainAnimatedPage,
.transparentDocument .mainAnimatedPages,
.transparentDocument .skinHeader,
.transparentDocument .view,
.transparentDocument .page,
.transparentDocument .backgroundContainer,
.transparentDocument .videoPlayerContainer,
.transparentDocument #offline-placeholder {
    background: transparent !important;
    background-color: transparent !important;
}
body.transparentDocument > *:not(#jf-offline-player-osd) {
    visibility: hidden !important;
}
.transparentDocument #offline-placeholder {
    display: none !important;
}
#jf-offline-player-osd {
    position: fixed;
    inset: 0;
    z-index: 9999999;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #fff;
    user-select: none;
    opacity: 1;
    transition: opacity 0.28s ease;
}
#jf-offline-player-osd.controls-hidden {
    opacity: 0 !important;
    cursor: none !important;
    pointer-events: none !important;
}
#jf-offline-player-osd * {
    box-sizing: border-box;
}
.jf-osd-top {
    pointer-events: auto;
    padding: 24px 32px 48px;
    background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 60%, transparent 100%);
    display: flex;
    align-items: center;
    gap: 20px;
}
.jf-osd-back-btn {
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #fff;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s, border-color 0.15s;
    flex-shrink: 0;
}
.jf-osd-back-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.06);
}
.jf-osd-title-group {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.jf-osd-main-title {
    font-size: 1.35em;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0,0,0,0.85);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.25;
}
.jf-osd-sub-title {
    font-size: 0.95em;
    color: rgba(255, 255, 255, 0.72);
    margin-top: 3px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.85);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
}
.jf-osd-center-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.85);
    min-width: 80px;
    padding: 16px 24px;
    border-radius: 40px;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.18s ease, transform 0.18s ease;
    z-index: 10;
}
.jf-osd-center-badge.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}
.jf-osd-center-badge-icon {
    width: 32px;
    height: 32px;
    color: #00a4dc;
    display: flex;
    align-items: center;
    justify-content: center;
}
.jf-osd-center-badge-text {
    font-size: 1.05em;
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
}
.jf-osd-bottom {
    pointer-events: auto;
    padding: 48px 32px 24px;
    background: linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 60%, transparent 100%);
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.jf-osd-timeline-container {
    position: relative;
    padding: 10px 0;
    cursor: pointer;
    user-select: none;
}
.jf-osd-timeline-track {
    height: 6px;
    background: rgba(255, 255, 255, 0.22);
    border-radius: 3px;
    position: relative;
    transition: height 0.15s ease;
}
.jf-osd-timeline-container:hover .jf-osd-timeline-track,
.jf-osd-timeline-container.is-dragging .jf-osd-timeline-track {
    height: 10px;
    border-radius: 5px;
}
.jf-osd-timeline-progress {
    height: 100%;
    background: #00a4dc;
    border-radius: inherit;
    width: 0%;
    position: relative;
}
.jf-osd-timeline-thumb {
    position: absolute;
    right: -7px;
    top: 50%;
    transform: translateY(-50%) scale(0);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #00a4dc;
    border: 2.5px solid #fff;
    box-shadow: 0 0 6px rgba(0,0,0,0.6);
    transition: transform 0.15s ease;
}
.jf-osd-timeline-container:hover .jf-osd-timeline-thumb,
.jf-osd-timeline-container.is-dragging .jf-osd-timeline-thumb {
    transform: translateY(-50%) scale(1);
}
.jf-osd-timeline-tooltip {
    position: absolute;
    bottom: 26px;
    transform: translateX(-50%);
    background: rgba(16, 16, 20, 0.92);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: #fff;
    padding: 4px 8px;
    font-size: 0.82em;
    font-variant-numeric: tabular-nums;
    border-radius: 4px;
    pointer-events: none;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.15s;
}
.jf-osd-controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.jf-osd-left-controls, .jf-osd-right-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}
.jf-osd-btn {
    background: transparent;
    border: none;
    color: #ffffff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s, color 0.15s;
    position: relative;
}
.jf-osd-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #00a4dc;
    transform: scale(1.08);
}
.jf-osd-btn.active {
    color: #00a4dc;
    background: rgba(0, 164, 220, 0.18);
}
.jf-osd-btn-play {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.12);
}
.jf-osd-btn-play:hover {
    background: #00a4dc;
    color: #fff;
    border-color: #00a4dc;
}
.jf-osd-time-display {
    font-size: 0.95em;
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, 0.85);
    margin-left: 6px;
    font-weight: 500;
}
.jf-osd-vol-group {
    display: flex;
    align-items: center;
    gap: 6px;
}
.jf-osd-vol-slider {
    width: 85px;
    height: 5px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 3px;
    outline: none;
    cursor: pointer;
}
.jf-osd-vol-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #00a4dc;
    border: 2px solid #fff;
    cursor: pointer;
}
.jf-osd-popup {
    position: absolute;
    bottom: 84px;
    background: rgba(22, 22, 26, 0.96);
    backdrop-filter: blur(18px);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 8px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75);
    color: #fff;
    min-width: 270px;
    max-width: 350px;
    max-height: 420px;
    display: flex;
    flex-direction: column;
    z-index: 100;
    pointer-events: auto;
    animation: jf-osd-popup-in 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
}
@keyframes jf-osd-popup-in {
    from { opacity: 0; transform: translateY(10px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
.jf-osd-popup-header {
    padding: 14px 18px;
    font-weight: 600;
    font-size: 1.05em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.jf-osd-popup-close {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.jf-osd-popup-close:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
}
.jf-osd-popup-list {
    overflow-y: auto;
    max-height: 240px;
    padding: 6px 0;
}
.jf-osd-popup-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 18px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background 0.12s ease;
    gap: 12px;
}
.jf-osd-popup-item:hover {
    background: rgba(255, 255, 255, 0.1);
}
.jf-osd-popup-item.selected {
    color: #00a4dc;
    font-weight: 500;
}
.jf-osd-popup-item-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
}
.jf-osd-popup-item-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.jf-osd-popup-item-badge {
    font-size: 0.78em;
    color: rgba(255, 255, 255, 0.55);
}
.jf-osd-popup-item.selected .jf-osd-popup-item-badge {
    color: rgba(0, 164, 220, 0.8);
}
.jf-osd-popup-check {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: #00a4dc;
    display: flex;
    align-items: center;
    justify-content: center;
}
.jf-osd-popup-delay-section {
    padding: 12px 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.jf-osd-popup-delay-label {
    font-size: 0.85em;
    color: rgba(255, 255, 255, 0.7);
}
.jf-osd-popup-delay-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 6px;
    padding: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}
.jf-osd-delay-btn {
    background: transparent;
    border: none;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
}
.jf-osd-delay-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #00a4dc;
}
.jf-osd-delay-val {
    font-size: 0.92em;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
}
.jf-osd-delay-val:hover {
    background: rgba(255, 255, 255, 0.1);
}
`;
        (document.head || document.documentElement).appendChild(style);
    }

    function formatPlayerTime(ms) {
        if (!Number.isFinite(ms) || ms < 0) ms = 0;
        const totalSec = Math.floor(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        if (h > 0) {
            return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function launchOfflinePlayer(record, meta) {
        ensurePlayerStyle();

        // 1. Metadata and tracks
        const isEpisode = meta.Type === 'Episode' || (record.filename || '').includes('Saison') || (record.filename || '').includes('Season') || (record.filename || '').toLowerCase().startsWith('series/');
        let mainTitle = '';
        let subTitle = '';
        if (isEpisode) {
            mainTitle = meta.SeriesName || meta.Name || 'Série';
            const sNum = meta.ParentIndexNumber != null ? String(meta.ParentIndexNumber).padStart(2, '0') : '';
            const eNum = meta.IndexNumber != null ? String(meta.IndexNumber).padStart(2, '0') : '';
            const epCode = (sNum && eNum) ? `S${sNum}E${eNum}` : '';
            const epTitle = (meta.Name && meta.Name !== mainTitle) ? meta.Name : '';
            subTitle = [epCode, epTitle].filter(Boolean).join(' - ') || meta.SeasonName || '';
        } else {
            mainTitle = meta.Name || (record.filename || '').split('/').pop().replace(/\.mkv$/i, '');
            subTitle = meta.ProductionYear ? String(meta.ProductionYear) : '';
        }

        const mediaStreams = (meta.MediaSources && meta.MediaSources[0]?.MediaStreams) || meta.MediaStreams || [];
        const audioTracks = [];
        let audioTrackCounter = 1;
        const subTracks = [];
        let subTrackCounter = 1;

        for (const s of mediaStreams) {
            if (s.Type === 'Audio') {
                const lang = s.Language ? s.Language.toUpperCase() : '';
                const title = s.DisplayTitle || s.Title || (lang ? `Audio (${lang})` : `Piste audio ${audioTrackCounter}`);
                const channels = s.ChannelLayout || (s.Channels ? `${s.Channels} ch` : '');
                const codec = (s.Codec || '').toUpperCase();
                const badge = [codec, channels].filter(Boolean).join(' · ');
                audioTracks.push({
                    mpvIndex: audioTrackCounter,
                    index: s.Index,
                    title,
                    badge,
                    isDefault: !!s.IsDefault
                });
                audioTrackCounter++;
            } else if (s.Type === 'Subtitle') {
                const lang = s.Language ? s.Language.toUpperCase() : '';
                const title = s.DisplayTitle || s.Title || (lang ? `Sous-titres (${lang})` : `Piste sous-titres ${subTrackCounter}`);
                const forced = s.IsForced ? 'Forcé' : '';
                const codec = (s.Codec || '').toUpperCase();
                const badge = [codec, forced].filter(Boolean).join(' · ');
                subTracks.push({
                    mpvIndex: subTrackCounter,
                    index: s.Index,
                    title,
                    badge,
                    isDefault: !!s.IsDefault,
                    isForced: !!s.IsForced
                });
                subTrackCounter++;
            }
        }
        if (audioTracks.length === 0) {
            audioTracks.push({
                mpvIndex: 1,
                index: 0,
                title: 'Piste audio principale',
                badge: '',
                isDefault: true
            });
        }

        let currentAudioTrack = (audioTracks.find(t => t.isDefault) || audioTracks[0]).mpvIndex;
        let currentSubTrack = (subTracks.find(t => t.isDefault && !t.isForced) || { mpvIndex: 0 }).mpvIndex;
        let currentAudioDelayMs = 0;
        let currentSubDelayMs = 0;
        let currentPlaybackRate = 1.0;
        let isPaused = false;
        let isMuted = false;
        let currentVolume = 100;
        let isDraggingScrubber = false;
        let isExited = false;

        // Resume position
        const resumeKey = 'jf_offline_pos_' + encodeURIComponent(record.filename || record.media_path);
        let startMs = 0;
        try {
            const saved = localStorage.getItem(resumeKey);
            if (saved) {
                const parsed = parseInt(saved, 10);
                if (Number.isFinite(parsed) && parsed > 10000) {
                    startMs = parsed;
                }
            }
        } catch (_) {}

        let currentPosMs = startMs;
        let durationMs = meta.RunTimeTicks ? Math.round(meta.RunTimeTicks / 10000) : 0;

        // 2. Window state & transparency
        const dlModal = document.getElementById('jellium-downloads-view');
        const prevDlDisplay = dlModal ? dlModal.style.display : null;
        if (dlModal) dlModal.style.display = 'none';

        const placeholder = document.getElementById('offline-placeholder');
        const prevPlaceholderDisplay = placeholder ? placeholder.style.display : null;
        if (placeholder) placeholder.style.display = 'none';

        document.documentElement.classList.add('transparentDocument');
        document.body.classList.add('transparentDocument');
        document.documentElement.style.backgroundColor = 'transparent';
        document.body.style.backgroundColor = 'transparent';
        if (window.jmpNative && window.jmpNative.playerOsdActive) {
            window.jmpNative.playerOsdActive(true);
        }

        // 3. Build OSD DOM
        const osd = document.createElement('div');
        osd.id = 'jf-offline-player-osd';

        // Top bar
        const topBar = document.createElement('div');
        topBar.className = 'jf-osd-top';

        const backBtn = document.createElement('button');
        backBtn.type = 'button';
        backBtn.className = 'jf-osd-back-btn';
        backBtn.title = 'Retour aux téléchargements (Échap)';
        backBtn.innerHTML = DOWNLOAD_ICONS.arrowBack;
        backBtn.onclick = (e) => {
            e.stopPropagation();
            exitPlayer();
        };

        const titleGroup = document.createElement('div');
        titleGroup.className = 'jf-osd-title-group';

        const mainTitleEl = document.createElement('div');
        mainTitleEl.className = 'jf-osd-main-title';
        mainTitleEl.textContent = mainTitle;

        titleGroup.appendChild(mainTitleEl);
        if (subTitle) {
            const subTitleEl = document.createElement('div');
            subTitleEl.className = 'jf-osd-sub-title';
            subTitleEl.textContent = subTitle;
            titleGroup.appendChild(subTitleEl);
        }
        topBar.append(backBtn, titleGroup);

        // Center badge for feedback
        const centerBadge = document.createElement('div');
        centerBadge.className = 'jf-osd-center-badge';
        const centerBadgeIcon = document.createElement('div');
        centerBadgeIcon.className = 'jf-osd-center-badge-icon';
        const centerBadgeText = document.createElement('div');
        centerBadgeText.className = 'jf-osd-center-badge-text';
        centerBadge.append(centerBadgeIcon, centerBadgeText);

        let badgeTimeout = null;
        function showBadge(iconHtml, text) {
            centerBadgeIcon.innerHTML = iconHtml;
            centerBadgeText.textContent = text;
            centerBadge.classList.add('show');
            clearTimeout(badgeTimeout);
            badgeTimeout = setTimeout(() => {
                centerBadge.classList.remove('show');
            }, 1200);
        }

        // Popups container
        let activePopup = null;
        function closePopups() {
            if (activePopup) {
                activePopup.remove();
                activePopup = null;
            }
            audioBtn.classList.remove('active');
            subBtn.classList.remove('active');
            settingsBtn.classList.remove('active');
        }

        // Bottom Bar
        const bottomBar = document.createElement('div');
        bottomBar.className = 'jf-osd-bottom';

        // Scrubber Timeline
        const timelineContainer = document.createElement('div');
        timelineContainer.className = 'jf-osd-timeline-container';

        const timelineTooltip = document.createElement('div');
        timelineTooltip.className = 'jf-osd-timeline-tooltip';

        const timelineTrack = document.createElement('div');
        timelineTrack.className = 'jf-osd-timeline-track';

        const timelineProgress = document.createElement('div');
        timelineProgress.className = 'jf-osd-timeline-progress';

        const timelineThumb = document.createElement('div');
        timelineThumb.className = 'jf-osd-timeline-thumb';

        timelineProgress.appendChild(timelineThumb);
        timelineTrack.appendChild(timelineProgress);
        timelineContainer.append(timelineTooltip, timelineTrack);

        function updateTimeUI() {
            if (durationMs > 0) {
                const pct = Math.min(100, Math.max(0, (currentPosMs / durationMs) * 100));
                timelineProgress.style.width = `${pct}%`;
            } else {
                timelineProgress.style.width = '0%';
            }
            timeDisplay.textContent = `${formatPlayerTime(currentPosMs)} / ${formatPlayerTime(durationMs)}`;
        }

        function seekFromMouseEvent(e) {
            if (durationMs <= 0) return;
            const rect = timelineTrack.getBoundingClientRect();
            const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
            const pct = relX / rect.width;
            const targetMs = Math.round(pct * durationMs);
            currentPosMs = targetMs;
            updateTimeUI();
            return targetMs;
        }

        timelineContainer.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.stopPropagation();
            isDraggingScrubber = true;
            timelineContainer.classList.add('is-dragging');
            const targetMs = seekFromMouseEvent(e);
            if (targetMs != null) {
                window.api.player.seekTo(targetMs);
            }
        });

        timelineContainer.addEventListener('mousemove', (e) => {
            const rect = timelineTrack.getBoundingClientRect();
            const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
            const pct = relX / rect.width;
            const hoverMs = Math.round(pct * (durationMs || 0));
            timelineTooltip.textContent = formatPlayerTime(hoverMs);
            timelineTooltip.style.left = `${relX}px`;
            timelineTooltip.style.opacity = '1';

            if (isDraggingScrubber) {
                seekFromMouseEvent(e);
            }
        });

        timelineContainer.addEventListener('mouseleave', () => {
            if (!isDraggingScrubber) {
                timelineTooltip.style.opacity = '0';
            }
        });

        // Controls row
        const controlsRow = document.createElement('div');
        controlsRow.className = 'jf-osd-controls-row';

        // Left controls
        const leftControls = document.createElement('div');
        leftControls.className = 'jf-osd-left-controls';

        // Play / Pause button
        const playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.className = 'jf-osd-btn jf-osd-btn-play';
        playBtn.title = 'Lecture / Pause (Espace)';
        playBtn.innerHTML = DOWNLOAD_ICONS.play;

        function updatePlayPauseIcon() {
            playBtn.innerHTML = isPaused ? DOWNLOAD_ICONS.play : `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        }

        playBtn.onclick = (e) => {
            e.stopPropagation();
            togglePlayPause();
        };

        function togglePlayPause() {
            if (isPaused) {
                window.api.player.play();
                showBadge(DOWNLOAD_ICONS.play, 'Lecture');
            } else {
                window.api.player.pause();
                showBadge(`<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`, 'Pause');
            }
        }

        // -10s button
        const replayBtn = document.createElement('button');
        replayBtn.type = 'button';
        replayBtn.className = 'jf-osd-btn';
        replayBtn.title = 'Reculer de 10s (Flèche Gauche)';
        replayBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.7l1.73-.59h.13V16zm4.28-1.54c0 .5-.11.89-.32 1.16-.21.27-.52.4-.92.4-.39 0-.69-.13-.9-.4-.21-.27-.32-.66-.32-1.16v-1.09c0-.5.11-.89.32-1.16.21-.27.51-.41.9-.41.4 0 .71.14.92.41.21.27.32.66.32 1.16v1.09zm-.89-1.23c0-.37-.05-.64-.16-.81-.1-.17-.26-.26-.48-.26-.21 0-.37.09-.48.26-.1.17-.16.44-.16.81v1.37c0 .37.05.64.16.81.11.17.26.26.48.26.22 0 .38-.09.48-.26.11-.17.16-.44.16-.81v-1.37z"/></svg>`;
        replayBtn.onclick = (e) => {
            e.stopPropagation();
            seekRelative(-10000);
        };

        // +10s button
        const forwardBtn = document.createElement('button');
        forwardBtn.type = 'button';
        forwardBtn.className = 'jf-osd-btn';
        forwardBtn.title = 'Avancer de 10s (Flèche Droite)';
        forwardBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.7l1.73-.59h.13V16zm4.28-1.54c0 .5-.11.89-.32 1.16-.21.27-.52.4-.92.4-.39 0-.69-.13-.9-.4-.21-.27-.32-.66-.32-1.16v-1.09c0-.5.11-.89.32-1.16.21-.27.51-.41.9-.41.4 0 .71.14.92.41.21.27.32.66.32 1.16v1.09zm-.89-1.23c0-.37-.05-.64-.16-.81-.1-.17-.26-.26-.48-.26-.21 0-.37.09-.48.26-.1.17-.16.44-.16.81v1.37c0 .37.05.64.16.81.11.17.26.26.48.26.22 0 .38-.09.48-.26.11-.17.16-.44.16-.81v-1.37z"/></svg>`;
        forwardBtn.onclick = (e) => {
            e.stopPropagation();
            seekRelative(10000);
        };

        function seekRelative(deltaMs) {
            const target = Math.max(0, Math.min(durationMs || Infinity, currentPosMs + deltaMs));
            currentPosMs = target;
            updateTimeUI();
            window.api.player.seekTo(target);
            showBadge(deltaMs > 0 ? forwardBtn.innerHTML : replayBtn.innerHTML, deltaMs > 0 ? '+10s' : '-10s');
        }

        // Time display
        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'jf-osd-time-display';
        timeDisplay.textContent = '00:00 / 00:00';

        leftControls.append(playBtn, replayBtn, forwardBtn, timeDisplay);

        // Right controls
        const rightControls = document.createElement('div');
        rightControls.className = 'jf-osd-right-controls';

        // Audio popup button
        const audioBtn = document.createElement('button');
        audioBtn.type = 'button';
        audioBtn.className = 'jf-osd-btn';
        audioBtn.title = 'Pistes audio et décalage';
        audioBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>`;

        audioBtn.onclick = (e) => {
            e.stopPropagation();
            if (activePopup && activePopup.dataset.type === 'audio') {
                closePopups();
                return;
            }
            closePopups();
            openAudioPopup();
        };

        function openAudioPopup() {
            audioBtn.classList.add('active');
            const popup = document.createElement('div');
            popup.className = 'jf-osd-popup';
            popup.dataset.type = 'audio';
            popup.style.right = '120px';

            const header = document.createElement('div');
            header.className = 'jf-osd-popup-header';
            header.innerHTML = `<span>Pistes audio</span>`;
            const closeX = document.createElement('button');
            closeX.type = 'button';
            closeX.className = 'jf-osd-popup-close';
            closeX.innerHTML = DOWNLOAD_ICONS.close;
            closeX.onclick = (e) => { e.stopPropagation(); closePopups(); };
            header.appendChild(closeX);

            const list = document.createElement('div');
            list.className = 'jf-osd-popup-list';

            audioTracks.forEach(t => {
                const item = document.createElement('div');
                item.className = 'jf-osd-popup-item' + (currentAudioTrack === t.mpvIndex ? ' selected' : '');
                const info = document.createElement('div');
                info.className = 'jf-osd-popup-item-info';
                const title = document.createElement('div');
                title.className = 'jf-osd-popup-item-title';
                title.textContent = t.title;
                info.appendChild(title);
                if (t.badge) {
                    const badge = document.createElement('div');
                    badge.className = 'jf-osd-popup-item-badge';
                    badge.textContent = t.badge;
                    info.appendChild(badge);
                }
                item.appendChild(info);

                if (currentAudioTrack === t.mpvIndex) {
                    const check = document.createElement('div');
                    check.className = 'jf-osd-popup-check';
                    check.innerHTML = DOWNLOAD_ICONS.check;
                    item.appendChild(check);
                }

                item.onclick = (e) => {
                    e.stopPropagation();
                    currentAudioTrack = t.mpvIndex;
                    window.api.player.setAudioStream(t.mpvIndex);
                    showBadge(audioBtn.innerHTML, `Audio : ${t.title}`);
                    closePopups();
                };
                list.appendChild(item);
            });

            // Audio delay stepper
            const delaySection = document.createElement('div');
            delaySection.className = 'jf-osd-popup-delay-section';
            const delayLabel = document.createElement('div');
            delayLabel.className = 'jf-osd-popup-delay-label';
            delayLabel.textContent = 'Décalage audio';

            const delayControls = document.createElement('div');
            delayControls.className = 'jf-osd-popup-delay-controls';

            const minusBtn = document.createElement('button');
            minusBtn.type = 'button';
            minusBtn.className = 'jf-osd-delay-btn';
            minusBtn.textContent = '−';
            minusBtn.title = 'Retarder l’audio (-50ms)';

            const delayVal = document.createElement('div');
            delayVal.className = 'jf-osd-delay-val';
            delayVal.title = 'Cliquer pour réinitialiser à 0 ms';
            delayVal.textContent = `${currentAudioDelayMs >= 0 ? '+' : ''}${currentAudioDelayMs} ms`;

            const plusBtn = document.createElement('button');
            plusBtn.type = 'button';
            plusBtn.className = 'jf-osd-delay-btn';
            plusBtn.textContent = '+';
            plusBtn.title = 'Avancer l’audio (+50ms)';

            minusBtn.onclick = (e) => {
                e.stopPropagation();
                currentAudioDelayMs -= 50;
                window.api.player.setAudioDelay(currentAudioDelayMs);
                delayVal.textContent = `${currentAudioDelayMs >= 0 ? '+' : ''}${currentAudioDelayMs} ms`;
                showBadge(audioBtn.innerHTML, `Audio : ${delayVal.textContent}`);
            };

            plusBtn.onclick = (e) => {
                e.stopPropagation();
                currentAudioDelayMs += 50;
                window.api.player.setAudioDelay(currentAudioDelayMs);
                delayVal.textContent = `${currentAudioDelayMs >= 0 ? '+' : ''}${currentAudioDelayMs} ms`;
                showBadge(audioBtn.innerHTML, `Audio : ${delayVal.textContent}`);
            };

            delayVal.onclick = (e) => {
                e.stopPropagation();
                currentAudioDelayMs = 0;
                window.api.player.setAudioDelay(0);
                delayVal.textContent = '0 ms';
                showBadge(audioBtn.innerHTML, 'Audio : 0 ms');
            };

            delayControls.append(minusBtn, delayVal, plusBtn);
            delaySection.append(delayLabel, delayControls);

            popup.append(header, list, delaySection);
            osd.appendChild(popup);
            activePopup = popup;
        }

        // Subtitles popup button
        const subBtn = document.createElement('button');
        subBtn.type = 'button';
        subBtn.className = 'jf-osd-btn' + (currentSubTrack > 0 ? ' active' : '');
        subBtn.title = 'Sous-titres et décalage';
        subBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z"/></svg>`;

        subBtn.onclick = (e) => {
            e.stopPropagation();
            if (activePopup && activePopup.dataset.type === 'subtitles') {
                closePopups();
                return;
            }
            closePopups();
            openSubtitlesPopup();
        };

        function openSubtitlesPopup() {
            subBtn.classList.add('active');
            const popup = document.createElement('div');
            popup.className = 'jf-osd-popup';
            popup.dataset.type = 'subtitles';
            popup.style.right = '80px';

            const header = document.createElement('div');
            header.className = 'jf-osd-popup-header';
            header.innerHTML = `<span>Sous-titres</span>`;
            const closeX = document.createElement('button');
            closeX.type = 'button';
            closeX.className = 'jf-osd-popup-close';
            closeX.innerHTML = DOWNLOAD_ICONS.close;
            closeX.onclick = (e) => { e.stopPropagation(); closePopups(); };
            header.appendChild(closeX);

            const list = document.createElement('div');
            list.className = 'jf-osd-popup-list';

            // "Désactivé" option
            const offItem = document.createElement('div');
            offItem.className = 'jf-osd-popup-item' + (currentSubTrack === 0 ? ' selected' : '');
            const offInfo = document.createElement('div');
            offInfo.className = 'jf-osd-popup-item-info';
            const offTitle = document.createElement('div');
            offTitle.className = 'jf-osd-popup-item-title';
            offTitle.textContent = 'Désactivé';
            offInfo.appendChild(offTitle);
            offItem.appendChild(offInfo);
            if (currentSubTrack === 0) {
                const check = document.createElement('div');
                check.className = 'jf-osd-popup-check';
                check.innerHTML = DOWNLOAD_ICONS.check;
                offItem.appendChild(check);
            }
            offItem.onclick = (e) => {
                e.stopPropagation();
                currentSubTrack = 0;
                window.api.player.setSubtitleStream(0);
                subBtn.classList.remove('active');
                showBadge(subBtn.innerHTML, 'Sous-titres : Désactivé');
                closePopups();
            };
            list.appendChild(offItem);

            subTracks.forEach(t => {
                const item = document.createElement('div');
                item.className = 'jf-osd-popup-item' + (currentSubTrack === t.mpvIndex ? ' selected' : '');
                const info = document.createElement('div');
                info.className = 'jf-osd-popup-item-info';
                const title = document.createElement('div');
                title.className = 'jf-osd-popup-item-title';
                title.textContent = t.title;
                info.appendChild(title);
                if (t.badge) {
                    const badge = document.createElement('div');
                    badge.className = 'jf-osd-popup-item-badge';
                    badge.textContent = t.badge;
                    info.appendChild(badge);
                }
                item.appendChild(info);

                if (currentSubTrack === t.mpvIndex) {
                    const check = document.createElement('div');
                    check.className = 'jf-osd-popup-check';
                    check.innerHTML = DOWNLOAD_ICONS.check;
                    item.appendChild(check);
                }

                item.onclick = (e) => {
                    e.stopPropagation();
                    currentSubTrack = t.mpvIndex;
                    window.api.player.setSubtitleStream(t.mpvIndex);
                    subBtn.classList.add('active');
                    showBadge(subBtn.innerHTML, `Sous-titres : ${t.title}`);
                    closePopups();
                };
                list.appendChild(item);
            });

            // Subtitle delay stepper
            const delaySection = document.createElement('div');
            delaySection.className = 'jf-osd-popup-delay-section';
            const delayLabel = document.createElement('div');
            delayLabel.className = 'jf-osd-popup-delay-label';
            delayLabel.textContent = 'Décalage des sous-titres';

            const delayControls = document.createElement('div');
            delayControls.className = 'jf-osd-popup-delay-controls';

            const minusBtn = document.createElement('button');
            minusBtn.type = 'button';
            minusBtn.className = 'jf-osd-delay-btn';
            minusBtn.textContent = '−';
            minusBtn.title = 'Retarder les sous-titres (-100ms)';

            const delayVal = document.createElement('div');
            delayVal.className = 'jf-osd-delay-val';
            delayVal.title = 'Cliquer pour réinitialiser à 0 ms';
            delayVal.textContent = `${currentSubDelayMs >= 0 ? '+' : ''}${currentSubDelayMs} ms`;

            const plusBtn = document.createElement('button');
            plusBtn.type = 'button';
            plusBtn.className = 'jf-osd-delay-btn';
            plusBtn.textContent = '+';
            plusBtn.title = 'Avancer les sous-titres (+100ms)';

            minusBtn.onclick = (e) => {
                e.stopPropagation();
                currentSubDelayMs -= 100;
                window.api.player.setSubtitleDelay(currentSubDelayMs);
                delayVal.textContent = `${currentSubDelayMs >= 0 ? '+' : ''}${currentSubDelayMs} ms`;
                showBadge(subBtn.innerHTML, `Sous-titres : ${delayVal.textContent}`);
            };

            plusBtn.onclick = (e) => {
                e.stopPropagation();
                currentSubDelayMs += 100;
                window.api.player.setSubtitleDelay(currentSubDelayMs);
                delayVal.textContent = `${currentSubDelayMs >= 0 ? '+' : ''}${currentSubDelayMs} ms`;
                showBadge(subBtn.innerHTML, `Sous-titres : ${delayVal.textContent}`);
            };

            delayVal.onclick = (e) => {
                e.stopPropagation();
                currentSubDelayMs = 0;
                window.api.player.setSubtitleDelay(0);
                delayVal.textContent = '0 ms';
                showBadge(subBtn.innerHTML, 'Sous-titres : 0 ms');
            };

            delayControls.append(minusBtn, delayVal, plusBtn);
            delaySection.append(delayLabel, delayControls);

            popup.append(header, list, delaySection);
            osd.appendChild(popup);
            activePopup = popup;
        }

        // Settings / Speed button
        const settingsBtn = document.createElement('button');
        settingsBtn.type = 'button';
        settingsBtn.className = 'jf-osd-btn';
        settingsBtn.title = 'Vitesse de lecture';
        settingsBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`;

        settingsBtn.onclick = (e) => {
            e.stopPropagation();
            if (activePopup && activePopup.dataset.type === 'settings') {
                closePopups();
                return;
            }
            closePopups();
            openSettingsPopup();
        };

        function openSettingsPopup() {
            settingsBtn.classList.add('active');
            const popup = document.createElement('div');
            popup.className = 'jf-osd-popup';
            popup.dataset.type = 'settings';
            popup.style.right = '40px';

            const header = document.createElement('div');
            header.className = 'jf-osd-popup-header';
            header.innerHTML = `<span>Vitesse de lecture</span>`;
            const closeX = document.createElement('button');
            closeX.type = 'button';
            closeX.className = 'jf-osd-popup-close';
            closeX.innerHTML = DOWNLOAD_ICONS.close;
            closeX.onclick = (e) => { e.stopPropagation(); closePopups(); };
            header.appendChild(closeX);

            const list = document.createElement('div');
            list.className = 'jf-osd-popup-list';

            const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
            rates.forEach(r => {
                const item = document.createElement('div');
                item.className = 'jf-osd-popup-item' + (currentPlaybackRate === r ? ' selected' : '');
                const title = document.createElement('div');
                title.className = 'jf-osd-popup-item-title';
                title.textContent = r === 1.0 ? '1x (Normale)' : `${r}x`;
                item.appendChild(title);
                if (currentPlaybackRate === r) {
                    const check = document.createElement('div');
                    check.className = 'jf-osd-popup-check';
                    check.innerHTML = DOWNLOAD_ICONS.check;
                    item.appendChild(check);
                }
                item.onclick = (e) => {
                    e.stopPropagation();
                    currentPlaybackRate = r;
                    window.api.player.setPlaybackRate(r * 1000);
                    showBadge(settingsBtn.innerHTML, `Vitesse : ${r}x`);
                    closePopups();
                };
                list.appendChild(item);
            });

            popup.append(header, list);
            osd.appendChild(popup);
            activePopup = popup;
        }

        // Volume group
        const volGroup = document.createElement('div');
        volGroup.className = 'jf-osd-vol-group';

        const volBtn = document.createElement('button');
        volBtn.type = 'button';
        volBtn.className = 'jf-osd-btn';
        volBtn.title = 'Muet (m)';
        volBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;

        const volSlider = document.createElement('input');
        volSlider.type = 'range';
        volSlider.className = 'jf-osd-vol-slider';
        volSlider.min = '0';
        volSlider.max = '100';
        volSlider.value = '100';

        function updateVolIcon(vol, muted) {
            if (muted || vol === 0) {
                volBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
            } else if (vol < 50) {
                volBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>`;
            } else {
                volBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
            }
        }

        volBtn.onclick = (e) => {
            e.stopPropagation();
            isMuted = !isMuted;
            window.api.player.setMuted(isMuted);
            volSlider.value = isMuted ? 0 : currentVolume;
            updateVolIcon(currentVolume, isMuted);
            showBadge(volBtn.innerHTML, isMuted ? 'Muet' : `Volume ${currentVolume}%`);
        };

        volSlider.addEventListener('input', (e) => {
            e.stopPropagation();
            const val = parseInt(volSlider.value, 10);
            currentVolume = val;
            if (isMuted && val > 0) {
                isMuted = false;
                window.api.player.setMuted(false);
            }
            window.api.player.setVolume(val);
            updateVolIcon(val, isMuted);
        });

        volGroup.append(volBtn, volSlider);

        // Fullscreen button
        const fsBtn = document.createElement('button');
        fsBtn.type = 'button';
        fsBtn.className = 'jf-osd-btn';
        fsBtn.title = 'Plein écran (f)';
        fsBtn.innerHTML = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:currentColor;"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;

        fsBtn.onclick = (e) => {
            e.stopPropagation();
            if (window.jmpNative && window.jmpNative.toggleFullscreen) {
                window.jmpNative.toggleFullscreen();
            }
        };

        rightControls.append(audioBtn, subBtn, settingsBtn, volGroup, fsBtn);
        controlsRow.append(leftControls, rightControls);
        bottomBar.append(timelineContainer, controlsRow);

        osd.append(topBar, centerBadge, bottomBar);
        document.body.appendChild(osd);

        // Click on background area to play/pause, double click to toggle fullscreen
        let lastClickTime = 0;
        osd.addEventListener('click', (e) => {
            if (e.target === osd) {
                const now = Date.now();
                if (now - lastClickTime < 300) {
                    if (window.jmpNative && window.jmpNative.toggleFullscreen) {
                        window.jmpNative.toggleFullscreen();
                    }
                    lastClickTime = 0;
                } else {
                    lastClickTime = now;
                    if (activePopup) {
                        closePopups();
                    } else {
                        togglePlayPause();
                    }
                }
            }
        });

        // 4. Auto-hide timer
        let autoHideTimeout = null;
        function resetControlsTimer() {
            osd.classList.remove('controls-hidden');
            clearTimeout(autoHideTimeout);
            if (!isPaused && !activePopup) {
                autoHideTimeout = setTimeout(() => {
                    if (!isPaused && !activePopup && !isDraggingScrubber && !isExited) {
                        osd.classList.add('controls-hidden');
                    }
                }, 3000);
            }
        }

        const onMouseMove = () => resetControlsTimer();
        const onMouseUp = (e) => {
            if (isDraggingScrubber) {
                isDraggingScrubber = false;
                timelineContainer.classList.remove('is-dragging');
                seekFromMouseEvent(e);
                resetControlsTimer();
            }
        };
        window.addEventListener('mousemove', onMouseMove, true);
        window.addEventListener('mouseup', onMouseUp, true);

        // 5. Keyboard shortcuts
        const onKeyDown = (e) => {
            if (isExited) return;
            resetControlsTimer();

            if (e.key === 'Escape' || e.key === 'Backspace') {
                if (activePopup) {
                    closePopups();
                } else {
                    e.preventDefault();
                    exitPlayer();
                }
            } else if (e.key === ' ' || e.key === 'k') {
                e.preventDefault();
                togglePlayPause();
            } else if (e.key === 'ArrowLeft' || e.key === 'j') {
                e.preventDefault();
                seekRelative(-10000);
            } else if (e.key === 'ArrowRight' || e.key === 'l') {
                e.preventDefault();
                seekRelative(10000);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const newVol = Math.min(100, currentVolume + 5);
                currentVolume = newVol;
                volSlider.value = newVol;
                window.api.player.setVolume(newVol);
                if (isMuted) { isMuted = false; window.api.player.setMuted(false); }
                updateVolIcon(newVol, isMuted);
                showBadge(volBtn.innerHTML, `Volume ${newVol}%`);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const newVol = Math.max(0, currentVolume - 5);
                currentVolume = newVol;
                volSlider.value = newVol;
                window.api.player.setVolume(newVol);
                updateVolIcon(newVol, isMuted);
                showBadge(volBtn.innerHTML, `Volume ${newVol}%`);
            } else if (e.key === 'm') {
                e.preventDefault();
                isMuted = !isMuted;
                window.api.player.setMuted(isMuted);
                volSlider.value = isMuted ? 0 : currentVolume;
                updateVolIcon(currentVolume, isMuted);
                showBadge(volBtn.innerHTML, isMuted ? 'Muet' : `Volume ${currentVolume}%`);
            } else if (e.key === 'f') {
                e.preventDefault();
                if (window.jmpNative && window.jmpNative.toggleFullscreen) {
                    window.jmpNative.toggleFullscreen();
                }
            } else if (e.key === 'z') {
                // Subtitle delay -100ms
                e.preventDefault();
                currentSubDelayMs -= 100;
                window.api.player.setSubtitleDelay(currentSubDelayMs);
                showBadge(subBtn.innerHTML, `Sous-titres : ${currentSubDelayMs >= 0 ? '+' : ''}${currentSubDelayMs} ms`);
            } else if (e.key === 'x') {
                // Subtitle delay +100ms
                e.preventDefault();
                currentSubDelayMs += 100;
                window.api.player.setSubtitleDelay(currentSubDelayMs);
                showBadge(subBtn.innerHTML, `Sous-titres : ${currentSubDelayMs >= 0 ? '+' : ''}${currentSubDelayMs} ms`);
            } else if (e.key === 'g') {
                // Audio delay -50ms
                e.preventDefault();
                currentAudioDelayMs -= 50;
                window.api.player.setAudioDelay(currentAudioDelayMs);
                showBadge(audioBtn.innerHTML, `Audio : ${currentAudioDelayMs >= 0 ? '+' : ''}${currentAudioDelayMs} ms`);
            } else if (e.key === 'h') {
                // Audio delay +50ms
                e.preventDefault();
                currentAudioDelayMs += 50;
                window.api.player.setAudioDelay(currentAudioDelayMs);
                showBadge(audioBtn.innerHTML, `Audio : ${currentAudioDelayMs >= 0 ? '+' : ''}${currentAudioDelayMs} ms`);
            }
        };
        window.addEventListener('keydown', onKeyDown, true);

        // 6. Connect Player Signals
        let lastSaveTime = 0;
        const onPos = (ms) => {
            if (isExited || isDraggingScrubber) return;
            currentPosMs = ms;
            updateTimeUI();
            const now = Date.now();
            if (now - lastSaveTime > 5000) {
                lastSaveTime = now;
                try {
                    if (currentPosMs > 10000 && (durationMs <= 0 || currentPosMs < durationMs - 30000)) {
                        localStorage.setItem(resumeKey, String(Math.round(currentPosMs)));
                    }
                } catch (_) {}
            }
        };

        const onDur = (ms) => {
            if (isExited || !ms) return;
            durationMs = ms;
            updateTimeUI();
        };

        const onPlaying = () => {
            if (isExited) return;
            isPaused = false;
            updatePlayPauseIcon();
            resetControlsTimer();
        };

        const onPaused = () => {
            if (isExited) return;
            isPaused = true;
            updatePlayPauseIcon();
            resetControlsTimer();
        };

        const onFinished = () => {
            if (isExited) return;
            try { localStorage.removeItem(resumeKey); } catch (_) {}
            exitPlayer();
        };

        const onError = (e) => {
            if (isExited) return;
            console.error('[OfflinePlayer] Media playback error:', e);
            window.alert('Erreur lors de la lecture du fichier média.');
            exitPlayer();
        };

        window.api.player.positionUpdate.connect(onPos);
        window.api.player.updateDuration.connect(onDur);
        window.api.player.playing.connect(onPlaying);
        window.api.player.paused.connect(onPaused);
        window.api.player.finished.connect(onFinished);
        window.api.player.error.connect(onError);

        // 7. Exit handler
        function exitPlayer() {
            if (isExited) return;
            isExited = true;

            try {
                if (currentPosMs > 10000 && (durationMs <= 0 || currentPosMs < durationMs - 30000)) {
                    localStorage.setItem(resumeKey, String(Math.round(currentPosMs)));
                } else if (durationMs > 0 && currentPosMs >= durationMs - 30000) {
                    localStorage.removeItem(resumeKey);
                }
            } catch (_) {}

            window.api.player.stop();
            if (window.jmpNative && window.jmpNative.playerOsdActive) {
                window.jmpNative.playerOsdActive(false);
            }

            window.api.player.positionUpdate.disconnect(onPos);
            window.api.player.updateDuration.disconnect(onDur);
            window.api.player.playing.disconnect(onPlaying);
            window.api.player.paused.disconnect(onPaused);
            window.api.player.finished.disconnect(onFinished);
            window.api.player.error.disconnect(onError);

            window.removeEventListener('keydown', onKeyDown, true);
            window.removeEventListener('mousemove', onMouseMove, true);
            window.removeEventListener('mouseup', onMouseUp, true);
            clearTimeout(autoHideTimeout);
            clearTimeout(badgeTimeout);

            osd.remove();

            document.documentElement.classList.remove('transparentDocument');
            document.body.classList.remove('transparentDocument');
            document.documentElement.style.backgroundColor = '';
            document.body.style.backgroundColor = '';

            if (dlModal) {
                dlModal.style.display = prevDlDisplay || 'flex';
            } else if (typeof window.showDownloadsView === 'function') {
                window.showDownloadsView();
            }

            if (placeholder && prevPlaceholderDisplay !== 'none') {
                placeholder.style.display = prevPlaceholderDisplay;
            }
        }

        // 8. Launch MPV
        const localId = meta.Id || ('local_' + (record.filename || '').replace(/[^a-zA-Z0-9]/g, '_'));
        window.api.player.load(
            record.media_path,
            { startMilliseconds: startMs, autoplay: true, isInfiniteStream: false },
            { type: 'video', metadata: { Id: localId, Name: mainTitle, Type: isEpisode ? 'Episode' : 'Movie' } },
            1, // video track
            currentAudioTrack,
            currentSubTrack,
            '', '',
            () => {}
        );

        updateTimeUI();
        resetControlsTimer();
    }

    function playDownloadedItem(record, meta) {
        if (!record || !record.media_path) {
            window.alert('Fichier introuvable ou chemin non défini.');
            return;
        }

        if (!meta || !meta.Id) {
            try {
                meta = JSON.parse(record.metadata || '{}');
            } catch (_) {}
        }

        const isOffline = (window.location.href || '').includes('offline.html') ||
            !window.ApiClient ||
            (typeof window.ApiClient.isLoggedIn === 'function' && !window.ApiClient.isLoggedIn());

        // Quand on est connecté à un serveur avec Internet, utiliser le lecteur standard de Jellyfin
        if (!isOffline && meta && meta.Id) {
            if (typeof closeDownloadsView === 'function') {
                closeDownloadsView();
            }
            const pm = window.playbackManager ||
                (window._mpvVideoPlayerInstance && window._mpvVideoPlayerInstance.playbackManager);

            if (pm && typeof pm.play === 'function') {
                const serverId = (window.ApiClient && typeof window.ApiClient.serverId === 'function' && window.ApiClient.serverId()) ||
                    meta.ServerId ||
                    (meta.item && meta.item.ServerId);

                console.info('[Player] Mode connecté : lancement via lecteur officiel Jellyfin pour ID:', meta.Id, 'serverId:', serverId);

                pm.play({
                    ids: [meta.Id],
                    serverId: serverId
                }).catch(function(err) {
                    console.error('[Player] Erreur pm.play, repli sur le lecteur hors ligne:', err);
                    launchOfflinePlayer(record, meta);
                });
                return;
            }
            if (window.appRouter && typeof window.appRouter.showItem === 'function') {
                window.appRouter.showItem(meta.Id);
                return;
            }
        }

        launchOfflinePlayer(record, meta);
    }

    function showDeleteConfirmation(filename, title, onConfirmed) {
        const dialog = document.createElement('div');
        dialog.style.cssText = 'position:fixed;inset:0;z-index:100002;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);';
        const box = document.createElement('div');
        box.style.cssText = 'max-width:380px;padding:24px;background:#1e1e1e;color:#fff;border-radius:8px;box-shadow:0 12px 36px rgba(0,0,0,.6);border:1px solid rgba(255,255,255,0.12);font-family:inherit;';
        const text = document.createElement('p');
        text.textContent = `Supprimer « ${title} » de cet appareil ?`;
        text.style.cssText = 'margin:0 0 20px;font-size:1.05em;line-height:1.4;';
        const actions = document.createElement('div');
        actions.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;';
        ensureDownloadsStyle();
        const cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.className = 'jf-btn jf-btn-secondary emby-button';
        cancel.textContent = 'Annuler';
        const confirm = document.createElement('button');
        confirm.type = 'button';
        confirm.className = 'jf-btn jf-btn-danger emby-button';
        confirm.style.background = '#c82333';
        confirm.style.borderColor = '#c82333';
        confirm.style.color = '#fff';
        confirm.textContent = 'Supprimer';
        cancel.onclick = () => dialog.remove();
        confirm.onclick = () => {
            dialog.remove();
            if (onConfirmed) onConfirmed();
            if (window.jmpNative && window.jmpNative.deleteDownload) {
                window.jmpNative.deleteDownload(filename);
            }
        };
        actions.append(cancel, confirm);
        box.append(text, actions);
        dialog.appendChild(box);
        document.body.appendChild(dialog);
    }

    _downloadsUiState = window._downloadsUiState;

    function normalizeSeriesKey(name) {
        if (!name) return '';
        return name.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function parseDownloadRecord(record) {
        const normName = (record.filename || '').replace(/\\/g, '/');
        let meta = {};
        try { meta = JSON.parse(record.metadata || '{}'); } catch (_) {}
        const isEpisode = meta.Type === 'Episode' ||
            normName.toLowerCase().startsWith('series/') ||
            (normName.split('/').length >= 3 && !normName.toLowerCase().startsWith('films/'));

        let seriesName = '';
        let seasonName = '';
        let title = meta.Name || '';

        if (isEpisode) {
            const parts = normName.split('/');
            seriesName = meta.SeriesName;
            if (!seriesName) {
                if (parts.length >= 3 && /^(saison|season)\b/i.test(parts[parts.length - 2])) {
                    seriesName = parts.slice(0, parts.length - 2).filter(p => p.toLowerCase() !== 'series').join(' - ');
                } else if (parts[0].toLowerCase() === 'series' && parts.length > 1) {
                    seriesName = parts[1];
                } else {
                    seriesName = parts[0];
                }
            }
            if (!seriesName) seriesName = 'Série';

            seasonName = meta.SeasonName;
            if (!seasonName) {
                if (parts.length >= 2 && /^(saison|season)\b/i.test(parts[parts.length - 2])) {
                    seasonName = parts[parts.length - 2];
                } else if (meta.ParentIndexNumber != null) {
                    seasonName = 'Saison ' + meta.ParentIndexNumber;
                } else {
                    seasonName = 'Saison 1';
                }
            }

            if (!title) {
                title = parts[parts.length - 1].replace(/\.mkv$/i, '');
            }
        } else {
            if (!title) {
                title = normName.split('/').pop().replace(/\.mkv$/i, '');
            }
        }

        const seriesKey = meta.SeriesId ? ('id_' + meta.SeriesId) : ('name_' + normalizeSeriesKey(seriesName));

        return {
            record,
            meta,
            normName,
            isEpisode,
            seriesKey,
            seriesName,
            seasonName,
            title
        };
    }
    window._parseDownloadRecord = parseDownloadRecord;

    function groupDownloadRecords(records) {
        const movies = [];
        const seriesMap = new Map();

        records.forEach(record => {
            const parsed = parseDownloadRecord(record);
            if (parsed.isEpisode) {
                const normSlash = (parsed.normName || '').replace(/\\/g, '/');
                const parts = normSlash.split('/');
                let seriesFolder = '';
                let seasonFolder = '';
                if (parts.length >= 3 && /^(saison|season)\b/i.test(parts[parts.length - 2])) {
                    seriesFolder = parts.slice(0, parts.length - 2).join('/');
                    seasonFolder = parts.slice(0, parts.length - 1).join('/');
                } else if (parts.length >= 3) {
                    seriesFolder = parts[0];
                    seasonFolder = parts.slice(0, 2).join('/');
                } else if (parts.length === 2) {
                    seriesFolder = parts[0];
                    seasonFolder = parts[0];
                }

                if (!seriesMap.has(parsed.seriesKey)) {
                    seriesMap.set(parsed.seriesKey, {
                        key: parsed.seriesKey,
                        displayName: parsed.seriesName,
                        seriesId: parsed.meta.SeriesId || '',
                        seriesFolder: seriesFolder,
                        artworkRecord: parsed.record,
                        hasArtwork: parsed.record.status === 'complete',
                        seasons: new Map()
                    });
                }
                const group = seriesMap.get(parsed.seriesKey);
                if (seriesFolder && !group.seriesFolder) {
                    group.seriesFolder = seriesFolder;
                }
                if (parsed.meta.SeriesId && !group.seriesId) {
                    group.seriesId = parsed.meta.SeriesId;
                }
                // Prefer display name with proper casing and punctuation from meta.SeriesName
                if (parsed.meta.SeriesName && (!group.displayName || group.displayName.length < parsed.meta.SeriesName.length)) {
                    group.displayName = parsed.meta.SeriesName;
                }
                // Prefer artwork from an episode that has completed or has artwork
                if (parsed.record.status === 'complete' || !group.hasArtwork) {
                    group.artworkRecord = parsed.record;
                    if (parsed.record.status === 'complete') group.hasArtwork = true;
                }

                if (!group.seasons.has(parsed.seasonName)) {
                    group.seasons.set(parsed.seasonName, {
                        name: parsed.seasonName,
                        seasonId: parsed.meta.SeasonId || '',
                        seasonFolder: seasonFolder,
                        artworkRecord: parsed.record,
                        episodes: []
                    });
                }
                const sObj = group.seasons.get(parsed.seasonName);
                if (seasonFolder && !sObj.seasonFolder) {
                    sObj.seasonFolder = seasonFolder;
                }
                if (parsed.meta.SeasonId && !sObj.seasonId) {
                    sObj.seasonId = parsed.meta.SeasonId;
                }
                if (parsed.record.status === 'complete' || !sObj.artworkRecord) {
                    sObj.artworkRecord = parsed.record;
                }
                sObj.episodes.push(parsed);
            } else {
                movies.push(parsed);
            }
        });

        // Sort episodes inside seasons
        seriesMap.forEach(group => {
            group.seasons.forEach(sObj => {
                sObj.episodes.sort((a, b) => {
                    const idxA = a.meta.IndexNumber != null ? a.meta.IndexNumber : 999;
                    const idxB = b.meta.IndexNumber != null ? b.meta.IndexNumber : 999;
                    if (idxA !== idxB) return idxA - idxB;
                    return a.title.localeCompare(b.title, undefined, { numeric: true });
                });
            });
        });

        return { movies, seriesMap };
    }

    function updateDownloadsProgressInPlace(records, movies, seriesMap) {
        const view = document.getElementById('jellium-downloads-view');
        if (!view) return false;

        // 1. Update individual items (movies and episodes in drilldown view)
        records.forEach(record => {
            const el = view.querySelector(`[data-download-filename="${CSS.escape(record.filename)}"]`);
            if (!el) return;
            const progressTrack = el.querySelector('.dl-card-track');
            const progressBar = el.querySelector('.dl-card-bar');
            const statusEl = el.querySelector('.dl-status-text');
            const pctBadge = el.querySelector('.dl-card-pct-badge');
            const subEl = el.querySelector('.dl-card-sub');
            const playBtn = el.querySelector('.dl-play-btn');

            const progress = record.total_bytes > 0
                ? Math.min(100, Math.round(record.downloaded_bytes * 100 / record.total_bytes))
                : 0;

            if (progressBar) {
                if (record.status === 'pending') {
                    progressBar.classList.add('is-pending');
                    progressBar.style.width = '';
                } else {
                    progressBar.classList.remove('is-pending');
                    progressBar.style.width = `${Math.max(progress, 3)}%`;
                }
            }
            if (progressTrack) {
                if (record.status === 'pending') {
                    progressTrack.classList.add('is-pending');
                } else {
                    progressTrack.classList.remove('is-pending');
                }
                progressTrack.style.display = record.status === 'complete' ? 'none' : 'block';
            }
            if (pctBadge) {
                if (record.status === 'downloading') {
                    pctBadge.textContent = `${progress}%`;
                    pctBadge.style.display = 'flex';
                } else if (record.status === 'pending') {
                    pctBadge.textContent = 'En attente';
                    pctBadge.style.display = 'flex';
                } else {
                    pctBadge.style.display = 'none';
                }
            }
            if (playBtn) {
                const canPlay = record.status === 'complete';
                playBtn.disabled = !canPlay;
                playBtn.style.cursor = canPlay ? 'pointer' : 'not-allowed';
                playBtn.style.opacity = canPlay ? '1' : '0.4';
                playBtn.style.boxShadow = canPlay ? '0 2px 5px rgba(0,0,0,0.35)' : 'none';
                if (canPlay) {
                    let epMeta = {};
                    try { epMeta = JSON.parse(record.metadata || '{}'); } catch (_) {}
                    playBtn.onclick = () => {
                        const cur = (window._downloadsCache || []).find(r => r.filename === record.filename) || record;
                        playDownloadedItem(cur, epMeta);
                    };
                }
            }
            if (subEl) {
                if (record.status === 'downloading') {
                    subEl.textContent = `${progress}% · ${formatDownloadSize(record.downloaded_bytes)} / ${formatDownloadSize(record.total_bytes)}`;
                    subEl.style.color = '#00a4dc';
                } else if (record.status === 'pending') {
                    subEl.textContent = 'En attente...';
                    subEl.style.color = 'rgba(255,255,255,0.6)';
                } else if (record.status === 'complete') {
                    subEl.textContent = formatDownloadSize(record.downloaded_bytes);
                    subEl.style.color = 'rgba(255,255,255,0.55)';
                }
            }
            if (statusEl) {
                if (record.status === 'complete') {
                    statusEl.textContent = 'Disponible hors ligne · ' + formatDownloadSize(record.downloaded_bytes);
                    statusEl.style.color = '#4caf50';
                } else if (record.status === 'pending') {
                    statusEl.textContent = 'En attente...';
                    statusEl.style.color = 'rgba(255,255,255,0.6)';
                } else if (record.status === 'error') {
                    statusEl.textContent = 'Erreur de téléchargement';
                    statusEl.style.color = '#f44336';
                } else {
                    statusEl.textContent = `Téléchargement : ${progress}% (${formatDownloadSize(record.downloaded_bytes)} / ${formatDownloadSize(record.total_bytes)})`;
                    statusEl.style.color = '#00a4dc';
                }
            }
        });

        // 2. Update Series folder cards in main series grid
        if (!_downloadsUiState.openSeries) {
            seriesMap.forEach(group => {
                const folderCard = view.querySelector(`[data-series-card="${CSS.escape(group.key)}"]`);
                if (!folderCard) return;
                let sDownloaded = 0;
                let sTotal = 0;
                let sActive = false;
                let sPending = false;
                let completedCount = 0;
                let totalEps = 0;

                group.seasons.forEach(sObj => {
                    sObj.episodes.forEach(ep => {
                        totalEps++;
                        sDownloaded += ep.record.downloaded_bytes || 0;
                        if (ep.record.total_bytes) sTotal += ep.record.total_bytes;
                        if (ep.record.status === 'downloading') sActive = true;
                        if (ep.record.status === 'pending') sPending = true;
                        if (ep.record.status === 'complete') completedCount++;
                    });
                });

                const sTrack = folderCard.querySelector('.dl-card-track');
                const sBar = folderCard.querySelector('.dl-card-bar');
                const sPctBadge = folderCard.querySelector('.dl-series-pct-badge');
                const sSub = folderCard.querySelector('.dl-series-sub');

                const pct = sTotal > 0 ? Math.min(100, Math.round(sDownloaded * 100 / sTotal)) : 0;

                if (sTrack && sBar) {
                    sTrack.style.display = (sActive || sPending) ? 'block' : 'none';
                    if (sPending && !sActive) {
                        sTrack.classList.add('is-pending');
                        sBar.classList.add('is-pending');
                        sBar.style.width = '';
                    } else {
                        sTrack.classList.remove('is-pending');
                        sBar.classList.remove('is-pending');
                        sBar.style.width = `${Math.max(pct, 3)}%`;
                    }
                }
                if (sPctBadge) {
                    if (sActive) {
                        sPctBadge.textContent = `${pct}%`;
                        sPctBadge.style.display = 'flex';
                    } else if (sPending) {
                        sPctBadge.textContent = 'En attente';
                        sPctBadge.style.display = 'flex';
                    } else {
                        sPctBadge.style.display = 'none';
                    }
                }
                if (sSub) {
                    if (sActive) {
                        sSub.textContent = `${pct}% · ${totalEps - completedCount} en cours`;
                        sSub.style.color = '#00a4dc';
                    } else if (sPending) {
                        sSub.textContent = 'En attente...';
                        sSub.style.color = 'rgba(255,255,255,0.6)';
                    } else {
                        sSub.textContent = `${totalEps} épisode${totalEps > 1 ? 's' : ''}`;
                        sSub.style.color = 'rgba(255,255,255,0.55)';
                    }
                }
            });
        } else if (!_downloadsUiState.openSeason) {
            // 3. Update Season folder cards in series view
            const group = seriesMap.get(_downloadsUiState.openSeries) ||
                [...seriesMap.values()].find(g => g.displayName === _downloadsUiState.openSeries || g.key === _downloadsUiState.openSeries);
            if (group) {
                group.seasons.forEach(season => {
                    const seasonCard = view.querySelector(`[data-season-card="${CSS.escape(season.name)}"]`);
                    if (!seasonCard) return;
                    let seaDownloaded = 0;
                    let seaTotal = 0;
                    let seaActive = false;
                    let seaPending = false;
                    let completedCount = 0;
                    const totalEps = season.episodes.length;

                    season.episodes.forEach(ep => {
                        seaDownloaded += ep.record.downloaded_bytes || 0;
                        if (ep.record.total_bytes) seaTotal += ep.record.total_bytes;
                        if (ep.record.status === 'downloading') seaActive = true;
                        if (ep.record.status === 'pending') seaPending = true;
                        if (ep.record.status === 'complete') completedCount++;
                    });

                    const sTrack = seasonCard.querySelector('.dl-card-track');
                    const sBar = seasonCard.querySelector('.dl-card-bar');
                    const sPctBadge = seasonCard.querySelector('.dl-season-pct-badge');
                    const sSub = seasonCard.querySelector('.dl-season-sub');

                    const pct = seaTotal > 0 ? Math.min(100, Math.round(seaDownloaded * 100 / seaTotal)) : 0;

                    if (sTrack && sBar) {
                        sTrack.style.display = (seaActive || seaPending) ? 'block' : 'none';
                        if (seaPending && !seaActive) {
                            sTrack.classList.add('is-pending');
                            sBar.classList.add('is-pending');
                            sBar.style.width = '';
                        } else {
                            sTrack.classList.remove('is-pending');
                            sBar.classList.remove('is-pending');
                            sBar.style.width = `${Math.max(pct, 3)}%`;
                        }
                    }
                    if (sPctBadge) {
                        if (seaActive) {
                            sPctBadge.textContent = `${pct}%`;
                            sPctBadge.style.display = 'flex';
                        } else if (seaPending) {
                            sPctBadge.textContent = 'En attente';
                            sPctBadge.style.display = 'flex';
                        } else {
                            sPctBadge.style.display = 'none';
                        }
                    }
                    if (sSub) {
                        if (seaActive) {
                            sSub.textContent = `${pct}% · ${totalEps - completedCount} en cours`;
                            sSub.style.color = '#00a4dc';
                        } else if (seaPending) {
                            sSub.textContent = 'En attente...';
                            sSub.style.color = 'rgba(255,255,255,0.6)';
                        } else {
                            sSub.textContent = `${totalEps} épisode${totalEps > 1 ? 's' : ''} · ${formatDownloadSize(seaDownloaded)}`;
                            sSub.style.color = 'rgba(255,255,255,0.55)';
                        }
                    }
                });
            }
        }
        return true;
    }

    function rebuildDownloadsViewDom() {
        const existing = document.getElementById('jellium-downloads-view');

        const records = _downloadsUiState.records || [];
        const { movies, seriesMap } = groupDownloadRecords(records);

        ensureDownloadsStyle();
        const view = document.createElement('div');
        view.id = 'jellium-downloads-view';
        view.dataset.totalCount = String(records.length);
        view.dataset.renderedSeries = _downloadsUiState.openSeries || '';
        view.dataset.renderedSeason = _downloadsUiState.openSeason || '';
        view.dataset.renderedTab = _downloadsUiState.activeTab || 'films';
        view.style.cssText = 'position:fixed;inset:0;z-index:100000;background:#101010 !important;background-image:none !important;overflow:hidden;display:flex;flex-direction:column;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;';

        // 1. TOP BAR (matching Jellyfin header)
        const topBar = document.createElement('header');
        topBar.style.cssText = 'height:56px;background:rgba(16,16,16,0.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;padding:0 24px;flex-shrink:0;z-index:10;box-sizing:border-box;';

        const leftNav = document.createElement('div');
        leftNav.style.cssText = 'display:flex;align-items:center;gap:12px;';

        const backBtn = document.createElement('button');
        backBtn.type = 'button';
        backBtn.className = 'jf-btn-icon emby-button';
        backBtn.title = _downloadsUiState.openSeason
            ? 'Retour aux saisons'
            : (_downloadsUiState.openSeries ? 'Retour à la liste des séries' : 'Fermer');
        backBtn.innerHTML = DOWNLOAD_ICONS.arrowBack;
        backBtn.onclick = () => {
            if (_downloadsUiState.openSeason) {
                _downloadsUiState.openSeason = null;
                rebuildDownloadsViewDom();
            } else if (_downloadsUiState.openSeries) {
                _downloadsUiState.openSeries = null;
                rebuildDownloadsViewDom();
            } else {
                closeDownloadsView();
            }
        };

        const logoBox = document.createElement('div');
        logoBox.style.cssText = 'width:28px;height:28px;display:flex;align-items:center;justify-content:center;margin:0 4px;';
        logoBox.innerHTML = DOWNLOAD_ICONS.jellyfin;

        const brandTitle = document.createElement('span');
        brandTitle.textContent = 'Jellyfin';
        brandTitle.style.cssText = 'font-weight:700;font-size:1.15em;letter-spacing:-0.02em;margin-right:20px;';

        const tabsBox = document.createElement('div');
        tabsBox.style.cssText = 'display:flex;align-items:center;gap:4px;';

        const filmsTabBtn = document.createElement('button');
        filmsTabBtn.type = 'button';
        filmsTabBtn.textContent = 'Films';
        const isFilmsActive = !_downloadsUiState.openSeries && !_downloadsUiState.openSeason && _downloadsUiState.activeTab === 'films';
        filmsTabBtn.className = 'jf-tab-btn emby-tab-button emby-button' + (isFilmsActive ? ' is-active' : '');
        filmsTabBtn.onclick = () => {
            _downloadsUiState.activeTab = 'films';
            _downloadsUiState.openSeries = null;
            _downloadsUiState.openSeason = null;
            rebuildDownloadsViewDom();
        };

        const seriesTabBtn = document.createElement('button');
        seriesTabBtn.type = 'button';
        seriesTabBtn.textContent = 'Séries';
        const isSeriesActive = _downloadsUiState.openSeries || _downloadsUiState.openSeason || _downloadsUiState.activeTab === 'series';
        seriesTabBtn.className = 'jf-tab-btn emby-tab-button emby-button' + (isSeriesActive ? ' is-active' : '');
        seriesTabBtn.onclick = () => {
            _downloadsUiState.activeTab = 'series';
            _downloadsUiState.openSeries = null;
            _downloadsUiState.openSeason = null;
            rebuildDownloadsViewDom();
        };

        tabsBox.append(filmsTabBtn, seriesTabBtn);
        leftNav.append(backBtn, logoBox, brandTitle, tabsBox);

        const rightNav = document.createElement('div');
        rightNav.style.cssText = 'display:flex;align-items:center;gap:12px;';

        const folderBtn = document.createElement('button');
        folderBtn.type = 'button';
        folderBtn.className = 'jf-btn jf-btn-secondary emby-button';
        folderBtn.title = "Ouvrir l'emplacement des téléchargements sur le disque";
        const folderIconSpan = document.createElement('span');
        folderIconSpan.style.cssText = 'width:18px;height:18px;display:flex;align-items:center;justify-content:center;';
        folderIconSpan.innerHTML = DOWNLOAD_ICONS.folder;
        const folderLabel = document.createElement('span');
        folderLabel.textContent = 'Dossier local';
        folderBtn.append(folderIconSpan, folderLabel);
        folderBtn.onclick = () => {
            if (window.jmpNative && window.jmpNative.openDownloadsView) {
                window.jmpNative.openDownloadsView();
            }
        };

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'jf-btn-icon emby-button';
        closeBtn.title = 'Fermer';
        closeBtn.innerHTML = DOWNLOAD_ICONS.close;
        closeBtn.onclick = closeDownloadsView;

        rightNav.append(folderBtn, closeBtn);
        topBar.append(leftNav, rightNav);
        view.appendChild(topBar);

        // 2. SCROLLABLE CONTAINER
        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = 'flex:1;overflow-y:auto;padding:28px 40px 60px;box-sizing:border-box;';

        const contentWrap = document.createElement('div');
        contentWrap.style.cssText = 'max-width:1800px;margin:0 auto;';

        // Check if viewing inside a specific Series
        let activeSeriesGroup = null;
        if (_downloadsUiState.openSeries) {
            activeSeriesGroup = seriesMap.get(_downloadsUiState.openSeries);
            if (!activeSeriesGroup) {
                for (const g of seriesMap.values()) {
                    if (g.displayName === _downloadsUiState.openSeries || g.key === _downloadsUiState.openSeries) {
                        activeSeriesGroup = g;
                        break;
                    }
                }
            }
        }

        if (activeSeriesGroup) {
            const group = activeSeriesGroup;
            let totalEps = 0;
            let totalBytes = 0;
            group.seasons.forEach(sObj => {
                totalEps += sObj.episodes.length;
                sObj.episodes.forEach(ep => {
                    totalBytes += ep.record.downloaded_bytes || 0;
                });
            });

            let activeSeason = null;
            if (_downloadsUiState.openSeason) {
                activeSeason = group.seasons.get(_downloadsUiState.openSeason);
                if (!activeSeason) {
                    for (const s of group.seasons.values()) {
                        if (s.name === _downloadsUiState.openSeason) {
                            activeSeason = s;
                            break;
                        }
                    }
                }
            }

            if (activeSeason) {
                // LEVEL 3: Inside Season View (List of Episodes)
                let seasonTotalBytes = 0;
                activeSeason.episodes.forEach(ep => {
                    seasonTotalBytes += ep.record.downloaded_bytes || 0;
                });

                // Header with Breadcrumb navigation
                const sHeader = document.createElement('div');
                sHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:16px;';

                const sTitleBox = document.createElement('div');
                sTitleBox.style.cssText = 'display:flex;align-items:baseline;gap:12px;';

                const breadcrumbWrap = document.createElement('div');
                breadcrumbWrap.style.cssText = 'display:flex;align-items:baseline;gap:10px;';

                const seriesLink = document.createElement('span');
                seriesLink.textContent = group.displayName;
                seriesLink.title = 'Retour aux saisons';
                seriesLink.style.cssText = 'font-size:1.6em;font-weight:600;color:rgba(255,255,255,0.7);cursor:pointer;transition:color .15s ease;';
                seriesLink.onmouseenter = () => { seriesLink.style.color = '#00a4dc'; };
                seriesLink.onmouseleave = () => { seriesLink.style.color = 'rgba(255,255,255,0.7)'; };
                seriesLink.onclick = () => {
                    _downloadsUiState.openSeason = null;
                    rebuildDownloadsViewDom();
                };

                const sep = document.createElement('span');
                sep.textContent = '›';
                sep.style.cssText = 'font-size:1.4em;color:rgba(255,255,255,0.3);';

                const seasonTitleEl = document.createElement('h1');
                seasonTitleEl.textContent = activeSeason.name;
                seasonTitleEl.style.cssText = 'margin:0;font-size:1.8em;font-weight:600;color:#fff;';

                breadcrumbWrap.append(seriesLink, sep, seasonTitleEl);

                const sBadge = document.createElement('span');
                sBadge.textContent = `${activeSeason.episodes.length} épisode${activeSeason.episodes.length > 1 ? 's' : ''} · ${formatDownloadSize(seasonTotalBytes)}`;
                sBadge.style.cssText = 'font-size:0.9em;color:rgba(255,255,255,0.6);';

                sTitleBox.append(breadcrumbWrap, sBadge);

                const sActions = document.createElement('div');
                sActions.style.cssText = 'display:flex;align-items:center;gap:12px;';

                const backToSeasonsBtn = document.createElement('button');
                backToSeasonsBtn.type = 'button';
                backToSeasonsBtn.className = 'jf-btn jf-btn-secondary emby-button';
                const bIcon = document.createElement('span');
                bIcon.style.cssText = 'width:16px;height:16px;display:flex;align-items:center;justify-content:center;';
                bIcon.innerHTML = DOWNLOAD_ICONS.arrowBack;
                const bLabel = document.createElement('span');
                bLabel.textContent = 'Retour aux saisons';
                backToSeasonsBtn.append(bIcon, bLabel);
                backToSeasonsBtn.onclick = () => {
                    _downloadsUiState.openSeason = null;
                    rebuildDownloadsViewDom();
                };

                const playSeasonBtn = document.createElement('button');
                playSeasonBtn.type = 'button';
                playSeasonBtn.className = 'jf-btn jf-btn-primary emby-button';
                const pIcon = document.createElement('span');
                pIcon.style.cssText = 'width:14px;height:14px;display:flex;align-items:center;justify-content:center;';
                pIcon.innerHTML = DOWNLOAD_ICONS.play;
                const pLabel = document.createElement('span');
                pLabel.textContent = 'Tout lire la saison';
                playSeasonBtn.append(pIcon, pLabel);
                playSeasonBtn.onclick = () => {
                    const firstCompleted = activeSeason.episodes.find(ep => ep.record.status === 'complete');
                    if (firstCompleted) {
                        playDownloadedItem(firstCompleted.record, firstCompleted.meta);
                    } else if (activeSeason.episodes.length > 0) {
                        playDownloadedItem(activeSeason.episodes[0].record, activeSeason.episodes[0].meta);
                    }
                };

                const delSeasonBtn = document.createElement('button');
                delSeasonBtn.type = 'button';
                delSeasonBtn.className = 'jf-btn jf-btn-danger emby-button';
                const tIcon = document.createElement('span');
                tIcon.style.cssText = 'width:16px;height:16px;display:flex;align-items:center;justify-content:center;';
                tIcon.innerHTML = DOWNLOAD_ICONS.trash;
                const tLabel = document.createElement('span');
                tLabel.textContent = 'Supprimer la saison';
                delSeasonBtn.append(tIcon, tLabel);
                delSeasonBtn.onclick = () => {
                    showDeleteConfirmation('', `${group.displayName} - ${activeSeason.name}`, () => {
                        if (window.jmpNative && window.jmpNative.deleteDownload) {
                            if (activeSeason.seasonFolder) {
                                window.jmpNative.deleteDownload(activeSeason.seasonFolder);
                            }
                            activeSeason.episodes.forEach(ep => {
                                window.jmpNative.deleteDownload(ep.record.filename);
                            });
                        }
                        _downloadsUiState.openSeason = null;
                        showDownloadsView();
                    });
                };

                sActions.append(backToSeasonsBtn, playSeasonBtn, delSeasonBtn);
                sHeader.append(sTitleBox, sActions);
                contentWrap.appendChild(sHeader);

                // Episode cards list
                const epList = document.createElement('div');
                epList.style.cssText = 'display:flex;flex-direction:column;gap:10px;';

                activeSeason.episodes.forEach(ep => {
                    const epCard = document.createElement('div');
                    epCard.dataset.downloadFilename = ep.record.filename;
                    epCard.style.cssText = 'display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:10px 14px;transition:background .15s ease;';
                    epCard.onmouseenter = () => { epCard.style.background = 'rgba(255,255,255,0.08)'; };
                    epCard.onmouseleave = () => { epCard.style.background = 'rgba(255,255,255,0.04)'; };

                    const thumb = document.createElement('img');
                    thumb.src = downloadsArtworkUrl(ep.record);
                    thumb.alt = ep.title;
                    thumb.style.cssText = 'width:130px;aspect-ratio:16/9;object-fit:cover;border-radius:4px;background:#1a1a1a;flex-shrink:0;';
                    thumb.onerror = () => {
                        if (ep.meta && ep.meta.Id && window.ApiClient && (ep.meta.ImageTags?.Primary || ep.meta.ImageTags?.Thumb)) {
                            const tag = ep.meta.ImageTags.Primary || ep.meta.ImageTags.Thumb;
                            const type = ep.meta.ImageTags.Primary ? 'Primary' : 'Thumb';
                            thumb.src = window.ApiClient.getUrl('/Items/' + ep.meta.Id + '/Images/' + type, { maxWidth: 600, tag: tag });
                        } else {
                            thumb.style.display = 'none';
                        }
                    };

                    const infoCol = document.createElement('div');
                    infoCol.style.cssText = 'flex:1;min-width:0;';

                    const epTitle = document.createElement('div');
                    epTitle.textContent = ep.title;
                    epTitle.style.cssText = 'font-weight:600;font-size:0.95em;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff;';

                    const epStatus = document.createElement('div');
                    epStatus.className = 'dl-status-text';
                    epStatus.style.cssText = 'font-size:0.85em;margin-bottom:4px;';
                    const progress = ep.record.total_bytes > 0
                        ? Math.min(100, Math.round(ep.record.downloaded_bytes * 100 / ep.record.total_bytes))
                        : 0;
                    if (ep.record.status === 'complete') {
                        epStatus.textContent = 'Disponible hors ligne · ' + formatDownloadSize(ep.record.downloaded_bytes);
                        epStatus.style.color = '#4caf50';
                    } else if (ep.record.status === 'pending') {
                        epStatus.textContent = 'En attente...';
                        epStatus.style.color = 'rgba(255,255,255,0.6)';
                    } else if (ep.record.status === 'error') {
                        epStatus.textContent = 'Erreur de téléchargement';
                        epStatus.style.color = '#f44336';
                    } else {
                        epStatus.textContent = `Téléchargement : ${progress}% (${formatDownloadSize(ep.record.downloaded_bytes)} / ${formatDownloadSize(ep.record.total_bytes)})`;
                        epStatus.style.color = '#00a4dc';
                    }

                    const progressTrack = document.createElement('div');
                    progressTrack.className = 'dl-card-track dl-row-track' + (ep.record.status === 'pending' ? ' is-pending' : '');
                    progressTrack.style.cssText = `height:4px;background:rgba(255,255,255,0.12);border-radius:2px;overflow:hidden;margin-top:4px;max-width:300px;display:${ep.record.status === 'complete' ? 'none' : 'block'};`;
                    const progressBar = document.createElement('div');
                    progressBar.className = 'dl-card-bar' + (ep.record.status === 'pending' ? ' is-pending' : '');
                    progressBar.style.cssText = ep.record.status === 'pending'
                        ? 'height:100%;'
                        : `height:100%;width:${ep.record.total_bytes ? Math.max(progress, 3) : (ep.record.status === 'downloading' ? 3 : 0)}%;background:#00a4dc;transition:width .2s ease;`;
                    progressTrack.appendChild(progressBar);

                    infoCol.append(epTitle, epStatus, progressTrack);

                    const btnCol = document.createElement('div');
                    btnCol.style.cssText = 'display:flex;gap:8px;flex-shrink:0;';

                    const playBtn = document.createElement('button');
                    playBtn.type = 'button';
                    playBtn.className = 'jf-btn jf-btn-primary jf-btn-sm emby-button dl-play-btn';
                    const canPlay = ep.record.status === 'complete';
                    playBtn.disabled = !canPlay;
                    playBtn.style.cursor = canPlay ? 'pointer' : 'not-allowed';
                    playBtn.style.opacity = canPlay ? '1' : '0.4';
                    playBtn.style.boxShadow = canPlay ? '0 2px 5px rgba(0,0,0,0.35)' : 'none';
                    const epPIcon = document.createElement('span');
                    epPIcon.style.cssText = 'width:14px;height:14px;display:flex;align-items:center;justify-content:center;';
                    epPIcon.innerHTML = DOWNLOAD_ICONS.play;
                    const epPLabel = document.createElement('span');
                    epPLabel.textContent = 'Lire';
                    playBtn.append(epPIcon, epPLabel);
                    playBtn.onclick = () => {
                        const cur = (window._downloadsCache || []).find(r => r.filename === ep.record.filename) || ep.record;
                        if (cur.status === 'complete') playDownloadedItem(cur, ep.meta);
                    };

                    const delBtn = document.createElement('button');
                    delBtn.type = 'button';
                    delBtn.className = 'jf-btn jf-btn-danger jf-btn-sm emby-button';
                    delBtn.textContent = 'Supprimer';
                    delBtn.onclick = () => {
                        showDeleteConfirmation(ep.record.filename, ep.title, () => {
                            epCard.remove();
                        });
                    };

                    btnCol.append(playBtn, delBtn);
                    epCard.append(thumb, infoCol, btnCol);
                    epList.appendChild(epCard);
                });

                contentWrap.appendChild(epList);

            } else {
                // LEVEL 2: Series View (Grid of Season folders with 2:3 vertical jackets)
                const sHeader = document.createElement('div');
                sHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:16px;';

                const sTitleBox = document.createElement('div');
                sTitleBox.style.cssText = 'display:flex;align-items:baseline;gap:14px;';

                const sTitleEl = document.createElement('h1');
                sTitleEl.textContent = group.displayName;
                sTitleEl.style.cssText = 'margin:0;font-size:1.8em;font-weight:600;';

                const sBadge = document.createElement('span');
                sBadge.textContent = `${group.seasons.size} saison${group.seasons.size > 1 ? 's' : ''} · ${totalEps} épisode${totalEps > 1 ? 's' : ''} · ${formatDownloadSize(totalBytes)}`;
                sBadge.style.cssText = 'font-size:0.9em;color:rgba(255,255,255,0.6);';

                sTitleBox.append(sTitleEl, sBadge);

                const sActions = document.createElement('div');
                sActions.style.cssText = 'display:flex;align-items:center;gap:12px;';

                const backToListBtn = document.createElement('button');
                backToListBtn.type = 'button';
                backToListBtn.className = 'jf-btn jf-btn-secondary emby-button';
                const bIcon = document.createElement('span');
                bIcon.style.cssText = 'width:16px;height:16px;display:flex;align-items:center;justify-content:center;';
                bIcon.innerHTML = DOWNLOAD_ICONS.arrowBack;
                const bLabel = document.createElement('span');
                bLabel.textContent = 'Retour aux séries';
                backToListBtn.append(bIcon, bLabel);
                backToListBtn.onclick = () => {
                    _downloadsUiState.openSeries = null;
                    rebuildDownloadsViewDom();
                };

                const playAllBtn = document.createElement('button');
                playAllBtn.type = 'button';
                playAllBtn.className = 'jf-btn jf-btn-primary emby-button';
                const pIcon = document.createElement('span');
                pIcon.style.cssText = 'width:14px;height:14px;display:flex;align-items:center;justify-content:center;';
                pIcon.innerHTML = DOWNLOAD_ICONS.play;
                const pLabel = document.createElement('span');
                pLabel.textContent = 'Tout lire';
                playAllBtn.append(pIcon, pLabel);
                playAllBtn.onclick = () => {
                    for (const s of group.seasons.values()) {
                        const firstCompleted = s.episodes.find(ep => ep.record.status === 'complete');
                        if (firstCompleted) {
                            playDownloadedItem(firstCompleted.record, firstCompleted.meta);
                            return;
                        }
                    }
                    const firstSeason = group.seasons.values().next().value;
                    if (firstSeason && firstSeason.episodes.length > 0) {
                        playDownloadedItem(firstSeason.episodes[0].record, firstSeason.episodes[0].meta);
                    }
                };

                const delSeriesBtn = document.createElement('button');
                delSeriesBtn.type = 'button';
                delSeriesBtn.className = 'jf-btn jf-btn-danger emby-button';
                const tIcon = document.createElement('span');
                tIcon.style.cssText = 'width:16px;height:16px;display:flex;align-items:center;justify-content:center;';
                tIcon.innerHTML = DOWNLOAD_ICONS.trash;
                const tLabel = document.createElement('span');
                tLabel.textContent = 'Supprimer toute la série';
                delSeriesBtn.append(tIcon, tLabel);
                delSeriesBtn.onclick = () => {
                    showDeleteConfirmation('', group.displayName, () => {
                        if (window.jmpNative && window.jmpNative.deleteDownload) {
                            if (group.seriesFolder) {
                                window.jmpNative.deleteDownload(group.seriesFolder);
                            }
                            group.seasons.forEach(sObj => {
                                if (sObj.seasonFolder && sObj.seasonFolder !== group.seriesFolder) {
                                    window.jmpNative.deleteDownload(sObj.seasonFolder);
                                }
                                sObj.episodes.forEach(ep => {
                                    window.jmpNative.deleteDownload(ep.record.filename);
                                });
                            });
                        }
                        _downloadsUiState.openSeries = null;
                        showDownloadsView();
                    });
                };

                sActions.append(backToListBtn, playAllBtn, delSeriesBtn);
                sHeader.append(sTitleBox, sActions);
                contentWrap.appendChild(sHeader);

                // Subheading: Saisons
                const subHead = document.createElement('div');
                subHead.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:20px;';
                const subTitle = document.createElement('h2');
                subTitle.textContent = 'Saisons';
                subTitle.style.cssText = 'margin:0;font-size:1.4em;font-weight:600;color:#fff;';
                const sPill = document.createElement('span');
                sPill.textContent = String(group.seasons.size);
                sPill.style.cssText = 'font-size:0.85em;background:rgba(255,255,255,0.12);padding:2px 10px;border-radius:12px;font-weight:600;color:rgba(255,255,255,0.85);';
                subHead.append(subTitle, sPill);
                contentWrap.appendChild(subHead);

                // Grid of Season Cards (Aspect Ratio 2:3 vertical posters!)
                const seasonGrid = document.createElement('div');
                seasonGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:24px 16px;';

                const sortedSeasons = [...group.seasons.values()].sort((a, b) => {
                    const numA = a.episodes[0]?.meta?.ParentIndexNumber != null ? a.episodes[0].meta.ParentIndexNumber : 999;
                    const numB = b.episodes[0]?.meta?.ParentIndexNumber != null ? b.episodes[0].meta.ParentIndexNumber : 999;
                    if (numA !== numB) return numA - numB;
                    return a.name.localeCompare(b.name, undefined, { numeric: true });
                });

                sortedSeasons.forEach(season => {
                    let sDownloaded = 0;
                    let sTotal = 0;
                    let sActive = false;
                    let sPending = false;
                    let completedCount = 0;
                    const countEps = season.episodes.length;

                    season.episodes.forEach(ep => {
                        sDownloaded += ep.record.downloaded_bytes || 0;
                        if (ep.record.total_bytes) sTotal += ep.record.total_bytes;
                        if (ep.record.status === 'downloading') sActive = true;
                        if (ep.record.status === 'pending') sPending = true;
                        if (ep.record.status === 'complete') completedCount++;
                    });

                    const card = document.createElement('div');
                    card.dataset.seasonCard = season.name;
                    card.style.cssText = 'display:flex;flex-direction:column;cursor:pointer;position:relative;width:100%;';

                    const posterBox = document.createElement('div');
                    posterBox.style.cssText = 'position:relative;width:100%;aspect-ratio:2/3;border-radius:4px;overflow:hidden;background:#181818;box-shadow:0 4px 12px rgba(0,0,0,0.35);transition:transform .18s ease,box-shadow .18s ease;';
                    card.onmouseenter = () => {
                        posterBox.style.transform = 'scale(1.04)';
                        posterBox.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
                        hoverOverlay.style.opacity = '1';
                    };
                    card.onmouseleave = () => {
                        posterBox.style.transform = 'none';
                        posterBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.35)';
                        hoverOverlay.style.opacity = '0';
                    };

                    const img = document.createElement('img');
                    const localSeasonPoster = season.seasonFolder
                        ? ('/jmp_local_artwork?file=' + encodeURIComponent(season.seasonFolder + '/poster.jpg') + '&_t=' + Date.now())
                        : '';
                    img.src = localSeasonPoster || (group.seriesFolder ? ('/jmp_local_artwork?file=' + encodeURIComponent(group.seriesFolder + '/poster.jpg') + '&_t=' + Date.now()) : downloadsArtworkUrl(season.artworkRecord));
                    img.alt = season.name;
                    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
                    img.onerror = () => {
                        // Fallback 1: ApiClient season primary image
                        if (season.seasonId && window.ApiClient) {
                            img.src = window.ApiClient.getUrl('/Items/' + season.seasonId + '/Images/Primary', { maxWidth: 600 });
                            img.onerror = () => {
                                // Fallback 2: Series local poster
                                if (group.seriesFolder) {
                                    img.src = '/jmp_local_artwork?file=' + encodeURIComponent(group.seriesFolder + '/poster.jpg') + '&_t=' + Date.now();
                                    img.onerror = () => {
                                        if (season.artworkRecord) {
                                            img.src = downloadsArtworkUrl(season.artworkRecord);
                                        } else {
                                            img.style.display = 'none';
                                        }
                                    };
                                } else if (season.artworkRecord) {
                                    img.src = downloadsArtworkUrl(season.artworkRecord);
                                } else {
                                    img.style.display = 'none';
                                }
                            };
                        } else if (group.seriesFolder) {
                            img.src = '/jmp_local_artwork?file=' + encodeURIComponent(group.seriesFolder + '/poster.jpg') + '&_t=' + Date.now();
                            img.onerror = () => {
                                if (season.artworkRecord) {
                                    img.src = downloadsArtworkUrl(season.artworkRecord);
                                } else {
                                    img.style.display = 'none';
                                }
                            };
                        } else if (season.artworkRecord) {
                            img.src = downloadsArtworkUrl(season.artworkRecord);
                        } else {
                            img.style.display = 'none';
                        }
                    };
                    posterBox.appendChild(img);

                    // Top-right episode count badge
                    const countBadge = document.createElement('div');
                    countBadge.textContent = String(countEps);
                    countBadge.style.cssText = 'position:absolute;top:6px;right:6px;min-width:22px;height:22px;padding:0 6px;border-radius:11px;background:#00a4dc;color:#fff;font-size:0.75em;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 5px rgba(0,0,0,0.5);box-sizing:border-box;';
                    posterBox.appendChild(countBadge);

                    // Top-left percentage / pending pill
                    const pctPill = document.createElement('div');
                    pctPill.className = 'dl-season-pct-badge';
                    const pct = sTotal > 0 ? Math.min(100, Math.round(sDownloaded * 100 / (sTotal || 1))) : 0;
                    pctPill.textContent = sActive ? `${pct}%` : (sPending ? 'En attente' : '');
                    pctPill.style.cssText = `position:absolute;top:6px;left:6px;padding:2px 7px;border-radius:4px;background:rgba(0,164,220,0.85);backdrop-filter:blur(4px);color:#fff;font-size:0.72em;font-weight:700;display:${(sActive || sPending) ? 'flex' : 'none'};box-shadow:0 2px 5px rgba(0,0,0,0.4);`;
                    posterBox.appendChild(pctPill);

                    // Bottom progress track
                    const track = document.createElement('div');
                    track.className = 'dl-card-track dl-poster-track' + ((sPending && !sActive) ? ' is-pending' : '');
                    track.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:5px;background:rgba(0,0,0,0.65);z-index:6;display:${(sActive || sPending) ? 'block' : 'none'};`;
                    const bar = document.createElement('div');
                    bar.className = 'dl-card-bar' + ((sPending && !sActive) ? ' is-pending' : '');
                    bar.style.cssText = (sPending && !sActive)
                        ? 'height:100%;'
                        : `height:100%;width:${Math.max(pct, 3)}%;background:#00a4dc;`;
                    track.appendChild(bar);
                    posterBox.appendChild(track);

                    // Hover overlay
                    const hoverOverlay = document.createElement('div');
                    hoverOverlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .18s ease;';

                    const openCircle = document.createElement('div');
                    openCircle.style.cssText = 'width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,0.7);border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;padding-left:2px;box-sizing:border-box;';
                    const playInner = document.createElement('span');
                    playInner.style.cssText = 'width:20px;height:20px;display:flex;align-items:center;justify-content:center;';
                    playInner.innerHTML = DOWNLOAD_ICONS.play;
                    openCircle.appendChild(playInner);

                    const deleteSmallBtn = document.createElement('button');
                    deleteSmallBtn.type = 'button';
                    deleteSmallBtn.className = 'jf-btn-card-delete emby-button';
                    deleteSmallBtn.title = 'Supprimer cette saison';
                    deleteSmallBtn.innerHTML = DOWNLOAD_ICONS.trash;
                    deleteSmallBtn.onclick = (e) => {
                        e.stopPropagation();
                        showDeleteConfirmation('', `${group.displayName} - ${season.name}`, () => {
                            if (window.jmpNative && window.jmpNative.deleteDownload) {
                                if (season.seasonFolder) {
                                    window.jmpNative.deleteDownload(season.seasonFolder);
                                }
                                season.episodes.forEach(ep => {
                                    window.jmpNative.deleteDownload(ep.record.filename);
                                });
                            }
                            card.remove();
                        });
                    };

                    hoverOverlay.append(openCircle, deleteSmallBtn);
                    posterBox.appendChild(hoverOverlay);

                    // Click opens this season
                    posterBox.onclick = () => {
                        _downloadsUiState.openSeason = season.name;
                        rebuildDownloadsViewDom();
                    };

                    // Text below poster
                    const titleEl = document.createElement('div');
                    titleEl.textContent = season.name;
                    titleEl.title = season.name;
                    titleEl.style.cssText = 'margin-top:8px;font-size:0.88em;font-weight:500;color:#fff;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3;';

                    const subEl = document.createElement('div');
                    subEl.className = 'dl-season-sub';
                    if (sActive) {
                        subEl.textContent = `${pct}% · ${countEps - completedCount} en cours`;
                        subEl.style.color = '#00a4dc';
                    } else if (sPending) {
                        subEl.textContent = 'En attente...';
                        subEl.style.color = 'rgba(255,255,255,0.6)';
                    } else {
                        subEl.textContent = `${countEps} épisode${countEps > 1 ? 's' : ''} · ${formatDownloadSize(sDownloaded)}`;
                        subEl.style.color = 'rgba(255,255,255,0.55)';
                    }
                    subEl.style.cssText += ';margin-top:2px;font-size:0.78em;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

                    card.append(posterBox, titleEl, subEl);
                    seasonGrid.appendChild(card);
                });

                contentWrap.appendChild(seasonGrid);
            }

        } else {
            // Main View: Either Films or Series tab
            const isFilms = _downloadsUiState.activeTab === 'films';
            const count = isFilms ? movies.length : seriesMap.size;

            // Subheader matching Jellyfin
            const subHeader = document.createElement('div');
            subHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;';

            const hTitleBox = document.createElement('div');
            hTitleBox.style.cssText = 'display:flex;align-items:center;gap:12px;';

            const hTitle = document.createElement('h1');
            hTitle.textContent = isFilms ? 'Films' : 'Séries';
            hTitle.style.cssText = 'margin:0;font-size:1.75em;font-weight:600;letter-spacing:-0.02em;color:#fff;';

            const pillCount = document.createElement('span');
            pillCount.textContent = String(count);
            pillCount.style.cssText = 'font-size:0.85em;background:rgba(255,255,255,0.12);padding:2px 10px;border-radius:12px;font-weight:600;color:rgba(255,255,255,0.85);';

            hTitleBox.append(hTitle, pillCount);

            // "Tout lire" button on right side of subheader
            const playAllBtn = document.createElement('button');
            playAllBtn.type = 'button';
            playAllBtn.className = 'jf-btn jf-btn-primary emby-button';
            const hasItems = count > 0;
            playAllBtn.disabled = !hasItems;
            playAllBtn.style.cursor = hasItems ? 'pointer' : 'not-allowed';
            playAllBtn.style.opacity = hasItems ? '1' : '0.4';
            playAllBtn.style.boxShadow = hasItems ? '0 2px 5px rgba(0,0,0,0.35)' : 'none';
            const paIcon = document.createElement('span');
            paIcon.style.cssText = 'width:15px;height:15px;display:flex;align-items:center;justify-content:center;';
            paIcon.innerHTML = DOWNLOAD_ICONS.play;
            const paLabel = document.createElement('span');
            paLabel.textContent = 'Tout lire';
            playAllBtn.append(paIcon, paLabel);
            playAllBtn.onclick = () => {
                if (isFilms && movies.length > 0) {
                    playDownloadedItem(movies[0].record, movies[0].meta);
                } else if (!isFilms && seriesMap.size > 0) {
                    const firstGroup = seriesMap.values().next().value;
                    if (firstGroup) {
                        const firstSeason = firstGroup.seasons.values().next().value;
                        if (firstSeason && firstSeason.episodes.length > 0) {
                            playDownloadedItem(firstSeason.episodes[0].record, firstSeason.episodes[0].meta);
                        }
                    }
                }
            };

            subHeader.append(hTitleBox, playAllBtn);
            contentWrap.appendChild(subHeader);

            if (count === 0) {
                const empty = document.createElement('div');
                empty.style.cssText = 'text-align:center;padding:80px 20px;color:rgba(255,255,255,0.45);font-size:1.05em;';
                empty.textContent = isFilms ? 'Aucun film disponible hors ligne.' : 'Aucune série disponible hors ligne.';
                contentWrap.appendChild(empty);
            } else {
                // Jellyfin Poster Grid (Aspect Ratio 2:3)
                const grid = document.createElement('div');
                grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:24px 16px;';

                if (isFilms) {
                    movies.forEach(m => {
                        const card = document.createElement('div');
                        card.dataset.downloadFilename = m.record.filename;
                        card.style.cssText = 'display:flex;flex-direction:column;cursor:pointer;position:relative;width:100%;';

                        const posterBox = document.createElement('div');
                        posterBox.style.cssText = 'position:relative;width:100%;aspect-ratio:2/3;border-radius:4px;overflow:hidden;background:#181818;box-shadow:0 4px 12px rgba(0,0,0,0.35);transition:transform .18s ease,box-shadow .18s ease;';
                        card.onmouseenter = () => {
                            posterBox.style.transform = 'scale(1.04)';
                            posterBox.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
                            hoverOverlay.style.opacity = '1';
                        };
                        card.onmouseleave = () => {
                            posterBox.style.transform = 'none';
                            posterBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.35)';
                            hoverOverlay.style.opacity = '0';
                        };

                        const img = document.createElement('img');
                        img.src = downloadsArtworkUrl(m.record);
                        img.alt = m.title;
                        img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
                        img.onerror = () => { img.style.display = 'none'; };
                        posterBox.appendChild(img);

                        // Top-right checkmark if complete
                        if (m.record.status === 'complete') {
                            const badge = document.createElement('div');
                            badge.style.cssText = 'position:absolute;top:6px;right:6px;width:22px;height:22px;border-radius:50%;background:#00a4dc;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 5px rgba(0,0,0,0.5);padding:3px;box-sizing:border-box;';
                            badge.innerHTML = DOWNLOAD_ICONS.check;
                            posterBox.appendChild(badge);
                        }

                        const progress = m.record.total_bytes > 0
                            ? Math.min(100, Math.round(m.record.downloaded_bytes * 100 / m.record.total_bytes))
                            : 0;

                        // Top-right percentage pill badge
                        const pctBadge = document.createElement('div');
                        pctBadge.className = 'dl-card-pct-badge';
                        pctBadge.textContent = m.record.status === 'downloading' ? `${progress}%` : (m.record.status === 'pending' ? 'En attente' : '');
                        pctBadge.style.cssText = `position:absolute;top:6px;right:6px;padding:2px 7px;border-radius:4px;background:rgba(0,164,220,0.85);backdrop-filter:blur(4px);color:#fff;font-size:0.72em;font-weight:700;display:${m.record.status !== 'complete' ? 'flex' : 'none'};box-shadow:0 2px 5px rgba(0,0,0,0.4);`;
                        posterBox.appendChild(pctBadge);

                        // Bottom download progress bar
                        const track = document.createElement('div');
                        track.className = 'dl-card-track dl-poster-track' + (m.record.status === 'pending' ? ' is-pending' : '');
                        track.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:5px;background:rgba(0,0,0,0.65);z-index:6;display:${m.record.status === 'complete' ? 'none' : 'block'};`;
                        const bar = document.createElement('div');
                        bar.className = 'dl-card-bar' + (m.record.status === 'pending' ? ' is-pending' : '');
                        bar.style.cssText = m.record.status === 'pending'
                            ? 'height:100%;'
                            : `height:100%;width:${m.record.total_bytes ? Math.max(progress, 3) : (m.record.status === 'downloading' ? 3 : 0)}%;background:#00a4dc;`;
                        track.appendChild(bar);
                        posterBox.appendChild(track);

                        // Hover overlay
                        const hoverOverlay = document.createElement('div');
                        hoverOverlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .18s ease;';

                        const playCircle = document.createElement('div');
                        playCircle.style.cssText = 'width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,0.7);border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;padding-left:2px;box-sizing:border-box;';
                        const playInner = document.createElement('span');
                        playInner.style.cssText = 'width:20px;height:20px;display:flex;align-items:center;justify-content:center;';
                        playInner.innerHTML = DOWNLOAD_ICONS.play;
                        playCircle.appendChild(playInner);

                        const deleteSmallBtn = document.createElement('button');
                        deleteSmallBtn.type = 'button';
                        deleteSmallBtn.className = 'jf-btn-card-delete emby-button';
                        deleteSmallBtn.title = 'Supprimer ce film';
                        deleteSmallBtn.innerHTML = DOWNLOAD_ICONS.trash;
                        deleteSmallBtn.onclick = (e) => {
                            e.stopPropagation();
                            showDeleteConfirmation(m.record.filename, m.title, () => {
                                card.remove();
                            });
                        };

                        hoverOverlay.append(playCircle, deleteSmallBtn);
                        posterBox.appendChild(hoverOverlay);

                        posterBox.onclick = () => {
                            const cur = (window._downloadsCache || []).find(r => r.filename === m.record.filename) || m.record;
                            if (cur.status === 'complete') playDownloadedItem(cur, m.meta);
                        };

                        const titleEl = document.createElement('div');
                        titleEl.textContent = m.title;
                        titleEl.title = m.title;
                        titleEl.style.cssText = 'margin-top:8px;font-size:0.88em;font-weight:500;color:#fff;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3;';

                        const subEl = document.createElement('div');
                        subEl.className = 'dl-card-sub';
                        if (m.record.status === 'downloading') {
                            subEl.textContent = `${progress}% · ${formatDownloadSize(m.record.downloaded_bytes)} / ${formatDownloadSize(m.record.total_bytes)}`;
                            subEl.style.color = '#00a4dc';
                        } else if (m.record.status === 'pending') {
                            subEl.textContent = 'En attente...';
                            subEl.style.color = 'rgba(255,255,255,0.6)';
                        } else {
                            subEl.textContent = m.meta.ProductionYear ? String(m.meta.ProductionYear) : formatDownloadSize(m.record.downloaded_bytes);
                            subEl.style.color = 'rgba(255,255,255,0.55)';
                        }
                        subEl.style.cssText += ';margin-top:2px;font-size:0.78em;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

                        card.append(posterBox, titleEl, subEl);
                        grid.appendChild(card);
                    });

                } else {
                    // Series Cards (main view)
                    seriesMap.forEach(group => {
                        let totalEps = 0;
                        let totalBytes = 0;
                        let hasActive = false;
                        let hasPending = false;
                        let completedCount = 0;

                        group.seasons.forEach(sObj => {
                            totalEps += sObj.episodes.length;
                            sObj.episodes.forEach(ep => {
                                totalBytes += ep.record.downloaded_bytes || 0;
                                if (ep.record.status === 'downloading') hasActive = true;
                                if (ep.record.status === 'pending') hasPending = true;
                                if (ep.record.status === 'complete') completedCount++;
                            });
                        });

                        const card = document.createElement('div');
                        card.dataset.seriesCard = group.key;
                        card.style.cssText = 'display:flex;flex-direction:column;cursor:pointer;position:relative;width:100%;';

                        const posterBox = document.createElement('div');
                        posterBox.style.cssText = 'position:relative;width:100%;aspect-ratio:2/3;border-radius:4px;overflow:hidden;background:#181818;box-shadow:0 4px 12px rgba(0,0,0,0.35);transition:transform .18s ease,box-shadow .18s ease;';
                        card.onmouseenter = () => {
                            posterBox.style.transform = 'scale(1.04)';
                            posterBox.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
                            hoverOverlay.style.opacity = '1';
                        };
                        card.onmouseleave = () => {
                            posterBox.style.transform = 'none';
                            posterBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.35)';
                            hoverOverlay.style.opacity = '0';
                        };

                        if (group.seriesFolder) {
                            const img = document.createElement('img');
                            img.src = '/jmp_local_artwork?file=' + encodeURIComponent(group.seriesFolder + '/poster.jpg') + '&_t=' + Date.now();
                            img.alt = group.displayName;
                            img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
                            img.onerror = () => {
                                if (group.seriesId && window.ApiClient) {
                                    img.src = window.ApiClient.getUrl('/Items/' + group.seriesId + '/Images/Primary', { maxWidth: 600 });
                                    img.onerror = () => {
                                        if (group.artworkRecord) {
                                            img.src = downloadsArtworkUrl(group.artworkRecord);
                                        } else {
                                            img.style.display = 'none';
                                        }
                                    };
                                } else if (group.artworkRecord) {
                                    img.src = downloadsArtworkUrl(group.artworkRecord);
                                } else {
                                    img.style.display = 'none';
                                }
                            };
                            posterBox.appendChild(img);
                        } else if (group.artworkRecord) {
                            const img = document.createElement('img');
                            img.src = downloadsArtworkUrl(group.artworkRecord);
                            img.alt = group.displayName;
                            img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
                            img.onerror = () => { img.style.display = 'none'; };
                            posterBox.appendChild(img);
                        }

                        // Top-right episode count badge
                        const countBadge = document.createElement('div');
                        countBadge.textContent = String(totalEps);
                        countBadge.style.cssText = 'position:absolute;top:6px;right:6px;min-width:22px;height:22px;padding:0 6px;border-radius:11px;background:#00a4dc;color:#fff;font-size:0.75em;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 5px rgba(0,0,0,0.5);box-sizing:border-box;';
                        posterBox.appendChild(countBadge);

                        // Top-left percentage / pending pill
                        const pctPill = document.createElement('div');
                        pctPill.className = 'dl-series-pct-badge';
                        const pct = totalBytes > 0 ? Math.min(100, Math.round(totalBytes * 100 / (totalBytes || 1))) : 0;
                        pctPill.textContent = hasActive ? `${pct}%` : (hasPending ? 'En attente' : '');
                        pctPill.style.cssText = `position:absolute;top:6px;left:6px;padding:2px 7px;border-radius:4px;background:rgba(0,164,220,0.85);backdrop-filter:blur(4px);color:#fff;font-size:0.72em;font-weight:700;display:${(hasActive || hasPending) ? 'flex' : 'none'};box-shadow:0 2px 5px rgba(0,0,0,0.4);`;
                        posterBox.appendChild(pctPill);

                        // Bottom progress track
                        const track = document.createElement('div');
                        track.className = 'dl-card-track dl-poster-track' + ((hasPending && !hasActive) ? ' is-pending' : '');
                        track.style.cssText = `position:absolute;bottom:0;left:0;right:0;height:5px;background:rgba(0,0,0,0.65);z-index:6;display:${(hasActive || hasPending) ? 'block' : 'none'};`;
                        const bar = document.createElement('div');
                        bar.className = 'dl-card-bar' + ((hasPending && !hasActive) ? ' is-pending' : '');
                        bar.style.cssText = (hasPending && !hasActive)
                            ? 'height:100%;'
                            : `height:100%;width:${Math.max(pct, 3)}%;background:#00a4dc;`;
                        track.appendChild(bar);
                        posterBox.appendChild(track);

                        // Hover overlay
                        const hoverOverlay = document.createElement('div');
                        hoverOverlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .18s ease;';

                        const openCircle = document.createElement('div');
                        openCircle.style.cssText = 'width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,0.7);border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;padding-left:2px;box-sizing:border-box;';
                        const playInner = document.createElement('span');
                        playInner.style.cssText = 'width:20px;height:20px;display:flex;align-items:center;justify-content:center;';
                        playInner.innerHTML = DOWNLOAD_ICONS.play;
                        openCircle.appendChild(playInner);

                        const deleteSmallBtn = document.createElement('button');
                        deleteSmallBtn.type = 'button';
                        deleteSmallBtn.className = 'jf-btn-card-delete emby-button';
                        deleteSmallBtn.title = 'Supprimer toute la série';
                        deleteSmallBtn.innerHTML = DOWNLOAD_ICONS.trash;
                        deleteSmallBtn.onclick = (e) => {
                            e.stopPropagation();
                            showDeleteConfirmation('', group.displayName, () => {
                                if (window.jmpNative && window.jmpNative.deleteDownload) {
                                    if (group.seriesFolder) {
                                        window.jmpNative.deleteDownload(group.seriesFolder);
                                    }
                                    group.seasons.forEach(sObj => {
                                        if (sObj.seasonFolder && sObj.seasonFolder !== group.seriesFolder) {
                                            window.jmpNative.deleteDownload(sObj.seasonFolder);
                                        }
                                        sObj.episodes.forEach(ep => {
                                            window.jmpNative.deleteDownload(ep.record.filename);
                                        });
                                    });
                                }
                                card.remove();
                            });
                        };

                        hoverOverlay.append(openCircle, deleteSmallBtn);
                        posterBox.appendChild(hoverOverlay);

                        // Click opens the series folder (to view its seasons)
                        posterBox.onclick = () => {
                            _downloadsUiState.openSeries = group.key;
                            _downloadsUiState.openSeason = null;
                            rebuildDownloadsViewDom();
                        };

                        // Text below poster
                        const titleEl = document.createElement('div');
                        titleEl.textContent = group.displayName;
                        titleEl.title = group.displayName;
                        titleEl.style.cssText = 'margin-top:8px;font-size:0.88em;font-weight:500;color:#fff;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3;';

                        const subEl = document.createElement('div');
                        subEl.className = 'dl-series-sub';
                        if (hasActive) {
                            subEl.textContent = `${pct}% · ${totalEps - completedCount} en cours`;
                            subEl.style.color = '#00a4dc';
                        } else if (hasPending) {
                            subEl.textContent = 'En attente...';
                            subEl.style.color = 'rgba(255,255,255,0.6)';
                        } else {
                            subEl.textContent = `${totalEps} épisode${totalEps > 1 ? 's' : ''}`;
                            subEl.style.color = 'rgba(255,255,255,0.55)';
                        }
                        subEl.style.cssText += ';margin-top:2px;font-size:0.78em;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

                        card.append(posterBox, titleEl, subEl);
                        grid.appendChild(card);
                    });
                }

                contentWrap.appendChild(grid);
            }
        }

        scrollContainer.appendChild(contentWrap);
        view.appendChild(scrollContainer);
        if (existing && existing.parentNode) {
            existing.replaceWith(view);
        } else {
            document.body.appendChild(view);
        }
    }

    function renderDownloadsView(records) {
        _downloadsUiState.records = records;

        const isOfflinePage = (window.location.href || '').includes('offline.html');
        // Ne jamais ouvrir la vue de force si elle n'a pas été demandée
        if (!_downloadsUiState.isOpen && !isOfflinePage) {
            return;
        }

        const view = document.getElementById('jellium-downloads-view');
        if (!view) {
            rebuildDownloadsViewDom();
            return;
        }

        const { movies, seriesMap } = groupDownloadRecords(records);
        const statusMap = {};
        let statusChanged = false;
        records.forEach(r => {
            statusMap[r.filename] = r.status;
            if (window._lastRecordStatuses && window._lastRecordStatuses[r.filename] && window._lastRecordStatuses[r.filename] !== r.status) {
                statusChanged = true;
            }
        });
        window._lastRecordStatuses = statusMap;

        const prevCount = parseInt(view.dataset.totalCount || '0', 10);
        if (prevCount !== records.length || statusChanged) {
            rebuildDownloadsViewDom();
            return;
        }

        if (_downloadsUiState.openSeries && !seriesMap.has(_downloadsUiState.openSeries) && ![...seriesMap.values()].some(g => g.displayName === _downloadsUiState.openSeries || g.key === _downloadsUiState.openSeries)) {
            _downloadsUiState.openSeries = null;
            _downloadsUiState.openSeason = null;
            rebuildDownloadsViewDom();
            return;
        }

        if (_downloadsUiState.openSeries && _downloadsUiState.openSeason) {
            const group = seriesMap.get(_downloadsUiState.openSeries) || [...seriesMap.values()].find(g => g.displayName === _downloadsUiState.openSeries || g.key === _downloadsUiState.openSeries);
            if (!group || !group.seasons.has(_downloadsUiState.openSeason)) {
                _downloadsUiState.openSeason = null;
                rebuildDownloadsViewDom();
                return;
            }
        }

        updateDownloadsProgressInPlace(records, movies, seriesMap);
    }

    window._nativeDownloadsResult = function(json) {
        let records = [];
        try { records = JSON.parse(json); } catch (_) { records = []; }
        window._downloadsCache = records;
        _downloadsUiState.records = records;
        renderDownloadsView(records);
        if (typeof updateDownloadMenuItems === 'function') {
            updateDownloadMenuItems();
        }
        const hasActiveDownloads = records.some(function(r) { return r.status === 'downloading' || r.status === 'pending'; });
        if (document.getElementById('jellium-downloads-view') && hasActiveDownloads) {
            clearInterval(window._downloadsRefreshTimer);
            window._downloadsRefreshTimer = setInterval(showDownloadsView, 2500);
        } else {
            clearInterval(window._downloadsRefreshTimer);
            window._downloadsRefreshTimer = null;
        }
    };

    window._nativeDownloadDeleted = function(deleted) {
        showDownloadsView();
    };

    function showDownloadsView() {
        _downloadsUiState.isOpen = true;
        const view = document.getElementById('jellium-downloads-view');
        if (!view && window._downloadsCache) {
            rebuildDownloadsViewDom();
        }
        if (window.jmpNative && window.jmpNative.listDownloads) {
            window.jmpNative.listDownloads();
        }
    }

    window.showDownloadsView = showDownloadsView;
    window.closeDownloadsView = closeDownloadsView;

    function createDownloadsMenuItem(tagName, className, reference) {
        const item = document.createElement(tagName);
        item.className = className + ' jellium-downloads-menu-item';
        const icon = document.createElement('span');
        icon.innerHTML = DOWNLOAD_ICONS.download;
        icon.setAttribute('aria-hidden', 'true');
        icon.style.cssText = 'display:inline-flex;width:20px;height:20px;align-items:center;justify-content:center;font-size:1.1em;';
        const label = document.createElement('span');
        label.textContent = 'Téléchargements';
        item.append(icon, label);
        item.setAttribute('role', 'menuitem');
        item.tabIndex = 0;
        item.style.cssText = 'display:flex;align-items:center;gap:12px;width:calc(100% + 2px);height:44px;margin-left:-1px;padding:0 16px;background:transparent;border:0;color:inherit;text-align:left;cursor:pointer;font:inherit;box-sizing:border-box;transition:background-color .15s ease;';
        if (reference) {
            const referenceStyle = getComputedStyle(reference);
            item.style.height = `${reference.getBoundingClientRect().height}px`;
            item.style.padding = referenceStyle.padding;
            item.style.font = referenceStyle.font;
            item.style.lineHeight = referenceStyle.lineHeight;
        }
        item.onmouseenter = () => { item.style.backgroundColor = 'rgba(255,255,255,.18)'; };
        item.onmouseleave = () => { item.style.backgroundColor = 'transparent'; };
        item.onclick = event => {
            event.preventDefault();
            event.stopPropagation();
            _downloadsUiState.openSeries = null;
            showDownloadsView();
        };
        item.onkeydown = event => {
            if (event.key === 'Enter' || event.key === ' ') item.click();
        };
        return item;
    }

    function appendDownloadsMenuItem(menu) {
        if (!menu || menu.querySelector('.jellium-downloads-menu-item')) return true;
        const reference = menu.querySelector('[role="menuitem"], button, a, .listItem');
        const item = createDownloadsMenuItem('div', '', reference);
        menu.appendChild(item);
        return true;
    }

    function appendDownloadsAfterEnhanced() {
        const enhancedLabel = [...document.querySelectorAll('body *')].find(element =>
            element.textContent.replace(/\s+/g, ' ').trim() === 'Jellyfin Enhanced' && element.offsetParent !== null
        );
        if (!enhancedLabel) return false;
        const anchor = enhancedLabel.closest('a, button, [role="menuitem"], .listItem') || enhancedLabel.parentElement;
        if (!anchor || !anchor.parentElement) return false;
        if (anchor.parentElement.querySelector('.jellium-downloads-menu-item')) return true;
        const item = createDownloadsMenuItem(
            anchor.tagName.toLowerCase() === 'button' ? 'button' : 'div',
            anchor.className,
            anchor
        );
        anchor.insertAdjacentElement('afterend', item);
        return true;
    }

    function installDownloadsMenuItem() {
        const profile = document.querySelector('.headerUserButton, [class*="userButton" i], [aria-label*="profile" i], [aria-label*="user" i], [title*="profile" i]');
        if (!profile || profile.dataset.jelliumDownloadsBound) return;
        profile.dataset.jelliumDownloadsBound = 'true';
        profile.addEventListener('click', () => setTimeout(() => {
            const menus = [...document.querySelectorAll('[role="menu"], .actionSheet, .paper-menu, .menu')]
                .filter(menu => menu.offsetParent !== null);
            const menu = menus.find(candidate => /déconnexion|deconnexion|sign out|logout/i.test(candidate.textContent)) || menus[0];
            if (appendDownloadsAfterEnhanced()) return;
            appendDownloadsMenuItem(menu);
        }, 50), true);
    }

    document.addEventListener('click', event => {
        const profile = event.target.closest?.('.headerUserButton, [class*="userButton" i], [aria-label*="profile" i], [aria-label*="user" i], [title*="profile" i]');
        if (profile) setTimeout(installDownloadsMenuItem, 100);
        setTimeout(appendDownloadsAfterEnhanced, 100);
    }, true);

    function startDownloadsMenuObserver() {
        if (!document.documentElement) return;
        new MutationObserver(() => {
            try { installDownloadsMenuItem(); } catch (error) {
                console.debug('[Downloads] Menu injection deferred:', error);
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
        installDownloadsMenuItem();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startDownloadsMenuObserver, { once: true });
    } else {
        startDownloadsMenuObserver();
    }

    
      setTimeout(() => {
          if (window.jmpNative && window.jmpNative.getUpdateInfo) {
              window.jmpNative.getUpdateInfo();
          }
      }, 5000);
      window.initCompleted = Promise.resolve();

    window.apiPromise = Promise.resolve(window.api);

    function sendThemeColor(color) {
        if (color && window.jmpNative && window.jmpNative.themeColor) {
            window.jmpNative.themeColor(color);
        }
    }

    function observeThemeColorMeta(meta) {
        sendThemeColor(meta.content);
        new MutationObserver(() => sendThemeColor(meta.content))
            .observe(meta, { attributes: true, attributeFilter: ['content'] });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        let css = 'body.mouseIdle, body.mouseIdle * { cursor: none !important; }';
        css += '\n@keyframes mpv-video-zoomin { from { transform: scale3d(0.2, 0.2, 0.2); opacity: 0.6; } to { transform: none; opacity: initial; } }';
        css += '\nhtml.transparentDocument, body.transparentDocument, html.transparentDocument body, .transparentDocument #app, .transparentDocument .mainAnimatedPage, .transparentDocument .mainAnimatedPages, .transparentDocument .skinHeader, .transparentDocument .view, .transparentDocument .page { background-color: transparent !important; background: transparent !important; }';

        if (jmpInfo.settings.advanced.hideScrollbar) {
            css += '\n::-webkit-scrollbar, *::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }';
            css += '\nhtml { scrollbar-width: none !important; }';
        }

        if (navigator.platform.startsWith('Mac') && jmpInfo.settings.advanced.transparentTitlebar) {
            css += '\n:root { --mac-titlebar-height: 22px; }';
            css += '\n.skinHeader { padding-top: var(--mac-titlebar-height) !important; }';
            css += '\n.mainAnimatedPage { top: var(--mac-titlebar-height) !important; }';
            css += '\n.touch-menu-la { padding-top: var(--mac-titlebar-height); }';
            css += '\n.MuiAppBar-positionFixed { padding-top: var(--mac-titlebar-height) !important; }';
            css += '\n.MuiDrawer-paper { padding-top: var(--mac-titlebar-height) !important; }';
            css += '\n.formDialogHeader { padding-top: var(--mac-titlebar-height) !important; }';

            document._callbacks = document._callbacks || {};
            document._callbacks['SHOW_VIDEO_OSD'] = document._callbacks['SHOW_VIDEO_OSD'] || [];
            document._callbacks['SHOW_VIDEO_OSD'].push((_e, visible) => {
                if (window.jmpNative && window.jmpNative.setOsdVisible) {
                    window.jmpNative.setOsdVisible(!!visible);
                }
            });
        }

        style.textContent = css;
        document.head.appendChild(style);

        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            observeThemeColorMeta(meta);
        } else {
            new MutationObserver((mutations, obs) => {
                for (const m of mutations) {
                    for (const node of m.addedNodes) {
                        if (node.nodeName === 'META' && node.name === 'theme-color') {
                            obs.disconnect();
                            observeThemeColorMeta(node);
                            return;
                        }
                    }
                }
            }).observe(document.head, { childList: true });
        }
    });



    const checkUpdateInterval = setInterval(() => {
        if (window._updateDialogShown) {
            clearInterval(checkUpdateInterval);
            return;
        }
        if (window.jmpNative && window.jmpNative.getUpdateInfo) {
            window.jmpNative.getUpdateInfo();
        }
    }, 15000);
    window._nativeUpdateInfoResult = function(version, downloadUrl, assetName) {
        if (window._updateDialogShown) return;
        window._updateDialogShown = true;
        clearInterval(checkUpdateInterval);

        const dialog = document.createElement('div');
        dialog.id = 'jfn-update-dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '0';
        dialog.style.left = '0';
        dialog.style.width = '100vw';
        dialog.style.height = '100vh';
        dialog.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        dialog.style.display = 'flex';
        dialog.style.alignItems = 'center';
        dialog.style.justifyContent = 'center';
        dialog.style.zIndex = '999999';
        
        const box = document.createElement('div');
        box.style.backgroundColor = 'rgba(28, 28, 28, 0.95)';
        box.style.padding = '2rem';
        box.style.borderRadius = '12px';
        box.style.maxWidth = '400px';
        box.style.textAlign = 'center';
        box.style.color = 'white';
        box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        box.style.fontFamily = 'sans-serif';
        box.style.border = '1px solid rgba(255,255,255,0.1)';

        const title = document.createElement('h2');
        title.innerText = 'Update available';
        title.style.margin = '0 0 1rem 0';
        
        const desc = document.createElement('p');
        desc.innerText = `Version ${version} is now available!\nWould you like to download it?`;
        desc.style.margin = '0 0 2rem 0';
        desc.style.lineHeight = '1.5';

        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.gap = '1rem';
        btnRow.style.justifyContent = 'center';

        const btnYes = document.createElement('button');
        btnYes.className = 'jf-btn jf-btn-primary emby-button';
        btnYes.innerText = 'Download';
        btnYes.onclick = () => {
            if (window.jmpNative && window.jmpNative.installUpdate) {
                btnYes.innerText = 'Downloading...';
                btnYes.disabled = true;
                window.jmpNative.installUpdate(downloadUrl, assetName);
            }
        };

        const btnNo = document.createElement('button');
        btnNo.className = 'jf-btn jf-btn-secondary emby-button';
        btnNo.innerText = 'Later';
        btnNo.onclick = () => dialog.remove();

        btnRow.appendChild(btnNo);
        btnRow.appendChild(btnYes);
        
        box.appendChild(title);
        box.appendChild(desc);
        box.appendChild(btnRow);
        dialog.appendChild(box);
        
        document.body.appendChild(dialog);
    };

    console.debug('[Media] Native shim installed');
})();

// --- Auto-loader pour Jellyfin Enhanced ---
(function() {
    function loadJellyfinEnhanced() {
        if (window.JellyfinEnhanced) return;
        var existing = document.querySelector('script[src*="JellyfinEnhanced"]');
        if (!existing || !window.JellyfinEnhanced) {
            var s = document.createElement('script');
            s.src = '../JellyfinEnhanced/script';
            s.defer = true;
            document.head.appendChild(s);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadJellyfinEnhanced);
    } else {
        loadJellyfinEnhanced();
    }
})();

// --- Moteur de telechargement natif Jellyfin Desktop ---
(function() {
    function installDownloadItemCache() {
        if (!window.ApiClient) return;
        if (window.ApiClient._jelliumDownloadItemCacheInstalled) return;
        var originalGetItem = window.ApiClient.getItem;
        if (typeof originalGetItem !== 'function') return;
        window.ApiClient.getItem = function() {
            return originalGetItem.apply(this, arguments).then(function(item) {
                if (item && item.Id) window._lastJellyfinDownloadItem = item;
                return item;
            });
        };
        window.ApiClient._jelliumDownloadItemCacheInstalled = true;
    }

    installDownloadItemCache();
    var downloadItemCacheTimer = setInterval(function() {
        installDownloadItemCache();
        if (window.ApiClient && window.ApiClient._jelliumDownloadItemCacheInstalled) {
            clearInterval(downloadItemCacheTimer);
        }
    }, 250);

    function getMediaTitle() {
        var titleEl = document.querySelector('.itemName, .pageTitle, h1');
        if (titleEl && titleEl.textContent.trim()) {
            return titleEl.textContent.trim() + '.mkv';
        }
        return 'download.mkv';
    }

    function resolveItemId(target) {
        // 1. Chercher data-id sur les ancetres sans accepter 'download'
        var el = target;
        while (el && el !== document.body) {
            var id = el.getAttribute('data-id') || el.getAttribute('data-itemid');
            if (id && !/^download(?:all)?$/i.test(id)) return id;
            el = el.parentElement;
        }

        // 2. Chercher dans l'URL (hash ou query string)
        var match = window.location.href.match(/[?&#](?:id|itemId)=([a-f0-9]{32})/i);
        if (match) return match[1];

        // 3. Chercher sur la page de details d'un element actif
        var page = document.querySelector('.itemDetailPage:not(.hide)');
        if (page) {
            var pageId = page.getAttribute('data-itemid') || page.getAttribute('data-id');
            if (pageId && !/^download(?:all)?$/i.test(pageId)) return pageId;
            var nestedId = page.querySelector('[data-itemid], [data-id]');
            var nestedValue = nestedId && (nestedId.getAttribute('data-itemid') || nestedId.getAttribute('data-id'));
            if (nestedValue && !/^download(?:all)?$/i.test(nestedValue)) return nestedValue;
        }

        var urlId = window.location.pathname.match(/\/Items\/([a-f0-9]{32})/i);
        if (urlId) return urlId[1];

        if (window._lastJellyfinDownloadItem && window._lastJellyfinDownloadItem.Id) {
            return window._lastJellyfinDownloadItem.Id;
        }

        return null;
    }

    function sanitizePathSegment(str) {
        return (str || '')
            .replace(/[\\/:*?"<>|]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getDownloadPath(item, filename) {
        if (!item) return filename || 'download.mkv';
        if (item.Type === 'Episode') {
            var series = sanitizePathSegment(item.SeriesName || (item.Series && item.Series.Name) || 'Série');
            var seasonNumber = item.ParentIndexNumber != null ? item.ParentIndexNumber : (item.SeasonNumber || 1);
            var season = sanitizePathSegment(item.SeasonName || ('Saison ' + String(seasonNumber).padStart(2, '0')));
            var epNum = item.IndexNumber != null ? 'E' + String(item.IndexNumber).padStart(2, '0') + ' - ' : '';
            var title = sanitizePathSegment(item.Name || (filename ? filename.replace(/\.mkv$/i, '') : 'Épisode'));
            return 'Series/' + series + '/' + season + '/' + epNum + title + '.mkv';
        }

        var movieTitle = sanitizePathSegment(item.Name || (filename ? filename.replace(/\.mkv$/i, '') : 'Film'));
        if (item.ProductionYear) {
            movieTitle += ' (' + item.ProductionYear + ')';
        }
        return 'Films/' + movieTitle + '.mkv';
    }

    function getDownloadSubtitles(item, mediaPath) {
        if (!item || !item.Id || !window.ApiClient) return [];
        var source = (item.MediaSources && item.MediaSources[0]) || null;
        var streams = (source && source.MediaStreams) || item.MediaStreams || [];
        var baseName = mediaPath.replace(/\.mkv$/i, '');
        var token = window.ApiClient.accessToken ? window.ApiClient.accessToken() : '';
        var bitmapCodecs = ['pgssub', 'pgs', 'dvdsub', 'dvd_subtitle', 'vobsub', 'hdmv_pgs_subtitle', 'dvb_subtitle'];

        var results = [];
        streams.forEach(function(stream) {
            if (stream.Type !== 'Subtitle' || stream.Index === undefined) return;
            var codec = (stream.Codec || '').toLowerCase();
            var isBitmap = bitmapCodecs.includes(codec);

            // Les sous-titres bitmap intégrés au conteneur MKV sont déjà dans la vidéo téléchargée
            if (isBitmap && !stream.DeliveryUrl) {
                return;
            }

            var language = stream.Language || stream.DisplayLanguage || 'und';
            var suffix = stream.IsForced ? '.forced' : '';
            var ext = 'srt';
            if (codec === 'ass' || codec === 'ssa') ext = 'ass';
            else if (codec === 'vtt' || codec === 'webvtt') ext = 'vtt';

            var subUrl = '';
            if (stream.DeliveryUrl) {
                subUrl = window.ApiClient.getUrl(stream.DeliveryUrl, { api_key: token });
            } else {
                var sourceId = (source && source.Id) || item.Id;
                subUrl = window.ApiClient.getUrl(
                    '/Videos/' + item.Id + '/' + sourceId + '/Subtitles/' + stream.Index + '/Stream.' + ext,
                    { api_key: token }
                );
            }

            results.push({
                url: subUrl,
                filename: baseName + '.' + language + suffix + '.' + ext
            });
        });

        return results;
    }

    var pendingDownloadRequests = new Map();
    var nextDownloadRequestId = 1;

    function sendNativeDownload(request) {
        if (window.jmpNative && typeof window.jmpNative.startDownload === 'function') {
            window.jmpNative.startDownload(
                request.url,
                request.filename,
                request.metadata ? JSON.stringify(request.metadata) : '',
                request.artworkUrl || '',
                request.subtitles ? JSON.stringify(request.subtitles) : '[]'
            );
            return true;
        }
        return false;
    }

    window._nativeDownloadExists = function(requestId, exists) {
        var request = pendingDownloadRequests.get(requestId);
        pendingDownloadRequests.delete(requestId);
        if (!request) return;
        if (exists) {
            if (window.NativeShell && window.NativeShell.AppHost && window.NativeShell.AppHost.displayMessage) {
                window.NativeShell.AppHost.displayMessage('Ce téléchargement est déjà disponible localement.');
            } else {
                console.info('[Downloader] Déjà téléchargé:', request.filename);
            }
            return;
        }
        sendNativeDownload(request);
    };

    function isAlreadyDownloaded(item, targetPath) {
        var records = window._downloadsCache || (window._downloadsUiState && window._downloadsUiState.records) || [];
        var normTarget = (targetPath || '').replace(/\\/g, '/').toLowerCase();
        var targetFileOnly = normTarget.split('/').pop();
        var itemId = item && item.Id;

        for (var i = 0; i < records.length; i++) {
            var r = records[i];
            var normR = (r.filename || '').replace(/\\/g, '/').toLowerCase();
            var rFileOnly = normR.split('/').pop();

            // Match exact relative path or filename
            if (normR === normTarget || (targetFileOnly && rFileOnly === targetFileOnly)) {
                return { exists: true, status: r.status, record: r };
            }
            // Match Jellyfin item Id from metadata
            if (itemId) {
                var meta = {};
                try { meta = JSON.parse(r.metadata || '{}'); } catch (_) {}
                if (meta.Id === itemId) {
                    return { exists: true, status: r.status, record: r };
                }
            }
        }
        return { exists: false };
    }

    function dismissOpenPopups() {
        document.querySelectorAll('.actionsheet, .actionSheet, .dialogContainer, .formDialog, .paper-menu-dialog, .dialogBackdrop, .actionSheetBackdrop').forEach(function(el) {
            try {
                if (typeof el.close === 'function') el.close();
                else el.remove();
            } catch (_) {
                el.remove();
            }
        });
        document.querySelectorAll('.jctx-menu, .custom-context-menu').forEach(function(el) {
            el.remove();
        });
        try {
            document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
            document.body.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
            document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
        } catch (_) {}
    }

    var _lastInteractionTarget = null;
    document.addEventListener('contextmenu', function(e) {
        _lastInteractionTarget = e.target;
        setTimeout(updateDownloadMenuItems, 50);
        setTimeout(updateDownloadMenuItems, 180);
    }, true);
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.actionSheet, .dialogContainer, .actionsheet, .paper-menu')) {
            _lastInteractionTarget = e.target;
        }
        setTimeout(updateDownloadMenuItems, 50);
        setTimeout(updateDownloadMenuItems, 180);
    }, true);

    function getItemDownloadState(itemId) {
        if (!itemId) return null;
        try {
            var records = window._downloadsCache || (window._downloadsUiState && window._downloadsUiState.records) || [];
            var matchingEpisodes = [];
            var matchingRecord = null;

            for (var i = 0; i < records.length; i++) {
                var r = records[i];
                var meta = {};
                try { meta = JSON.parse(r.metadata || '{}'); } catch (_) {}

                if (meta.Id === itemId) {
                    matchingRecord = { record: r, meta: meta };
                    break;
                }

                if (meta.SeriesId === itemId || meta.SeasonId === itemId) {
                    matchingEpisodes.push({ record: r, meta: meta });
                }
            }

            if (matchingRecord) {
                return {
                    downloaded: true,
                    status: matchingRecord.record.status,
                    isSeries: false,
                    title: matchingRecord.meta.Name || ''
                };
            }

            if (matchingEpisodes.length > 0) {
                var hasDownloading = matchingEpisodes.some(function(e) { return e.record.status === 'downloading'; });
                var hasPending = matchingEpisodes.some(function(e) { return e.record.status === 'pending'; });
                var seriesTitle = matchingEpisodes[0].meta.SeriesName || matchingEpisodes[0].meta.Name || '';
                var status = (hasDownloading || hasPending) ? 'downloading' : 'complete';
                return {
                    downloaded: true,
                    status: status,
                    isSeries: true,
                    title: seriesTitle,
                    episodeCount: matchingEpisodes.length
                };
            }
        } catch (e) {
            console.warn('[OfflineHooks] Error in getItemDownloadState:', e);
        }

        return null;
    }

    function findDownloadMenuLabel(item) {
        var titleEl = item.querySelector('.actionSheetMenuItemTitle, .actionSheetMenuItemText, .listItemBodyText, .buttonText, .listItemTitle');
        if (titleEl) return titleEl;

        var candidates = item.querySelectorAll('div, span, p');
        for (var i = 0; i < candidates.length; i++) {
            var el = candidates[i];
            if (el.classList.contains('actionsheetMenuItemIcon') ||
                el.classList.contains('material-icons') ||
                el.classList.contains('material-symbols-outlined') ||
                el.classList.contains('md-icon')) {
                continue;
            }
            if (/t[eé]l[eé]charger|download/i.test(el.textContent)) {
                return el;
            }
        }
        return null;
    }

    function updateDownloadMenuItems() {
        // 1. Mise à jour des menus d'actions / feuilles de dialogue
        var menus = document.querySelectorAll('.actionSheet, .actionsheet, .dialogContainer, .formDialog, .paper-menu');
        var target = _lastInteractionTarget || document.activeElement;
        var menuContextId = resolveItemId(target) || resolveItemId(document.body);

        if (menuContextId) {
            var menuState = getItemDownloadState(menuContextId);
            if (menuState && menuState.downloaded) {
                menus.forEach(function(menu) {
                    var items = menu.querySelectorAll('.actionSheetMenuItem, [data-action="download"], button, a, .listItem');
                    items.forEach(function(item) {
                        if (/demand|request|jellyseerr/i.test(item.textContent)) return;

                        if (/t[eé]l[eé]charger|download/i.test(item.textContent)) {
                            var labelEl = findDownloadMenuLabel(item);
                            if (!labelEl && !item.querySelector('.actionsheetMenuItemIcon, .material-icons, .md-icon')) {
                                labelEl = item;
                            }
                            if (labelEl) {
                                if (menuState.status === 'complete') {
                                    labelEl.textContent = menuState.isSeries ? '✓ Série déjà téléchargée' : '✓ Déjà téléchargé';
                                    item.style.color = '#4caf50';
                                } else if (menuState.status === 'downloading') {
                                    labelEl.textContent = 'Téléchargement en cours...';
                                    item.style.color = '#00a4dc';
                                } else if (menuState.status === 'pending') {
                                    labelEl.textContent = 'En file d’attente...';
                                    item.style.color = 'rgba(255,255,255,0.7)';
                                }
                            }
                        }
                    });
                });
            }
        }

        // 2. Mise à jour de tous les boutons de téléchargement (pages de détails, listes d'épisodes, etc.)
        var pageItemId = resolveItemId(document.body) || (window._lastJellyfinDownloadItem && window._lastJellyfinDownloadItem.Id);
        var pageButtons = document.querySelectorAll(
            '.itemDetailPage:not(.hide) [data-action="download"], .itemDetailPage:not(.hide) .btnDownload, ' +
            '[data-role="page"]:not(.hide) [data-action="download"], [data-role="page"]:not(.hide) .btnDownload, ' +
            '.detailPageContent [data-action="download"], .detailPageContent .btnDownload, ' +
            '.detailButton[data-action="download"], .btnDownload, [data-action="download"]'
        );

        pageButtons.forEach(function(btn) {
            if (btn.closest('.actionSheet, .actionsheet, .dialogContainer, .formDialog, .paper-menu')) return;
            if (/demand|request|jellyseerr/i.test(btn.textContent || '')) return;

            var id = btn.getAttribute('data-itemid') ||
                     btn.getAttribute('data-id') ||
                     btn.closest('[data-id], [data-itemid]')?.getAttribute('data-id') ||
                     btn.closest('[data-id], [data-itemid]')?.getAttribute('data-itemid') ||
                     resolveItemId(btn) ||
                     pageItemId;

            if (!id) return;
            var state = getItemDownloadState(id);
            if (!state || !state.downloaded) return;

            var labelEl = btn.querySelector('.buttonText, .detailButton-text') ||
                [...btn.querySelectorAll('span')].find(function(s) {
                    return !s.classList.contains('material-icons') &&
                           !s.classList.contains('actionsheetMenuItemIcon') &&
                           !s.classList.contains('md-icon') &&
                           s.textContent.trim().length > 0;
                });

            var iconEl = btn.querySelector('.material-icons, .actionsheetMenuItemIcon, .md-icon, .detailButton-icon');

            if (state.status === 'complete') {
                if (labelEl && labelEl.textContent.trim()) {
                    labelEl.textContent = state.isSeries ? '✓ Série déjà téléchargée' : '✓ Déjà téléchargé';
                }
                if (iconEl) {
                    iconEl.textContent = 'check';
                }
                btn.style.color = '#4caf50';
                btn.setAttribute('title', state.isSeries ? 'Série déjà téléchargée' : 'Déjà téléchargé');
            } else if (state.status === 'downloading') {
                if (labelEl && labelEl.textContent.trim()) {
                    labelEl.textContent = 'Téléchargement en cours...';
                }
                btn.style.color = '#00a4dc';
                btn.setAttribute('title', 'Téléchargement en cours...');
            }
        });
    }

    try {
        var menuObserver = new MutationObserver(function(mutations) {
            var shouldUpdate = false;
            for (var i = 0; i < mutations.length; i++) {
                var added = mutations[i].addedNodes;
                for (var j = 0; j < added.length; j++) {
                    var node = added[j];
                    if (node.nodeType === 1 && (
                        node.matches?.('.actionSheet, .actionsheet, .dialogContainer, .itemDetailPage, .btnDownload, [data-action="download"]') ||
                        node.querySelector?.('.actionSheet, .actionSheetMenuItem, [data-action="download"], .btnDownload')
                    )) {
                        shouldUpdate = true;
                        break;
                    }
                }
                if (shouldUpdate) break;
            }
            if (shouldUpdate) {
                updateDownloadMenuItems();
            }
        });
        menuObserver.observe(document.body, { childList: true, subtree: true });
    } catch (_) {}

    ['viewshow', 'pageshow', 'pagebeforeshow', 'hashchange', 'popstate'].forEach(function(evt) {
        window.addEventListener(evt, function() {
            setTimeout(updateDownloadMenuItems, 60);
            setTimeout(updateDownloadMenuItems, 250);
            setTimeout(updateDownloadMenuItems, 600);
        });
        document.addEventListener(evt, function() {
            setTimeout(updateDownloadMenuItems, 60);
            setTimeout(updateDownloadMenuItems, 250);
            setTimeout(updateDownloadMenuItems, 600);
        });
    });

    function initDownloadsCheck() {
        if (window.jmpNative && typeof window.jmpNative.listDownloads === 'function') {
            window.jmpNative.listDownloads();
        }
    }
    setTimeout(initDownloadsCheck, 500);
    setTimeout(initDownloadsCheck, 1500);
    setTimeout(initDownloadsCheck, 3500);
    setInterval(function() {
        if (!document.hidden && window.jmpNative && typeof window.jmpNative.listDownloads === 'function') {
            window.jmpNative.listDownloads();
        }
    }, 5000);

    function doNativeDownload(url, filename, metadata, artworkUrl, subtitles, silentToast) {
        if (!url) return false;
        var finalName = filename || getMediaTitle();
        if (metadata && (finalName === 'download.mkv' || !finalName.includes('/'))) {
            finalName = getDownloadPath(metadata, finalName);
        }
        if (finalName === 'download.mkv') {
            console.error('[Downloader] Métadonnées absentes, téléchargement annulé:', url);
            return false;
        }

        var check = isAlreadyDownloaded(metadata, finalName);
        if (check.exists) {
            var msg = 'Cet élément est déjà téléchargé et disponible hors ligne.';
            if (check.status === 'downloading') {
                msg = 'Le téléchargement de cet élément est déjà en cours.';
            } else if (check.status === 'pending') {
                msg = 'Cet élément est déjà dans la file d’attente de téléchargement.';
            }
            if (window.NativeShell && window.NativeShell.AppHost && window.NativeShell.AppHost.displayMessage) {
                window.NativeShell.AppHost.displayMessage(msg);
            } else {
                window.alert(msg);
            }
            return false;
        }

        console.warn('[Downloader] Declenchement jmpNative.startDownload :', finalName, url);
        var request = { url: url, filename: finalName, metadata: metadata, artworkUrl: artworkUrl, subtitles: subtitles };
        if (sendNativeDownload(request)) {
            console.warn('[Downloader] Transmission IPC vers Rust reussie !');
            if (!silentToast && window.NativeShell && window.NativeShell.AppHost && window.NativeShell.AppHost.displayMessage) {
                var nameStr = (metadata && metadata.Name) || finalName.split('/').pop().replace(/\.mkv$/i, '');
                window.NativeShell.AppHost.displayMessage('Téléchargement lancé : ' + nameStr);
            }
            return true;
        }
        console.error('[Downloader] window.jmpNative.startDownload introuvable !', window.jmpNative);
        return false;
    }

    function getDownloadArtworkUrl(item) {
        if (!item || !window.ApiClient || !item.Id) return '';
        var imageTags = item.ImageTags || {};
        var path = '';
        var tag = '';
        if (item.Type === 'Episode') {
            if (imageTags.Primary) {
                path = '/Items/' + item.Id + '/Images/Primary';
                tag = imageTags.Primary;
            } else if (imageTags.Thumb) {
                path = '/Items/' + item.Id + '/Images/Thumb';
                tag = imageTags.Thumb;
            } else if (item.SeriesId && item.SeriesPrimaryImageTag) {
                path = '/Items/' + item.SeriesId + '/Images/Primary';
                tag = item.SeriesPrimaryImageTag;
            } else if (item.SeasonId && item.SeasonPrimaryImageTag) {
                path = '/Items/' + item.SeasonId + '/Images/Primary';
                tag = item.SeasonPrimaryImageTag;
            } else if (item.SeriesId) {
                path = '/Items/' + item.SeriesId + '/Images/Primary';
            }
        } else if ((item.MediaType === 'Audio' || item.Type === 'Audio') && item.AlbumId && item.AlbumPrimaryImageTag) {
            path = '/Items/' + item.AlbumId + '/Images/Primary';
            tag = item.AlbumPrimaryImageTag;
        } else if (imageTags.Primary) {
            path = '/Items/' + item.Id + '/Images/Primary';
            tag = imageTags.Primary;
        } else if (item.BackdropImageTags && item.BackdropImageTags.length) {
            path = '/Items/' + item.Id + '/Images/Backdrop/0';
            tag = item.BackdropImageTags[0];
        }
        if (!path) return '';
        var params = { maxWidth: 1024, api_key: window.ApiClient.accessToken() };
        if (tag) params.tag = tag;
        return window.ApiClient.getUrl(path, params);
    }

    function getDownloadItem(itemId) {
        if (!itemId || !window.ApiClient || typeof window.ApiClient.getItem !== 'function') {
            return Promise.resolve(null);
        }
        var userId = typeof window.ApiClient.getCurrentUserId === 'function'
            ? window.ApiClient.getCurrentUserId()
            : null;
        return window.ApiClient.getItem(userId, itemId).then(function(item) {
            if (!item) {
                return window._lastJellyfinDownloadItem && window._lastJellyfinDownloadItem.Id === itemId
                    ? window._lastJellyfinDownloadItem
                    : null;
            }
            var hasStreams = (item.MediaStreams && item.MediaStreams.length > 0) ||
                             (item.MediaSources && item.MediaSources[0] && item.MediaSources[0].MediaStreams && item.MediaSources[0].MediaStreams.length > 0);
            if (!hasStreams && typeof window.ApiClient.getPlaybackInfo === 'function') {
                return window.ApiClient.getPlaybackInfo(itemId, { UserId: userId }).then(function(pbInfo) {
                    if (pbInfo && pbInfo.MediaSources && pbInfo.MediaSources.length) {
                        item.MediaSources = pbInfo.MediaSources;
                        if (!item.MediaStreams && pbInfo.MediaSources[0].MediaStreams) {
                            item.MediaStreams = pbInfo.MediaSources[0].MediaStreams;
                        }
                    }
                    return item;
                }).catch(function() {
                    return item;
                });
            }
            return item;
        }).catch(function() {
            return window._lastJellyfinDownloadItem && window._lastJellyfinDownloadItem.Id === itemId
                ? window._lastJellyfinDownloadItem
                : null;
        });
    }

    function getBulkEpisodes(item) {
        if (!item || !window.ApiClient || typeof window.ApiClient.getItems !== 'function') {
            return Promise.resolve([]);
        }
        var userId = typeof window.ApiClient.getCurrentUserId === 'function'
            ? window.ApiClient.getCurrentUserId()
            : null;
        return window.ApiClient.getItems(userId, {
            ParentId: item.Id,
            IncludeItemTypes: 'Episode',
            Recursive: true,
            SortBy: 'ParentIndexNumber,IndexNumber,SortName',
            SortOrder: 'Ascending',
            Fields: 'Path,MediaSources,MediaStreams,Overview,Genres,ImageTags,SeriesName,SeasonName,SeriesId,SeasonId,ParentIndexNumber,IndexNumber,SeriesPrimaryImageTag,SeasonPrimaryImageTag'
        }).then(function(result) {
            return result && Array.isArray(result.Items) ? result.Items : [];
        }).catch(function(error) {
            console.error('[Downloader] Impossible de lister les épisodes:', error);
            return [];
        });
    }

    function downloadSelection(item) {
        return getBulkEpisodes(item).then(function(episodes) {
            if (!episodes.length) {
                console.warn('[Downloader] Aucun épisode trouvé pour:', item && item.Name);
                return;
            }
            console.info('[Downloader] Analyse téléchargement groupé de', episodes.length, 'épisodes');
            var toDownload = [];
            var alreadyCount = 0;

            episodes.forEach(function(episode) {
                var episodeUrl = window.ApiClient.getUrl('/Items/' + episode.Id + '/Download', {
                    api_key: window.ApiClient.accessToken()
                });
                var path = getDownloadPath(episode, episode.Name ? episode.Name + '.mkv' : getMediaTitle());
                var check = isAlreadyDownloaded(episode, path);
                if (check.exists) {
                    alreadyCount++;
                } else {
                    toDownload.push({ episode: episode, episodeUrl: episodeUrl, path: path });
                }
            });

            if (toDownload.length === 0) {
                var msg = episodes.length === 1
                    ? 'Cet épisode est déjà téléchargé ou en cours.'
                    : 'Tous les épisodes de cette série sont déjà téléchargés ou en cours.';
                if (window.NativeShell && window.NativeShell.AppHost && window.NativeShell.AppHost.displayMessage) {
                    window.NativeShell.AppHost.displayMessage(msg);
                } else {
                    window.alert(msg);
                }
                return;
            }

            var seriesName = item.Name || item.SeriesName || 'Série';
            if (item.Type === 'Season' && item.SeriesName) {
                seriesName = item.SeriesName + ' - ' + (item.Name || 'Saison');
            }
            var countStr = toDownload.length + (toDownload.length > 1 ? ' épisodes' : ' épisode');
            var msg = 'Téléchargement lancé : ' + seriesName + ' (' + countStr + ')';
            if (alreadyCount > 0) {
                msg += ' · ' + alreadyCount + ' déjà présent(s)';
            }
            if (window.NativeShell && window.NativeShell.AppHost && window.NativeShell.AppHost.displayMessage) {
                window.NativeShell.AppHost.displayMessage(msg);
            }

            toDownload.forEach(function(job) {
                doNativeDownload(
                    job.episodeUrl,
                    job.path,
                    job.episode,
                    getDownloadArtworkUrl(job.episode),
                    getDownloadSubtitles(job.episode, job.path),
                    true // silentToast to avoid spamming multiple notifications
                );
            });
        });
    }

    // 1. Hook NativeShell.downloadFile
    if (window.NativeShell) {
        window.NativeShell.downloadFile = function(info) {
            var url = (typeof info === 'string') ? info : (info && (info.url || info.path));
            var filename = (info && info.filename) ? info.filename : getMediaTitle();
            var bulkRequested = /\/Items\/downloadall(?:\/|$)/i.test(url || '');
            var itemId = resolveItemId(document.activeElement || document.body);
            var urlId = url && url.match(/\/Items\/([a-f0-9]{32})/i);
            itemId = itemId || (urlId && urlId[1]);
            if (!itemId) {
                console.warn('[Downloader] ID Jellyfin introuvable, téléchargement annulé:', url);
                return;
            }
            getDownloadItem(itemId).then(function(item) {
                if (item && (item.Type === 'Series' || item.Type === 'Season')) {
                    downloadSelection(item);
                    return;
                }
                if (bulkRequested && item && item.SeriesId) {
                    getDownloadItem(item.SeriesId).then(downloadSelection);
                    return;
                }
                var path = getDownloadPath(item, filename);
                doNativeDownload(url, path, item, getDownloadArtworkUrl(item), getDownloadSubtitles(item, path));
            });
        };
    }

    // 2. Interception des clics de telechargement
    document.addEventListener('click', function(e) {
        if (e.target.closest('[class*="jellyseerr"], [id*="jellyseerr"], [class*="request"], [id*="request"]') ||
            /demand|request|jellyseerr/i.test(e.target.textContent || '')) {
            return;
        }

        var target = e.target.closest('a[href*="/Download"], a[download], [data-action="download"]');
        if (!target) {
            var inActionSheet = e.target.closest('.actionSheet, .actionsheet, .paper-menu');
            if (inActionSheet) {
                var menuItem = e.target.closest('.actionSheetMenuItem, .listItem, button');
                if (menuItem && /t[eé]l[eé]charger|download/i.test(menuItem.textContent) && !/demand|request|jellyseerr/i.test(menuItem.textContent)) {
                    target = menuItem;
                }
            }
        }

        if (target) {
            if (/demand|request|jellyseerr/i.test(target.textContent || '')) return;

            var url = target.getAttribute('href');
            var bulkRequested = /\/Items\/downloadall(?:\/|$)/i.test(url || '') ||
                /tout\s+t[eé]l[eé]charger|download\s+all/i.test(target.textContent);
            var filename = getMediaTitle();
            var itemId = resolveItemId(target) || (_lastInteractionTarget && resolveItemId(_lastInteractionTarget));
            if (!itemId) {
                return;
            }
            console.debug('[Downloader] Item sélectionné:', itemId, 'URL:', url);

            var dlState = getItemDownloadState(itemId);
            if (dlState && dlState.downloaded) {
                e.preventDefault();
                e.stopPropagation();
                dismissOpenPopups();
                var titleStr = dlState.title ? '« ' + dlState.title + ' » ' : 'Cet élément ';
                var alertMsg = dlState.status === 'complete'
                    ? titleStr + 'est déjà téléchargé et disponible hors ligne.'
                    : (dlState.status === 'downloading'
                        ? 'Le téléchargement de ' + (dlState.title ? '« ' + dlState.title + ' »' : 'cet élément') + ' est déjà en cours.'
                        : (dlState.title ? '« ' + dlState.title + ' »' : 'Cet élément') + ' est déjà dans la file d’attente.');
                if (window.NativeShell && window.NativeShell.AppHost && window.NativeShell.AppHost.displayMessage) {
                    window.NativeShell.AppHost.displayMessage(alertMsg);
                } else {
                    window.alert(alertMsg);
                }
                return;
            }

            if ((!url || url.indexOf('/Items/download/Download') !== -1 || bulkRequested || /t[eé]l[eé]charger|download/i.test(target.textContent)) && window.ApiClient) {
                url = window.ApiClient.getUrl('/Items/' + itemId + '/Download', {
                    api_key: window.ApiClient.accessToken()
                });
            }

            if ((url && url.indexOf('/Download') !== -1) || bulkRequested || /t[eé]l[eé]charger|download/i.test(target.textContent)) {
                e.preventDefault();
                e.stopPropagation();
                dismissOpenPopups();
                getDownloadItem(itemId).then(function(item) {
                    if (item && (item.Type === 'Series' || item.Type === 'Season')) {
                        downloadSelection(item);
                        return;
                    }
                    if (bulkRequested && item && item.SeriesId) {
                        getDownloadItem(item.SeriesId).then(downloadSelection);
                        return;
                    }
                    var path = getDownloadPath(item, filename);
                    doNativeDownload(url, path, item, getDownloadArtworkUrl(item), getDownloadSubtitles(item, path));
                });
            }
        }
    }, true);
})();