using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace SignalRChat.Database
{
    public class RoomInDB : IEquatable<RoomInDB>
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId? id { get; set; } = null!;

        [BsonElement("roomName")]
        public string roomName { get; set; } = null!;
        [BsonElement("roomDataCategory")]
        public string roomDataCategory { get; set; } = null!;

        public RoomInDB(string roomName, string roomDataCategory)
        {
            this.id = ObjectId.GenerateNewId();
            this.roomName = roomName;
            this.roomDataCategory = roomDataCategory;
        }

        public bool Equals(RoomInDB? other)
        {
            return (id?.Equals(other?.id) is not null) && roomName.Equals(other?.roomName) && roomDataCategory.Equals(other?.roomDataCategory);
        }
    }
}
