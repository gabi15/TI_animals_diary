var db;
var req = indexedDB.open('db', 1);
var global_results;

// crate local database
req.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore('surveys');
    console.log("Local Database created or updated");
}

req.onsuccess = function (event) {
	db = event.target.result;
};

req.onerror = function (event) {
	alert("Error creating local database " + event.target.errorCode);
};

function addObjectToStore(name, obj) {
    var tran = db.transaction([name], "readwrite");
    var store = tran.objectStore(name);

    store.add(obj, getID());

    tran.oncomplete = function () {
        alert("Dodano ankiete do lokalnej bazy danych.");
    };

    tran.onerror = function (event) {
        alert("Błąd przy dodawaniu danych do lokalnej bazy.");
    }
}

function clearStore(name) {
    var tran = db.transaction(name, "readwrite");
    var store = tran.objectStore(name);

    store.clear();
    tran.oncomplete = function () {
        console.log("Local storage cleared.");
    };

    tran.onerror = function (event) {
        console.log("Error clearing local storage.");
    }
}

function sendLocalDataToServer() {
    readData('surveys', sendLocalDataToServerAfterLoading);
}

function sendLocalDataToServerAfterLoading() {
    for(var i = 0 ; i < global_results.length; i++){
        console.log(global_results[i]);
        $.ajax({
            type: "POST",
            url: "/survey",
            data: global_results[i],
            success: function (data) {
                console.log('Wysłano ankiete');
            },
            error: function (){
                console.log('Nie udalo sie wysłać ankiety.');
            }
        })
    }
    // clear local storage
    global_results = [];
    clearStore('surveys');
}

function readData(name, callback) {
    var tran = db.transaction(name, "readwrite");
    var store = tran.objectStore(name);

    var data = [];
    store.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if(cursor){
            data.push(cursor.value);
            cursor.continue();
        }
    }

    tran.oncomplete = function () {
        console.log("Read successful.");
        global_results = data;
        callback();
    };

    tran.onerror = function (event) {
        console.log("Error reading local data.");
    }
}

var getID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };