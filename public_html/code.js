/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var TURTLE = (function() {
   var my = {};
   var codebox = undefined;
   my.initialize = function(codebox_id) {
       $("#draggable").draggable();
       codebox = '#' + codebox_id;
   };
   my.run = function() {
       console.log($(codebox).val());
       eval($(codebox).val());
   };
   return my;
})();


