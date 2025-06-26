<?php
namespace Kanboard\Plugin\SubtasksOnBoard\Controller;
use Kanboard\Controller\BaseController;

class SubtasksOnBoardController extends BaseController
{

  public function updateSubtask()
    {
    // Ici, tu mets la logique de suppression de la sous-tâche
    $subtask_id = $this->request->getIntegerParam('subtask_id');
    $task_id = $this->request->getIntegerParam('task_id');
    $this->checkCSRFParam();

    if (! $this->helper->user->hasProjectAccess('SubtaskController', 'edit', $task_id)) {
        $this->flash->failure('Pas les droits');
        $this->response->redirect($this->helper->url->to('BoardViewController', 'show', array('project_id' => $this->request->getIntegerParam('project_id'))), true);
        return;
    }

    if ($this->subtaskModel->remove($subtask_id)) {
        $this->flash->success(t('Sous-tâche supprimée avec succès.'));
    } else {
        $this->flash->failure(t('Impossible de supprimer la sous-tâche.'));
    }

    // Redirection vers la page du board
    $this->response->redirect($this->helper->url->to('BoardViewController', 'show', array('project_id' => $this->request->getIntegerParam('project_id'))), true);
  }
}

?>