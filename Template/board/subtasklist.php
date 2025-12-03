<!-- <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> -->

<?php
    $subtasks = $this->helper->subtasklistHelper->subtasks($task['id']);
    if (sizeof($subtasks) > 0):
    // print_r($subtasks)
?>



<?php $subtask_num=0 ?>
<!-- DESCRIPTION == vide ? -->
<?php $have_desc = ( empty($subtask['due_description']) ) ? "sans" : "avec" ?>


<table class="table-suboncard" data-have_desc="<?=$have_desc ?>">
    <div class="dropdown-submenu-open_alt" onclick="">
        <li>
            <i class="fa fa-info ok" aria-hidden="true"></i>
            <a href="/?controller=SubtaskController&action=create&task_id=<?=$task["id"] ?>" class="js-modal-medium" title="Ajouter une tache"><i class="fa fa-plus fa-fw" aria-hidden="true"></i></a>
        </li>        
    </div>
    <span class='all_toggle_wraper' onclick="">
        <a href="" class="all_toggle active">
            <i class="fa fa-eye ok" title="Cacher/Déplier toutes -Press H" aria-hidden="true" onclick=""></i>
        </a>
    </span>
    
    <!-- ///// -->
    <?php foreach ($subtasks as $subtask): ?>
        <?php $ids = $this->subtask->renderids($task, $subtask); ?>

        <tr class="subt_tr">
            <td class="subt_td" onclick="">


            <!-- EDIT btns -->
            <div class='edit_subtask'>

                <!-- <span class="extra_icns"> -->
                <!-- /// CLIPBOARD store data -->
                <a class="cpclip" onclick='cpclip(<?= $task["id"] ?>,<?=$subtask["id"] ?>)'>
                    <i class="fa fa-clipboard"></i>
                </a>

                <a class="plink_sub" href='/?controller=BoardViewController&action=show&project_id=<?=$ids['project_id'] ?>&data-subtask-id=<?=$subtask["id"] ?>'>
                    <i class="fa fa-link"></i>
                </a>

                <!-- /// TOGGLE SHOW/HIDE -->
                <a class="toggle_sub_desc_a" title="Cacher/Déplier -Press H" onclick="" data-task_id="<?= $task["id"] ?>" data-subtask_id="<?=$subtask["id"] ?>">
                    <label class="toggle_sub_desc" for="toggle_sub_desc_<?= $subtask_id ?>"><i class='fa fa-eye'></i></label>
                </a>
                <!-- </span> -->
                 <!-- CHECK IF USER CONNECTED -->
                <?php if ($this->projectRole->canUpdateTask($task)): ?>
                    <!-- /// RM -->
                    <a class="js-modal-medium rmbutt" href="/?controller=SubtaskController&action=confirm&task_id=<?= $task["id"] ?>&subtask_id=<?=$subtask["id"] ?>">
                        <i class="fa fa-trash-o fa-fw js-modal-large" aria-hidden="true"></i>
                    </a>
                    <!-- /// MOD EDIT -->
                    <a class="js-modal-medium editbutt" href="/?controller=SubtaskController&action=edit&task_id=<?= $task["id"] ?>&subtask_id=<?=$subtask["id"] ?>">
                        <i class="fa fa-edit fa-fw js-modal-large" aria-hidden="true"></i>
                    </a>
                    <a class="edit_mod" href="#" title="Elargir (éditer dans popup) -Press E" onclick="">
                        <i class="fa fa-arrows-h fa-fw" aria-hidden="true"></i>
                    </a>
                    <a class="edit_close" href="#" title="Fermer" onclick="">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </a>
                <?php endif ?>
                <!-- <li> -->
                    <i class="fa fa-bullseye cible" aria-hidden="true"></i>
                <!-- </li>      -->
                <!-- //// DRAG N DROP   -->
                <span class='drame dragbutt' onclick="">
                    <a href="" class="dragme_a" onclick="">
                        <i class="fa fa-hand-paper-o" aria-hidden="true" onclick=""></i>
                    </a>
                </span>
            </div>

            <!-- TASKS CONTENT Render -->
            <!-- TASKS TITLE Render -->
            <form class="sub_title_form" data-task_id="<?= $task["id"] ?>" data-subtask_id="<?=$subtask["id"] ?>" data-project_id="<?=$ids['project_id'] ?>" data-position="<?=$subtask["position"] ?>" method="post">
                <span class="sub_task_title_only" onclick="">
                    <span class="title_text"><?= $subtask["title"] ?></span>
                </span>
            </form>
            
                   
            </td>

            <?= $this->hook->render('template:board:tooltip:subtasks:rows', array( 'subtask' => $subtask, "csrf_token" => $ids['csrf_token'], "task_id" => $ids['task_id'], "subtask_id" => $ids['subtask_id'], "project_id" => $ids['project_id']) ) ?>

        </tr>

    <?php endforeach ?> <!-- ($subtasks as $subtask): -->
</table>
    
<?php else: ?>

    <table class="table-suboncard">
        <div class="dropdown-submenu-open_alt">
            <li>
                <i class="fa fa-eye ok1 hideme" aria-hidden="true"></i>
                <a href="/?controller=SubtaskController&action=create&task_id=<?php print_r($task["id"]) ?>" class="js-modal-medium ok" title="Ajouter une sous-tache"><i class="fa fa-plus fa-fw" aria-hidden="true"></i></a>
            </li>
        </div>    
    </table>

<?php endif ?>


<script>
function cpclip(id,subid) {
    var $task_cibling = $('[data-subid="'+subid+'"][data-taskid="'+id+'"]')
    let taskId = id;
    let subtaskId = subid;

    $.ajax({
        url: "/assets/php/get_subdescription.php",
        type: "POST",
        dataType: "json",
        data: { 
          task_id: taskId, 
          subtask_id: subtaskId,
          what: "title_desc"
        },
        success: function(response) { 

          if (response.title) {

            let final_cp = response.title +"\n-------\n"+ response.due_description;
            navigator.clipboard.writeText(final_cp).then(() => {
                alert(final_cp);
            }).catch(err => {
                alert('Failed to copy text: ', err);
            });

          }
        }
    });

}
</script>






