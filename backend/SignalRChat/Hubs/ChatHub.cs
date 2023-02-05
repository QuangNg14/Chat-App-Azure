using System.Reflection;
using System.Threading.Channels;
using Microsoft.AspNetCore.SignalR;
using Models;
using MongoDB.Bson;
using SignalRChat.Database;
namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        //All the following functions are for groups
        //Refactored an wrapped in a List
        //public async Task SendMessage(string user, string message)
        //{
        //    MessageInDB myMessage = new MessageInDB(getUTCmsNow(), message);
        //    List<MessageInDB> myList = new List<MessageInDB>
        //    {
        //        myMessage
        //    };
        //    await Clients.All.SendAsync("ReceiveMessage", user, myList);
        //}

        public async Task JoinRoom(string room, string user)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, room);
            await Clients.Group(room).SendAsync("UpdateToRoom", $"{user} subscribed to the room {room}", room);
            //SendMessage(room, user, value)
            await GetMessages(room);
        }

        public async Task AddRoom(string room, string category)
        {
            Console.WriteLine("Before Adding room");
            RoomInDB? createdRoom = DatabaseManager.tryAddRoom(room, category);
            if (createdRoom is not null)
            {
                Console.WriteLine("Adding room successful");
                List<RoomInDB> rooms = new List<RoomInDB>();
                rooms.Add(createdRoom);
                //we need to send to all since there is no one in the room,
                //so no one would receieve the room if were to send it only to the people in the room
                //we need to populate a dropdown
                await Clients.All.SendAsync("ReceiveRooms", rooms);
            }
            else
            {
                Console.Error.WriteLine("Cannot add a room");
            }      
            
        }

        public async Task SendMessage(string room, string user, string value)
        {
            long utcMSNow = getUTCmsNow();

            MessageInDB message = new MessageInDB(utcMSNow, value, user);
            List<MessageInDB> messages = new List<MessageInDB>();
            messages.Add(message);

            await Clients.Group(room).SendAsync("ReceiveSendMessages", messages, room);

            Database.DatabaseManager.addNewMessageSent(message, room);
        }
        public async Task LeaveRoom(string room, string user)
        {
            //long utcMSNow = getUTCmsNow();
            //string value =  $"{user} just left the room {room}";

            //MessageInDB message = new MessageInDB(utcMSNow, value, user);
            //List<MessageInDB> messages = new List<MessageInDB>();
            //messages.Add(message);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, room);
            await Clients.Group(room).SendAsync("UpdateToRoom", $"{user} just left the room {room}", room);
            //Tell everyoe in the room that user left.
            //await Clients.Group(room).SendAsync("ReceiveMessages", messages);

            //Database.DatabaseManager.addNewMessageSent(message, room);
        }

        public async Task getRooms() 
        {
            List<RoomInDB> roomNames = DatabaseManager.getAllRooms();
            await Clients.Caller.SendAsync("ReceiveRooms", roomNames);
        }

        private static long getUTCmsNow()
        {
            return (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds;
        }

        private async Task GetMessages(string room)
        {
            List<MessageInDB> messages = Database.DatabaseManager.getAllMessages(room);
            await Clients.Caller.SendAsync("ReceiveGetMessages", messages, room);
        }

    }
}