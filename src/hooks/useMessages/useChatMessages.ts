import produce from "immer";
import { MESSAGES, CHAT_MESSAGES, MORE_MESSAGES, NEW_MESSAGE, MESSAGE_UPDATED, MESSAGE_DELETED, MESSAGES_BULK_DELETED } from ".";
import { useQuery, useSubscription } from "react-apollo-hooks";
import { MessageDeleted, MessagesBulkDeleted, Messages_channel, Message, MessageUpdated, NewMessage, UpdatedMessage } from "@generated";
import { generalStore } from "@store";

/**
 * Fetches the messages for a DM chat
 */
export const useChatMessages = (user: string, guild: string) => {
  const query = useQuery(CHAT_MESSAGES, {
    variables: { guild, user },
    fetchPolicy: 'network-only'
  });

  const ready = !!query.data?.getMessagesForChat

  const messages = query.data?.getMessagesForChat ?? [];

  const fetchMore = () => {}

//   async function fetchMore(options?: {
//     around?: string;
//     after?: string;
//     before?: string;
//     limit?: number;
//   }) {
//     if (!user) return;
//     if (!options) {
//       const [firstMessage] = messages;
//       if (!firstMessage) return;

//       options = { before: firstMessage.id };
//     }

//     await query.fetchMore({
//       query: MORE_MESSAGES,
//       variables: { channel, thread, ...options },
//       updateQuery: (prev, { fetchMoreResult }) =>
//         produce(prev, draftState => {
//           draftState.channel.messageBunch.messages = [
//             ...fetchMoreResult.channel.messageBunch.messages,
//             ...draftState.channel.messageBunch.messages
//           ];
//         })
//     })
//   }

  useSubscription<NewMessage>(NEW_MESSAGE, {
    // variables: { channel, guild, threadId: thread },
    onSubscriptionData({ subscriptionData }) {
      query.updateQuery(prev =>
        produce(prev, ({ channel: { messageBunch: { messages } } }: { channel: Messages_channel }) => {
          const message = subscriptionData.data.message as Message
          message.author.color = messages.find(m => m.author.id === message.author.id)?.author.color || 0xffffff
          if (!messages.find(m => m.id === message.id)) messages.push(message);
        })
      )}
  });

  useSubscription<MessageUpdated>(MESSAGE_UPDATED, {
    // variables: { channel, guild, threadId: thread },
    onSubscriptionData({ subscriptionData }) {
      query.updateQuery(prev =>
        produce(prev, ({ channel: { messageBunch: { messages } } }: { channel: Messages_channel }) => {
          const message = subscriptionData.data.messageUpdate
          const index = messages.findIndex(m => m.id === message.id);

          if (index > -1) {
            const updatedProps = Object.fromEntries(Object.entries(message).filter(([_, v]) => v !== null)) as Partial<Message>
            if (updatedProps.author) updatedProps.author.color = messages.find(m => m.author.id === message.author?.id)?.author.color || 0xffffff
            delete updatedProps.__typename

            Object.assign(messages[index], updatedProps)
          }
        })
      );
    }
  });

  useSubscription<MessageDeleted>(MESSAGE_DELETED, {
    // variables: { channel, guild, threadId: thread },
    onSubscriptionData({ subscriptionData }) {
      query.updateQuery(prev =>
        produce(prev, ({ channel: { messageBunch: { messages } } }: { channel: Messages_channel }) => {
          const { id } = subscriptionData.data.messageDelete
          const index = messages.findIndex(m => m.id === id)

          if (index > -1) messages.splice(index, 1)
        })
      );
    }
  });

  useSubscription<MessagesBulkDeleted>(MESSAGES_BULK_DELETED, {
    // variables: { channel, guild, threadId: thread },
    onSubscriptionData({ subscriptionData }) {
      query.updateQuery(prev =>
        produce(prev, ({ channel }: { channel: Messages_channel }) => {
          const { ids } = subscriptionData.data.messageDeleteBulk

          channel.messageBunch.messages = channel.messageBunch.messages.filter(
            message => !ids.includes(message.id)
          );
        })
      );
    }
  });

  return <any>{
    ready,
    messages,
    fetchMore,
    error: query.error,
    // @ts-ignore
    stale: query.stale
  };
};
