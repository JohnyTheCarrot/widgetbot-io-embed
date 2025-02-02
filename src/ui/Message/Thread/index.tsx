import * as React from 'react'
import { Message_thread } from "@generated";
import { generalStore } from "@store";
import { Archived, Clock, MessageCount, ThreadBox, ThreadBoxHeader, ThreadName, ThreadText } from "./elements";
import { Locale } from "@lib/Locale";

interface Props {
  thread: Message_thread
}

const Thread = ({ thread }: Props) => {
  const [hover, setHover] = React.useState(false);

  return (
    <ThreadBox
      className="thread-box"
      onClick={() => generalStore.setActiveThread(thread)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ThreadBoxHeader className="thread-box-header">
        <ThreadName>{thread.name}</ThreadName>
        <MessageCount hover={hover}>
          {/* {thread.messageCount === 0
            ? 'See Thread'
            : `${thread.messageCount} Message${thread.messageCount === 1 ? '' : 's'}`
          } › */}
          See Thread ›
        </MessageCount>
      </ThreadBoxHeader>

      {thread.archivedAt
        ? <Archived className="thread-archived">
            {Locale.translate('messages.threadarchived')}
            <Clock aria-hidden="false" width="14" height="14" viewBox="0 0 20 20"><g fill="none" fillRule="evenodd"><path fill="#b9bbbe" d="M9.99999 1.66675C5.39699 1.66675 1.66666 5.39708 1.66666 10.0001C1.66666 14.6031 5.39699 18.3334 9.99999 18.3334C14.603 18.3334 18.3333 14.6031 18.3333 10.0001C18.3333 5.39708 14.603 1.66675 9.99999 1.66675ZM9.99999 4.66675C10.3685 4.66675 10.6667 4.96493 10.6667 5.33342V9.61475L13.8021 11.4272C14.1211 11.6108 14.2252 12.0145 14.0416 12.3335C13.8581 12.6525 13.4544 12.7567 13.1354 12.5731L9.73937 10.6148C9.71333 10.6043 9.68989 10.5874 9.66646 10.5731C9.46724 10.4572 9.33312 10.2463 9.33312 10.0002V5.3335C9.33312 4.965 9.6315 4.66675 9.99999 4.66675Z"></path></g></Clock>
          </Archived>
        : thread.messageCount === 0 && <ThreadText>There are no messages in this thread yet.</ThreadText>
      }
    </ThreadBox>
  )
}

export default Thread;
