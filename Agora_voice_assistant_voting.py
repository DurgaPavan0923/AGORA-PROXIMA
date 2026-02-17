import os
import time
import tempfile

import speech_recognition as sr
from gtts import gTTS
from playsound import playsound

# ------------------------------
# CONFIG
# ------------------------------

LANG_EN = "en" 
LANG_HI = "hi"

CANDIDATES = {
    1: {"name_en": "Sankar Mridha", "name_hi": "संकर मृदा "},
    2: {"name_en": "Bharat Jyoti Sahu", "name_hi": "भारत ज्योति साहू "},
    3: {"name_en": "Anukampa Behera", "name_hi": "अनुकम्पा बेहेरा"}
}

# ------------------------------
# TEXT-TO-SPEECH (gTTS)
# ------------------------------

def speak(text, lang_code=LANG_EN):
    """
    Convert text to speech using gTTS and play it.
    """
    tmp_path = None
    try:
        # Create temp mp3
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
            tmp_path = fp.name

        tts = gTTS(text=text, lang=lang_code)
        tts.save(tmp_path)

        playsound(tmp_path)

    except Exception as e:
        print("[TTS ERROR]", e)
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


# ------------------------------
# SPEECH-TO-TEXT
# ------------------------------

recognizer = sr.Recognizer()

def listen(lang_code=LANG_EN):
    """
    Listen from microphone and return recognized text (lowercased).
    """
    language_map = {
        LANG_EN: "en-IN",
        LANG_HI: "hi-IN"
    }
    google_lang = language_map.get(lang_code, "en-IN")

    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source, duration=1.0)
        try:
            audio = recognizer.listen(source, timeout=6, phrase_time_limit=8)
        except:
            print("Did not hear anything")
            return None

    try:
        text = recognizer.recognize_google(audio, language=google_lang)
        print("User said:", text)
        return text.lower()

    except sr.UnknownValueError:
        print("Could not understand")
        return None
    except Exception as e:
        print("Error:", e)
        return None


# ------------------------------
# LANGUAGE SELECTION
# ------------------------------

def ask_language():
    speak(
        "Welcome to Agora Voice Assistant. "
        "For English, say English. For Hindi, say Hindi.",
        LANG_EN
    )
    speak(
        "आगोरा वॉइस असिस्टेंट में आपका स्वागत है। "
        "अंग्रेज़ी के लिए English बोलिए। हिंदी के लिए Hindi बोलिए।",
        LANG_HI
    )

    for _ in range(3):
        response = listen(LANG_EN)
        if response:
            if "english" in response:
                speak("You selected English.", LANG_EN)
                return LANG_EN
            if "hindi" in response or "हिंदी" in response:
                speak("आपने हिंदी चुनी है।", LANG_HI)
                return LANG_HI

        speak("Please say English or Hindi again.", LANG_EN)

    speak("Defaulting to English.", LANG_EN)
    return LANG_EN


# ------------------------------
# YES / NO HELPERS
# ------------------------------

def is_yes(text, lang):
    if text is None: return False
    if lang == LANG_EN:
        return any(w in text for w in ["yes confirm this vote"])
    else:
        return any(w in text for w in ["Yes","हां"])

def is_no(text, lang):
    if text is None: return False
    if lang == LANG_EN:
        return "No" in text
    else:
        return any(w in text for w in ["नहीं"])


# ------------------------------
# VOTING LOGIC
# ------------------------------

def explain_process(lang):
    if lang == LANG_EN:
        speak(
            "I will guide you through the voting process. "
            "I will read the names of the candidates, then you will speak the number "
            "of the candidate you want to vote for.",
            lang
        )
    else:
        speak(
            "मैं आपको वोटिंग की प्रक्रिया में मार्गदर्शन करुंगी। "
            "मैं उम्मीदवारों के नाम पढ़ूंगी, फिर आप उस उम्मीदवार का नंबर बोलिए "
            "जिसे आप वोट देना चाहते हैं।",
            lang
        )

def read_candidates(lang):
    if lang == LANG_EN:
        speak("Here are the candidates.", lang)
        for num, info in CANDIDATES.items():
            speak(f"Number {num}: {info['name_en']}", lang)
    else:
        speak("यह रहे उम्मीदवार।", lang)
        for num, info in CANDIDATES.items():
            speak(f"नंबर {num}: {info['name_hi']}", lang)

def get_choice(lang):
    if lang == LANG_EN:
        speak("Please say the number of the candidate you want to vote for.", lang)
    else:
        speak("कृपया उम्मीदवार का नंबर बोलिए।", lang)

    for _ in range(3):
        response = listen(lang)
        if response:
            for num in CANDIDATES:
                if str(num) in response:
                    return num

        speak("I didn't understand. Please say the number clearly.", lang)

    return None

def confirm_vote(lang, num):
    candidate = CANDIDATES[num]
    if lang == LANG_EN:
        speak(
            f"You chose number {num}, {candidate['name_en']}. "
            "Do you want to confirm this vote?",
            lang
        )
    else:
        speak(
            f"आपने नंबर {num}, {candidate['name_hi']} चुना है। "
            "क्या आप इसे पुष्टि करना चाहते हैं?",
            lang
        )

    for _ in range(3):
        response = listen(lang)
        if is_yes(response, lang):
            return True
        if is_no(response, lang):
            return False

        speak("Please say yes or no.", lang)

    return False


# ------------------------------
# MAIN FLOW
# ------------------------------

def voting_flow():
    lang = ask_language()
    explain_process(lang)
    read_candidates(lang)

    choice = get_choice(lang)
    if choice is None:
        speak("Could not detect choice. Please try again later.", lang)
        return

    if confirm_vote(lang, choice):
        speak("Your vote has been recorded. Thank you.", lang)
        print(f"[BACKEND] Record vote for candidate {choice}")
    else:
        speak("Vote cancelled. No vote recorded.", lang)


# ------------------------------
# START
# ------------------------------

if __name__ == "__main__":
    print("Starting Agora Voice Assistant...")
    time.sleep(1)
    voting_flow()
