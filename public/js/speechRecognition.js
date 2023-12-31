'use strict';

const langs = 
[['Afrikaans',       ['af-ZA']],
 ['አማርኛ',           ['am-ET']],
 ['Azərbaycanca',    ['az-AZ']],
 ['বাংলা',            ['bn-BD', 'বাংলাদেশ'],
                     ['bn-IN', 'ভারত']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Dansk',           ['da-DK']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-KE', 'Kenya'],
                     ['en-TZ', 'Tanzania'],
                     ['en-GH', 'Ghana'],
                     ['en-NZ', 'New Zealand'],
                     ['en-NG', 'Nigeria'],
                     ['en-ZA', 'South Africa'],
                     ['en-PH', 'Philippines'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Filipino',        ['fil-PH']],
 ['Français',        ['fr-FR']],
 ['Basa Jawa',       ['jv-ID']],
 ['Galego',          ['gl-ES']],
 ['ગુજરાતી',           ['gu-IN']],
 ['Hrvatski',        ['hr-HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['ಕನ್ನಡ',             ['kn-IN']],
 ['ភាសាខ្មែរ',          ['km-KH']],
 ['Latviešu',        ['lv-LV']],
 ['Lietuvių',        ['lt-LT']],
 ['മലയാളം',          ['ml-IN']],
 ['मराठी',             ['mr-IN']],
 ['Magyar',          ['hu-HU']],
 ['ລາວ',              ['lo-LA']],
 ['Nederlands',      ['nl-NL']],
 ['नेपाली भाषा',        ['ne-NP']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['සිංහල',          ['si-LK']],
 ['Slovenščina',     ['sl-SI']],
 ['Basa Sunda',      ['su-ID']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Kiswahili',       ['sw-TZ', 'Tanzania'],
                     ['sw-KE', 'Kenya']],
 ['ქართული',       ['ka-GE']],
 ['Հայերեն',          ['hy-AM']],
 ['தமிழ்',            ['ta-IN', 'இந்தியா'],
                     ['ta-SG', 'சிங்கப்பூர்'],
                     ['ta-LK', 'இலங்கை'],
                     ['ta-MY', 'மலேசியா']],
 ['తెలుగు',           ['te-IN']],
 ['Tiếng Việt',      ['vi-VN']],
 ['Türkçe',          ['tr-TR']],
 ['اُردُو',            ['ur-PK', 'پاکستان'],
                     ['ur-IN', 'بھارت']],
 ['Ελληνικά',         ['el-GR']],
 ['български',         ['bg-BG']],
 ['Pусский',          ['ru-RU']],
 ['Српски',           ['sr-RS']],
 ['Українська',        ['uk-UA']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['हिन्दी',             ['hi-IN']],
 ['ภาษาไทย',         ['th-TH']]];

const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let isWebkitSpeechRecognitionSupported = false;
let recognitionRunning = false;
let recognition;
let recognitionLanguage = getId('recognitionLanguage');
let recognitionDialect = getId('recognitionDialect');

if (speechRecognition) {
    handleRecognitionLanguages();
    // init webkitSpeechRecognition...
    recognition = new speechRecognition();
    recognition.maxAlternatives = 1;
    recognition.continuous = true;
    recognition.lang = recognitionDialect.value;

    recognition.onstart = function () {
        console.log('Start speech recognition');
        speechRecognitionStart.style.display = 'none';
        speechRecognitionStop.style.display = 'block';
        setColor(speechRecognitionIcon, 'lime');
    };

    // Detect the said words
    recognition.onresult = (e) => {
        let current = e.resultIndex;
        // Get a transcript of what was said.
        let transcript = e.results[current][0].transcript;
        let config = {
            type: 'speech',
            room_id: roomId,
            peer_name: myPeerName,
            text_data: transcript,
            time_stamp: new Date(),
        };
        // save also my speech to text
        handleSpeechTranscript(config);
        sendToDataChannel(config);
    };

    recognition.onerror = function (event) {
        console.warn('Speech recognition error', event.error);
    };

    recognition.onend = function () {
        console.log('Stop speech recognition');
        // if (recognitionRunning) recognition.start();
        speechRecognitionStop.style.display = 'none';
        speechRecognitionStart.style.display = 'block';
        setColor(speechRecognitionIcon, 'white');
    };

    isWebkitSpeechRecognitionSupported = true;
    console.info('00. Browser supports webkitSpeechRecognition');
} else {
    console.warn(
        'This browser not supports webkitSpeechRecognition, check out supported browsers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#browser_compatibility',
    );
}

/**
 * Update speech recognition country
 */
function updateCountry() {
    for (let i = recognitionDialect.options.length - 1; i >= 0; i--) {
        recognitionDialect.remove(i);
    }
    let list = langs[recognitionLanguage.selectedIndex];
    for (let i = 1; i < list.length; i++) {
        recognitionDialect.options.add(new Option(list[i][1], list[i][0]));
    }
    recognitionDialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

/**
 * Handle recognition languages
 */
function handleRecognitionLanguages() {
    for (let i = 0; i < langs.length; i++) {
        recognitionLanguage.options[i] = new Option(langs[i][0], i);
    }
    recognitionLanguage.selectedIndex = 6;
    updateCountry();
    recognitionDialect.selectedIndex = 6;
    recognitionLanguage.addEventListener('change', () => {
        updateCountry();
    });
}

/**
 * Start or Stop speech recognition
 * @param {object} config data
 */
function startSpeech(config) {
    if (isWebkitSpeechRecognitionSupported) {
        if (config) {
            try {
                recognitionRunning = true;
                recognition.lang = recognitionDialect.value;
                recognitionLanguage.disabled = true;
                recognitionDialect.disabled = true;
                recognition.start();
            } catch (error) {
                console.log('Start speech', error);
            }
        } else {
            recognitionRunning = false;
            recognitionLanguage.disabled = false;
            recognitionDialect.disabled = false;
            recognition.stop();
        }
    } else {
        userLog('info', 'This browser not supports webkitSpeechRecognition');
    }
}
