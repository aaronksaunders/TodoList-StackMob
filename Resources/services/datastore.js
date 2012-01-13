//load dependencies
var Todo = require('model/Todo');

//bootstrap datastore
//include StackMob & credentials module
var credentials = require('services/credentials').C;
var stackmob = require('services/stackmob-module.min');

//create StackMob Client
var client = new stackmob.Client(credentials.STACKMOB_APP_NAME, credentials.STACKMOB_PUBLIC_KEY, credentials.STACKMOB_PRIVATE_KEY, credentials.STACKMOB_USER_OBJECT_NAME);

//login the user

exports.login = function() {
	client.login({
		'username' : "aaron@clearlyinnovative.com",
		'password' : "password",
		success : function(data) {
			Ti.API.info("login " + JSON.stringify(data));
			alert("Logged In");
		},
		error : function(data) {
			Ti.API.error("ERROR:login " + JSON.stringify(JSON.parse(data.text)));
		}
	});
}
//implement service interface
exports.getList = function(_callback) {
	query(_callback);
};
//save a Todo object to our data store
exports.saveTodo = function(todo, _callback) {
	if(todo.guid) {
		update(todo, _callback);
	} else {
		todo.guid = new Date().getTime();
		save(todo, _callback);
	}
};
function query(_callback) {

	client.get({
		className : 'todo',
		params : {},
		success : function(data) {
			Ti.API.info("query todo " + JSON.stringify(JSON.parse(data.text)));
			_callback(JSON.parse(data.text));
		},
		error : function(data) {
			Ti.API.error("ERROR:query todo " + JSON.stringify(JSON.parse(data.text)));
			_callback(data);
		}
	});
}

function save(todo, _callback) {

	client.create({
		className : 'todo',
		params : todo,
		success : function(data) {
			Ti.API.info("create todo " + JSON.stringify(JSON.parse(data.text)));
			alert("Saved Item");
			_callback(data);
		},
		error : function(data) {
			Ti.API.error("ERROR:create todo " + JSON.stringify(JSON.parse(data.text)));
			_callback(data);
		}
	});

}

function update(todo, _callback) {
	
	var id = todo["todo_id"];
	
	// cant update primary key
	delete todo["todo_id"];
	
	client.update({
		className : 'todo',
		objectId : id,
		params : todo,
		success : function(data) {
			Ti.API.info("create todo " + JSON.stringify(JSON.parse(data.text)));
			alert("Updated Item");
			_callback(data);
		},
		error : function(data) {
			Ti.API.error("ERROR:updating todo " + JSON.stringify(JSON.parse(data.text)));
			_callback(data);
		}
	});	
	
}
