(function() {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        console.debug('[LocalStorage SetItem] key:', key, 'value:', value);
        originalSetItem.apply(this, arguments);
        if ((key === 'servers' || key === 'jellyfin_credentials') && window.jmpNative && window.jmpNative.saveServerUrl) {
            try {
                let parsed = JSON.parse(value);
                let currentServer = "";
                if (key === 'servers' && Array.isArray(parsed)) {
                    currentServer = parsed.length > 0 ? (parsed[0].Url || parsed[0].Id || parsed[0].ManualAddress || parsed[0].LocalAddress) : "";
                } else if (key === 'jellyfin_credentials' && parsed && Array.isArray(parsed.Servers)) {
                    currentServer = parsed.Servers.length > 0 ? (parsed.Servers[0].ManualAddress || parsed.Servers[0].LocalAddress || parsed.Servers[0].Url) : "";
                }
                if (currentServer) {
                    window.jmpNative.saveServerUrl(currentServer);
                } else if (parsed.length === 0 || (parsed.Servers && parsed.Servers.length === 0)) {
                    window.jmpNative.saveServerUrl("");
                }
            } catch (e) {}
        }
    };
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
        console.debug('[LocalStorage RemoveItem] key:', key);
        originalRemoveItem.apply(this, arguments);
        if ((key === 'servers' || key === 'jellyfin_credentials') && window.jmpNative && window.jmpNative.saveServerUrl) {
            window.jmpNative.saveServerUrl("");
        }
    };
})();
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

    window._nativeFindServersResult = function(serversJson) {
        if (window._findServersResolve) {
            try {
                const servers = JSON.parse(serversJson);
                window._findServersResolve(servers);
            } catch (e) {
                window._findServersResolve([]);
            }
            window._findServersResolve = null;
        }
    };

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

    window._nativeFindServersResult = function(servers) {
        if (!servers || !Array.isArray(servers) || servers.length === 0) return;
        
        let container = document.getElementById('jellium-discovery-container');
        if (container) container.remove();
        
        let anchor = document.querySelector('.page:not(.hide) .manualServerConnection') || document.querySelector('.page:not(.hide) form');
        if (!anchor) return;
        
        console.info('[Discovery] Anchor HTML: ' + anchor.outerHTML);

        container = document.createElement('div');
        container.id = 'jellium-discovery-container';
        container.style.marginTop = '40px';
        container.style.width = '100%';
        container.innerHTML = '<h3 style="color:#ddd; margin-bottom:15px; font-weight:normal; font-size:1.1em; text-align:center;">Discovered Servers</h3><div id="jellium-discovery-list" style="display:flex;flex-direction:column;gap:15px;align-items:center;"></div>';
        
        // Always append inside the anchor.
        anchor.appendChild(container);

        const list = document.getElementById('jellium-discovery-list');
        list.innerHTML = '';
        
        servers.forEach(s => {
            const btn = document.createElement('div');
            btn.style.width = '100%';
            btn.style.maxWidth = '450px';
            btn.style.backgroundColor = '#292929';
            btn.style.padding = '1em';
            btn.style.border = '0.16em solid transparent';
            btn.style.borderRadius = '0.2em';
            btn.style.cursor = 'pointer';
            btn.style.display = 'flex';
            btn.style.flexDirection = 'column';
            btn.style.transition = 'background 0.15s ease-in-out';
            btn.style.boxSizing = 'border-box';
            
            // Hover effect matching .server-card:hover
            btn.onmouseenter = () => {
                btn.style.backgroundColor = '#333333';
                btn.style.borderColor = '#00a4dc';
            };
            btn.onmouseleave = () => {
                btn.style.backgroundColor = '#292929';
                btn.style.borderColor = 'transparent';
            };
            
            const title = document.createElement('div');
            title.innerText = s.Name;
            title.style.fontSize = '1.1em';
            title.style.fontWeight = '500';
            title.style.color = '#fff';
            title.style.marginBottom = '0.25em';
            title.style.textAlign = 'left';
            
            const subtitle = document.createElement('div');
            subtitle.innerText = s.Address;
            subtitle.style.fontSize = '0.9em';
            subtitle.style.color = 'rgba(255, 255, 255, 0.5)';
            subtitle.style.textAlign = 'left';
            
            btn.appendChild(title);
            btn.appendChild(subtitle);
            btn.onclick = (e) => {
                e.preventDefault();
                if (window.jmpNative && window.jmpNative.saveServerUrl) {
                    window.jmpNative.saveServerUrl(s.Address);
                    window.location.href = s.Address;
                }
            };
            list.appendChild(btn);
        });
        
        if (list.children.length === 0) {
            container.style.display = 'none';
        } else {
            container.style.display = 'block';
        }
    };

    (function() {
        function injectDiscoveryList() {
            if (!window.jmpNative || !window.jmpNative.findServers) return;
            // Only inject on the add server page
            if (!window.location.hash.includes('addserver') && !window.location.pathname.includes('addserver')) return;
            
            const form = document.querySelector('.page:not(.hide) .manualServerConnection') || document.querySelector('.page:not(.hide) form');
            if (!form) return;
            
            // Remove any existing one to prevent duplicates during re-renders
            const existing = document.getElementById('jellium-discovery-container');
            if (existing) existing.remove();

            console.log('[Discovery] Triggering findServers for form injection');
            window.jmpNative.findServers(1000);
        }

        const observer = new MutationObserver((mutations) => {
            // Check if we are on the add server page specifically
            if (window.location.hash.includes('addserver') || window.location.pathname.includes('addserver')) {
                // To avoid an infinite loop if findServers returns immediately and injects,
                // we only inject if the container isn't there yet.
                if (!document.getElementById('jellium-discovery-container')) {
                    injectDiscoveryList();
                }
            }
        });

        observer.observe(document.documentElement || document, { childList: true, subtree: true });
        
        injectDiscoveryList();
    })();

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
        btnYes.innerText = 'Download';
        btnYes.style.padding = '10px 20px';
        btnYes.style.background = '#00a4dc';
        btnYes.style.color = 'white';
        btnYes.style.border = 'none';
        btnYes.style.borderRadius = '6px';
        btnYes.style.cursor = 'pointer';
        btnYes.style.fontWeight = 'bold';
        btnYes.onclick = () => {
            if (window.jmpNative && window.jmpNative.installUpdate) {
                btnYes.innerText = 'Downloading...';
                btnYes.disabled = true;
                window.jmpNative.installUpdate(downloadUrl, assetName);
            }
        };

        const btnNo = document.createElement('button');
        btnNo.innerText = 'Later';
        btnNo.style.padding = '10px 20px';
        btnNo.style.background = 'rgba(255,255,255,0.1)';
        btnNo.style.color = 'white';
        btnNo.style.border = 'none';
        btnNo.style.borderRadius = '6px';
        btnNo.style.cursor = 'pointer';
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
