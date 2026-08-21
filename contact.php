<?php
/**
 * Traitement du formulaire de contact du portfolio.
 * Réceptionne les champs POST, valide, puis envoie un email via mail().
 * Répond en JSON pour être consommé en AJAX par js/script.js.
 */

header('Content-Type: application/json; charset=utf-8');

// ---------- Config à adapter ----------
$destinataire = "tonadresse@email.com"; // <-- remplace par ta vraie adresse
$sujetPrefixe = "[Portfolio] Nouveau message de ";

// ---------- On n'accepte que du POST ----------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// ---------- Récupération et nettoyage des champs ----------
function clean($value) {
    return trim(strip_tags($value ?? ''));
}

$nom     = clean($_POST['nom'] ?? '');
$email   = clean($_POST['email'] ?? '');
$sujet   = clean($_POST['sujet'] ?? '');
$message = clean($_POST['message'] ?? '');

// Piège à bots (honeypot) : si jamais tu ajoutes un champ caché "website" dans le HTML
if (!empty($_POST['website'] ?? '')) {
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès !']);
    exit;
}

// ---------- Validation ----------
$erreurs = [];

if ($nom === '' || mb_strlen($nom) < 2) {
    $erreurs[] = "Le nom est requis (2 caractères minimum).";
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erreurs[] = "L'adresse email n'est pas valide.";
}
if ($message === '' || mb_strlen($message) < 10) {
    $erreurs[] = "Le message doit contenir au moins 10 caractères.";
}

if (!empty($erreurs)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $erreurs)]);
    exit;
}

// ---------- Construction et envoi de l'email ----------
$sujetFinal = $sujetPrefixe . $nom . ($sujet !== '' ? " — " . $sujet : "");

$corps  = "Nouveau message reçu depuis le portfolio\n";
$corps .= "-----------------------------------------\n";
$corps .= "Nom     : $nom\n";
$corps .= "Email   : $email\n";
$corps .= "Sujet   : " . ($sujet !== '' ? $sujet : "(non précisé)") . "\n\n";
$corps .= "Message :\n$message\n";

$entetes  = "From: Portfolio Contact <no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . ">\r\n";
$entetes .= "Reply-To: $email\r\n";
$entetes .= "Content-Type: text/plain; charset=UTF-8\r\n";

$envoye = @mail($destinataire, $sujetFinal, $corps, $entetes);

if ($envoye) {
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès ! Je vous répondrai rapidement.']);
} else {
    // mail() échoue souvent en local (pas de serveur SMTP configuré) : message clair pour debug.
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => "Le message n'a pas pu être envoyé. Vérifie la configuration mail() du serveur (ou utilise PHPMailer/SMTP en production)."
    ]);
}
