<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
//   // Accès direct ou mauvaise méthode, on bloque
//   die('Accès interdit.');
// }

// Récupérer les paramètres depuis l'URL (GET) ou le formulaire (POST)
$task_id = isset($_REQUEST['task_id']) ? intval($_REQUEST['task_id']) : null;
$subtask_id = isset($_REQUEST['subtask_id']) ? intval($_REQUEST['subtask_id']) : null;
// 
// $allowed_columns = ['due_description', 'title', 'id', 'task_id', 'title_desc'];
// $what = isset($_REQUEST['what']) && in_array($_REQUEST['what'], $allowed_columns) ? $_REQUEST['what'] : "due_description";

// Charger la config MYSQL CRENTIALS !!!!
$config = require __DIR__ . '/.env.php';

$dsn = "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], $options);
    // echo "ok db <br>";

    $task_id = isset($_REQUEST['task_id']) ? intval($_REQUEST['task_id']) : null;
    $subtask_id = isset($_REQUEST['subtask_id']) ? intval($_REQUEST['subtask_id']) : null;
    $subtask_txt = isset($_REQUEST['text']) ? $_REQUEST['text'] : null;
    $subtask_title = isset($_REQUEST['title']) ? $_REQUEST['title'] : null;
    $context = isset($_REQUEST['context']) ? $_REQUEST['context'] : null;

    // Pour vérifier :
    if ($task_id && $subtask_id) {
        echo "<br>Task ID : $task_id, <br>Subtask ID : $subtask_id";
        echo "<br>Title : $subtask_title";
        echo "<br>Text : $subtask_txt";
        echo "<br>Context : $context";
        echo "<br><br>";
    } else {
        // Paramètres manquants
        echo "Paramètres manquants<br>";
    }

    // $pdo est ta connexion PDO
    $stmt = $pdo->prepare("SELECT id, task_id, title, due_description FROM subtasks WHERE id = ?");
    $stmt->execute([$subtask_id]);
    $row = $stmt->fetch();

    if ( !$row ) {
        die("<br><strong style='color:red'>Aucune sous-tâche trouvée avec cet id.</strong><br>");
    }

    
    // Mise à jour du titre si fourni
    if ($subtask_title !== null) {
        $sql = "UPDATE subtasks SET title = '" . addslashes($subtask_title) . "' WHERE id = " . intval($subtask_id);
        $success = $pdo->exec($sql);
        if ($success !== false) {
            echo "<br><strong style='color:green'>Titre mis à jour avec succès !</strong>";
        } else {
            echo "<br><strong style='color:red'>Erreur lors de la mise à jour du titre</strong><br>";
        }
    }
    // Mise à jour de la description si fournie
    if ($subtask_txt !== null) {
        if (($subtask_txt === "") || ($subtask_txt === "\"\"")) {
            $subtask_txt = "vide";
            die("<br><strong style='color:red'>--- description est vide, abort</strong>");
        }
        $sql = "UPDATE subtasks SET due_description = '" . addslashes($subtask_txt) . "' WHERE id = " . intval($subtask_id);
        $success = $pdo->exec($sql);
        if ($success !== false) {
            echo "<br><strong style='color:green'>Description mise à jour avec succès !</strong>";
            echo "<br>subtask_txt == " . $subtask_txt;
        } else {
            echo "<br><strong style='color:red'>Erreur lors de la mise à jour de la description</strong><br>";
        }
    }


} catch (\PDOException $e) {
    echo "Erreur de connexion à la base de données : " . $e->getMessage();
    exit;
}

?>
