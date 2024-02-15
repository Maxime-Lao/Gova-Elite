import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "Connexion": "Login",
            "S'inscrire": "Register",
            "Réservations": "Bookings",
            "Veuillez activer votre compte pour accéder à votre espace": "Please activate your account to access your space",
            "Loading": "Loading",
            "Louez votre véhicule en seulement 3 étapes.": "Rent your vehicle in just 3 steps.",
            "L'heure et la date.": "The time and date.",
            "Choisissez quand et où commence votre aventure.": "Choose when and where your adventure begins.",
            "L'emplacement.": "The location.",
            "Sélectionnez le point de départ idéal pour votre voyage.": "Select the ideal starting point for your trip.",
            "Récupérer votre véhicule.": "Pick up your vehicle.",
            "Prenez les clés et écrivez votre histoire sur la route.": "Take the keys and write your story on the road.",
            "Réservez Votre Rêve,": "Book Your Dream,",
            "Conduisez l'Exception.": "Drive the Exception.",
            "Date de début": "Start Date",
            "Date de fin": "End Date",
            "Lieu": "Location",
            "Lieu invalide.": "Invalid location.",
            "Veuillez remplir tous les champs.": "Please fill in all fields.",
            "La date de début doit être antérieure à la date de fin.": "The start date must be before the end date.",
            "Rechercher": "Search",
            "chevaux": "horsepower",
            "sièges": "seats",
            "portes": "doors",
            "km": "km",
            "Commentaires:": "Comments",
            "Pas de commentaire pour l'instant": "No comments yet",
            "avis": "reviews",
            "Planification de la location": "Rental Planning",
            "Prix total :": "Total Price:",
            "Louer la voiture": "Rent the Car",
            "La date de début ne peut pas être après la date de fin.": "The start date cannot be after the end date.",
            "La date de fin ne peut pas être avant la date de début.": "The end date cannot be before the start date.",
            "La voiture n'est pas disponible pour les dates sélectionnées.": "The car is not available for the selected dates.",
            "Date et heure de début": "Start Date and Time",
            "Date et heure de fin": "End Date and Time",
            "Votre réservation a été effectuée avec succès!": "Your reservation has been successfully made!",
            "Réservations de voiture pour": "Car reservations for",
            "En cours": "Current",
            "Historique": "History",
            "Annuler": "Cancel",
            "Décaler le RDV": "Reschedule",
            "Reprendre RDV": "Reschedule Appointment",
            "Prix total :": "Total Price:",
            "Louer la voiture": "Rent the Car",
            "Voulez-vous vraiment annuler votre réservation ?": "Do you really want to cancel your reservation?",
            "Retour": "Return",
            "Oui": "Yes",
            "Date et heure de début": "Start Date and Time",
            "Date et heure de fin": "End Date and Time",
            "Fermer": "Close",
            "Erreur lors de la décale": "Error during rescheduling",
            "La voiture n'est pas disponible pour les dates sélectionnées.": "The car is not available for the selected dates.",
            "La date de début ne peut pas être après la date de fin.": "The start date cannot be after the end date.",
            "La date de fin ne peut pas être avant la date de début.": "The end date cannot be before the start date.",
            "Description:": "Description:",
            "La location a été décalée !": "The rental has been rescheduled!",
            "Note de la voiture :": "Car Rating:",
            "Propreté": "Cleanliness",
            "Entretien": "Maintenance",
            "Communication": "Communication",
            "Confort": "Convenience",
            "Précision": "Accuracy",
            "Commentaire": "Comment",
            "Ajouter un commentaire...": "Add a comment...",
            "Annuler": "Cancel",
            "Valider": "Submit",
            "Noter": "Rate",
            "Votre commentaire a été pris en compte.": "Your comment has been taken into account.",
            "résultat(s) trouvé(s)": "result(s) found",
            "Aucun résultat n'a été trouvé.": "No results were found.",
            "Companie": "Company",
            "Prix": "Price",
            "Adresse": "Address",
            "Ville": "City",
            "Code postal": "Zip Code",
        },
    },
    fr: {
        translation: {
           
        },
    },
};

const language = localStorage.getItem('language') || "fr";

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: language,
    interpolation: {
      escapeValue: false,
    },
  });


export default i18n;
