using MongoDB.Bson;
using MongoDB.Driver;
using System.Security.Authentication;

namespace SignalRChat.Database
{
    public class DatabaseManager
    {
        // Setup methods for the database connection and accessing collections
        private static readonly string roomToDataCategoryName = "roomToData";
        private static readonly IMongoDatabase DBConnection = setupDB();
        private static IMongoDatabase setupDB()
        {
            string connectionString = ""
            MongoClientSettings settings = MongoClientSettings.FromUrl(new MongoUrl(connectionString));
            settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
            var connection = new MongoClient(settings).GetDatabase("DevelopmentDB");

            if (!connection.ListCollectionNames().ToList().Contains(roomToDataCategoryName))
            {
                connection.CreateCollection(roomToDataCategoryName);
            }
            return connection;
        }
        private static IMongoCollection<MessageInDB> getRoomCollection(string roomName)
        {
            return DBConnection.GetCollection<MessageInDB>(roomName);
        }
        private static IMongoCollection<RoomInDB> getRoomToDataCategoryCollection()
        {
            return DBConnection.GetCollection<RoomInDB>(roomToDataCategoryName);
        }

        /**
		 * Makes a new room in the database with name *roomName*, if one doesn't exist
		 * The data type is *dataCategory*
		 * Returns a RoomInDB object representing the new room if it was made, null if a room with the same name already exists
		 */
        public static RoomInDB? tryAddRoom(string roomName, string dataCategory)
        {
            if (!DBConnection.ListCollectionNames().ToList().Contains(roomName))
            {
                DBConnection.CreateCollection(roomName);
                // Create an index on timestamp, since we sort on it
                //https://www.mongodb.com/docs/v5.2/reference/method/db.collection.createIndex/
                var indexKeysDefinition = Builders<MessageInDB>.IndexKeys.Ascending(doc => doc.timestampUTCms);
                getRoomCollection(roomName).Indexes.CreateOne(new CreateIndexModel<MessageInDB>(indexKeysDefinition));

                RoomInDB room = new RoomInDB(roomName, dataCategory);
                getRoomToDataCategoryCollection().InsertOne(room);
                return room;
            }
            return null;
        }

        /**
         * Adds a new string message *message* to the database room *roomName*, with timestamp *timestampUTCms*
         */
        public static void addNewMessageSent(MessageInDB message, string roomName)
        {
            getRoomCollection(roomName).InsertOne(message);
        }

        /**
		 * Retrieves the names of all the rooms that exist.
		 */
        public static List<RoomInDB> getAllRooms()
        {
            /*List<string> names = DBConnection.ListCollectionNames().ToList();
            names.Remove(roomToDataCategoryName);
            return names;*/
            return getRoomToDataCategoryCollection().Find(_ => true).ToList();
        }

        /**
		 * Retrieves the most recent *numberOfMessages* messages from room *roomName*, sorted by timestamp, newest first
		 */
        public static List<MessageInDB> getRecentMessages(string roomName, int numberOfMessages)
        {
            return getMessagesCore(roomName).Limit(numberOfMessages).ToList();
        }
        /**
		 * Retrieves all messages from room *roomName*, sorted by timestamp, newest first
		 */
        public static List<MessageInDB> getAllMessages(string roomName)
        {
            return getMessagesCore(roomName).ToList();
        }
        private static IFindFluent<MessageInDB, MessageInDB> getMessagesCore(string roomName)
        {
            // Sort by timestamp in descending order = larger timestamps first = newer messages first
            // MongoDB with CosmosDB workaround using index:
            // https://stackoverflow.com/questions/56988743/using-the-sort-cursor-method-without-the-default-indexing-policy-in-azure-cosm
            return getRoomCollection(roomName).Find(_ => true).Sort(new BsonDocument("timestampUTCms", -1));
        }
    }
}
