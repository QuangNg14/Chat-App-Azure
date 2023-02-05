"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

//connection.on("ReceiveMessages", function (messages, room) {
//    var li = document.createElement("li");
//    document.getElementById("messagesList").appendChild(li);
//    // We can assign user-supplied strings to an element's textContent because it
//    // is not interpreted as markup. If you're assigning in any other way, you 
//    // should be aware of possible script injection concerns.
//    //li.textContent = `room ${room} just received a message ${messages[0]} at ${createdAt}`;
//    console.log(messages);
//});


//Test SendMessage
connection.on("ReceiveMessages", function (listMessages) {
    console.log("getting messages from the categories");
    console.log("Messages" + listMessages);
    console.log("First message" + listMessages[0].message);
    //console.log(JSON.parse(listMessages));
    //var li = document.createElement("li");
    //document.getElementById("messagesList").appendChild(li);
    //// We can assign user-supplied strings to an element's textContent because it
    //// is not interpreted as markup. If you're assigning in any other way, you 
    //// should be aware of possible script injection concerns.
    //li.textContent = `${user} says ${message}`;
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});



document.getElementById("sendMessageRoomButton").addEventListener("click", function (event) {
    console.log("Clicked Send Message To Room button");
    var room = document.getElementById("roomToSendMessageInput").value;
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", room, user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

// TEST GetMessages

document.getElementById("getMessages").addEventListener("click", function (event) {
    console.log("Clicked Send Message To Room button");
    var room = document.getElementById("roomToGetMessageInput").value;
    connection.invoke("GetMessages", room).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("getRoomButton").addEventListener("click", function (event) {
    connection.invoke("getRooms").catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

//TEST AddRoom

document.getElementById("addRoomButton").addEventListener("click", function (event) {
    console.log("Clicked Add room button");
    var room = document.getElementById("addRoomInput").value;
    var category = document.getElementById("categoryRoomInput").value;
    connection.invoke("AddRoom", room, category).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

//TEST Receieve Rooms
connection.on("ReceiveRooms", function (rooms) {
    console.log("received rooms", rooms);
    //var jsonObject = JSON.parse(jsonObject);
    console.log("First room's name is " + rooms[0].roomName);
});

// TEST get rooms
document.getElementById("getCategoriesButton").addEventListener("click", function (event) {
    console.log("Clicked Get Categories button");
    //var room = document.getElementById("roomToSendMessageInput").value;
    //var message = document.getElementById("messageInput").value;

    var room = document.getElementById("roomToSendMessageInput").value;
    //connection.invoke("GetAllMessages", room).catch(function (err) {
    //    return console.error(err.toString());
    //});
    connection.invoke("GetRooms").catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

// TEST JoinRoom

document.getElementById("joinRoomButton").addEventListener("click", function (event) {
    console.log("Clicked Join Room button");
    var room = document.getElementById("roomInput").value;
    connection.invoke("JoinRoom", room, user).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

connection.on("AddedToRoom", function (message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.

    li.textContent = `${message}`;
});
