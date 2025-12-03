<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
// Accès direct ou mauvaise méthode, on bloque
  die('Accès interdit.');
}

// Récupérer les paramètres depuis l'URL (GET) ou le formulaire (POST)
$task_id = isset($_REQUEST['task_id']) ? intval($_REQUEST['task_id']) : null;
$subtask_id = isset($_REQUEST['subtask_id']) ? intval($_REQUEST['subtask_id']) : null;

$allowed_columns = ['due_description', 'title', 'id', 'task_id', 'title_desc'];
$what = isset($_REQUEST['what']) && in_array($_REQUEST['what'], $allowed_columns) ? $_REQUEST['what'] : "due_description";


// Charger la config MYSQL CRENTIALS !!!!
$config = require __DIR__ . '/.env';

$dsn = "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], $options);

    if (!$task_id || !$subtask_id) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Paramètres manquants']);
        exit;
    }


    $stmt = $pdo->prepare("SELECT id, task_id, title, due_description FROM subtasks WHERE id = ?");
    $stmt->execute([$subtask_id]);
    $row = $stmt->fetch();

    header('Content-Type: application/json');
    // if ($row['due_description'] == "vide") {
        // echo json_encode(['error' => 'vide']);
    // }
    // else 
    if ( $what == "title_desc" ) {
        echo json_encode([
            'title' => $row['title'],
            'due_description' => $row['due_description']
        ]);
    } else if ($row) {
        echo json_encode([$what => $row[$what]]);
    } else {
        echo json_encode(['error' => 'Sous-tâche non trouvée']);
    }
    exit;

} catch (\PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Erreur de connexion à la base de données : ' . $e->getMessage()]);
    exit;
}


?>
