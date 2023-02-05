using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace SignalRChat.Database
{
    public class MessageInDB : IEquatable<MessageInDB>
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId? id { get; set; } = null!;

        [BsonElement("timestampUTCms")]
        public long timestampUTCms { get; set; }
        [BsonElement("message")]
        public string message { get; set; }
        [BsonElement("sender")]
        public string sender { get; set; }

        public MessageInDB(long timestampUTCms, string message, string sender)
        {
            this.id = ObjectId.GenerateNewId();
            this.timestampUTCms = timestampUTCms;
            this.message = message;
            this.sender = sender;
        }

        public bool Equals(MessageInDB? other)
        {
            return (id?.Equals(other?.id) is not null) && timestampUTCms.Equals(other?.timestampUTCms) && message.Equals(other?.message)
                && sender.Equals(other?.sender);
        }
    }
}
