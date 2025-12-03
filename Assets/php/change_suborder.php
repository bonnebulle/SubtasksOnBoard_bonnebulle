
<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  // Accès direct ou mauvaise méthode, on bloque
  die('Accès interdit.');
}

// USE kanboard;
// SELECT id, task_id, position, title FROM subtasks;

// Récupérer les paramètres depuis l'URL (GET) ou le formulaire (POST)
$task_id = isset($_REQUEST['task_id']) ? intval($_REQUEST['task_id']) : null;
$subtask_id = isset($_REQUEST['subtask_id']) ? intval($_REQUEST['subtask_id']) : null;

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
    echo "ok db <br>";

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['order']) && is_array($_POST['order'])) {
        $order = $_POST['order'];
        $task_id = isset($_POST['task_id']) ? intval($_POST['task_id']) : null;
    
        // Connexion PDO déjà faite plus haut
        $position = 1;
        foreach ($order as $subtask_id) {
            $subtask_id = intval($subtask_id);
            // On vérifie que la sous-tâche appartient bien à la tâche (sécurité)
            $stmt = $pdo->prepare("UPDATE subtasks SET position = ? WHERE id = ? AND task_id = ?");
            $stmt->execute([$position, $subtask_id, $task_id]);
            $position++;
        }
        echo json_encode(['success' => true]);
        exit;
    }

} catch (\PDOException $e) {
    echo "Erreur de connexion à la base de données : " . $e->getMessage();
    exit;
}

?>
