'use strict';
module.exports = function(app) {
  var container = require('../controllers/containerController');

  // todoList Routes
  app.route('/containers')
    .get(container.list_all_containers)
    
  app.route('/containers/:language')
    .put(container.run_container);


  /*app.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);*/
};
