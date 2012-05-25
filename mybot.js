var target = null;

function new_game() {
	
}

function Fruit(x_pos, y_pos, fruit_type) {
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.fruit_type = fruit_type;
	
	return true;
}

function calculate_desired_fruit(){
	
	var num_items = get_number_of_item_types();
	var min_fruit = -1;
	var min_remain = 99999;
	
	for (var i = 1; i <= num_items; i++){
		var i_own = get_my_item_count(i);
		var o_own = get_opponent_item_count(i);
		var remaining = get_total_item_count(i) - (i_own + o_own);
		
		/* Logic here:
		So you want to target the fruit category that has the least 
		amount of fruits in it, because you will close out that 
		category and get a point. At the same time, there's no 
		need to pursue a category that you have already won. Furthermore
		if it's impossible to win in a fruit category, just forget it.*/
		
		if (remaining < min_remain && remaining > 0 && (remaining + o_own) > i_own && (remaining + i_own) > o_own){
			min_fruit = i;
			min_remain = remaining;
		}
	}
	
	return min_fruit;
}

function move(close_fruit){
   if (get_my_x() > close_fruit.x_pos){
		return WEST;
   }
   else if(get_my_x() < close_fruit.x_pos){
		return EAST;
   }
   else if (get_my_y() < close_fruit.y_pos){
		return SOUTH;
   }
   else if (get_my_y() > close_fruit.y_pos){
		return NORTH;
   }
   else
		return PASS;
}

function distance(fruit){
	// dist form
	return Math.abs(fruit.x_pos-get_my_x()) + Math.abs(fruit.y_pos-get_my_y());
}

function fruits_in_play(board){
	var fruits = new Array();
	// Find all fruits.
   var index = 0;
   for (var x_pos = 0; x_pos < board.length; x_pos++){
		for (var y_pos = 0; y_pos < board[x_pos].length; y_pos++){
			if (board[x_pos][y_pos] > 0){
				fruits[index] = new Fruit(x_pos, y_pos, board[x_pos][y_pos]);
				index++;
			}
		}
   }
   return fruits;

}

function make_move() {

   
   var board = get_board();

   // we found an item! take it. be greedy.
   if (target != null && board[target.x_pos][target.y_pos] > 0){
	   var current_pos = board[get_my_x()][get_my_y()];
	   if (current_pos > 0){
		   if (current_pos == target.fruit_type) {
			   target = null;
			   return TAKE;
			}
			else {
				//return TAKE;
			}
	   }
   }
   
   
   var fruits = fruits_in_play(board);
   
   
   // Find closest fruit that we want.
   var min_dist = 999999999;
   var min_index = -1;
   var ideal_fruit = -1;
   for (var i = 0; i < fruits.length; i++){
		if (distance(fruits[i]) < min_dist){
			var desired_fruit = calculate_desired_fruit();
			if (desired_fruit != -1 && fruits[i].fruit_type == desired_fruit){
				ideal_fruit = i;
				min_dist = distance(fruits[i]);
				min_index = i;
			}
			else if(desired_fruit == -1){
				return PASS;
			}
		}
   }
   
   // Move towards it.
   target = fruits[ideal_fruit];
   return move(target)
}
