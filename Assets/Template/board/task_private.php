<!-- VBULLE -->

<?php
    $subtasks = $this->helper->subtasklistHelper->subtasks($task['id']);
    $have_subt = (sizeof($subtasks) == 0)  ? "sans" : "avec";
    // print_r($subtasks)
    // print_r($task)
?>



<div 
    data-have_subt="<?=$have_subt ?>"
    data-projet-name="<?= $task['project_name'] ?>"
    data-swimlane-name="<?= $task['swimlane_name'] ?>"
    class="loading_have_subt
        task-board
        <?= $task['is_draggable'] ? 'draggable-item ' : '' ?>
        <?= $task['is_active'] == 1 ? 'task-board-status-open '.($task['date_modification'] > (time() - $board_highlight_period) ? 'task-board-recent' : '') : 'task-board-status-closed' ?>
        color-<?= $task['color_id'] ?>"
     data-project-id="<?= $task['project_id'] ?>"
     data-task-id="<?= $task['id'] ?>"
     data-column-id="<?= $task['column_id'] ?>"
     data-swimlane-id="<?= $task['swimlane_id'] ?>"
     data-position="<?= $task['position'] ?>"
     data-owner-id="<?= $task['owner_id'] ?>"
     data-category-id="<?= $task['category_id'] ?>"
     data-due-date="<?= $task['date_due'] ?>"
     data-task-url="<?= $this->url->href('TaskViewController', 'show', array('task_id' => $task['id'])) ?>">

    <div class="task-board-sort-handle" style="display: none;"><i class="fa fa-arrows-alt"></i></div>

    <?php if ($this->board->isCollapsed($task['project_id'])): ?>
        <div class="task-board-collapsed">
            <div class="task-board-saving-icon" style="display: none;"><i class="fa fa-spinner fa-pulse"></i></div>
            <?php if ($this->user->hasProjectAccess('TaskModificationController', 'edit', $task['project_id'])): ?>
                <?= $this->render('task/dropdown', array('task' => $task, 'redirect' => 'board')) ?>
                <?php if ($this->projectRole->canUpdateTask($task)): ?>
                    <?= $this->modal->large('edit', '', 'TaskModificationController', 'edit', array('task_id' => $task['id'])) ?>
                <?php endif ?>
            <?php else: ?>
                <strong><?= '#'.$task['id'] ?></strong>
            <?php endif ?>

            <?php if (! empty($task['assignee_username'])): ?>
                <span title="<?= $this->text->e($task['assignee_name'] ?: $task['assignee_username']) ?>">
                    <?= $this->text->e($this->user->getInitials($task['assignee_name'] ?: $task['assignee_username'])) ?>
                </span> -
            <?php endif ?>
            <?= $this->url->link($this->text->e($task['title']), 'TaskViewController', 'show', array('task_id' => $task['id']), false, '', $this->text->e($task['title'])) ?>
        </div>
    <?php else: ?>
        <div class="task-board-expanded">
            <div class="task-board-saving-icon" style="display: none;"><i class="fa fa-spinner fa-pulse fa-2x"></i></div>
            <div class="task-board-header">
                <?php if ($this->user->hasProjectAccess('TaskModificationController', 'edit', $task['project_id'])): ?>
                    <?= $this->render('task/dropdown', array('task' => $task, 'redirect' => 'board')) ?>
                    <?php if ($this->projectRole->canUpdateTask($task)): ?>
                        <!-- VBULLE RM -->
                        <a class="js-modal-confirm rm_task_quickaction" href="/?controller=TaskSuppressionController&action=confirm&task_id=<?= $task['id']?>&redirect=board">
                            <i class="fa fa-trash-o fa-fw js-modal-large" aria-hidden="true"></i>
                        </a>
                        <?= $this->modal->large('edit', '', 'TaskModificationController', 'edit', array('task_id' => $task['id'])) ?>
                        <!-- <div class="task-board-sort-handle"><i class="fa fa-arrows-alt"></i></div> -->
                    <?php endif ?>

                <?php else: ?>
                    <strong><?= '#'.$task['id'] ?></strong>
                <?php endif ?>

                <?php if (! empty($task['owner_id'])): ?>
                    <span class="task-board-assignee">
                        <?= $this->text->e($task['assignee_name'] ?: $task['assignee_username']) ?>
                    </span>
                <?php endif ?>

                <?= $this->render('board/task_avatar', array('task' => $task)) ?>
            </div>

            <?= $this->hook->render('template:board:private:task:before-title', array('task' => $task)) ?>
            <div class="task-board-title">
                <?= $this->url->link($this->text->e($task['title']), 'TaskViewController', 'show', array('task_id' => $task['id'])) ?>
            </div>
            <?= $this->hook->render('template:board:private:task:after-title', array('task' => $task)) ?>

            <?= $this->render('board/task_footer', array(
                'task' => $task,
                'not_editable' => $not_editable,
                'project' => $project,
            )) ?>
        </div>
    <?php endif ?>
</div>
