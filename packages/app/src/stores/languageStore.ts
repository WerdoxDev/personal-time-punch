import { ErrorType } from "shared";
import { createStore, useStore } from "zustand";
import { combine } from "zustand/middleware";

type Language = {
    login: string;
    register: string;
    welcome_back: string
    welcome_to: string;
    welcome: string;
    panel: string;
    home: string;
    end_session: string;
    start_session: string;
    session_type: string;
    dont_have_account: string;
    already_have_account: string
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
    loading: string;
    entry: string;
    exit: string;
    day_of_week: string
    type: string;
    actions: string;
    date: string;
    edit: string;
    delete: string;
    download_report: string;
    create_record: string;
    start_date: string;
    end_date: string;
    download: string;
    cancel: string;
    close: string;
    confirm: string;
    download_work_report: string;
    download_work_report_desc: string;
    create_work_record: string;
    create_work_record_desc: string;
    entry_time: string;
    exit_time: string;
    create: string;
    onsite: string;
    remote: string;
    absent: string;
    vacation: string;
    edit_work_record: string;
    edit_work_record_desc: string;
    incorrect_date_title: string;
    incorrect_date_text: string;
    login_failed: string;
    register_failed: string;
    fill_all_fields: string;
    are_you_sure: string;
    delete_record_desc: string;
    [ErrorType.EMAIL_TAKEN]: string;
    [ErrorType.PASSWORD_TOO_SHORT]: string;
    [ErrorType.INVALID_CREDENTIALS]: string;
    [ErrorType.INVALID_EMAIL]: string;
    [ErrorType.USERNAME_TAKEN]: string;
}

type LanguageType = "en" | "de"

const english: Language = {
    login: "Login",
    register: "Register",
    welcome_back: "Welcome back to",
    welcome_to: "Welcome to",
    welcome: "Welcome",
    end_session: "End session",
    home: "Go to Home",
    panel: "Go to Panel",
    session_type: "Session type",
    start_session: "Start session",
    dont_have_account: "Don't have an account?",
    already_have_account: "Already have an account?",
    email: "Email",
    username: "Username",
    first_name: "First name",
    last_name: "Last name",
    password: "Password",
    loading: "Loading",
    entry: "Entry",
    exit: "Exit",
    actions: "Actions",
    create_record: "Create record",
    date: "Date",
    day_of_week: "Day of Week",
    delete: "Delete",
    download_report: "Download report",
    edit: "Edit",
    type: "Type",
    start_date: "Start date",
    end_date: "End date",
    download: "Download",
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    download_work_report: "Download work report",
    download_work_report_desc: "Download a work report from a date range",
    create_work_record: "Create record",
    create_work_record_desc: "Manually create a record",
    create: "Create",
    entry_time: "Entry time",
    exit_time: "Exit time",
    absent: "Absent",
    onsite: "Onsite",
    remote: "Remote",
    vacation: "Vacation",
    edit_work_record: "Edit record",
    edit_work_record_desc: "Edit an existing record",
    incorrect_date_title: "Incorrect time",
    incorrect_date_text: "Entry time cannot be after exit time",
    login_failed: "Login failed",
    register_failed: "Register failed",
    fill_all_fields: "Please fill all the fields",
    are_you_sure: "Are you sure?",
    delete_record_desc: "You are about to delete a record",
    [ErrorType.EMAIL_TAKEN]: "Email is already taken",
    [ErrorType.USERNAME_TAKEN]: "Username is already taken",
    [ErrorType.INVALID_CREDENTIALS]: "Invalid login credentials",
    [ErrorType.INVALID_EMAIL]: "Invalid email",
    [ErrorType.PASSWORD_TOO_SHORT]: "Password is too short (minumum 8 characters)"
}

const german: Language = {
    login: "Anmelden",
    register: "Registieren",
    welcome_back: "Willkommen zurück bei",
    welcome_to: "Willkommen bei",
    home: "Zur Startseite",
    end_session: "Sitzung beenden",
    panel: "Zum Panel",
    session_type: "Sitzungstyp",
    start_session: "Sitzung starten",
    welcome: "Willkommen",
    dont_have_account: "Sie haben noch kein Konto?",
    already_have_account: "Haben Sie bereits ein Konto?",
    email: "E-Mail",
    first_name: "Vorname",
    last_name: "Nachname",
    password: "Kennwort",
    username: "Benutzername",
    loading: "Wird geladen",
    entry: "Eintrag",
    exit: "Ausgang",
    actions: "Aktion",
    create_record: "Datensatz erstellen",
    date: "Datum",
    day_of_week: "Wochentag",
    delete: "Löschen",
    edit: "Bearbeiten",
    download_report: "Bericht herunterladen",
    type: "Typ",
    start_date: "Startdatum",
    end_date: "Enddatum",
    cancel: "Abbrechen",
    close: "Schließen",
    confirm: "Bestätigen",
    download: "Herunterladen",
    download_work_report: "Arbeitsbericht herunterladen",
    download_work_report_desc: "Laden Sie einen Arbeitsbericht für einen bestimmten Zeitraum herunter",
    create: "Erstellen",
    create_work_record: "Datensatz erstellen",
    create_work_record_desc: "Erstellen Sie manuell einen Datensatz",
    entry_time: "Eingangszeit",
    exit_time: "Ausgangszeit",
    absent: "Abwesend",
    onsite: "Vor Ort",
    remote: "Fernarbeit",
    vacation: "Urlaub",
    edit_work_record: "Datensatz bearbeiten",
    edit_work_record_desc: "Einen bestehenden Datensatz bearbeiten",
    incorrect_date_title: "Falsche Uhrzeit",
    incorrect_date_text: "Die Eintrittszeit darf nicht nach der Austrittszeit liegen",
    login_failed: "Anmeldung fehlgeschlagen",
    register_failed: "Registierung fehlgeschlagen",
    fill_all_fields: "Bitte füllen Sie alle Felder aus",
    are_you_sure: "Sind Sie sicher?",
    delete_record_desc: "Sie sind dabei, einen Datensatz zu löschen",
    [ErrorType.EMAIL_TAKEN]: "Die E-Mail-Adresse ist bereits vergeben",
    [ErrorType.USERNAME_TAKEN]: "Der Benutzername ist bereits vergeben",
    [ErrorType.INVALID_CREDENTIALS]: "Ungültige Anmeldendaten",
    [ErrorType.INVALID_EMAIL]: "Ungültige E-Mail-Adresse",
    [ErrorType.PASSWORD_TOO_SHORT]: "Das Kennwort ist zu kurz (mindestens 8 Zeichen)"
}

const store = createStore(combine({
    currentLanguage: "de" as LanguageType,
    language: { ...german } as Language,
}, (set) => ({
    setLanguage: (lang: LanguageType) => {
        localStorage.setItem("lang", lang);
        set({ language: lang === "en" ? { ...english } : { ...german }, currentLanguage: lang })
    }
})))

export function initializeLanguage() {
    const lang = localStorage.getItem("lang");

    if (lang) {
        store.getState().setLanguage(lang as LanguageType);
    }

    localStorage.setItem("lang", store.getState().currentLanguage);
}

export function useLanguage() {
    return useStore(store);
}